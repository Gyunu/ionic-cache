import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';


import { CacheConfig, CONFIG } from '../contracts/config.contract';
import { Storage } from '../contracts/storage.contract';

@Injectable()
export class CacheService {

  private diskStorage: Storage;
  private sessionStorage: Storage;

  constructor(
    @Inject(CONFIG) private config: CacheConfig
  ) {

  }

  public setDiskStorage(storage: Storage) {
    this.diskStorage = storage;
  }

  public setSessionStorage(storage: Storage) {
    this.sessionStorage = storage;
  }

  public getItem(key: string): Observable<any> {
    return Observable.create(
      (observer) => {
        let data: any;

        if(this.config.useSessionStorage) {
          this.sessionStorage.getItem(key)
          .then(
            (success) => observer.next(data),
            (error) => observer.error(error)
          );
        }

        if(!data) {
          data = this.diskStorage.getItem(key)
          .then(
            (success) => observer.next(data),
            (error) => observer.error(error)
          );
        }

        if(this.isExpired(data.expires)) {
          this.removeItem(key);
        }
        else {
          observer.next(data);
        }
    });
  }

  public setItem(key: string, data: any): Observable<any> {

    data.expires = Date.now() + (this.config.expires / 60 / 1000);

    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.setItem(key, data)
          .then(
            (success) => observer.next(data),
            (error) => observer.error(error)
          );;
        }

        this.diskStorage.setItem(key, data)
        .then(
          (success) => observer.next(data),
          (error) => observer.error(error)
        );
    });
  }

  public removeItem(key): Observable<boolean> {
    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.removeItem(key)
          .then(
            (success) => observer.next(true),
            (error) => observer.error(error)
          );;
        }

        this.diskStorage.removeItem(key)
        .then(
          (success) => observer.next(true),
          (error) => observer.error(error)
        );
    });
  }

  public empty(): Observable<boolean> {
    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.clear()
          .then(
            (success) => observer.next(true),
            (error) => observer.error(error)
          );
        }

        this.diskStorage.clear();
        observer.next(true)
        .then(
          (success) => observer.next(true),
          (error) => observer.error(error)
        );
    });
  }

  private isExpired(expiry: string): boolean {
    return new Date(expiry).getMilliseconds() < Date.now();
  }
}
