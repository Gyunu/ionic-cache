import { OpaqueToken } from '@angular/core';
export const CONFIG = new OpaqueToken('CONFIG');

export interface CacheConfig {
  expires: number,
  useSessionStorage: boolean
}
