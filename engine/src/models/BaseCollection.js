"use strict";
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
exports.BaseCollection = void 0;
var Events_1 = require("./Events");
var Events_2 = require("./Events");
var BaseCollection = /** @class */ (function (_super) {
    __extends(BaseCollection, _super);
    function BaseCollection() {
        var _this = _super.call(this) || this;
        _this.items = new Map();
        return _this;
    }
    BaseCollection.prototype.init = function () {
        this.reset();
        return this;
    };
    BaseCollection.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.items.clear();
    };
    BaseCollection.prototype.getItemByID = function (id) {
        return this.items.get(id);
    };
    BaseCollection.prototype.addItem = function (item) {
        if (!this.items.has(item.id)) {
            this.items.set(item.id, item);
            this.dispatch(Events_2.EventType.Add, item, null, item);
            return true;
        }
        return false;
    };
    BaseCollection.prototype.removeItem = function (item) {
        if (this.items.delete(item.id)) {
            this.dispatch(Events_2.EventType.Remove, item, null, item);
            return true;
        }
        return false;
    };
    BaseCollection.prototype.updateItem = function (item) {
        if (this.items.has(item.id)) {
            this.items.set(item.id, item);
            return true;
        }
        return false;
    };
    return BaseCollection;
}(Events_1.EventDispatcher));
exports.BaseCollection = BaseCollection;
// Export ChildCollection if defined in this file (if not, will migrate separately)
//# sourceMappingURL=BaseCollection.js.map