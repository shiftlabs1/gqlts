"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
function isEmpty(x) {
    if (!x) {
        return true;
    }
    return Object.keys(x).length === 0;
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=support.js.map