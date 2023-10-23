import * as AppTypes from "../AppTypes";

export default {};

export interface Response<T> {
  total: number;
  pages: number;
  list: T[];
}

export interface Request {
  page: number;
  size: number;
  order?: string;
  direction?: AppTypes.Direction;
}
