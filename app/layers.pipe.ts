import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'layers' })
export class LayersPipe implements PipeTransform {
	transform(allLayers: any[], key:string, value:string) {
		if ( allLayers ) {
			return allLayers.filter(layer => layer[key] == value);
		}
		return allLayers;
	}
}