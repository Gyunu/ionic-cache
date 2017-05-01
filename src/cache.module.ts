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
    config: CacheConfig
  ): ModuleWithProviders {

    return {
      ngModule: CacheModule,
      providers: [
        {provide: CONFIG, useValue: config},
        {provide: CacheService, useClass: CacheService}
      ]
    }
  }
}
