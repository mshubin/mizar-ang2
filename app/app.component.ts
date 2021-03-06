import { Component } from '@angular/core';
//import * as AstroWeb from 'AstroWeb';
import { MizarCanvas } from './mizarCanvas.component';
import { SidebarComponent } from './sidebar.component';
declare var AstroWeb: any;

//import AstroWeb = require('AstroWeb');

console.log("AstroWeb", AstroWeb);

@Component({
	selector: 'my-app',
	template: `
		<div>
			<mizar-sidebar style="position: absolute; height: 100%;"></mizar-sidebar>
			<mizar-canvas></mizar-canvas>
		</div>
 	`,
	directives: [MizarCanvas, SidebarComponent]
})
export class AppComponent {

	constructor(){
		console.log("Hello app")
	}
}

