import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { CacheConfig, CONFIG } from '../contracts/config.contract';
import { DISKSTORAGE } from '../contracts/diskStorage.contract';
import { SESSIONSTORAGE } from '../contracts/sessionStorage.contract';

@Injectable()
export class CacheService {

  constructor(
    @Inject(CONFIG) private config: CacheConfig,
    @Inject(DISKSTORAGE) private diskStorage,
    @Inject(SESSIONSTORAGE) private sessionStorage,
  ) {

  }

  public getItem(key: string): Observable<any> {
    return Observable.create(
      (observer) => {
        let data: any;

        if(this.config.useSessionStorage) {
          data = this.sessionStorage.setItem(key, data);
        }

        if(!data) {
          data = this.diskStorage.setItem(key, data);
        }

        if(this.isExpired(data.expires)) {
          this.removeItem(key);
        }
        else {
          observer.next(data);
        }


        observer.complete();
    });
  }

  public setItem(key: string, data: any): Observable<any> {

    data.expires = Date.now() + (this.config.expires / 60 / 1000);

    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.setItem(key, data);
        }

        this.diskStorage.setItem(key, data);
        observer.next(true);
        observer.complete();
    });
  }

  public removeItem(key): Observable<boolean> {
    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.removeItem(key);
        }

        this.diskStorage.removeItem(key);
        observer.next(true);
        observer.complete();
    });
  }

  public empty(): Observable<boolean> {
    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.empty();
        }

        this.diskStorage.empty();
        observer.next(true);
        observer.complete();
    });
  }

  private isExpired(expiry: string): boolean {
    return new Date(expiry).getMilliseconds() < Date.now();
  }
}
