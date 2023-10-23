import * as PageListDto from "./PageListDto";

export default {}

export interface Response {
  id: number;
  bid: number;
  content: string;
  writer: string;
  password: string;
  created_id?: number;
  created_dt: string;
}

export interface Summary {
  id: number;
  bid: number;
  writer: string;
  content: string;
  created_dt: string;
}

export interface Create {
  writer: string;
  password: string;
  content: string;
  created_id?: number;
}

export interface Update {
  writer: string;
  content: string;
  created_id?: number;
}

export interface RequestList extends PageListDto.Request {
}

export interface ResponseList extends PageListDto.Response<Summary> {
}
