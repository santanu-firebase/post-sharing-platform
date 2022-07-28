import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  @ViewChild('footer', { static: false }) footer: ElementRef;
  constructor() { }

  ngOnInit(): void {

    window.addEventListener('resize', () => {
      this.fooetrInit();
    });
  }
  fooetrInit() {
    // if (window.outerHeight > document.body.scrollHeight) {
    //   this.footer.nativeElement.classList.add('fixed');
    // } else {
    //   this.footer.nativeElement.classList.remove('fixed');
    // }
  }
  ngAfterViewInit() {
    this.fooetrInit();
  }
}
