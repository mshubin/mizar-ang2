import { Component } from '@angular/core';

import { MizarService } from './mizar.service';

declare var AstroWeb: any;

@Component({
	selector: 'mizar-canvas',
	template: `
		<div class="canvas">
			<canvas class="noSelect" id="{{id}}" style="border: none; margin: 0; padding: 0;" width="0" height="0"></canvas>
		</div>
	`,
	providers: [MizarService]
})
export class MizarCanvas {

	id:string;
	constructor(private _mizarService:MizarService){
		this.id = "AstroWebCanvas";
		//this.conf = configrationService.getConfiguration();
	};	

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

	/**
	 *	Callback when content is fully initialized
	 *	i.e. <canvas> {{id}} has been evaluated
	 */
	ngAfterViewInit() {
		// TODO: Check if Mizar has been initialized correctly, if not show error message
		// catch (err)
		// {
		// 	document.getElementById('AstroWebCanvas').style.display = "none";
		// 	document.getElementById('loading').style.display = "none";
		// 	document.getElementById('webGLNotAvailable').style.display = "block";
		// }
		this._mizarService.init(this.id);
		this.initGlobeEvents();
		this.initCanvas(document.getElementById(this.id));
		//if ( options.isMobile )
		//{	
			// TODO
			//this.initTouchNavigation(options);
		//}
	}
};