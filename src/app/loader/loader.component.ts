import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {


  @Input() color = '#ffffff';
  @Input() class: string;
  @Input() background = 'transparent';
  @Input() fullPage = false;
  @Input() text = 'Wait';
  @Input() isButton = true;
  @Input() buttonText = '';

  isLoading: any;

  constructor(
    private firebaseService: FirebaseService
  ) {
    this.isLoading = this.firebaseService.isHttpRequest;    
  }

  ngOnInit() {
  }
}

