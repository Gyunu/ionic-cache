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
        if(this.config.useSessionStorage) {
          this.sessionStorage.getItem(key)
          .then(
            (success) => {
              if(success) {
                if(this.isExpired(success.expires)) {
                  this.sessionStorage.removeItem(key)
                  .then(
                    (success) => {
                      observer.next(null);
                      observer.complete;
                    },
                    (error) => {
                      observer.error(error);
                    }
                  )
                }
                else {
                  observer.next(success.data);
                  observer.complete();
                }
              }
              else {
                this.diskStorage.getItem(key)
                .then(
                  (success) => {
                    if(success) {
                      if(this.isExpired(success.expires)) {
                        this.diskStorage.removeItem(key)
                        .then(
                          (success) => {
                            observer.next(null);
                            observer.complete();
                          },
                          (error) => {
                            observer.error(error);
                          }
                        );
                      }
                      else {
                        observer.next(success.data);
                        observer.complete();
                      }
                    }
                  },
                  (error) => {
                    observer.error();
                  }
                )
              }
          });
        }
      });
  }

  public setItem(key: string, data: any): Observable<any> {

    const now = Date.now();
    const cacheTime = (this.config.expires * 60 * 1000);
    let saveData: any = {};
    saveData.expires = now + cacheTime;
    saveData.data = data;

    return Observable.create(
      (observer) => {
        if(this.config.useSessionStorage) {
          this.sessionStorage.setItem(key, saveData)
          .then(
            (success) => {},
            (error) => {}
          );
        }
        this.diskStorage.setItem(key, saveData)
        .then(
          (success) => observer.next(saveData),
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
    return Number(expiry) < Date.now();
  }
}
