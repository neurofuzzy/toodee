"use strict";
// Migrated from namespace Models to ES module
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = exports.Event = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["Add"] = "add";
    EventType["Remove"] = "remove";
    EventType["Update"] = "update";
    EventType["Contact"] = "contact";
})(EventType || (exports.EventType = EventType = {}));
var Event = /** @class */ (function () {
    function Event(type, source, target, payload) {
        if (source === void 0) { source = null; }
        if (target === void 0) { target = null; }
        this.type = type;
        this.source = source;
        this.target = target;
        this.payload = payload;
    }
    Event.prototype.cancel = function () {
        this.cancelled = true;
    };
    return Event;
}());
exports.Event = Event;
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
    }
    EventDispatcher.prototype.init = function () {
        this.reset();
        return this;
    };
    EventDispatcher.prototype.reset = function () {
        this.listeners = [];
    };
    EventDispatcher.prototype.addListener = function (listener, scope) {
        this.listeners.push({ listener: listener, scope: scope });
    };
    EventDispatcher.prototype.removeListener = function (listener) {
        this.listeners = this.listeners.filter(function (l) { return l.listener !== listener; });
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var _b = _a[_i], listener = _b.listener, scope = _b.scope;
            if (event.cancelled) {
                return;
            }
            listener.call(scope, event);
        }
    };
    EventDispatcher.prototype.dispatch = function (type, source, target, payload) {
        this.dispatchEvent(new Event(type, source, target, payload));
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=Events.js.map