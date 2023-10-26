import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BoardDto from "../../../common/model/BoardDto";
import { BoardService } from "../../../common/service/BoardService";
import AppConstants from "../../../common/AppConstants";
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from "rxjs";
import { AppErrorService } from "../../../common/service/AppErrorService";

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

  private keywordInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private boardService: BoardService, private appErrorHandler: AppErrorService) {
  }

  ngOnInit(): void {
    this.search();

    this.subscribeToKeywordChange();
    this.subscribeToErrors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private search() {
    this.boardService.list(this.page).pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      catchError(error => {
        this.appErrorHandler.report(error);
        return of(this.pageList);
      })
    ).subscribe(data => this.updatePageList(data));
  }

  private subscribeToKeywordChange() {
    this.keywordInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword) => this.boardService.list({ ... this.page, page: 1, keyword })),
      takeUntil(this.destroy$),
      catchError(error => {
        this.appErrorHandler.report(error);
        return of(this.pageList);
      })
    ).subscribe(data => this.updatePageList(data));
  }

  private subscribeToErrors(): void {
    this.appErrorHandler.stream$.subscribe(error => {
      if (error) {
        alert(error.message);
        this.appErrorHandler.clear();
      }
    })
  }

  private updatePageList(data: BoardDto.ResponseList): void {
    this.pageList = data;
  }

  public handleKeywordChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.keywordInput$.next(input.value);
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
