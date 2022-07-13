"use strict";Object.defineProperty(exports, "__esModule", {value: true});



    
    const newChain = (path = []) => {
      const chain = (() => {})
      chain.path = path
      return chain
    }
    
    const pathToRequest = (path, executeFields) => {
      if (path.length === 0) return undefined
    
      const [[field, arg], ...rest] = path
    
      const nextFields = pathToRequest(rest, executeFields) || executeFields
    
      return {
        [field]: arg
          ? nextFields && typeof nextFields !== 'boolean' && typeof nextFields !== 'number'
            ? [arg, nextFields]
            : [arg]
          : nextFields
          ? nextFields
          : 1,
      }
    }
    
    const wrapInProxy = (chain, onExecute) =>
      new Proxy(chain, {
        get(target, prop) {
          if (typeof prop !== 'string') throw new Error('property is not a string')
    
          if (prop === 'get') {
            return (fields, defaultValue) =>
              onExecute(target.path.map(i => i[0]), pathToRequest(target.path, fields), defaultValue,{})
          } else {
            const newPath = [...target.path, [prop]]
            return wrapInProxy(newChain(newPath), onExecute)
          }
        },
        apply(target, _, argArray) {
          const newPath = [...target.path.slice(0, -1), [target.path[target.path.length - 1][0], argArray[0]]]
          return wrapInProxy(newChain(newPath), onExecute)
        },
      })
    
     const chain = (onExecute) =>
      wrapInProxy(newChain(), onExecute); exports.chain = chain