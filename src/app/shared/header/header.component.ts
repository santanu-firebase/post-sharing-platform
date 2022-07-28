import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    private firebaseService: FirebaseService,
    public storage: StorageService,
    private router: Router
  ) {
  }

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
