export class SessionStorage {

  private storage: any = {};

  constructor() {}

  get length(): number {
    return Object.keys(this.storage).length;
  }

  public getItem(key: string): any {
    return this.storage[key];
  }

  public setItem(key: string, data: any): void {
    this.storage[key] = data;
  }

  public removeItem(key: string): void {
    this.storage[key] = null;
  }

  public clear(): void {
    this.storage = {};
  }

  public key(key: number): any {
    return this.storage[Object.keys(this.storage)[key]];
  }

}
