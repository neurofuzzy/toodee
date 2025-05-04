"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./BaseGeom"), exports);
__exportStar(require("./BaseSpatial"), exports);
__exportStar(require("./Constraints"), exports);
__exportStar(require("./Helpers"), exports);
__exportStar(require("./IGeom"), exports);
__exportStar(require("./IGrid"), exports);
__exportStar(require("./ISpatial"), exports);
__exportStar(require("./Penetration"), exports);
__exportStar(require("./PolygonGrid"), exports);
__exportStar(require("./SpatialGrid"), exports);
__exportStar(require("./SpatialPolygonMap"), exports);
// Do not re-export PointHit here to avoid ambiguity
//# sourceMappingURL=index.js.map