import { Component } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private title: Title, private meta: Meta) {
    this.setTitle('Spring-Angular-Board');
    this.setMetaDescription('스프링 앵귤러 게시판');
  }

  private setTitle(newTitle: string): void {
    this.title.setTitle(newTitle);
  }

  private setMetaDescription(description: string): void {
    this.meta.updateTag({ name: 'description',  content: description})
  }
}
