"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function sortKeys(obj) {
  obj = obj || {};
  const ordered = {};
  Object.keys(obj)
    .sort()
    // .reverse()
    .forEach(function (key) {
      ordered[key] = obj[key];
    });
  return ordered;
} exports.sortKeys = sortKeys;

 function intersection(a) {
  return a.reduce((p, c) => p.filter((e) => c.includes(e)));
} exports.intersection = intersection;
