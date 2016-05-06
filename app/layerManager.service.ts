import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
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

@Injectable()
export class LayerManagerService {

	backgroundSurveys: any[];
	gwLayers: any[];


	constructor(private http: Http, private _mizarService:MizarService) {
		// TODO: inject CONFIG if needed
		// configuration = conf;
		// Store the sky in the global module variable

		// TODO: Make Mizar a service and inject it here
		// sky = mizar.sky;

		this.fetch();
		console.log(this.backgroundSurveys);
	}

	fetch() {
		this.http.get('/app/backgroundSurveys.json')
			.subscribe(
				response => {
					this.backgroundSurveys = JSON.parse(_removeComments(response.text()));
				},
				err => console.error(err),
				() => console.log('done')
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
			var rgb = AstroWeb.Utils.generateColor();
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
			if ( !(gwLayer instanceof AstroWeb.PlanetLayer) ) {
				globe.addLayer( gwLayer );
			}

			// Publish the event
			// this.mizar.publish("additionalLayer:add", gwLayer);
		}
	}

	getLayers() {
		return this.gwLayers;
	}

	addLayer(layerDescription:any)  {
		var gwLayer = this.createLayerFromConf(layerDescription);
		if ( gwLayer ) {
			this.addLayerToEngine(gwLayer);
		}
		return gwLayer;
	}
}