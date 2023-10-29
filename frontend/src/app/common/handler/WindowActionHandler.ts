import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class WindowActionHandler {
  constructor() {}

  reload(): void {
    window.location.reload();
  }

  confirm(message: string): boolean {
    return window.confirm(message);
  }

  alert(message: string): void {
    window.alert(message);
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
