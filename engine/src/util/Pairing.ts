namespace Util {

  export class Pairing {

    public static cantorPair (a:number, b:number):number {

      var k1 = a;
      var k2 = b;

      if (a > b) {
        k1 = b;
        k2 = a;
      }

      return ( (k1 + k2) * (k1 + k2 + 1) ) * 0.5 + k2;

    }

  }

}