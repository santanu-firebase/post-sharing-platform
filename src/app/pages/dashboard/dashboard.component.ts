import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  entryList: any[];
  duplicateEntryList: any[];
  filterValue: string;
  pageNo: number = 1;

  constructor(
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    public storageService: StorageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getEntries();
  }


  applyFilter(filterValue: string) {
    this.pageNo = 1;
    this.filterValue = filterValue.trim().toLowerCase(); // Remove whitespace and Datasource defaults to lowercase matches
    if (filterValue.length > 0) {
      this.entryList = this.duplicateEntryList.filter(x => (x.data.title).toLowerCase().includes(this.filterValue));
    } else {
      this.entryList = this.duplicateEntryList;
    }
  }

  getEntries() {
    this.firebaseService.getPostList().subscribe((res) => {
      if (res) {
        this.entryList = res;
        this.duplicateEntryList = res;
      }
    });
  }

  openDialog(element?) {
    let dialogRef = this.dialog.open(PostAddUpdateDialog, {
      minWidth: 500,
      disableClose: true,
      data: { element: element }
    });
  }

  redirectToDetailsPage(key) {
    this.router.navigate(['/user', 'post-details', this.storageService.encription(key)]);
  }
}


@Component({
  selector: 'post-add-update-dialog',
  templateUrl: 'post-add-update-dialog.html',
})
export class PostAddUpdateDialog {
  createPostForm: FormGroup;
  thumbnailImageFile: File;
  isLoading: any;
  isDisable: boolean;

  constructor(
    public dialogRef: MatDialogRef<PostAddUpdateDialog>,
    private firebaseService: FirebaseService,
    public storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formInit();
    if (this.data.element) {
      this.createPostForm.patchValue(this.data.element.data);
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  formInit() {
    this.createPostForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]),
      uid: new FormControl(this.storageService.getUser()?.accessToken),
      displayName: new FormControl(this.storageService.getUser()?.displayName),
      thumbnail: new FormControl(''),
      content: new FormControl('', [Validators.required, Validators.minLength(100), Validators.maxLength(500)]),
      privacy: new FormControl('Public', Validators.required),
      createdAt: new FormControl(new Date() + ''),
      updatedAt: new FormControl('')
    })
  }

  submitForm() {
    if (this.createPostForm.valid) {
      if (this.data.element) {
        this.isDisable = true;
        this.createPostForm.value.updatedAt = new Date() + '';
        this.firebaseService.updateEntry(this.data.element.key, this.createPostForm.value).then((response: any) => {
          this.dialogRef.close(this.createPostForm.value);
          this.firebaseService.alert('Post has been updated successfully', 'success');
        }, err => {
          this.isDisable = false;
        });
      } else {
        this.isDisable = true;
        if (this.thumbnailImageFile) {
          this.createPostForm.value.createdAt = new Date() + '';
          this.createPostForm.value.id = Math.random().toString(16).substring(2, 15);
          this.firebaseService.uploadFileToFirebase(this.createPostForm.value.id, this.thumbnailImageFile).then((res) => {
            if (res) {
              this.createPostForm.controls.thumbnail.patchValue(res);
            }
          }, err => {
            this.isDisable = false;
          }).then(() => {
            this.firebaseService.addNewPost(this.createPostForm.value).then((response: any) => {
              this.dialogRef.close(this.createPostForm.value);
              this.firebaseService.alert('Post has been added successfully', 'success');
            }, err => {
              this.isDisable = false;
            });
          })
        } else {
          this.firebaseService.alert('Please upload Thumbnail Image', 'error');
        }

      }

    } else {
      this.createPostForm.markAllAsTouched();
    }
  }

  uploadFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === 'image/jpeg') {
        if (event.target.files[0].size <= 10485760) {
          this.thumbnailImageFile = event.target.files[0];
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.createPostForm.controls.thumbnail.patchValue(event.target.result);
          }
          reader.readAsDataURL(event.target.files[0]);
        } else {
          this.firebaseService.alert('Warning: Thumbnail Image should be within 10MB.', 'error');
        }
      } else {
        this.firebaseService.alert('Warning: only jpeg will support', 'error');
      }
    }
  }

}