"use strict";
/// <reference path="./Events.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildCollection = void 0;
var Events_1 = require("./Events");
var ChildCollection = /** @class */ (function (_super) {
    __extends(ChildCollection, _super);
    function ChildCollection() {
        var _this = _super.call(this) || this;
        _this.items = new Map();
        _this.itemsByParentID = new Map();
        return _this;
    }
    ChildCollection.prototype.init = function () {
        this.reset();
        return this;
    };
    ChildCollection.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.items = new Map();
        this.itemsByParentID = new Map();
    };
    // Returns the first item only in order to correctly apply this interface
    ChildCollection.prototype.getItemByParentID = function (parentID) {
        if (this.itemsByParentID.has(parentID)) {
            return this.itemsByParentID.get(parentID)[0];
        }
        return null;
    };
    ChildCollection.prototype.getItemsByParentID = function (parentID) {
        if (this.itemsByParentID.has(parentID)) {
            return this.itemsByParentID.get(parentID);
        }
        return null;
    };
    ChildCollection.prototype.addItem = function (item) {
        if (this.items.has(item.id)) {
            return false;
        }
        this.items.set(item.id, item);
        var children = this.itemsByParentID.get(item.parentID);
        if (!children) {
            children = [item];
            this.itemsByParentID.set(item.parentID, children);
        }
        else {
            if (children.indexOf(item) !== -1) {
                return false;
            }
            children.push(item);
            this.itemsByParentID.set(item.parentID, children);
        }
        this.dispatch(Events_1.EventType.Add, item, null, item);
        return true;
    };
    ChildCollection.prototype.removeItem = function (item) {
        if (item.parentID >= 0) {
            var children = this.itemsByParentID.get(item.parentID);
            if (!children) {
                return false;
            }
            var childIdx = children.indexOf(item);
            if (childIdx !== -1) {
                children.splice(childIdx, 1);
                this.itemsByParentID.set(item.parentID, children);
            }
            if (this.items.has(item.id)) {
                this.items.delete(item.id);
            }
            this.dispatch(Events_1.EventType.Remove, item, null, item);
            return true;
        }
        return false;
    };
    ChildCollection.prototype.updateItem = function (item) {
        if (this.items.has(item.id)) {
            this.items.set(item.id, item);
            return true;
        }
        return false;
    };
    return ChildCollection;
}(Events_1.EventDispatcher));
exports.ChildCollection = ChildCollection;
//# sourceMappingURL=ChildCollection.js.map