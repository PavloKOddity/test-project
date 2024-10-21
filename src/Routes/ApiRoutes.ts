import { Router } from "express";
import { Container } from "inversify";

import { StorePartsHandler } from "../Handlers/StorePartsHandler";

export function configureRoutes(container: Container): Router {
  const router = Router();

  const storePartsHandler = container.get<StorePartsHandler>(StorePartsHandler);

  router.post("/store-parts", (req, res) => storePartsHandler.handle(req, res));

  return router;
}
