import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  destroyer: Subject<boolean> = new Subject<boolean>();
  postDetails: any;

  constructor(
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) {
    this.activatedRoute.params.subscribe((res: any)=>{      
      if(res.id) {        
        this.getPostDetails(this.storageService.decription(res.id))
      } else {
        this.router.navigate(['/user','dashboard']);
      }
    })
   }

  ngOnInit(): void {
  }

  getPostDetails(key) {
    this.firebaseService.getPostDetails(key).pipe(takeUntil(this.destroyer)).subscribe((res: any) => {
      this.postDetails = res;
    })
  }


ngOnDestroy(): void {
  this.destroyer.next(true);
  this.destroyer.unsubscribe();  
}
}
