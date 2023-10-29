import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import * as AppTypes from "../../../common/AppTypes";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import ValueUtils from "../../../common/utils/ValueUtils";
import { BoardService } from "../../../common/service/BoardService";
import { BoardCommentService } from "../../../common/service/BoardCommentService";
import { delay, Subject, takeUntil } from "rxjs";
import { AppErrorHandler } from "../../../common/handler/AppErrorHandler";
import * as BoardCommentDto from "../../../common/model/BoardCommentDto";
import * as BoardDto from "../../../common/model/BoardDto";
import { WindowActionHandler } from "../../../common/handler/WindowActionHandler";

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.css']
})
export class BoardViewComponent implements OnInit, OnDestroy {
  private no: number = -1;
  private destroy$ = new Subject<void>();

  protected readonly AppTypes = AppTypes;

  public currentMode: AppTypes.PageMode = AppTypes.PageMode.view;

  public commentList: BoardCommentDto.ResponseList = {
    total: 0,
    pages: 0,
    list: []
  }

  public postForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    password: ['', Validators.required],
    content: ['', Validators.required]
  });

  public commentForm = this.fb.group({
    writer: ['', Validators.required],
    password: ['', Validators.required],
    content: ['', Validators.required]
  });

  private isSubmitted = false;
  private isCommentSubmitted = false;
  public isLoading = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private boardService: BoardService,
    private boardCommentService: BoardCommentService,
    private appErrorHandler: AppErrorHandler,
    private windowActionHandler: WindowActionHandler
  ) {
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
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.no = params['no'];
      this.currentMode = ValueUtils.nvl(params['mode'], AppTypes.PageMode.view);

      const isViewMode = this.currentMode === AppTypes.PageMode.view;
      if (isViewMode && !this.no) {
        this.windowActionHandler.alert('유효하지 않은 접근입니다.');
        this.router.navigate(['/board/list']);
        return;
      }

      if (isViewMode) {
        this.loadPage();
      }
    })
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

  private loadPage(): void {
    this.subscribeToPost();
    this.subscribeToComments();
  }

  private subscribeToPost(): void {
    this.boardService.get(this.no).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: data => {
        if (data) {
          this.postForm.setValue({
            title: ValueUtils.nvl(data.title),
            author: ValueUtils.nvl(data.writer),
            password: '',
            content: ValueUtils.nvl(data.content)
          });
        }
      },
      error: err => {
        this.appErrorHandler.report(err);
      }
    })
  }

  private subscribeToComments(): void {
    this.isLoading = true;
    this.boardCommentService.list(this.no).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: data => {
        if (data) {
          this.commentList = data;
        }
      },
      error: err => {
        this.appErrorHandler.report(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  public handleListClick(): void {
    this.location.back();
  }

  public handleEditClick(): void {
    this.currentMode = AppTypes.PageMode.edit;
  }

  public handleDeleteClick() {
    if (this.windowActionHandler.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
      this.boardService.delete(this.no).pipe(
        delay(1_000),
        takeUntil(this.destroy$),
      ).subscribe({
        next: data => {
          this.router.navigate(['/board/list']);
        },
        error: err => {
          this.appErrorHandler.report(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    }
  }

  public handleCancelClick() {
    if (this.currentMode === AppTypes.PageMode.edit) {
      this.currentMode = AppTypes.PageMode.view;
      return;
    }

    this.location.back();
  }

  public submitPostForm() {
    if (this.postForm.invalid) {
      this.isSubmitted = true
      this.postForm.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.postForm.value.title,
      writer: this.postForm.value.author,
      password: this.postForm.value.password,
      content: this.postForm.value.content
    }

    if (this.currentMode === AppTypes.PageMode.create) {
      this.isLoading = true;

      this.boardService.create(payload as BoardDto.Create).pipe(
        delay(1_000),
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          this.windowActionHandler.alert('게시물이 등록되었습니다.');
          this.router.navigate(['/board/list']);
        },
        error: err => {
          this.appErrorHandler.report(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
      return;
    }

    if (this.currentMode === AppTypes.PageMode.edit) {
      this.isLoading = true;
      this.boardService.update(this.no, payload as BoardDto.Update).pipe(
        delay(1_000),
        takeUntil(this.destroy$)
      ).subscribe({
        next: data => {
          this.windowActionHandler.alert('게시물이 수정되었습니다.');
          this.router.navigate(['/board/list']);
        },
        error: err => {
          this.appErrorHandler.report(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    }
  }

  public submitCommentForm() {
    if (this.commentForm.invalid) {
      this.isCommentSubmitted = true
      this.commentForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.commentForm.value,
    } as BoardCommentDto.Create;

    this.isLoading = true;

    this.boardCommentService.create(this.no, payload).pipe(
      delay(1_000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: data => {
        this.commentForm.reset();
        this.windowActionHandler.reload();
        this.windowActionHandler.scrollToTop();
      },
      error: err => {
        this.appErrorHandler.report(err);
      },
      complete: () => {
        this.isLoading = true;
      }
    });
  }

  public postFormHasError(key: string) {
    return this.postForm.get(key)?.touched && this.postForm.get(key)?.hasError('required');
  }

  public commentFormHasError(key: string) {
    return this.commentForm.get(key)?.touched && this.commentForm.get(key)?.hasError('required');
  }

  public checkError(key: string) {
    return this.isSubmitted ? this.postForm.get(key)?.hasError('required') : null;
  }

  public checkCommentError(key: string) {
    return this.isCommentSubmitted ? this.commentForm.get(key)?.hasError('required') : null;
  }
}
