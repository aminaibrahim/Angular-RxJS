import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, EMPTY } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId;
  
  products: Product[] = [];
  sub: Subscription;

  constructor(private productService: ProductService) { }


  selectProduct$ = this.productService.selectedProduct$;


  products$ = this.productService.productWithCategory$.pipe(catchError(err => {
    this. errorMessage = err;
    return EMPTY;
  }));


  onSelected = (selectedId)=>{
    this.productService.selectedProduct(+selectedId);
  }



}
