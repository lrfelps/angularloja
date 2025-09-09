import { Injectable, inject } from '@angular/core';
import { ProdutoModel } from '../models/produtoModel';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private http = inject(HttpClient);
  private base = 'http://localhost:8080/produtos'
  private produtos: ProdutoModel[] = [

  ];

  listar(): Observable<ProdutoModel[]> {
    return this.http.get<ProdutoModel[]>(`${this.base}/listar`)
    .pipe(catchError(this.handle));
  }

  private handle(err: HttpErrorResponse){
    const msg = err.error?.message || err.error?.erro ||
      err.message || 'Erro inesperado'
      return throwError(() => new Error (msg));
  }


}
