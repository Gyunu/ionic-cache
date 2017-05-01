export interface Storage {
  getItem(key: string);
  setItem(key: string, data: any): any;
  removeItem(key: string);
  clear();
}
