import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  
  product;
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();



  constructor(private productService: ProductService) { }
  selectedProduct$ = this.productService.selectedProduct$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
    return EMPTY;
  }));
}
