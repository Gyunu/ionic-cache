export class SessionStorage {

  constructor(
    private storage: any = {}
  ) {}

  public getItem(key: string): Promise<any> {
    return new Promise((res, rej) => {
      res(this.storage[key]);
    });
  }

  public setItem(key: string, data: any): Promise<boolean> {
    return new Promise((res, rej) => {
      this.storage[key] = data;
      res(true);
    });
  }

  public removeItem(key: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.storage[key] = null;
      res(true);
    });
  }

  public clear(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.storage = {};
      res(true);
    });
  }
}
