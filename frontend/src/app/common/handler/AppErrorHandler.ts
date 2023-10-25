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

  report(error: HttpErrorResponse): void {
    const model: ErrorModel = error?.error?.error;
    this.subject.next(model);
  }

  clear(): void {
    this.subject.next(null);
  }
}
