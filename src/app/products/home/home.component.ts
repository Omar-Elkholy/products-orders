import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDialogComponent } from 'src/app/shared/dialogs/order-dialog/order-dialog.component';
import { Product } from 'src/app/shared/models/product.model';
import { CoreService } from 'src/app/shared/services/core.service';
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';
import { Order, OrderProduct } from 'src/app/shared/models/order.model';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products$: Observable<Product[]>;
  addedQuantity: any = {};
  addedProducts: Product[] = [];
  startShowOrderBtn: boolean;

  constructor(
    private coreService: CoreService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.products$ = this.coreService.getJSON<Product[]>("/assets/data/products.json");
  }

  // CHECK IF THE QUANITTY OF THE PRODUCT IS LESS THAN OR EQUAL 5
  // THIS FUNCTION IS ALSO USED TO HANDLE THE UNDEFINED | 0 POSSIBLILITY OF THE QUANITITY
  checkQuantity(num: number | undefined) {
    return num ? num <= 5 : false
  }

  // THIS METHOD IS USED TO ADD PRODUCTS TO addedQuantity OBJECT (THAT HOLDS THE QUANTITY) & THE ORDER PRODUCTS ARRAY
  // IN THIS FUNCTION WE CHECK IF WE HAVE ADDED THE PRODUCT BEFORE THEN UPDATE THE QUANTITY OF IT -> ELSE PUSH THE PRODUCT WITH QUANITYT 1
  addOrUpdateOrder(product: Product) {
    this.startShowOrderBtn = true;
    const productIndex = this.addedProducts.findIndex(item => item.ProductId === product.ProductId);
    if (productIndex === -1) {
      product.quantity = 1;
      if (product.AvailablePieces >= product.quantity) {
        this.addedQuantity[product.ProductId] = 1;
        this.addedProducts.push(product);
      }
    } else {
      if (product.AvailablePieces > this.addedQuantity[product.ProductId]) {
        this.addedQuantity[product.ProductId] = this.addedQuantity[product.ProductId] + 1;
        this.updateExistingOrder(productIndex, product, this.addedQuantity[product.ProductId]);
      }
    }
  }

  updateExistingOrder(index: number, product: Product, newQuantity: number) {
    product.quantity = newQuantity;
    this.addedProducts.splice(index, 1, product);
  }


  // HERE WE CHECK FOR THE QUANITITY OF THE PRODUCT IF 1 THEN WE REMOVE IT -> OTHERWISE UPDATE THE EXISTING PRODUCT WITH NEW QUANITITY
  decreaseOrRemoveOrder(product: Product) {
    const productIndex = this.addedProducts.findIndex(item => item.ProductId === product.ProductId);
    if (product.quantity === 1) {
      this.addedQuantity[product.ProductId] = 0;
      this.addedProducts.splice(productIndex, 1);
    }
    else {
      this.addedQuantity[product.ProductId] = this.addedQuantity[product.ProductId] - 1;
      this.updateExistingOrder(productIndex, product, this.addedQuantity[product.ProductId]);
    }
  }

  openDialog() {
    this.dialog.open(OrderDialogComponent, {
      width: window.innerWidth < 992 ? '90%' : '35%'
    })
      .afterClosed().subscribe(
        result => {
          if (result) {
            this.postOrder(result.data)
          }
        }
      );
  }

  postOrder(data: any) {
    let orderProducts: OrderProduct[] = [];
    this.addedProducts.forEach(item => {
      orderProducts.push({
        ProductId: item.ProductId,
        Quantity: item.quantity || 0
      })
    })

    const obj: Order = {
      OrderDate: new Date().toString(),
      // RANDOM 6 DIGITS
      OrderId: Math.floor(Math.random() * 90000) + 10000,
      PaymentType: data.paymentType,
      Products: orderProducts,
      UserId: data.userId
    }

    this.coreService.addedOrders.unshift(obj);
    localStorage.setItem('addedOrders', JSON.stringify(this.coreService.addedOrders))
    this.toastr.success('Order Added Successfully..!');

    this.addedQuantity = {};
    this.addedProducts = [];
  }

}
