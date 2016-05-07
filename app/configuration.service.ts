import { Injectable } from '@angular/core';
import { CONFIG } from './config';

// TODO: To be used when conf will be retried from server
// import {Http} from '@angular/http';

@Injectable()
export class ConfigurationService {
	getConfiguration() {
		return CONFIG;
	}
};
