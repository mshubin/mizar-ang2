import { Injectable } from '@angular/core';

/**
 *	HSV values in [0..1[
 *	returns [r, g, b] values from 0 to 255
 */
function hsv_to_rgb(h, s, v) {
	var r, g, b;
	var h_i = Math.floor(h * 6);
	var f = h * 6 - h_i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	switch (h_i) {
		case 0:
			r = v; g = t; b = p;
			break;
		case 1:
			r = q; g = v; b = p;
			break;
		case 2:
			r = p; g = v; b = t;
			break;
		case 3:
			r = p; g = q; b = v;
			break;
		case 4:
			r = t; g = p; b = v;
			break;
		case 5:
			r = v; g = p; b = q;
			break;
		default:
			r = 1; g = 1; b = 1;
	}
	return [r, g, b];
}

@Injectable()
export class UtilsService {
	
	/**
	 *	Generate eye-friendly color based on hsv
	 */
	generateColor() {
		//use golden ratio
		var golden_ratio_conjugate = 0.618033988749895;
		var h = Math.random();
		h += golden_ratio_conjugate;
		h %= 1;
		return hsv_to_rgb(h, 0.5, 0.95);
	}
}