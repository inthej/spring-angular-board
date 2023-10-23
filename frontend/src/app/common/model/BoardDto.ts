import * as PageListDto from "./PageListDto";

export default {}

export interface Response {
  id: number;
  title: string;
  content: string;
  writer: string;
  password?: string;
  view_count: number;
  created_id?: number;
  created_dt: string;
}

export interface Summary {
  id: number;
  title: string;
  content: string;
  writer: string;
  view_count: number;
  created_dt: string;
}

export interface Create {
  title: string;
  writer: string;
  password: string;
  content: string;
  created_id?: number;
}

export interface Update {
  title: string;
  writer: string;
  password: string;
  content: string;
}

export interface RequestList extends PageListDto.Request {
  keyword?: string;
}

export interface ResponseList extends PageListDto.Response<Summary> {
}
