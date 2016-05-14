import { Component, ChangeDetectorRef, Input } from '@angular/core';

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
			<md-radio-group>
				<span *ngFor="let layer of layers">
  					<md-radio-button value="{{layer.name}}">{{layer.name}}</md-radio-button><br/>
  				</span>
			</md-radio-group>
		</div>
	`,
	directives: [MdRadioButton, MdRadioGroup]
})
export class BackgroundLayersComponent {
	@Input() layers: any;
	showLayers: boolean = true;

	constructor(private _changeDetectionRef: ChangeDetectorRef) {
		console.log(this.layers);
	}

	toggleView() {
		// HACK: @see issue: https://github.com/angular/angular/issues/6005
		this.showLayers = !this.showLayers;
		this._changeDetectionRef.detectChanges();
	}
}