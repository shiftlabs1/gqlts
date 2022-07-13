"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function isEmpty(x) {
  if (!x) {
    return true;
  }
  return Object.keys(x).length === 0;
} exports.isEmpty = isEmpty;
