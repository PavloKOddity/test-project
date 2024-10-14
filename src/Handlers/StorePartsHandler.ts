import { Request, Response } from "express";
import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";

import { StorePartsRepository } from "../Repositories/StorePartsRepository";

/**
 * Task:
 * Implement the handle method for saving data about car parts and their supplier.
 *
 * The system should enforce the following requirements:
 * 1. Each supplier can only supply one type of goods (e.g., car parts of a specific type).
 * 2. If needed, you are allowed to modify the function signatures or install additional packages to fulfill the task requirements.
 */

// Req body examples

//{
//   "loader": {
//     "loaderId": "12345",
//     "loaderName": "John Doe"
//   },
//   "parts": [
//     {
//       "type": "wheel",
//       "diameter": 22,
//       "material": "rubber"
//     },
//     {
//       "type": "wheel",
//       "diameter": 18,
//       "material": "rubber"
//     }
//   ]
// }

//{
//   "loader": {
//     "loaderId": "12345",
//     "loaderName": "John Doe"
//   },
//   "parts": [
//     {
//       "type": "door",
//       "height": 2.1,
//       "width": 0.9,
//       "material": "steel"
//     },
//     {
//       "type": "door",
//       "height": 2.0,
//       "width": 0.8,
//       "material": "aluminum"
//     }
//   ]
// }

//{
//   "loader": {
//     "loaderId": "12345",
//     "loaderName": "John Doe"
//   },
//   "parts": [
//     {
//       "type": "window",
//       "height": 1.2,
//       "width": 1.0,
//       "glassType": "tempered"
//     },
//     {
//       "type": "window",
//       "height": 1.5,
//       "width": 1.2,
//       "glassType": "laminated"
//     }
//   ]
// }

@injectable()
export class StorePartsHandler {
  constructor(private readonly storePartsRepository: StorePartsRepository) {}

  public async handle(_req: Request, res: Response): Promise<void> {
    res.status(StatusCodes.OK).end();
  }
}
