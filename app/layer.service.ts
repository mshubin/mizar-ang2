/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

/**
 *	Remove "C"-like comment lines from string
 */
var _removeComments = function(string)
{
	var starCommentRe = new RegExp("/\\\*(.|[\r\n])*?\\\*/", "g");
	var slashCommentRe = new RegExp("[^:]//.*[\r\n]", "g");
	string = string.replace(slashCommentRe, "");
	string = string.replace(starCommentRe, "");

	return string;
}

@Injectable()
export class LayerService {

	constructor(private _http: Http) {
	}

	getLayers() {
		return this._http.get('/app/layers.json')
			.map(this.parseJSON)
			.catch(this.handleError);
	}

	/**
	 *	Parse JSON after comments has been removed
	 */
	parseJSON(response: Response) {
		return JSON.parse(_removeComments(response.text()));
	}

	handleError(error: any) {
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}
}