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
    	<mizar-sidebar style="oveflow: visible; position: absolute; top: 0px; height:100%;left:0px;"></mizar-sidebar>
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

