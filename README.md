babel-plugin-immutability-helper
==================================

A babel plugin providing an API similar to
[immutability-helper](https://github.com/kolodny/immutability-helper), with the
"update spec" resolved at compile time.

# Example
```javascript
import update from 'immutability-helper';

const state2 = update(state1, {
    someObject: {
        anArray: { $push: [4, 5, 6] },
        anotherArray: { $unshift: [4, 5, 6] },
    },
    [dynamicKey]: {
        prop: { $set: 'nextValue' },
        $toggle: ['a'],
        $unset: ['b'],
        $merge: {
            merged: 'value',
        },
        $apply: t => t,
    },
});
```

```javascript
import update from 'immutability-helper';

const state2 = {
    ...state1,

    someObject: {
        ...state1.someObject,
        anArray: [...state1.someObject.anArray, 4, 5, 6],
        anotherArray: [4, 5, 6, ...state1.someObject.anotherArray]
    },

    [dynamicKey]: (t => t)({
        ...state1[dynamicKey],
        prop: 'nextValue',
        a: !state1[dynamicKey].a,
        b: undefined,
        merged: 'value'
    })
};
```

# Notable differences
- The `$splice` operation is not supported
- The `$unset` operation does not use the `delete` operator, but replaces the
  value with the `undefined` constant
- No equality check is performed, most operations will **ALWAYS** return a new
  object.
- Runtime extensions are of course unsupported
- This plugin cannot deoptimize to dynamic calls in unsupported cases
