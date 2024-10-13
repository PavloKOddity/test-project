import { injectable } from "inversify";

import { PartType } from "../Common/PartTypes";

interface Loader {
  id: number;
  name: string;
}

interface Part {
  id: number;
  type: PartType;
  material: string;
  loaderId: number;
}

export abstract class StorePartsRepository {
  public abstract insertLoader(name: string): Promise<Loader>;
  public abstract insertPart(type: PartType, material: string, loaderId: number): Promise<Part | null>;
  public abstract getLoaderById(id: number): Promise<Loader | undefined>;
  public abstract getPartsByLoaderId(loaderId: number): Promise<Part[]>;
  public abstract updateLoader(id: number, newName: string): Promise<boolean>;
  public abstract updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean>;
  public abstract deleteLoader(id: number): Promise<boolean>;
  public abstract deletePart(id: number): Promise<boolean>;

  // Transaction control methods
  public abstract beginTransaction(): void;
  public abstract commitTransaction(): void;
  public abstract rollbackTransaction(): void;
}

@injectable()
export class StorePartsRepositoryImpl implements StorePartsRepository {
  loaders: Loader[] = [];
  parts: Part[] = [];
  loaderIdCounter = 1;
  partIdCounter = 1;

  // Snapshots for transaction management
  private loadersSnapshot: Loader[] = [];
  private partsSnapshot: Part[] = [];
  private transactionActive: boolean = false;

  // Begin a transaction by taking a snapshot of the current state
  public beginTransaction(): void {
    this.loadersSnapshot = [...this.loaders];
    this.partsSnapshot = [...this.parts];
    this.transactionActive = true;
  }

  // Commit the transaction by discarding the snapshot
  public commitTransaction(): void {
    if (!this.transactionActive) {
      throw new Error("No active transaction to commit.");
    }
    this.loadersSnapshot = [];
    this.partsSnapshot = [];
    this.transactionActive = false;
  }

  // Rollback the transaction by restoring the snapshot
  public rollbackTransaction(): void {
    if (!this.transactionActive) {
      throw new Error("No active transaction to rollback.");
    }
    this.loaders = [...this.loadersSnapshot];
    this.parts = [...this.partsSnapshot];
    this.transactionActive = false;
  }

  // Insert loader
  async insertLoader(name: string): Promise<Loader> {
    const newLoader: Loader = { id: this.loaderIdCounter++, name };
    this.loaders.push(newLoader);
    return newLoader;
  }

  // Insert part
  async insertPart(type: PartType, material: string, loaderId: number): Promise<Part | null> {
    const newPart: Part = { id: this.partIdCounter++, type, material, loaderId };
    this.parts.push(newPart);
    return newPart;
  }

  // Get loader by ID
  async getLoaderById(id: number): Promise<Loader | undefined> {
    return this.loaders.find((loader) => loader.id === id);
  }

  // Get parts by loader ID
  async getPartsByLoaderId(loaderId: number): Promise<Part[]> {
    return this.parts.filter((part) => part.loaderId === loaderId);
  }

  // Update loader
  async updateLoader(id: number, newName: string): Promise<boolean> {
    const loader = this.loaders.find((loader) => loader.id === id);
    if (loader) {
      loader.name = newName;
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

  // Delete loader
  async deleteLoader(id: number): Promise<boolean> {
    const index = this.loaders.findIndex((loader) => loader.id === id);
    if (index !== -1) {
      this.loaders.splice(index, 1);
      this.parts = this.parts.filter((part) => part.loaderId !== id);
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
