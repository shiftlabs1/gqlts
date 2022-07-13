"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unionType = void 0;
const lodash_1 = require("lodash");
function unionType(type, _) {
    const types = type.getTypes();
    const typeObj = types.reduce((r, t) => {
        r[`on_${t.name}`] = { type: t.name };
        return r;
    }, {});
    const commonInterfaces = (0, lodash_1.uniq)((0, lodash_1.flatten)(types.map((x) => x.getInterfaces())));
    commonInterfaces.forEach((t) => {
        typeObj[`on_${t.name}`] = { type: t.name };
    });
    typeObj.__typename = { type: "String" };
    return typeObj;
}
exports.unionType = unionType;
//# sourceMappingURL=unionType.js.map