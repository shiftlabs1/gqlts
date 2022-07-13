"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
var _listr = require('listr'); var _listr2 = _interopRequireDefault(_listr);
var _clientTasks = require('./tasks/clientTasks');
var _schemaTask = require('./tasks/schemaTask');

 function generate(config) {
  if (!config.output) {
    throw new Error("`output` must be defined in the config");
  }

  return new (0, _listr2.default)(
    [
      {
        title: `generating the client in \`${config.output}\``,
        task: () => new (0, _listr2.default)([_schemaTask.schemaTask.call(void 0, config), ..._clientTasks.clientTasks.call(void 0, config)]),
      },
    ],
    { renderer: config.verbose ? "verbose" : "silent", exitOnError: false }
  )
    .run()
    .catch((e) => {
      // cconsole.log(e)
      throw _optionalChain([e, 'optionalAccess', _ => _.errors, 'optionalAccess', _2 => _2[0]]);
    });
} exports.generate = generate;
