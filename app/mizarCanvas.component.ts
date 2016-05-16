import { Component } from '@angular/core';

import { MizarService } from './mizar.service';
import { MdSpinner, MdProgressCircle } from '@angular2-material/progress-circle';

declare var AstroWeb: any;

@Component({
	selector: 'mizar-canvas',
	styleUrls: [
		'../node_modules/@angular2-material/progress-circle/progress-circle.css'
	],
	template: `
		<div class="canvas">
			<div style="position: absolute; top: 50%; left: 50%;" *ngIf="isLoading">
				<md-progress-circle style="width: 30px;" mode="indeterminate" color="primary"></md-progress-circle>
			</div>
			<canvas class="noSelect" id="{{id}}" style="border: none; margin: 0; padding: 0;" width="0" height="0"></canvas>
		</div>
	`,
	directives: [MdProgressCircle]
})
export class MizarCanvas {

	isLoading: boolean = true;
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

		this._mizarService.globe.subscribe("baseLayersReady", () => {
			this.isLoading = false;
		});
		
		//if ( options.isMobile )
		//{	
			// TODO
			//this.initTouchNavigation(options);
		//}
	}
};