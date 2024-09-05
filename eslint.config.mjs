
import eslint from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin-ts";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import ts_eslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        ignores: ["**/js/*", "**/node_modules", "**/files/*", "**/node.ts", "**/node.d.ts"]
    },
        ...ts_eslint.config(
            eslint.configs.recommended,
            ...ts_eslint.configs.recommended
    ),
    {
        files: ["**/*.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "@stylistic": stylistic
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: 11,
            sourceType: "module",

            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            curly: "error",
            eqeqeq: "error",
            "linebreak-style": ["error", "unix"],
            "max-params": ["error", 3],
            "one-var": ["error", "always"],
            "operator-assignment": ["error", "never"],
            "no-console": "error",
            "no-continue": "error",
            "no-control-regex": 0,
            "no-else-return": "error",
            "no-empty": "error",
            "no-extra-bind": "error",
            "no-extra-semi": "error",
            "no-new": "error",
            "no-plusplus": "error",

            "no-restricted-imports": [
                "error",
                "assert",
                "buffer",
                "child_process",
                "cluster",
                "crypto",
                "dgram",
                "dns",
                "domain",
                "events",
                "freelist",
                "fs",
                "http",
                "https",
                "module",
                "net",
                "os",
                "path",
                "punycode",
                "querystring",
                "readline",
                "repl",
                "smalloc",
                "stream",
                "string_decoder",
                "sys",
                "timers",
                "tls",
                "tracing",
                "tty",
                "url",
                "util",
                "vm",
                "zlib",
                "node:assert",
                "node:buffer",
                "node:child_process",
                "node:cluster",
                "node:crypto",
                "node:dgram",
                "node:dns",
                "node:domain",
                "node:events",
                "node:freelist",
                "node:fs",
                "node:http",
                "node:https",
                "node:module",
                "node:net",
                "node:os",
                "node:path",
                "node:punycode",
                "node:querystring",
                "node:readline",
                "node:repl",
                "node:smalloc",
                "node:stream",
                "node:string_decoder",
                "node:sys",
                "node:timers",
                "node:tls",
                "node:tracing",
                "node:tty",
                "node:url",
                "node:util",
                "node:vm",
                "node:zlib",
            ],

            "no-restricted-syntax": ["error", {
                selector: "ExpressionStatement[expression.left.property.name='innerHTML']",
                message: "Assignment to innerHTML is not allowed.",
            }, {
                selector: "ExpressionStatement[expression.callee.property.name='apply'], VariableDeclarator[init.callee.property.name='apply'], ExpressionStatement[expression.callee.property.name='bind'], VariableDeclarator[init.callee.property.name='bind'], ExpressionStatement[expression.callee.property.name='call'], VariableDeclarator[init.callee.property.name='call']",
                message: "Function methods 'apply', 'bind', and 'call' are not allowed.",
            }, {
                selector: "ThisExpression, ThisStatement",
                message: "Use explicit reference names instead of 'this'.",
            }, {
                selector: "ClassDeclaration, ClassExpression",
                message: "No classes. Inheritance imposes unseen complexity upon code extension.",
            }, {
                selector: "TryStatement",
                message: "Do not use try/catch blocks as these are performance bottlenecks.",
            }, {
                selector: "ArrowFunctionExpression[type='ArrowFunctionExpression']",
                message: "Do not use arrow functions.  Instead use named functions conforming to the naming convention.",
            }, {
                selector: "ExpressionStatement[expression.callee.property.name='Promise'], Identifier[name='Promise'], FunctionDeclaration[id.name='asyncCall']",
                message: "Do not use async/await or promises.  Instead use callbacks then provide comments and documentation to clearly describe the flow control.",
            }, {
                selector: "ExpressionStatement[expression.callee.property.name='querySelector'], ExpressionStatement[expression.callee.property.name='querySelectorAll']",
                message: "Do not use query selectors.  Use other DOM methods that do not require string parsing.",
            }, {
                selector: "[test.type='Identifier'], LogicalExpression[left.type='Identifier'], LogicalExpression[right.type='Identifier']",
                message: "Use explicit comparisons with a comparison operator.",
            }],
            "no-undef": 0,
            "no-unused-expressions": "error",
            "no-unused-vars": 0,
            "no-var": "error",
            semi: 0,
            "space-before-function-paren": 0,
            strict: ["error", "function"],
            "@stylistic/semi": "error",
            "@stylistic/member-delimiter-style": [
                "error",
                {
                    "multiline": {
                        "delimiter": "semi",
                        "requireLast": true
                    },
                    "singleline": {
                        "delimiter": "semi",
                        "requireLast": true
                    }
                }
            ],
            "@stylistic/quotes": ["error","double"],
            "@stylistic/space-before-function-paren": ["error","never"],
            "@typescript-eslint/consistent-indexed-object-style": ["error", "index-signature"],
            "@typescript-eslint/consistent-type-assertions": ["error", {
                assertionStyle: "as",
            }],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/member-ordering": ["error", {
                default: {
                    order: "alphabetically-case-insensitive",
                },
            }],
            "@typescript-eslint/method-signature-style": ["error", "property"],
            "@typescript-eslint/naming-convention": ["error", {
                custom: {
                    regex: "^[a-z]+([A-Z][a-z]+)*(_[a-z]+([A-Z][a-z]+)*)*",
                    match: true,
                },

                format: null,
                selector: ["function"],
            }],
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/restrict-plus-operands": "error",
            "@typescript-eslint/sort-type-constituents": "error",
            "@typescript-eslint/typedef": ["error", {
                arrayDestructuring: true,
                arrowParameter: true,
                memberVariableDeclaration: true,
                objectDestructuring: true,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true,
            }],
            "wrap-iife": ["error", "outside"],
            "wrap-regex": "error",
        }
    }
];