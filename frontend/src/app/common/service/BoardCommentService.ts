import AppConstants from "../AppConstants";
import * as BoardCommentDto from "../model/BoardCommentDto";
import { ResponseModel } from "../model/ResponseModel";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardCommentService {
  private readonly apiUrl: string = `${AppConstants.BASE_URL}/board`;

  constructor(private http: HttpClient) {
  }

  get = (bid: number, id: number): Observable<BoardCommentDto.Response> => {
    const path = `${this.apiUrl}/${bid}/comment/${id}`;
    return this.http.get<ResponseModel<BoardCommentDto.Response>>(path)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  create = (bid: number, form: BoardCommentDto.Create): Observable<BoardCommentDto.Response> => {
    const path = `${this.apiUrl}/${bid}/comment`;
    return this.http.post<ResponseModel<BoardCommentDto.Response>>(path, form)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  update = (bid: number, id: number, form: BoardCommentDto.Update): Observable<BoardCommentDto.Response> => {
    const path = `${this.apiUrl}/${bid}/comment/${id}`;
    return this.http.put<ResponseModel<BoardCommentDto.Response>>(path, form)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  delete = (bid: number, id: number): Observable<BoardCommentDto.Response> => {
    const path = `${this.apiUrl}/${bid}/comment/${id}`;
    return this.http.delete<ResponseModel<BoardCommentDto.Response>>(path)
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      );
  }

  list = (bid: string, form: BoardCommentDto.RequestList): Observable<BoardCommentDto.ResponseList> => {
    const path = `${this.apiUrl}/${bid}/comments`;
    return this.http.get<ResponseModel<BoardCommentDto.ResponseList>>(path, { params: <any>form })
      .pipe(
        map(response => response.data),
        catchError(error => throwError(error))
      )
  }
}
