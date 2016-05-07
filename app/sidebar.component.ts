import { Component } from '@angular/core';
import 'rxjs/Rx';
  
import { LayerManagerService } from './layerManager.service';

import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MdButton } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';


@Component({
	selector: 'mizar-sidebar',
	styleUrls: [
			'../node_modules/@angular2-material/sidenav/sidenav.css',
			'../node_modules/@angular2-material/button/button.css'
	],
	directives: [MdButton, MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES],
	template: `
		<md-sidenav-layout style="height: 100%;width: 340px;">
			<md-sidenav style="overflow-x: hidden;" #start mode="side">
				<md-list style="width: 300px;">
					<md-list-item	*ngFor="let layer of layers">
						<h3 md-line> {{layer.name}} </h3>
						<p md-line>
							<span> {{layer.description}} </span>
							<span class="demo-2"> -- {{layer.category}} </span>
						</p>
					</md-list-item>
				</md-list>
				<!--
					Start Side Drawer
					<br>
					<br>
					<br>
					<button md-button
						(click)="start.mode = (start.mode == 'push' ? 'over' : (start.mode == 'over' ? 'side' : 'push'))">Toggle Mode</button>
					<div>Mode: {{start.mode}}</div>
					<br>
					<input #myinput>
					<br>
					<button md-raised-button color="primary">FLAT</button>
					<button md-raised-button color="warn">WARN</button>
				-->
			</md-sidenav>
			<div>
				<button (click)="start.toggle()" md-mini-fab>
					<md-icon class="md-24">Menu</md-icon>
				</button>
			</div>
		</md-sidenav-layout>
	`
})
export class SidebarComponent {
	layers: any;

	constructor(private _layerManager:LayerManagerService) {
		console.log("Hello sidebar");
		_layerManager.getLayers().subscribe(res => {
			console.log("sidebar layers", res);
			this.layers = res;
		})
	}
}

