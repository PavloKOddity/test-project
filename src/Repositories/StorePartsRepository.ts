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
  loaderId: number; // ID вантажника, до якого належить частина
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
}

@injectable()
export class StorePartsRepositoryImpl implements StorePartsRepository {
  loaders: Loader[] = [];
  parts: Part[] = [];
  loaderIdCounter = 1;
  partIdCounter = 1;

  // Вставка вантажника
  async insertLoader(name: string): Promise<Loader> {
    const newLoader: Loader = { id: this.loaderIdCounter++, name };
    this.loaders.push(newLoader);
    return newLoader;
  }

  // Вставка частини
  async insertPart(type: PartType, material: string, loaderId: number): Promise<Part | null> {
    const newPart: Part = { id: this.partIdCounter++, type, material, loaderId };
    this.parts.push(newPart);
    return newPart;
  }

  // Отримання вантажника за ID
  async getLoaderById(id: number): Promise<Loader | undefined> {
    return this.loaders.find((loader) => loader.id === id);
  }

  // Отримання частин за ID вантажника
  async getPartsByLoaderId(loaderId: number): Promise<Part[]> {
    return this.parts.filter((part) => part.loaderId === loaderId);
  }

  // Оновлення вантажника
  async updateLoader(id: number, newName: string): Promise<boolean> {
    const loader = this.loaders.find((loader) => loader.id === id);
    if (loader) {
      loader.name = newName;
      return true;
    }
    return false;
  }

  // Оновлення частини
  async updatePart(id: number, newType: PartType, newMaterial: string): Promise<boolean> {
    const part = this.parts.find((part) => part.id === id);
    if (part) {
      part.type = newType;
      part.material = newMaterial;
      return true;
    }
    return false;
  }

  // Видалення вантажника
  async deleteLoader(id: number): Promise<boolean> {
    const index = this.loaders.findIndex((loader) => loader.id === id);
    if (index !== -1) {
      this.loaders.splice(index, 1);
      // Видаляємо всі частини, що належать цьому вантажнику
      this.parts = this.parts.filter((part) => part.loaderId !== id);
      return true;
    }
    return false;
  }

  // Видалення частини
  async deletePart(id: number): Promise<boolean> {
    const index = this.parts.findIndex((part) => part.id === id);
    if (index !== -1) {
      this.parts.splice(index, 1);
      return true;
    }
    return false;
  }
}
