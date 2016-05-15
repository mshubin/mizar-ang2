import { bootstrap }    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import { AppComponent } from './app.component';

// Stores
import { LayerStore } from './layer.store';

// Services
import { ConfigurationService } from './configuration.service';
import { MizarService } from './mizar.service';
import { LayerService } from './layer.service';
import { UtilsService } from './utils.service';

bootstrap(AppComponent, [
	HTTP_PROVIDERS, ConfigurationService, MizarService, LayerService, LayerStore, UtilsService
]);
