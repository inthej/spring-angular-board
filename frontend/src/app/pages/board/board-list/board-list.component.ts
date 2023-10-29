import { Component, OnDestroy, OnInit } from '@angular/core';
import * as BoardDto from "../../../common/model/BoardDto";
import { BoardService } from "../../../common/service/BoardService";
import AppConstants from "../../../common/AppConstants";
import { debounceTime, Subject, switchMap, takeUntil } from "rxjs";
import { AppErrorHandler } from "../../../common/handler/AppErrorHandler";
import { Router } from "@angular/router";
import * as AppTypes from "../../../common/AppTypes";
import { WindowActionHandler } from "../../../common/handler/WindowActionHandler";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit, OnDestroy {
  private keywordInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

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

  public isLoading = false;

  constructor(
    private router: Router,
    private boardService: BoardService,
    private appErrorHandler: AppErrorHandler,
    private windowActionHandler: WindowActionHandler) {
  }

  ngOnInit(): void {
    this.search();
    this.subscribeToKeywordChanges();
    this.subscribeToErrors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private search() {
    this.isLoading = true;
    this.boardService.list(this.page).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        if (data) {
          this.updatePageList(data)
        }
      },
      error: err => {
        this.appErrorHandler.report(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private subscribeToKeywordChanges(): void {
    this.isLoading = true;
    this.keywordInput$.pipe(
      debounceTime(300),
      switchMap((keyword) => this.boardService.list({ ... this.page, page: 1, keyword })),
      takeUntil(this.destroy$),
    ).subscribe({
      next: data => {
        if (data) {
          this.updatePageList(data);
        }
      },
      error: err => {
        this.appErrorHandler.report(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private subscribeToErrors(): void {
    this.appErrorHandler.stream$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(error => {
      if (error) {
        this.windowActionHandler.alert(error.message);
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
    this.router.navigate([`/board/${AppTypes.PageMode.create}`])
  }

  public handleRowSelect(id: number): void {
    this.router.navigate(['/board/view', id]);
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
