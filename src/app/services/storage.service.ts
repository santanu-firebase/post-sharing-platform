import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  USER = {
    KEY: '_tuL',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  constructor(
  ) {
  }

  encription(data: any) {
    return CryptoTS.AES.encrypt(JSON.stringify(data), '!##0895*()?:}95047834&&tes').toString();
  }
  decription(data: any) {
    const bytes = CryptoTS.AES.decrypt(data, '!##0895*()?:}95047834&&tes');
    return JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  }

  setUser(data: any) {
    return localStorage.setItem(this.USER.KEY, this.encription(data).toString());
  }

  getUser() {
    const DATA = localStorage.getItem(this.USER.KEY) !== null ? localStorage.getItem(this.USER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA);
    } else {
      return undefined;
    }
  }

  clearUser() {
    return localStorage.removeItem(this.USER.KEY);
  }

  isAuthenticate() {
    if (this.getUser()) {
      return true;
    } else {
      return false;
    }
  }
}
