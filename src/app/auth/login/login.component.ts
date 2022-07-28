import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  visible: any;
  inputType: string = 'password';

  constructor(
    private storage: StorageService,
    private firebaseService: FirebaseService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

    this.formInit();
 
  }

  ngOnInit(): void {
  }

  formInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$")]),
      password: new FormControl('', [Validators.required]),
    })
  }

  loginUser(){
    if(this.loginForm.valid) {
      let data;
    this.firebaseService.doLogin(Object.assign(this.loginForm.value, {returnSecureToken: true}))
    .then(res => {      
      data = {
        email: res.user.toJSON().email,
        photoURL: res.user.toJSON().photoURL,
        accessToken: res.user.toJSON().uid,
        displayName: res.user.toJSON().displayName,
        refreshToken: res.user.toJSON().stsTokenManager.refreshToken
      };
      this.storage.setUser(data);
      this.firebaseService.alert('You have successfully login.', 'success');
      this.router.navigate(['/user', 'dashboard']);
    }, err => {
      this.firebaseService.alert(err.message, 'error');
    });
  } else {
    this.loginForm.markAllAsTouched()
  }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.changeDetectorRef.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.changeDetectorRef.markForCheck();
    }
  }
}
