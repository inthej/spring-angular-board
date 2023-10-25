import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BoardDto from "../../../common/model/BoardDto";
import { BoardService } from "../../../common/service/BoardService";
import AppConstants from "../../../common/AppConstants";
import { catchError, of, Subscription } from "rxjs";
import * as _ from "lodash-es";
import { AppErrorHandler } from "../../../common/handler/AppErrorHandler";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit, OnDestroy {
  public page: BoardDto.RequestList = {
    page: 1,
    size: AppConstants.DEFAULT_PAGE_SIZE,
    keyword: ''
  }

  public pageList: BoardDto.ResponseList = {
    total: 0,
    pages: 0,
    list: []
  }

  private errorSubscription: Subscription | undefined;
  private debounceKeywordChange = _.debounce(this.changeKeyword, 300)

  constructor(private boardService: BoardService, private appErrorHandler: AppErrorHandler) {
  }

  ngOnInit(): void {
    this.search();
    this.subscribeToErrors();
  }

  private async search() {
    this.boardService.list(this.page)
      .pipe(
        catchError(error => {
          this.appErrorHandler.report(error);
          return of(this.pageList);
        })
      )
      .subscribe(data => this.updatePageList(data));
  }

  ngOnDestroy(): void {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  private subscribeToErrors(): void {
    this.errorSubscription = this.appErrorHandler.stream$.subscribe(error => {
      if (error) {
        alert(error.message);
        this.appErrorHandler.clear();
      }
    })
  }

  private updatePageList(data: BoardDto.ResponseList): void {
    this.pageList = data;
  }

  private changeKeyword(keyword: string) {
    this.page = {
      ...this.page,
      page: 1,
      keyword
    };
    this.search();
  }

  public handleKeywordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.debounceKeywordChange(input.value);
  }

  public handleCreateBtnClick(): void {
    console.log('onCreateBtnClick');
  }

  public handleRowSelect(id: number): void {
    console.log('onRowSelect')
  }

  public handlePrevBtnClick(): void {
    if (this.page.page > 1) {
      this.page.page--;
      this.search();
    }
  }

  public handleNextBtnClick(): void {
    if (this.page.page < this.pageList.pages) {
      this.page.page++;
      this.search();
    }
  }
}
