// Migrated from namespace Physics to ES module
import { IPoint, IPointHit, ISegment } from '../geom/IGeom';
import { BaseBody } from './Body';
import { scalePoint, angleBetween, rotatePoint, distanceBetween, normalizePoint, SHAPE_ROUND, SHAPE_ORTHO } from '../geom/Helpers';

export interface IContactable {
  contactMask: number;
  resolveMask: number;
}

export class IContact<B> {
  penetration!: IPoint;
  itemA!: BaseBody;
  itemB!: B;
}

export class BaseContact<B> implements IContact<B> {
  public penetration!: IPoint;
  public itemA!: BaseBody;
  public itemB!: B;
  public corAB: number;

  constructor(penetration: IPoint, itemA: BaseBody, itemB: B, corAB: number = 1) {
    penetration = { ...penetration };
    normalizePoint(penetration);
    this.penetration = penetration;
    this.itemA = itemA;
    this.itemB = itemB;
    this.corAB = corAB;
  }
}

export class BodyBodyContact extends BaseContact<BaseBody> {}

export class BodySegmentBodyContact extends BaseContact<any> {
  public hitPoint!: IPointHit;
}

export class BodyBoundaryContact extends BaseContact<ISegment> {}

export function resolveContact(contact: IContact<BaseBody | ISegment | any>): void {
  let pen = contact.penetration;
  let iA = contact.itemA;
  let vA = iA.velocity;

  if (contact instanceof BodyBodyContact) {
    let iB = contact.itemB;
    let vB = iB.velocity;
    scalePoint(vA, contact.corAB);
    scalePoint(vB, contact.corAB);
    if (iA.bounds.shape == SHAPE_ROUND && iB.bounds.shape == SHAPE_ROUND) {
      let aA = iA.bounds.anchor;
      let aB = iB.bounds.anchor;
      let angle = angleBetween(aA.x, aA.y, aB.x, aB.y);
      rotatePoint(vA, angle);
      rotatePoint(vB, angle);
      let vt = vA.x;
      vA.x = 0 - vB.x;
      vB.x = vt;
      rotatePoint(vA, 0 - angle);
      rotatePoint(vB, 0 - angle);
    } else if (iA.bounds.shape == SHAPE_ROUND && iB.bounds.shape == SHAPE_ORTHO) {
      let vAx = vA.x;
      let vAy = vA.y;
      if (pen.x == 0) {
        vA.y = 0 - vAy;
      }
      if (pen.y == 0) {
        vA.x = 0 - vAx;
      }
      if (pen.x != 0 && pen.y != 0) {
        var vel = distanceBetween(0, 0, vAx, vAy);
        vA.x = pen.x * vel;
        vA.y = pen.y * vel;
      }
    }
  } else if (contact instanceof BodyBoundaryContact) {
    let iB = contact.itemB;
    let angle = angleBetween(iB.ptA.x, iB.ptA.y, iB.ptB.x, iB.ptB.y);
    rotatePoint(vA, angle);
    vA.y = 0 - vA.y * contact.corAB;
    rotatePoint(vA, 0 - angle);
  } else if (contact instanceof BodySegmentBodyContact) {
    let iB = contact.itemB;
    if (iB.isBoundary) {
      let angle = angleBetween(iB.ray.ptA.x, iB.ray.ptA.y, iB.ray.ptB.x, iB.ray.ptB.y);
      rotatePoint(vA, angle);
      vA.y = 0 - vA.y * contact.corAB;
      rotatePoint(vA, 0 - angle);
    } else {
      let aA = iA.bounds.anchor;
      let hp = contact.hitPoint;
      let angle = angleBetween(aA.x, aA.y, hp.pt.x, hp.pt.y);
      rotatePoint(vA, angle);
      vA.x -= iB.pressure;
      rotatePoint(vA, 0 - angle);
    }
  }
}