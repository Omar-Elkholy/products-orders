import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';
import { CoreService } from 'src/app/shared/services/core.service';
import { map } from 'rxjs/operators'
import { zip } from 'rxjs'
import { Product } from 'src/app/shared/models/product.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string;
  order: Order;
  productById: any;
  users: User[];
  orderProducts: Product[] = [];
  orderUser: User | undefined;
  totalPrice: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.getProductsAndUsers();
  }

  // FUNCTION TO GET THE ORDER BY THE ROUTE ID
  getRoutedOrder() {
    this.coreService.getOrderById(this.orderId)
      .subscribe((res: any) => {
        this.order = res;        
        this.getOrderUser();
        this.getOrderProducts();
      })
  }

  // GETTING THE OBJECT OF THE USER INSIDE ORDER
  getOrderUser() {
    this.orderUser = this.users.find(user => user.Id === this.order.UserId);    
  }

  // GETTING THE OBJECT OF EACH PRODUCT INSIDE CURRENT ORDER
  getOrderProducts() {
    this.order.Products.forEach(
      product => {
        const productObj = this.productById[product.ProductId];
        productObj.quantity = product.Quantity;
        this.totalPrice += productObj.ProductPrice;
        this.orderProducts.push(productObj);
      }
    )    
  }

  getProducts() {
    return this.coreService.getJSON<Product[]>("/assets/data/products.json")
      .pipe(
        map(products => {
          this.productById = this.convertToObj(products);
        })
      );
  }

  // PERFORMANCE TIP TO CONVERT THE ARRAY TO AN OBJECT
  // KEY => ID OF THE PRODUCT
  // VALUE => VALUE(Obj) OF THE RELATED ID
  // NOW WE CAN GET PRODUCT BY ID WITH O(1) TIME COMPLEXITY USING productById OBJECT
  convertToObj(products: any[]) {
    return products.reduce(
      (acc, curr) => {        
        acc = {...acc, [curr.ProductId]: curr }
        return acc;
      }, {})
  }

  getUsers() {
    return this.coreService.getJSON<User[]>("/assets/data/users.json")
      .pipe(
        map(users => {
          this.users = users;
        })
      );
  }

  /**
   * 
   * AS WE NEED TO GET THE DATA OF PRODUCTS & USERS BEFORE GETTING ORDERS -> WE COMBINED USING ZIP THE
   * getProducts, getUsers -> THEN WE GET THE ORDER
   * 
   * */
  getProductsAndUsers() {
    zip(this.getProducts(), this.getUsers())
      .subscribe(res => {
        if (this.orderId)
          this.getRoutedOrder();
      })
  }
}