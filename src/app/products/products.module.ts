import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator'

import { ProductsRoutingModule } from './products-routing.module';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent,
    OrdersComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    RouterModule,
    SharedModule
  ]
})
export class ProductsModule { }