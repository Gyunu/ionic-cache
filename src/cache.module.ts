import { NgModule, ModuleWithProviders } from '@angular/core';

/*
  Lib
*/
import { SessionStorage } from './lib/sessionStorage';

/*
  Services
*/
import { CacheService } from './services/cache.service';

/*
  Contracts
*/
import { CacheConfig, CONFIG } from './contracts/config.contract';
import { DISKSTORAGE } from './contracts/diskStorage.contract';
import { SESSIONSTORAGE } from './contracts/sessionStorage.contract';
import { Storage } from './contracts/storage.contract';

@NgModule({
  declarations: [],
  imports: [],
  bootstrap: [],
  exports: [],
  entryComponents: [],
  providers: []
})
export class CacheModule {

  static forRoot(
    config: CacheConfig,
    diskStorage: Storage,
    sessionStorage: Storage
  ): ModuleWithProviders {

    if(config.useSessionStorage && !sessionStorage) {
      sessionStorage = new SessionStorage();
    }

    return {
      ngModule: CacheModule,
      providers: [
        {provide: CONFIG, useValue: config},
        {provide: DISKSTORAGE, useValue: diskStorage},
        {provide: SESSIONSTORAGE, useValue: sessionStorage},
        {provide: CacheService, useClass: CacheService}
      ]
    }
  }
}
