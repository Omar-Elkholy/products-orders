import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent {

  users: User[] = [];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreService: CoreService,
    private fb: FormBuilder
  ) {
    this.getUsers();
    this.intializeForm();
  }

  getUsers() {
    this.coreService.getJSON<User[]>("/assets/data/users.json")
      .subscribe(users => {
        this.users = users;
      })
  }

  intializeForm() {
    this.form = this.fb.group({
      userId: [null, Validators.required],
      paymentType: [null, Validators.required]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {    
    this.dialogRef.close({
      data: this.form.value
    });
  }

}
