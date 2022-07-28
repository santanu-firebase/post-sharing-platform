import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from '../material.module';
import { PagesComponent } from './pages.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { HighlightSearch } from '../pipe/highlight.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardComponent, PostAddUpdateDialog } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [PageNotFoundComponent, PostAddUpdateDialog, PagesComponent, PostDetailsComponent, HighlightSearch, DashboardComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class PagesModule { }
