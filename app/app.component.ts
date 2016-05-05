import { Component } from '@angular/core';
//import { AstroWeb } from 'AstroWebModule';
import { MizarContext } from './mizarContext.component';
declare var AstroWeb: any;


console.log(AstroWeb.Globe);

@Component({
  selector: 'my-app',
  template: `
    <div>
    	<mizar-canvas></mizar-canvas>
  	</div>
  `,
  directives: [MizarContext]
})
export class AppComponent {

	constructor(){
		console.log("Hello app")
	}

}

