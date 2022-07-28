import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
    public storage: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  
  logout() {
    this.firebaseService.doLogout().then((res)=>{
      if(res) {
        this.firebaseService.alert('Successfully logout.', 'success');
        this.storage.clearUser();
        this.router.navigate(['/login']);
      }
    })
  }

  redirectToDashboard() {
    this.router.navigate(['/user', 'dashboard']);
  }

}
