import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, combineLatest, BehaviorSubject, Subject, merge } from 'rxjs';
import { catchError, tap, map, scan } from 'rxjs/operators';

import { Product } from './product';

import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;

private selectedProductSubject = new BehaviorSubject<number>(0);
selectedProductAction$ =  this.selectedProductSubject.asObservable();



private addNewInsertedSubject = new Subject<Product>();
addNewInsertedAction$ = this.addNewInsertedSubject.asObservable();


  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      // tap(data => console.log('products', JSON.stringify(data))),
      catchError(this.handleError)
    );


  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$])
    .pipe(
      // tap(data => console.log('.........', data)),
      map(([products, categories]) => products.map(product => ({
        ...product,
        price: product.price * 2,
        categoryName: categories.find(c => product.categoryId === c.id).name,
        searchKey: [product.productName],
      }) as Product)
      )
    );

    selectedProduct$ = combineLatest([this. productWithCategory$, this.selectedProductAction$])
    .pipe( tap(data => console.log(data)),
      map(([productswithCategory, selectedProduct]) =>
        productswithCategory.find(singleproduct => singleproduct.id === selectedProduct)
      ),
      tap(data => console.log(data))
      );

// tslint:disable-next-line: deprecation
addObject$ =  merge(
  this.productWithCategory$,
  this.addNewInsertedAction$
)
  .pipe(
    scan((acc: Product[], value: Product) => [...acc, value]),
    catchError(err => {
      console.error(err);
      return throwError(err);
    })
  );






  constructor(private http: HttpClient,
              private supplierService: SupplierService,
              private productCategoryService: ProductCategoryService) { }


  private fakeProduct() {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      categoryName: "newItem",
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }


  selectedProduct =(selectedId) => {
    this.selectedProductSubject.next(selectedId);
  }
  addProduct = () => {
    this.addNewInsertedSubject.next(this.fakeProduct());
  }

}


  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }

