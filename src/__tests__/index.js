const pluginTester = require('babel-plugin-tester');
const { default: plugin } = require('../index');

pluginTester({
    plugin,
    tests: {
        'push values to an array': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $push: ['first', 'second']
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = [...input, 'first', 'second'];
            `,
        },
        'append an array to another': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $push: external
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = [...input, ...external];
            `,
        },

        'unshift values to an array': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $unshift: ['first', 'second']
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = ['first', 'second', ...input];
            `,
        },
        'prepend an array to another': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $unshift: external
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = [...external, ...input];
            `,
        },

        'replace a value in an object': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    key: { $set: 'value' }
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    key: 'value'
                };
            `,
        },

        'toggle properties in an object': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $toggle: ['a', 'b']
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    a: !input.a,
                    b: !input.b
                };
            `,
        },

        'unset properties from an object': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $unset: ['a', 'b']
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    a: undefined,
                    b: undefined
                };
            `,
        },

        'merge objects': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $merge: external
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    ...external
                };
            `,
        },
        'merge object literals': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $merge: { key: 'value' }
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    key: 'value' };
            `,
        },

        'apply a function to an object': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    $apply: v => v
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = (v => v)(input);
            `,
        },

        'computed keys are transfered': {
            code: `
                import update from 'immutability-helper';
                const output = update(input, {
                    [key]: { $set: 'value' }
                });
            `,
            output: `
                import update from 'immutability-helper';
                const output = {
                    ...input,
                    [key]: 'value'
                };
            `,
        },
    },
});
