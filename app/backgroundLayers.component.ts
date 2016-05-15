import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { LayerManagerService } from './layerManager.service';
import { MizarService } from './mizar.service';
import { MdRadioButton, MdRadioGroup } from '@angular2-material/radio';
import {MdRadioDispatcher} from '@angular2-material/radio/radio_dispatcher';

declare var AstroWeb: any;

@Component({
	selector: "background-layers",
	styleUrls: ['../node_modules/@angular2-material/radio/radio.css'],
	providers: [MdRadioDispatcher],
	template: `
		<div style="color: rgb(255,255,255);  background-color: rgb(25,118,210);  box-shadow: none!important;
  			border-radius: 0;  cursor: pointer;  align-items: inherit;  line-height: 40px;  margin: 0;
  			max-height: 40px;   overflow: hidden;  padding: 0 16px;  text-decoration: none;  white-space: normal;"
  			(click)="toggleView()">Selected layer here
  		</div>
		<div *ngIf="showLayers">
			<md-radio-group [(ngModel)]="selectedLayer">
				<span *ngFor="let layer of backgroundLayers | async">
  					<md-radio-button value="{{layer.name}}" (click)="selectLayer(layer)">{{layer.name}}</md-radio-button><br/>
  				</span>
			</md-radio-group>
		</div>
	`,
	directives: [MdRadioButton, MdRadioGroup]
})
export class BackgroundLayersComponent {
	showLayers: boolean = true;
	selectedLayer: "none";
	_backgroundLayers: any;

	constructor(private _changeDetectionRef: ChangeDetectorRef, private _layerManager: LayerManagerService) {
	}

	get backgroundLayers() {
		return this._layerManager.backgroundSurveys.map(layers => {
			this._backgroundLayers = layers.filter(l => {
				return l.category == "background";
			})
			if ( this._backgroundLayers.length ) {
				let currentBackgroundLayer = this._backgroundLayers.find(l => {
					return l._visible;
				});
				if ( currentBackgroundLayer ) {
					this.selectedLayer = currentBackgroundLayer.name;
				}
			}

			return this._backgroundLayers;
		});
	}

	toggleView() {
		// HACK: @see issue: https://github.com/angular/angular/issues/6005
		this.showLayers = !this.showLayers;
		this._changeDetectionRef.detectChanges();
	}

	selectLayer(layer) {
		this._layerManager.setBackgroundSurvey(layer.name);
		this._changeDetectionRef.detectChanges();
	}
}