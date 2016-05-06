import { Injectable } from '@angular/core';
import { Config } from './config';
import { ConfigurationService } from './configuration.service';

declare var AstroWeb: any;

@Injectable()
export class MizarService {
	globe: any;
	navigation: any;
	conf: Config;

	constructor(private _configurationService:ConfigurationService) {	
	}

	init(canvasId:string) {
		// Initialize sky
		try
		{
			// Create the sky
			this.globe = new AstroWeb.Sky( { 
				canvas: canvasId, 
				tileErrorTreshold: 1.5,
				continuousRendering: true,
				renderTileWithoutTexture: false,
				radius: 10.,
				minFar: 15		// Fix problem with far buffer, with planet rendering
			} );
		} catch (err) {
			console.log("Error while initializing sky in #" + canvasId);
		}

		this.navigation = new AstroWeb.AstroNavigation(this.globe, {
			"initTarget": [85.2500, -2.4608],
			"initFov": 20,
			"inertia": true,
			"minFov": 0.001,
			"zoomFactor": 0,
			"handlers": [
				new AstroWeb.MouseNavigationHandler({
					zoomOnDblClick: true
				}),
				new AstroWeb.KeyboardNavigationHandler()
			]
		});

		var layerDesc = { 
			"type": "healpix",
			"name": "DSS",
			"baseUrl": "http://demonstrator.telespazio.com/sitools/Alasky/DssColor",
			"description": "Digital Sky Survey from CDS",
			"attribution": "DSS backbround from <img width='48' height='32' src=\"css/images/cds.svg\" />",
			"visible": true,
			"background": true,
			"numberOfLevels": 7
		};

		var healpixLayer = new AstroWeb.HEALPixLayer(layerDesc);
		this.globe.setBaseImagery(healpixLayer);

		console.log(AstroWeb);
	}

};
