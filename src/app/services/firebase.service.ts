import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import iziToast from 'izitoast';
import firebase from 'firebase/compat/app';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  isHttpRequest = new Subject<boolean>();

  constructor(
    private angularFireDatabase: AngularFireDatabase,
    private firestorage: AngularFireStorage,
    private storageService: StorageService
  ) {
  }

  alert(message: string, type: any) {
    return iziToast[type]({
      title: message,
      zindex: 999999,
      position: 'topRight',
      timeout: 5000,
    });
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
    this.isHttpRequest.next(true);
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        this.isHttpRequest.next(false);
        resolve(res);
      }, err => {
        this.isHttpRequest.next(false);
        reject(err)
      })
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
    this.isHttpRequest.next(true);
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        const dataForStore = Object.assign(value, {displayName: value.firstName + ' ' + value.lastName, photoURL: `https://ui-avatars.com/api/?name=${value.firstName}+${value.lastName}`})
        delete dataForStore.password;
        delete dataForStore.confirmPassword;

        this.addUser(dataForStore);
        this.updateProfile(dataForStore)
        this.isHttpRequest.next(false);
        resolve(res);
      }, err => {
        this.alert(err.message, 'error');
        this.isHttpRequest.next(false);
        reject(err);
      })
    })
  }

  updateProfile(value) {
    return new Promise<any>((resolve, reject) => {
      this.isHttpRequest.next(true);
      firebase.auth().currentUser.updateProfile(value)
      .then(res => {
        this.isHttpRequest.next(false);
        resolve(res);
      }, err => {
        this.alert(err.message, 'error');
        this.isHttpRequest.next(false);
        reject(err)
      })
    })
  }

  addUser(data) {
    return new Promise<any>((resolve, reject) => {
      this.isHttpRequest.next(true);
      this.angularFireDatabase.list(`/users`).push(data).then(()=>{
        this.isHttpRequest.next(false);
        resolve('');
      }, err => {
        this.alert(err.message, 'error');
        this.isHttpRequest.next(false);
        reject(err)
      });
  })
  }

  addNewPost(data) {
    return new Promise<any>((resolve, reject) => {
      this.isHttpRequest.next(true);
      this.angularFireDatabase.list(`/posts`).push(data).then(()=>{
        this.isHttpRequest.next(false);
        resolve('');
      }, err => {
        this.alert(err.message, 'error');
        this.isHttpRequest.next(false);
        reject(err)
      });
  })
  }

  updateEntry(KEY, Value) {
    return new Promise<any>((resolve, reject) => {
      this.isHttpRequest.next(true);
       this.angularFireDatabase.database.ref(`/posts/${KEY}`).update(Value).then(()=>{
        this.isHttpRequest.next(false);
        resolve('');
      }, err => {
        this.alert(err.message, 'error');
        this.isHttpRequest.next(false);
        reject(err)
      });
  })
  }

  getPostList() {
    let data = [];
    this.isHttpRequest.next(true);
    return this.angularFireDatabase.list(`/posts`).snapshotChanges().pipe(map((res: any) => {
      data = [];
      res.forEach((el: any) => {                
          const dataSet = {
            key: el.key,
            data: el.payload.val(),
          };
          if((dataSet?.data?.uid === this.storageService.getUser()?.accessToken) || dataSet?.data?.privacy === 'Public') {
            data.push(Object.assign(dataSet));
          }
      });
      this.isHttpRequest.next(false);
      return data;
    }));
  }

  getPostDetails(key) {
    this.isHttpRequest.next(true);
    return this.angularFireDatabase.object(`/posts/${key}`).snapshotChanges().pipe(map((res: any) => {
      this.isHttpRequest.next(false);
      return res.payload.val();
    }));
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      this.isHttpRequest.next(true);
      if(firebase.auth().currentUser){
        firebase.auth().signOut();
        this.isHttpRequest.next(false);
        resolve(true);
      }
      else{
        this.isHttpRequest.next(false);
        reject();
      }
    });
  }

  uploadFileToFirebase(key, file) {
    const date = new Date() + '';
    let refURL;
    const path = `PostThumbnailImages/${key}/${date.toString()}`;
    return new Promise((resolve, reject) => {
      this.firestorage.upload(`${path}`, file).then(res => {
        res.ref.getDownloadURL().then(URL => {
          refURL = URL;
          resolve(refURL);
        });
      }).catch(err => {
        this.alert(err.message, 'error');
        reject(err);
      });
    });
  }
}


