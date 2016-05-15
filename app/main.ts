import { bootstrap }    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';

import { AppComponent } from './app.component';
import { ConfigurationService } from './configuration.service';
import { MizarService } from './mizar.service';
import { LayerStore } from './layer.store';
import { LayerService } from './layer.service';

bootstrap(AppComponent, [
	HTTP_PROVIDERS, ConfigurationService, MizarService, LayerService, LayerStore
]);
