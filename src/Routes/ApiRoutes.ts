import { Router } from "express";

import { StorePartsHandler } from "../Handlers/StorePartsHandler";
import container from "../Container";

const router = Router();

const storePartsHandler = container.get<StorePartsHandler>(StorePartsHandler);

router.post("/store-parts", (req, res) => storePartsHandler.handle(req, res));

export default router;
