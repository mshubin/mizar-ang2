import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

import { BehaviorSubject } from "rxjs/Rx";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

import { MizarService } from './mizar.service';
declare var AstroWeb: any;

/**
 *	Remove "C"-like comment lines from string
 */
var _removeComments = function(string)
{
	var starCommentRe = new RegExp("/\\\*(.|[\r\n])*?\\\*/", "g");
	var slashCommentRe = new RegExp("[^:]//.*[\r\n]", "g");
	string = string.replace(slashCommentRe, "");
	string = string.replace(starCommentRe, "");

	return string;
}

/**
 *	HSV values in [0..1[
 *	returns [r, g, b] values from 0 to 255
 */
function hsv_to_rgb(h, s, v) {
	var r, g, b;
	var h_i = Math.floor(h * 6);
	var f = h * 6 - h_i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	switch (h_i) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
		default:
			r = 1; g = 1; b = 1;
	}
	return [r, g, b];
}

/**
 *	Generate eye-friendly color based on hsv
 */
var _generateColor = function() {
	//use golden ratio
	var golden_ratio_conjugate = 0.618033988749895;
	var h = Math.random();
	h += golden_ratio_conjugate;
	h %= 1;
	return hsv_to_rgb(h, 0.5, 0.95);
}

@Injectable()
export class LayerManagerService {

	// Not REALLY GlobWeb layers but more its description
	gwLayers: any[] = [];

	// Inner representation of all surveys
	// TODO: rename background surveys into more appropriate word
	private _backgroundSurveys: BehaviorSubject<any> = new BehaviorSubject([]);
	get backgroundSurveys() {
		return this._backgroundSurveys.asObservable();
	}

	constructor(private http: Http, private _mizarService:MizarService) {
		// TODO: inject CONFIG if needed
		// configuration = conf;
		// Store the sky in the global module variable

		this.getLayers().subscribe(
			res => {
				// Add complete descriptions of every layer
				let layers = (<Object[]>res).map((layerDesc: any) => {
					return this.addLayer(layerDesc);
				}).filter(l => {
					return l != null;
				});
				console.log("Publishing list", layers);
				this._backgroundSurveys.next(layers);
			},
			err => console.log("Error retrieving layers")
		);
	}

	updateDefaults(layerDescription: any) {
		// Update layer color
		if ( layerDescription.color )
		{
			layerDescription.color = AstroWeb.FeatureStyle.fromStringToColor( layerDescription.color );
		}
		else
		{
			// Generate random color
			var rgb = _generateColor();
			layerDescription.color = rgb.concat([1]);
		}

		// Layer opacity must be in range [0, 1] 
		if ( layerDescription.opacity )
			layerDescription.opacity /= 100;
		// Layers are not visible by default
		if ( !layerDescription.visible )
			layerDescription.visible = false;

		// Create style if needed
		if ( !layerDescription.style ) {
			var defaultVectorStyle = new AstroWeb.FeatureStyle({ 
				rendererHint: "Basic", 
				opacity: layerDescription.opacity,
				iconUrl: layerDescription.icon,// TODO: ? layerDescription.icon : configuration.mizarBaseUrl + "css/images/star.png",
				fillColor: layerDescription.color,
				strokeColor: layerDescription.color
			});
			layerDescription.style = defaultVectorStyle;
		}
	}

	createLayerFromConf(layerDescription:any) {
		var gwLayer;

		this.updateDefaults(layerDescription);
		switch (layerDescription.type) {
			case "healpix":
				gwLayer = new AstroWeb.HEALPixLayer(layerDescription);
				/*
				TODO: check if it can't be extracted from backgroundSurveys directly
				if ( layerDesc.availableServices )
				{
					gwLayer.availableServices = layerDesc.availableServices;
					gwLayer.healpixCutFileName = layerDesc.healpixCutFileName;
				}
				*/
				break;
			
			case "coordinateGrid":
				gwLayer = new AstroWeb.CoordinateGridLayer(layerDescription);
				break;

			case "healpixGrid":
				gwLayer = new AstroWeb.TileWireframeLayer(layerDescription);
				break;

			case "GeoJSON":
				gwLayer = new AstroWeb.VectorLayer(layerDescription);
				gwLayer.pickable = layerDescription.hasOwnProperty('pickable') ? layerDescription.pickable : true;
				break;

			case "DynamicOpenSearch":
				// INFO: no clustering for now..
				gwLayer = new AstroWeb.OpenSearchLayer(layerDescription);

				// TODO: check if it can't be extracted from backgroundSurveys directly
				if (layerDescription.displayProperties)
					gwLayer.displayProperties = layerDescription.displayProperties;
				gwLayer.pickable = layerDescription.hasOwnProperty('pickable') ? layerDescription.pickable : true;
				gwLayer.availableServices = layerDescription.availableServices;
					
				break;
			case "Moc":
				layerDescription.style.fill = true;
				layerDescription.style.fillColor[3] = 0.3 // make transparent
				gwLayer = new AstroWeb.MocLayer( layerDescription );
				gwLayer.dataType = "line";
				break;
			// TODO: Handle it later
			// case "Vector":
			// 	gwLayer = createSimpleLayer(layerDesc.name);
			// 	gwLayer.pickable = layerDesc.hasOwnProperty('pickable') ? layerDesc.pickable : true;
			// 	gwLayer.deletable = false;
			// 	break;
			// case "Planet":
			// 	gwLayer = new AstroWeb.PlanetLayer( layerDesc );
			// 	break;
			default:
				console.error(layerDescription.type+" isn't not implemented");
				return null;
		}

		// TODO: check if it can't be extracted from backgroundSurveys directly
		// Attach some properties to gwLayer for components
		gwLayer.type = layerDescription.type;
		gwLayer.dataType = layerDescription.dataType;
		// Store category name on GlobWeb layer object to be able to restore it later
		gwLayer.category = layerDescription.background ? "background" : layerDescription.category;

		return gwLayer;
	}

	setBackgroundSurvey(name:string) {
		var globe = this._mizarService.globe;

		// FIXME: is the use of gwLayers is appropriate here ?
		let gwLayer = this.gwLayers.find(l => l.name == name);
		if (globe.baseImagery) {
			globe.baseImagery.visible(false);
		}
		globe.setBaseImagery(gwLayer);
		// HACK: find a better way
		gwLayer._visible = true;
	}

	addLayerToEngine(gwLayer:any) {
		var globe = this._mizarService.globe;
		if ( gwLayer.category == "background" ) {
			if ( gwLayer.visible() ) {
				if ( globe.baseImagery ) {
					globe.baseImagery.visible(false);
				}
				globe.setBaseImagery(gwLayer);
			}

			// Publish the event --> no need ?
			// this.mizar.publish("backgroundLayer:add", gwLayer);
		} else {
			// Add to engine
			// TODO: handle planet layer case
//			if ( !(gwLayer instanceof AstroWeb.PlanetLayer) ) {
				globe.addLayer( gwLayer );
//			}

			// Publish the event
			// this.mizar.publish("additionalLayer:add", gwLayer);
		}
	}

	getLayers() {
		// TODO: Add layerStore ?
		return this.http.get('/app/backgroundSurveys.json')
			.map(this.parseJSON)
			.catch(this.handleError);
	}

	/**
	 *	Parse JSON after comments has been removed
	 */
	parseJSON(response: Response) {
		return JSON.parse(_removeComments(response.text()));
	}

	handleError(error: any) {
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}

	addLayer(layerDescription:any)  {
		var gwLayer = this.createLayerFromConf(layerDescription);
		if ( gwLayer ) {
			this.addLayerToEngine(gwLayer);
			this.gwLayers.push(gwLayer);
		}
		return gwLayer;
	}
}