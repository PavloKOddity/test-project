import { StorePartsRepository } from "../../src/Repositories/StorePartsRepository";
import { PartTypes } from "../../src/Common/PartType";
import { setupTestContext } from "../setup";

const appTest = setupTestContext();

describe("StorePartsRepositoryImpl", () => {
  let repository: StorePartsRepository;

  beforeEach(() => {
    repository = appTest.container.get(StorePartsRepository);
  });

  afterEach(async () => {
    await repository.flushStorage();
  });

  // Supplier operations
  it("should insert a supplier", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const suppliersSnapshot = repository.getSuppliers();

    expect(suppliersSnapshot.length).toBe(1);
    expect(suppliersSnapshot[0]).toEqual(supplier);
  });

  it("should insert multiple suppliers with unique IDs", async () => {
    const supplier1 = await repository.insertSupplier("Supplier A");
    const supplier2 = await repository.insertSupplier("Supplier B");
    const suppliersSnapshot = repository.getSuppliers();

    expect(suppliersSnapshot.length).toBe(2);
    expect(supplier1.id).not.toEqual(supplier2.id);
  });

  it("should return the correct supplier by ID", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const fetchedSupplier = await repository.getSupplierById(supplier.id);

    expect(fetchedSupplier).toEqual(supplier);
  });

  it("should return undefined if supplier does not exist", async () => {
    const fetchedSupplier = await repository.getSupplierById(999);
    expect(fetchedSupplier).toBeNull();
  });

  it("should update an existing supplier's name", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const result = await repository.updateSupplier(supplier.id, "Supplier B");
    const updatedSupplier = await repository.getSupplierById(supplier.id);

    expect(result).toBe(true);
    expect(updatedSupplier?.name).toBe("Supplier B");
  });

  it("should return false when updating a non-existent supplier", async () => {
    const result = await repository.updateSupplier(999, "Supplier B");
    expect(result).toBe(false);
  });

  it("should delete an existing supplier and remove its parts", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    await repository.insertPart(PartTypes.Wheel, "Steel", supplier.id);
    const deleteResult = await repository.deleteSupplier(supplier.id);
    const fetchedSupplier = await repository.getSupplierById(supplier.id);
    const fetchedParts = await repository.getPartsBySupplierId(supplier.id);

    expect(deleteResult).toBe(true);
    expect(fetchedSupplier).toBeNull();
    expect(fetchedParts.length).toBe(0);
  });

  it("should return false when deleting a non-existent supplier", async () => {
    const result = await repository.deleteSupplier(999);
    expect(result).toBe(false);
  });

  // Part operations
  it("should insert a part", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const part = await repository.insertPart(PartTypes.Wheel, "Steel", supplier.id);
    const parts = await repository.getPartsBySupplierId(supplier.id);

    expect(parts.length).toBe(1);
    expect(parts[0]).toEqual(part);
  });

  it("should return null when trying to insert a part for a non-existent supplier", async () => {
    const part = await repository.insertPart(PartTypes.Door, "Steel", 999);
    expect(part).toBeNull();
  });

  it("should update an existing part's type and material", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const part = await repository.insertPart(PartTypes.Door, "Steel", supplier.id);
    const result = await repository.updatePart(part!.id, PartTypes.Window, "Oak");
    const updatedParts = await repository.getPartsBySupplierId(supplier.id);

    expect(result).toBe(true);
    expect(updatedParts[0].type).toBe(PartTypes.Window);
    expect(updatedParts[0].material).toBe("Oak");
  });

  it("should return false when updating a non-existent part", async () => {
    const result = await repository.updatePart(999, PartTypes.Door, "Oak");
    expect(result).toBe(false);
  });

  it("should delete an existing part", async () => {
    const supplier = await repository.insertSupplier("Supplier A");
    const part = await repository.insertPart(PartTypes.Door, "Steel", supplier.id);
    const deleteResult = await repository.deletePart(part!.id);
    const parts = await repository.getPartsBySupplierId(supplier.id);

    expect(deleteResult).toBe(true);
    expect(parts.length).toBe(0);
  });

  it("should return false when trying to delete a non-existent part", async () => {
    const result = await repository.deletePart(999);
    expect(result).toBe(false);
  });

  // Transaction operations
  it("should rollback transaction and restore state", async () => {
    await repository.insertSupplier("Supplier A");
    repository.beginTransaction();
    await repository.insertSupplier("Supplier B");

    repository.rollbackTransaction();
    const suppliersSnapshot = repository.getSuppliersSnapshot();
    expect(suppliersSnapshot.length).toBe(1);
    expect(suppliersSnapshot[0].name).toBe("Supplier A");
  });

  it("should commit transaction and discard the snapshot", async () => {
    await repository.insertSupplier("Supplier A");
    repository.beginTransaction();
    await repository.insertSupplier("Supplier B");

    repository.commitTransaction();
    const suppliersSnapshot = repository.getSuppliersSnapshot();
    expect(suppliersSnapshot.length).toBe(0);
  });

  it("should throw an error when trying to commit without an active transaction", () => {
    expect(() => repository.commitTransaction()).toThrow("No active transaction to commit.");
  });

  it("should throw an error when trying to rollback without an active transaction", () => {
    expect(() => repository.rollbackTransaction()).toThrow("No active transaction to rollback.");
  });

  // Connection operations
  it("should reset all internal states on flushStorage", async () => {
    await repository.insertSupplier("Supplier A");
    await repository.insertPart(PartTypes.Door, "Steel", 1);

    await repository.flushStorage();
    const suppliersSnapshot = repository.getSuppliersSnapshot();
    const parts = await repository.getPartsBySupplierId(1);

    expect(suppliersSnapshot.length).toBe(0);
    expect(parts.length).toBe(0);
  });

  it("should wait for transaction to finish before storage flushing", async () => {
    await repository.insertSupplier("Supplier A");
    repository.beginTransaction();
    const closePromise = repository.flushStorage();
    repository.commitTransaction();
    await closePromise;

    const suppliersSnapshot = repository.getSuppliersSnapshot();
    expect(suppliersSnapshot.length).toBe(0);
  });
});
