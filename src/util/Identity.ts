namespace Util {

  export interface Identifiable {
    id:number;
  } 

  export class IdentityService {
    
    private static lastID:number = 0;

    public static newIdentity ():number {
      return IdentityService.lastID++;
    }

  }

}