import { Container } from "inversify";

import { StorePartsRepository, StorePartsRepositoryImpl } from "./Repositories/StorePartsRepository";
import { StorePartsHandler } from "./Handlers/StorePartsHandler";

const container = new Container();
container.bind(StorePartsRepository).to(StorePartsRepositoryImpl).inSingletonScope();
container.bind<StorePartsHandler>(StorePartsHandler).toSelf();

export default container;
