import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import * as AppTypes from "../../../common/AppTypes";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import ValueUtils from "../../../common/utils/ValueUtils";
import { BoardService } from "../../../common/service/BoardService";
import { BoardCommentService } from "../../../common/service/BoardCommentService";
import { catchError, of, Subject, takeUntil } from "rxjs";
import { AppErrorHandler } from "../../../common/handler/AppErrorHandler";
import * as BoardCommentDto from "../../../common/model/BoardCommentDto";

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit, OnDestroy {
  private no: number = -1;
  private currentMode: AppTypes.PageMode = AppTypes.PageMode.view;
  postForm: FormGroup;
  commentForm: FormGroup;
  commentList: BoardCommentDto.ResponseList = {
    total: 0,
    pages: 0,
    list: []
  }

  private destroy$ = new Subject<void>();
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private boardService: BoardService,
    private boardCommentService: BoardCommentService,
    private appErrorHandler: AppErrorHandler
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      password: ['', Validators.required],
      content: ['', Validators.required]
    })

    this.commentForm = this.fb.group({
      writer: ['', Validators.required],
      password: ['', Validators.required],
      content: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.subscribeToParams();
    this.subscribeToErrors();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToParams(): void {
    this.route.params.subscribe(params => {
      this.no = params['no'];
      this.currentMode = ValueUtils.nvl(params['mode'], AppTypes.PageMode.view);

      if (!this.no && this.currentMode === AppTypes.PageMode.view) {
        alert('유효하지 않은 접근입니다.');
        this.router.navigate(['/board/list']);
        return;
      }

      this.loadPage();
    })
  }

  private subscribeToErrors(): void {
    this.appErrorHandler.stream$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(error => {
      if (error) {
        alert(error.message);
        this.appErrorHandler.clear();
      }
    })
  }

  private loadPage(): void {
    this.subscribeToPost();
    this.subscribeToComments();
  }

  private subscribeToPost(): void {
    this.boardService.get(this.no).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.appErrorHandler.report(error);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.postForm.setValue({
          title: ValueUtils.nvl(data.title),
          author: ValueUtils.nvl(data.writer),
          content: ValueUtils.nvl(data.content)
        })
      }
    })
  }

  private subscribeToComments(): void {
    this.boardCommentService.list(this.no).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.appErrorHandler.report(error);
        return of(this.commentList);
      })
    ).subscribe(data => {
      this.commentList = data;
    })
  }

  public handleListClick(): void {
    this.location.back();
  }

  public handleEditClick(): void {
    this.currentMode = AppTypes.PageMode.edit;
  }

  public handleDeleteClick() {
    if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      // @ts-ignore
      this.boardService.delete(this.no).pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.appErrorHandler.report(error);
          return of(null);
        })
      ).subscribe(() => {
        this.router.navigate(['/board/list']);
      })
    }
  }

  public handleCacelClick() {
    if (this.currentMode === AppTypes.PageMode.edit) {
      this.currentMode = AppTypes.PageMode.view;
    }
  }

  public onSubmit() {

  }

  public onCommentSubmit() {

  }
}
