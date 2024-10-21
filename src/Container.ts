import { Container } from "inversify";

import { StorePartsRepository, StorePartsRepositoryImpl } from "./Repositories/StorePartsRepository";
import { StorePartsHandler } from "./Handlers/StorePartsHandler";

export function configureContainer() {
  const container = new Container();
  container.bind(StorePartsRepository).to(StorePartsRepositoryImpl).inSingletonScope();
  container.bind<StorePartsHandler>(StorePartsHandler).toSelf();

  return container;
}
