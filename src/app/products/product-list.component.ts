import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Observable, EMPTY, combineLatest, forkJoin, Subject, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, tap, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
private selectedCategoryIdSubject = new BehaviorSubject<number>(0);
selectedCategoryAction$ = this.selectedCategoryIdSubject.asObservable();


  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }


  products$ = combineLatest([this.productService.productWithCategory$, this.selectedCategoryAction$])
  .pipe(map(([products, selectedcategoryId]) => products.filter(product =>
     selectedcategoryId? product.categoryId === selectedcategoryId : true)),
catchError(err => {
    this.errorMessage = err;
    return EMPTY;
  }));



      categories$ = this.productCategoryService.productCategories$.pipe(catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      }))


  // onAdd(): void {
  //   console.log('Not yet implemented');
  // }

  onSelected(categoryId: string): void {
this.selectedCategoryIdSubject.next(+categoryId);
  }
}
