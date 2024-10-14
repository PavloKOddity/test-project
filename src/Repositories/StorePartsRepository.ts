import { injectable } from "inversify";

import { PartType } from "../Common/PartTypes";

interface Supplier {
  id: number;
  name: string;
}

interface Part {
  id: number;
  type: PartType;
  material: string;
  supplierId: number;
}

export abstract class StorePartsRepository {
  public abstract insertSupplier(name: string): Promise<Supplier>;
  public abstract insertPart(type: PartType, material: string, supplierId: number): Promise<Part | null>;
  public abstract getSupplierById(id: number): Promise<Supplier | undefined>;
  public abstract getPartsBySupplierId(supplierId: number): Promise<Part[]>;
  public abstract updateSupplier(id: number, newName: string): Promise<boolean>;
  public abstract updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean>;
  public abstract deleteSupplier(id: number): Promise<boolean>;
  public abstract deletePart(id: number): Promise<boolean>;

  // Transaction control methods
  public abstract beginTransaction(): void;
  public abstract commitTransaction(): void;
  public abstract rollbackTransaction(): void;
}

@injectable()
export class StorePartsRepositoryImpl implements StorePartsRepository {
  suppliers: Supplier[] = [];
  parts: Part[] = [];
  supplierIdCounter = 1;
  partIdCounter = 1;

  // Snapshots for transaction management
  private suppliersSnapshot: Supplier[] = [];
  private partsSnapshot: Part[] = [];
  private transactionActive: boolean = false;

  // Begin a transaction by taking a snapshot of the current state
  public beginTransaction(): void {
    this.suppliersSnapshot = [...this.suppliers];
    this.partsSnapshot = [...this.parts];
    this.transactionActive = true;
  }

  // Commit the transaction by discarding the snapshot
  public commitTransaction(): void {
    if (!this.transactionActive) {
      throw new Error("No active transaction to commit.");
    }

    this.suppliersSnapshot = [];
    this.partsSnapshot = [];
    this.transactionActive = false;
  }

  // Rollback the transaction by restoring the snapshot
  public rollbackTransaction(): void {
    if (!this.transactionActive) {
      throw new Error("No active transaction to rollback.");
    }

    this.suppliers = [...this.suppliersSnapshot];
    this.parts = [...this.partsSnapshot];
    this.transactionActive = false;
  }

  // Insert supplier
  async insertSupplier(name: string): Promise<Supplier> {
    const newSupplier: Supplier = { id: this.supplierIdCounter++, name };
    this.suppliers.push(newSupplier);

    return newSupplier;
  }

  // Insert part
  async insertPart(type: PartType, material: string, supplierId: number): Promise<Part | null> {
    const newPart: Part = { id: this.partIdCounter++, type, material, supplierId };
    this.parts.push(newPart);

    return newPart;
  }

  // Get supplier by ID
  async getSupplierById(id: number): Promise<Supplier | undefined> {
    return this.suppliers.find((supplier) => supplier.id === id);
  }

  // Get parts by supplier ID
  async getPartsBySupplierId(supplierId: number): Promise<Part[]> {
    return this.parts.filter((part) => part.supplierId === supplierId);
  }

  // Update supplier
  async updateSupplier(id: number, newName: string): Promise<boolean> {
    const supplier = this.suppliers.find((supplier) => supplier.id === id);
    if (supplier) {
      supplier.name = newName;

      return true;
    }
    return false;
  }

  // Update part
  async updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean> {
    const part = this.parts.find((part) => part.id === id);
    if (part) {
      part.type = newType;
      part.material = newMaterial;

      return true;
    }

    return false;
  }

  // Delete supplier
  async deleteSupplier(id: number): Promise<boolean> {
    const index = this.suppliers.findIndex((supplier) => supplier.id === id);
    if (index !== -1) {
      this.suppliers.splice(index, 1);
      this.parts = this.parts.filter((part) => part.supplierId !== id);

      return true;
    }

    return false;
  }

  // Delete part
  async deletePart(id: number): Promise<boolean> {
    const index = this.parts.findIndex((part) => part.id === id);
    if (index !== -1) {
      this.parts.splice(index, 1);

      return true;
    }

    return false;
  }
}
