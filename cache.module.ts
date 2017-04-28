import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
/*
  Services
*/
import { ApiService, CacheService } from './services';

/*
  Contracts
*/
import { ROUTES, CONFIG } from './contracts';

@NgModule({
  declarations: [
  ],
  imports: [
    HttpModule
  ],
  bootstrap: [],
  exports: [],
  entryComponents: [],
  providers: []
})
export class CacheModule {

  static forRoot(routes: any, config: any): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        {provide: ROUTES, useValue: routes},
        {provide: CONFIG, useValue: config},
        {provide: CacheService, useClass: CacheService},
        {provide: ApiService, useClass: ApiService}
      ]
    }
  }

}
