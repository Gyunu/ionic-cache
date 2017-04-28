import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/catch';


import { ROUTES, CONFIG } from "../contracts";

@Injectable()
export class ApiService {

  constructor(
    private http: Http,
    @Inject(ROUTES) private routes,
    @Inject(CONFIG) private config
  ) {

  }


  appendQuery(route: string, params = {}) {
    let url = this.routes[route];
    for(let param in params) {
      param = param.replace(/\$/g, '$$$$');
      let replace = `{${param}}`;
      url = url.replace(new RegExp(replace), params[param]);
    }
    return url;
  }

  get(route: string, params = {}, external?: boolean) {
    if(this.routes[route] === undefined) { throw new Error('API: Route not found'); }
    if(route.split('.')[0] !== 'get') { throw new Error('API: Method not allowed'); }


    let url = this.appendQuery(route, params);

    return this.http.get( ((!!external) ? '' : this.config.base) + url)
           .timeout(this.config.timeout)
           .retry(this.config.retry || 0)
           .map(data => data.json());
  }

  post(route: string, params, external?: boolean) {
    if(this.routes[route] === undefined) { throw new Error('API: Route not found'); }
    if(route.split('.')[0] !== 'post') { throw new Error('API: Method not allowed'); }

    let body = new URLSearchParams();
    let url = this.appendQuery(route, params);

    for(let param in params) {
      body.append(param, params[param]);
    }


    return this.http.post( ((!!external) ? '' : this.config.base ) + url, body)
           .map(data => data.json());

  }

}
