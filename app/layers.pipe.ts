import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'backgroundLayers' })
export class LayersPipe implements PipeTransform {
	transform(allLayers: any[], key:string, value:string) {
		if ( allLayers ) {
			var filtered = allLayers.filter(layer => layer[key] == value);
			console.log(filtered);
			return filtered;
		}
		return allLayers;
	}
}