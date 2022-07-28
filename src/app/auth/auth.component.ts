import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    if(this.storage.isAuthenticate()) {
      this.router.navigate(['/user', 'dashboard']);
    }
  }

  ngOnInit(): void {
  }

}
