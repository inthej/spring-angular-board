import AppConstants from "../AppConstants";
import * as BoardCommentDto from "../model/BoardCommentDto";
import axios from "axios";
import { ResponseModel } from "../model/ResponseModel";

class BoardCommentService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = `${AppConstants.BASE_URL}/board`
  }

  get = async (bid: number, id: number): Promise<BoardCommentDto.Response> => {
    try {
      const path = `${this.apiUrl}/${bid}/comment/${id}`;
      const responseModel: ResponseModel<BoardCommentDto.Response> = await axios.get(path);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  create = async (bid: number, form: BoardCommentDto.Create): Promise<BoardCommentDto.Response> => {
    try {
      const path = `${this.apiUrl}/${bid}/comment`;
      const responseModel: ResponseModel<BoardCommentDto.Response> = await axios.post(path, form);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  update = async (bid: number, id: number, form: BoardCommentDto.Update): Promise<BoardCommentDto.Response> => {
    try {
      const path = `${this.apiUrl}/${bid}/comment/${id}`;
      const responseModel: ResponseModel<BoardCommentDto.Response> = await axios.put(path, form);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  delete = async (bid: number, id: number): Promise<BoardCommentDto.Response> => {
    try {
      const path = `${this.apiUrl}/${bid}/comment/${id}`;
      const responseModel: ResponseModel<BoardCommentDto.Response> = await axios.delete(path);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  list = async (bid: string, form: BoardCommentDto.RequestList): Promise<BoardCommentDto.ResponseList> => {
    try {
      const path = `${this.apiUrl}/${bid}/comments`;
      const responseModel: ResponseModel<BoardCommentDto.ResponseList> = await axios.get(path, { params: form });
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }
}

export const boardCommentService = new BoardCommentService();
