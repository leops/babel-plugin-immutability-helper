export default function ({ types: t }) {
    const commands = {
        $push: (value, prevObject) => {
            let result = [ t.spreadElement(prevObject) ];
            if(t.isArrayExpression(value)) {
              	result = result.concat(value.elements);
            } else {
                result.push(t.spreadElement(value));
            }
            return t.arrayExpression(result);
        },
        $unshift: (value, prevObject) => {
            let result = [ t.spreadElement(prevObject) ];
            if(t.isArrayExpression(value)) {
              	result = value.elements.concat(result);
            } else {
                result.unshift(t.spreadElement(value));
            }
            return t.arrayExpression(result);
        },
        $set: value => value,
        $toggle: (targets, prevObject, originalObject) => {
            return targets.elements.reduce((object, prop) => assign(
                object,
                t.objectProperty(
                    t.identifier(prop.value),
                    t.unaryExpression('!', t.memberExpression(
                        originalObject,
                        t.identifier(prop.value),
                    )),
                ),
            ), prevObject);
        },
        $unset: (value, prevObject) => {
            return value.elements.reduce((object, prop) => assign(
                object,
                t.objectProperty(
                    t.identifier(prop.value),
                    t.identifier('undefined'),
                ),
            ), prevObject);
        },
        $merge: (value, prevObject) => {
          	if(t.isObjectExpression(value)) {
              	return value.properties.reduce(
                    (object, prop) => assign(object, prop),
                    prevObject,
                );
            } else {
                return assign(prevObject, t.spreadProperty(value));
            }
        },
        $apply: (value, prevObject) => {
            return t.callExpression(value, [ prevObject ]);
        }
    };

    function assign(object, property) {
        if(t.isObjectExpression(object)) {
            object.properties.push(property);
            return object;
        } else {
            return t.objectExpression([
                t.spreadProperty(object),
                property,
            ]);
        }
    }

    function update(object, spec) {
      	return spec.reduce((prevObject, prop) => {
          	if(commands.hasOwnProperty(prop.key.name)) {
                return commands[prop.key.name](prop.value, prevObject, object);
            } else {
                return assign(
                    prevObject,
                    t.objectProperty(
                        prop.key,
                        update(
                            t.memberExpression(object, prop.key, prop.computed),
                            prop.value.properties,
                        ),
                        prop.computed,
                    ),
                );
            }
        }, object);
    }

    return {
        name: 'immutability-helper',
        visitor: {
            Program: {
                enter(path, state) {
                    for(const imp of state.file.metadata.modules.imports) {
                        if(imp.source === 'immutability-helper') {
                            for(const spec of imp.specifiers) {
                                if(spec.imported === 'default') {
                                    state.importedName = spec.local;
                                }
                            }
                        }
                    }
                },
            },
            CallExpression(path, state) {
                if(t.isIdentifier(path.node.callee) && path.node.callee.name === state.importedName) {
                    path.replaceWith(
                        update(path.node.arguments[0], path.node.arguments[1].properties),
                    );
                }
            }
        }
    };
}
