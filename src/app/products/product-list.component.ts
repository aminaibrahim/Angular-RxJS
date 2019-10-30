import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Observable, EMPTY, combineLatest, forkJoin, Subject, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, tap, map, startWith, merge } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
 
private selectedCategoryIdSubject = new BehaviorSubject<number>(0);
selectedCategoryAction$ = this.selectedCategoryIdSubject.asObservable();


private errorMessagesSubject = new Subject<string>();
errorMessagesAction$ =  this.errorMessagesSubject.asObservable();

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }


  products$ = combineLatest([this.productService.addObject$, this.selectedCategoryAction$])
  .pipe(map(([products, selectedcategoryId]) => products.filter(product =>
     selectedcategoryId? product.categoryId === selectedcategoryId : true)),
catchError(err => {
    this.errorMessagesSubject.next(err);
    return EMPTY;
  }));

 

      categories$ = this.productCategoryService.productCategories$.pipe(catchError(err => {
        this.errorMessagesSubject.next(err);
        return EMPTY;
      }))

     


  onSelected(categoryId: string): void {
this.selectedCategoryIdSubject.next(+categoryId);
  }

  onAdd(product): void {
this.productService.addProduct();
  }
}
