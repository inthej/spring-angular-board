import * as BoardDto from "../model/BoardDto";
import { ResponseModel } from "../model/ResponseModel";
import axios from "axios";
import AppConstants from "../AppConstants";

class BoardService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = `${AppConstants.BASE_URL}/board`;
  }

  get = async (id: number): Promise<BoardDto.Response> => {
    try {
      const path = `${this.apiUrl}/${id}`;
      const responseModel: ResponseModel<BoardDto.Response> = await axios.get(path);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  create = async (form: BoardDto.Create): Promise<BoardDto.Response> => {
    try {
      const path = this.apiUrl;
      const responseModel: ResponseModel<BoardDto.Response> = await axios.post(path, form);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  update = async (id: number, form: BoardDto.Update): Promise<BoardDto.Response> => {
    try {
      const path = `${this.apiUrl}/${id}`;
      const responseModel: ResponseModel<BoardDto.Response> = await axios.put(path, form);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }

  delete = async (id: number): Promise<BoardDto.Response> => {
    try {
      const path = `${this.apiUrl}/${id}`;
      const responseModel: ResponseModel<BoardDto.Response> = await axios.delete(path);
      return responseModel.data;
    } catch (error) {
      throw error;
    }
}

  list = async (form: BoardDto.RequestList): Promise<BoardDto.ResponseList> => {
    try {
      const path = this.apiUrl;
      const responseModel: ResponseModel<BoardDto.ResponseList> = await axios.get(path, { params: form });
      return responseModel.data;
    } catch (error) {
      throw error;
    }
  }
}

export const boardService = new BoardService();

