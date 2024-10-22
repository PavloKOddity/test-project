import { Request, Response } from "express";
import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";

import { StorePartsRepository } from "../Repositories/StorePartsRepository";

@injectable()
export class StorePartsHandler {
  constructor(private readonly storePartsRepository: StorePartsRepository) {}

  public async handle(_req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).end();
  }
}
