export interface Storage {
  getItem(key: string): Promise<any>;
  setItem(key: string, data: any): Promise<any>;
  removeItem(key: string): Promise<any>;
  clear(): Promise<any>;
}
