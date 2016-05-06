import { Component } from '@angular/core';
//import { AstroWeb } from 'AstroWebModule';
import { MizarCanvas } from './mizarCanvas.component';
declare var AstroWeb: any;

console.log("AstroWeb", AstroWeb);

@Component({
  selector: 'my-app',
  template: `
    <div>
    	<mizar-canvas></mizar-canvas>
  	</div>
  `,
  directives: [MizarCanvas]
})
export class AppComponent {

	constructor(){
		console.log("Hello app")
	}

}

