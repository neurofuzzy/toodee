// Migrated from namespace Models to ES module

export interface Identifiable {
  id: number;
}

export interface IChild {
  parentID: number;
}

export class IdentityService {
  private static lastID: number = 0;

  public static newIdentity(): number {
    return IdentityService.lastID++;
  }
}