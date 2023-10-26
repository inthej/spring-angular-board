import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ErrorModel } from "../model/ResponseModel";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler {
  private subject = new BehaviorSubject<ErrorModel | null>(null);

  get stream$() {
    return this.subject.asObservable();
  }

  report(response: HttpErrorResponse): void {
    const responseError = response.error;
    const errorModel: ErrorModel = responseError.error;
    this.subject.next(errorModel);
  }

  clear(): void {
    this.subject.next(null);
  }
}
