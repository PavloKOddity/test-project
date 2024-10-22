import { injectable } from "inversify";

import { PartType } from "../Common/PartType";

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
  public abstract getSupplierById(id: number): Supplier | null;

  public abstract getSuppliersSnapshot(): Supplier[];

  public abstract getSuppliers(): Supplier[];

  public abstract getPartsBySupplierId(supplierId: number): Part[];

  public abstract insertSupplier(name: string): Promise<Supplier>;

  public abstract insertPart(type: PartType, material: string, supplierId: number): Promise<Part | null>;

  public abstract updateSupplier(id: number, newName: string): Promise<boolean>;

  public abstract updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean>;

  public abstract deleteSupplier(id: number): Promise<boolean>;

  public abstract deletePart(id: number): Promise<boolean>;

  public abstract flushStorage(): Promise<void>;

  // Transaction control methods
  public abstract beginTransaction(): void;

  public abstract commitTransaction(): void;

  public abstract rollbackTransaction(): void;
}

@injectable()
export class StorePartsRepositoryImpl implements StorePartsRepository {
  private suppliers: Supplier[] = [];
  private parts: Part[] = [];
  private supplierIdCounter = 1;
  private partIdCounter = 1;

  // Snapshots for transaction management
  private suppliersSnapshot: Supplier[] = [];
  private partsSnapshot: Part[] = [];
  private transactionActive: boolean = false;

  public getSuppliers(): Supplier[] {
    return this.suppliers;
  }

  public getSuppliersSnapshot(): Supplier[] {
    return this.suppliersSnapshot;
  }

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

    // Simulating an async database insert with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.suppliers.push(newSupplier);
        resolve(newSupplier);
      }, 500); // Simulate a 500ms delay
    });
  }

  // Insert part
  async insertPart(type: PartType, material: string, supplierId: number): Promise<Part | null> {
    const supplierExists = this.getSupplierById(supplierId);
    if (!supplierExists) {
      return null;
    }

    const newPart: Part = { id: this.partIdCounter++, type, material, supplierId };

    // Simulating an async database insert with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.parts.push(newPart);
        resolve(newPart);
      }, 500); // Simulate a 500ms delay
    });
  }

  // Get supplier by ID
  getSupplierById(id: number): Supplier | null {
    return this.suppliers.find((supplier) => supplier.id === id) || null;
  }

  // Get parts by supplier ID
  getPartsBySupplierId(supplierId: number): Part[] {
    return this.parts.filter((part) => part.supplierId === supplierId);
  }

  // Update supplier
  async updateSupplier(id: number, newName: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const supplier = this.suppliers.find((supplier) => supplier.id === id);
        if (supplier) {
          supplier.name = newName;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simulate a 500ms delay
    });
  }

  // Update part
  async updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const part = this.parts.find((part) => part.id === id);
        if (part) {
          part.type = newType;
          part.material = newMaterial;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simulate a 500ms delay
    });
  }

  // Delete supplier
  async deleteSupplier(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.suppliers.findIndex((supplier) => supplier.id === id);
        if (index !== -1) {
          this.suppliers.splice(index, 1);
          this.parts = this.parts.filter((part) => part.supplierId !== id);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simulate a 500ms delay
    });
  }

  // Delete part
  async deletePart(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.parts.findIndex((part) => part.id === id);
        if (index !== -1) {
          this.parts.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simulate a 500ms delay
    });
  }

  // Flush storage (reset state) and await transaction completion
  public async flushStorage(): Promise<void> {
    if (this.transactionActive) {
      // Wait until transaction is finished
      await new Promise<void>((resolve) => {
        const checkTransaction = setInterval(() => {
          if (!this.transactionActive) {
            clearInterval(checkTransaction);
            resolve();
          }
        }, 100); // Check every 100ms
      });
    }

    // Now reset the state
    this.suppliers = [];
    this.parts = [];
    this.supplierIdCounter = 1;
    this.partIdCounter = 1;
    this.suppliersSnapshot = [];
    this.partsSnapshot = [];
    this.transactionActive = false;
  }
}
