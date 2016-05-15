/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { BehaviorSubject } from "rxjs/Rx";
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

// import {List} from 'immutable';

import { MizarService } from './mizar.service';
import { LayerService } from './layer.service';
import { UtilsService } from './utils.service';
declare var AstroWeb: any;

@Injectable()
export class LayerStore {
	gwLayers: any[] = [];

	// Inner representation of all surveys
	private _layers: BehaviorSubject<any> = new BehaviorSubject([]);
	get layers() {
		return this._layers.asObservable();
	}

	constructor(private _layerService: LayerService, private _mizarService:MizarService, private _utils:UtilsService) {
		// TODO: inject CONFIG if needed
		// configuration = conf;

		this.loadLayers();
	}

	/**
	 *	Load layers from configuration
	 */
	loadLayers() {
		this._layerService.getLayers().subscribe(
			res => {
				// Add complete descriptions of every layer
				let layers = (<Object[]>res).map((layerDesc: any) => {
					return this.addLayer(layerDesc);
				}).filter(l => {
					return l != null;
				});
				console.log("Publishing list", layers);
				this._layers.next(layers);
			},
			err => console.log("Error retrieving layers")
		);
	}

	/**
	 *	Update layer description parameters:
	 *	- missing parameters by default ones
	 *	- process the existing parameters : color, opacity
	 */
	updateDefaults(layerDescription: any) {
		// Update layer color
		if ( layerDescription.color )
		{
			layerDescription.color = AstroWeb.FeatureStyle.fromStringToColor( layerDescription.color );
		}
		else
		{
			// Generate random color
			var rgb = this._utils.generateColor();
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

	/**
	 *	Create GlobWeb layer from description
	 */
	createLayerFromDescription(layerDescription: any) {
		var gwLayer;

		this.updateDefaults(layerDescription);
		switch (layerDescription.type) {
			case "healpix":
				gwLayer = new AstroWeb.HEALPixLayer(layerDescription);
				/*
				TODO: check if it can't be extracted from layers directly
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

				// TODO: check if it can't be extracted from layers directly
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

		// TODO: check if it can't be extracted from layers directly
		// Attach some properties to gwLayer for components
		gwLayer.type = layerDescription.type;
		gwLayer.dataType = layerDescription.dataType;
		// Store category name on GlobWeb layer object to be able to restore it later
		gwLayer.category = layerDescription.background ? "background" : layerDescription.category;

		return gwLayer;
	}

	/**
	 *	Set current background survey by name
	 */
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

	/**
	 *	Add GlobWeb layer to globe
	 */
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

	/**
	 *	Add layer to globe from the given description
	 */
	addLayer(layerDescription:any)  {
		var gwLayer = this.createLayerFromDescription(layerDescription);
		if ( gwLayer ) {
			this.addLayerToEngine(gwLayer);
			this.gwLayers.push(gwLayer);
		}
		return gwLayer;
	}
}