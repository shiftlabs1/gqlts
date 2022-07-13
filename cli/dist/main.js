"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const listr_1 = __importDefault(require("listr"));
const clientTasks_1 = require("./tasks/clientTasks");
const schemaTask_1 = require("./tasks/schemaTask");
function generate(config) {
    if (!config.output) {
        throw new Error("`output` must be defined in the config");
    }
    return new listr_1.default([
        {
            title: `generating the client in \`${config.output}\``,
            task: () => new listr_1.default([(0, schemaTask_1.schemaTask)(config), ...(0, clientTasks_1.clientTasks)(config)]),
        },
    ], { renderer: config.verbose ? "verbose" : "silent", exitOnError: false })
        .run()
        .catch((e) => {
        var _a;
        // cconsole.log(e)
        throw (_a = e === null || e === void 0 ? void 0 : e.errors) === null || _a === void 0 ? void 0 : _a[0];
    });
}
exports.generate = generate;
//# sourceMappingURL=main.js.map