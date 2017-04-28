import { Injectable, Inject } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ApiService } from '.';

import { ROUTES, CONFIG } from "../contracts";

@Injectable()
export class CacheService {

  constructor(
    private localStorage: Storage,
    private apiService: ApiService,
    private nativeStorage: NativeStorage,
    @Inject(ROUTES) private routes,
    @Inject(CONFIG) private config
  ) {

  }

  public get(url: string, params = {}, debug?: any) {
    let key = this.apiService.appendQuery(url, params);
    let observable = Observable.create((observer) => {
      this.nativeStorage.getItem(key)
      .then(
        (data) => {
          console.log(`Cache Service: Native Storage`);
          if(data) {
            if(data.expires > Date.now()) {
              console.log(`Cache Service: Native Storage found and is expired.`);
              this.getFromApi(url, params).
              subscribe(
                (data) => {
                  console.log(`Cache Service: Native Storage found and not expired`);
                  observer.next(data);
                  observer.complete();
              },
              (error) => {
                  console.log(`Cache Service: Api Error`, error);
                  observer.error(error);
                  observer.complete();
              },
              (/*complete*/) => {
                  console.log(`Cache Service: Api Complete`);
              });
            }
            else {
              console.log(`Cache Service: Native Storage found and not expired`);
              observer.next(data);
              observer.complete();
            }
          }
          else {
            this.apiService.get(url, params).subscribe((data) => {
              console.log(`Cache Service: Native Storage not found, getting from API`);
              this.set(key, data).subscribe(
              (success) => {
                if(success) {
                  observer.next(data);
                  observer.complete();
                }
              },
              (error) => {
                console.log(`Cache Service: Set in cache error`, error);
                observer.error(error);
                observer.complete();
              },
              (/*complete*/) => {
                console.log(`Cache Service: Set Complete`);
              });
            });
          }
        },
        (error) =>  {
          this.localStorage.get(key)
          .then(
            (data) => {
              console.log(`Cache Service: Local Storage`);
              if(data) {
                let now = new Date().getMilliseconds()
                if(data.expires < now) {
                  console.log(`Cache Service: Local Storage found and is expired.`);
                  this.getFromApi(url, params).
                  subscribe(
                    (data) => {
                      console.log(`Cache Service: Local Storage found and not expired`);
                      this.set(key, data);
                      observer.next(data);
                      observer.complete();
                    },
                    (error) => {
                      console.log(`Cache Service: Local Storage error`, error);
                      observer.error(data);
                      observer.complete();
                    },
                    (/*complete*/) => {
                      console.log(`Cache Service: Local Storage expired Api Complete`);
                    }
                  );
                }
                else {
                  console.log(`Cache Service: Local Storage found and not expired`);
                  observer.next(data);
                  observer.complete();
                }
              }
              else {
                this.apiService.get(url, params).subscribe(
                  (data) => {
                    console.log(`Cache Service: Local Storage not found, getting from API`);
                    this.set(key, data).subscribe(
                      (success) => {
                        if(success) {
                          observer.next(data);
                          observer.complete();
                        }
                      },
                      (error) => {
                        console.log(`Cache Service Local Storage not found, API Error`, error);
                        observer.error(error);
                        observer.complete();
                      },
                      (/*complete*/) => {
                        console.log(`Cache Service: Local Storage not found API Complete`);
                      });
                },
                (error) => {
                  console.log(`Cache Service Local Storage not found, API Error`, error);
                  observer.error(error);
                  observer.complete();
                },
                (/*success*/) => {
                  console.log(`Cache Service: Local Storage not found API Complete`);
                });
              }
            },
            (error) => {
              console.log(`Cache Service: Local Storage error, API fallback`, error);
              this.apiService.get(url, params).subscribe(
                  (data) => {
                  this.set(key, data).subscribe(
                    (success) => {
                      if(success) {
                        observer.next(data);
                        observer.complete();
                      }
                    },
                    (error) => {
                      console.log(`Cache Service Local Storage error API fallback Error`, error);
                      observer.error(error);
                      observer.complete();
                    },
                    (/*complete*/) => {
                        console.log(`Cache Service: Local Storage error API Fallback API Complete`);
                    });
                  },
                  (error) => {
                    console.log(`Cache Service Local Storage error API fallback Error`, error);
                    observer.error(error);
                    observer.complete();
                  },
                  (/*complete*/) => {
                    console.log(`Cache Service: Local Storage error API Fallback API Complete`);
                  }
              );
            }
          )
        }
      )
    });

    return observable;
  }

  public getFromApi(url: string, params?: any) {
    return this.apiService.get(url, params);
  }

  public set(key: string, data: any) {
    let observable = Observable.create(
      (observer) => {
        //convert config.expires from minutes to milliseconds
        data.expires = Date.now() + (this.config.expires / 60 / 1000);
        this.nativeStorage.setItem(key, data);
        this.localStorage.set(key, data);
        observer.next(true);
        observer.complete();
      }
    )

    return observable;
  }

  public clear(key: string, data: any) {
    let observable = Observable.create(
      (observer) => {
        this.nativeStorage.remove(key);
        this.localStorage.remove(key);
        observer.next(true);
        observer.complete();
      }
    )

    return observable;
  }

  public flush() {
    try {
      this.nativeStorage.clear();
      this.localStorage.clear();
    }
    catch(e) {
      console.log('Cache.clear: clear error', e);
    }
  }
}
