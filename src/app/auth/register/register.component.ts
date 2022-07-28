import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  parrentBnnaerMessage = "Sign Up";
  registrationForm: FormGroup;

  minDate = new Date(1990, 0, 1);
  maxDate = new Date();
  visible: any;
  inputType: string = 'password';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.formInit();
  }

  ngOnInit(): void {
  
  }

  formInit() {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(5),  Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(5),  Validators.maxLength(50)]),
      dateOfBirth: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$")]),
      password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$")]),
      confirmPassword: new FormControl('', [Validators.required]),
    },{validators: this.comparisonValidator()})
  }

  registerUser() {
    if (this.registrationForm.valid) {
      this.firebaseService.doRegister(this.registrationForm.value).then(()=>{
        this.firebaseService.alert('Successfully registered.', 'success');
        this.router.navigate(['/login']);
      })
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  comparisonValidator() {
    return (group: FormGroup): ValidationErrors => {
      const password = group.controls['password'];
      const confirmPassword = group.controls['confirmPassword'];
      if (confirmPassword.errors && !confirmPassword.errors.valuesDoNotMatch)
        return;
      password.value !== confirmPassword.value ? confirmPassword.setErrors({ valuesDoNotMatch: true }) : confirmPassword.setErrors(null);
    };
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
