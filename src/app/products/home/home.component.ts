import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/models/product.model';
import { CoreService } from 'src/app/shared/services/core.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products$: Observable<Product[]>;

  constructor(
    private coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.products$ = this.coreService.getJSON<Product[]>("/assets/data/products.json");
  }

  // CHECK IF THE QUANITTY OF THE PRODUCT IS LESS THAN OR EQUAL 5
  // THIS FUNCTION IS ALSO USED TO HANDLE THE UNDEFINED POSSIBLILITY OF THE QUANITITY
  checkQuantity(num: number | undefined) {
    return num ? num <= 5 : false
  }

}
