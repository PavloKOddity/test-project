import { Container } from "inversify";

import { configureContainer } from "../src/Container";
import { StorePartsRepository } from "../src/Repositories/StorePartsRepository";

export function setupTestContext() {
  let container: Container;

  beforeEach(async () => {
    container = configureContainer();
  });

  afterEach(async () => {
    await container.get(StorePartsRepository).closeConnection();
  });

  return {
    get container() {
      return container;
    },
  };
}
