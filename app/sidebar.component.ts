import { Component } from '@angular/core';
import 'rxjs/Rx';
  
import { LayerStore } from './layer.store';
import { BackgroundLayersComponent } from './backgroundLayers.component';

import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MdButton } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { LayersPipe } from './layers.pipe';

@Component({
	selector: 'mizar-sidebar',
	styleUrls: [
		'../node_modules/@angular2-material/sidenav/sidenav.css',
		'../node_modules/@angular2-material/button/button.css'
		//'../node_modules/@angular2-material/list/list.css'
	],
	directives: [BackgroundLayersComponent, MdButton, MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES],
	template:
	`
		<md-sidenav-layout style="height: 100%;width: 340px; overflow-x: visible">
			<md-sidenav style="overflow-x: hidden;" #start mode="side">
				<background-layers [layers]="layers$ | async | layers:'category':'background'"></background-layers>
					
				<!-- Use this list for additional layers later -->
				<!--<md-list style="width: 300px;">
					<md-list-item	*ngFor="let layer of layers">
						<h3 md-line> {{layer.name}} </h3>
						<p md-line>
							<span> {{layer.description}} </span>
							<span class="demo-2"> -- {{layer.category}} </span>
						</p>
					</md-list-item>
				</md-list>-->
			</md-sidenav>
			<div>
				<paper-icon-button style="border-radius: 0px 10px 10px 0px; background-color: rgb(111, 156, 203);" icon="menu" (click)="start.toggle()"></paper-icon-button>
			</div>
		</md-sidenav-layout>
	`,
	pipes: [LayersPipe]
})
export class SidebarComponent {

	layers$: any;
	constructor(private _layerStore:LayerStore) {
		console.log("Hello sidebar");
		this.layers$ = this._layerStore.layers$;
	}
}

