import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from 'src/app/shared/services/core.service';
import { Order } from 'src/app/shared/models/order.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'date', 'customer', 'payment', 'details'];
  dataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getOrders() {
    this.coreService.getJSON<Order[]>('/assets/data/orders.json')
      .subscribe(res => {
        this.handleDateFormat(res);
        this.dataSource.data = res;
      })
  }

  // THIS FUNCTION IS USED TO HANDLE THE INVALID DATES FORMATS.
  handleDateFormat(res: Order[]) {
    res?.forEach(item => {
      const date = new Date(item.OrderDate).toString();
      item.OrderDate = date !== 'Invalid Date' ? date : '';
    })
  }

}
