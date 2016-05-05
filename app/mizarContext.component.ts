import { Component } from '@angular/core';
import { Config } from './config';
import { ConfigurationService } from './configuration.service'

declare var AstroWeb: any;

console.log(AstroWeb.Globe);

@Component({
  selector: 'mizar-canvas',
  template: `
  	<div class="canvas">
  		<canvas class="noSelect" id="AstroWebCanvas" style="border: none; margin: 0; padding: 0;" width="0" height="0"></canvas>
  	</div>
  `,
  providers: [ConfigurationService]
})
export class MizarContext {
	globe: any;
	navigation: any;
	conf: Config;

	public initCanvas(canvas) {
		// Set canvas dimensions from width/height attributes
		// Use window width by default
		var width = window.innerWidth;
		var height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		
		// Define on resize function
		var onResize = function() {
			// TODO
		}

		// Context lost listener
		canvas.addEventListener("webglcontextlost", function(event) {
			// TODO
			event.preventDefault();
			document.getElementById('loading').style.display = "none";
			document.getElementById('webGLContextLost').style.display = "block";
		}, false);
	};

	public initGlobeEvents() {
		// TODO
	};

	constructor(private configrationService:ConfigurationService){
		this.conf = configrationService.getConfiguration();
		console.log("conf", this.conf);
	};


	ngOnInit() {
		// Initialize sky
		try
		{
			// Create the sky
			this.globe = new AstroWeb.Sky( { 
				canvas: 'AstroWebCanvas', 
				tileErrorTreshold: 1.5,
				continuousRendering: true,
				renderTileWithoutTexture: false,
				radius: 10.,
				minFar: 15		// Fix problem with far buffer, with planet rendering
			} );
		}
		catch (err)
		{
			document.getElementById('AstroWebCanvas').style.display = "none";
			document.getElementById('loading').style.display = "none";
			document.getElementById('webGLNotAvailable').style.display = "block";
		}
		this.initGlobeEvents();
		this.initCanvas(document.getElementById('AstroWebCanvas'));

		//if ( options.isMobile )
		//{	
			// TODO
			//this.initTouchNavigation(options);
		//}
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
	};
};