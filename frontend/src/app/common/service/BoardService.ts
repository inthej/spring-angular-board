import * as BoardDto from "../model/BoardDto";
import { ResponseModel } from "../model/ResponseModel";
import AppConstants from "../AppConstants";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly apiUrl: string = `${AppConstants.BASE_URL}/board`;

  constructor(private http: HttpClient) {
  }

  get = (id: number): Observable<BoardDto.Response> => {
    const path = `${this.apiUrl}/${id}`;
    return this.http.get<ResponseModel<BoardDto.Response>>(path)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  create = (form: BoardDto.Create): Observable<BoardDto.Response> => {
    const path = this.apiUrl;
    return this.http.post<ResponseModel<BoardDto.Response>>(path, form)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  update = (id: number, form: BoardDto.Update): Observable<BoardDto.Response> => {
    const path = `${this.apiUrl}/${id}`;
    return this.http.put<ResponseModel<BoardDto.Response>>(path, form)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  };

  delete = (id: number): Observable<BoardDto.Response> => {
    const path = `${this.apiUrl}/${id}`;
    return this.http.delete<ResponseModel<BoardDto.Response>>(path)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  list = (form: BoardDto.RequestList): Observable<BoardDto.ResponseList> => {
    const path = `${this.apiUrl}/list`;
    return this.http.get<ResponseModel<BoardDto.ResponseList>>(path, { params: <any>form })
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }
}

