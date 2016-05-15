import { Component, ChangeDetectorRef, Input } from '@angular/core';

import { LayerStore } from './layer.store';
import { MizarService } from './mizar.service';
import { MdRadioButton, MdRadioGroup } from '@angular2-material/radio';
import { MdRadioDispatcher } from '@angular2-material/radio/radio_dispatcher';

declare var AstroWeb: any;

@Component({
	selector: "background-layers",
	styleUrls: ['../node_modules/@angular2-material/radio/radio.css'],
	providers: [MdRadioDispatcher],
	template: `
		<div style="color: rgb(255,255,255);  background-color: rgb(25,118,210);  box-shadow: none!important;
  			border-radius: 0;  cursor: pointer;  align-items: inherit;  line-height: 40px;  margin: 0;
  			max-height: 40px;   overflow: hidden;  padding: 0 16px;  text-decoration: none;  white-space: normal;"
  			(click)="toggleView()">{{selectedLayer}}
  		</div>
		<div *ngIf="showLayers">
			<md-radio-group [(ngModel)]="selectedLayer">
				<span *ngFor="let layer of layers">
  					<md-radio-button value="{{layer.name}}" (click)="selectLayer(layer)">{{layer.name}}</md-radio-button><br/>
  				</span>
			</md-radio-group>
		</div>
	`,
	directives: [MdRadioButton, MdRadioGroup]
})
export class BackgroundLayersComponent {
	@Input('layers') layers: any;
	showLayers: boolean = true;
	selectedLayer: "none";

	constructor(private _changeDetectionRef: ChangeDetectorRef, private _layerStore: LayerStore) {
	}

	/**
	 *	Update selected layer name on layer change
	 */
    ngOnChanges(changes: { [layers: string]: SimpleChange }) {
		if (changes['layers'].currentValue) {
			this.selectedLayer = changes['layers'].currentValue.find(function(l) { return l._visible }).name;
		}
    }

/*
	// Use observables solution
	ngOnInit(){
		this._layerStore.layers.subscribe(layers => {
			this._backgroundLayers = layers.filter(l => {
				return l.category == "background";
			})
			if (this._backgroundLayers.length) {
				let currentBackgroundLayer = this._backgroundLayers.find(l => {
					return l._visible;
				});
				if (currentBackgroundLayer) {
					this.selectedLayer = currentBackgroundLayer.name;
				}
			}
		});
	}
*/

	toggleView() {
		// HACK: @see issue: https://github.com/angular/angular/issues/6005
		this.showLayers = !this.showLayers;
		this._changeDetectionRef.detectChanges();
	}

	selectLayer(layer) {
		this._layerStore.setBackgroundSurvey(layer.name);
		this._changeDetectionRef.detectChanges();
	}
}