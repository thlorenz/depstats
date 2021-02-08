# depstats [![](https://github.com/thlorenz/depstats/workflows/Node/badge.svg?branch=master)](https://github.com/thlorenz/depstats/actions)

Groups modules by package and includes stats.

## Example

Given an app with express dependency at `expressAppDir`.

```js
const { depStats } = require('depstats')
const { inspect } = require('util')

const res = await depStats(expressAppDir, [
  './node_modules/express/lib/middleware/query.js',
  './node_modules/express/lib/middleware/init.js',
  './node_modules/express/lib/router/layer.js',
  './node_modules/express/lib/router/index.js',
  './node_modules/express/lib/express.js',
  './node_modules/express/index.js',
  './node_modules/express/application.js',
  './node_modules/body-parser/lib/types/json.js',
  './node_modules/body-parser/lib/read.js',
  './node_modules/body-parser/index.js',
])
console.log(inspect(Array.from(res), { depth: 5 }))
```

Outputs the below where `full:` is the actual full path for your case.

```js
[
  [
    'body-parser@1.19.0',
    {
      name: 'body-parser',
      version: '1.19.0',
      main: 'index.js',
      fullPath: 'full:node_modules/body-parser',
      relPath: 'node_modules/body-parser',
      modules: [
        {
          modulePath: 'index.js',
          relPath: 'node_modules/body-parser/index.js',
          fullPath: 'full:node_modules/body-parser/index.js',
          size: '2.66 kB',
        },
        {
          modulePath: 'lib/read.js',
          relPath: 'node_modules/body-parser/lib/read.js',
          fullPath: 'full:node_modules/body-parser/lib/read.js',
          size: '3.89 kB',
        },
        {
          modulePath: 'lib/types/json.js',
          relPath: 'node_modules/body-parser/lib/types/json.js',
          fullPath: 'full:node_modules/body-parser/lib/types/json.js',
          size: '4.92 kB',
        },
      ],
    },
  ],
  [
    'express@4.17.1',
    {
      name: 'express',
      version: '4.17.1',
      main: 'index.js',
      fullPath: 'full:node_modules/express',
      relPath: 'node_modules/express',
      modules: [
        {
          modulePath: 'index.js',
          relPath: 'node_modules/express/index.js',
          fullPath: 'full:node_modules/express/index.js',
          size: '224 B',
        },
        {
          modulePath: 'lib/express.js',
          relPath: 'node_modules/express/lib/express.js',
          fullPath: 'full:node_modules/express/lib/express.js',
          size: '2.41 kB',
        },
        {
          modulePath: 'lib/middleware/init.js',
          relPath: 'node_modules/express/lib/middleware/init.js',
          fullPath: 'full:node_modules/express/lib/middleware/init.js',
          size: '853 B',
        },
        {
          modulePath: 'lib/middleware/query.js',
          relPath: 'node_modules/express/lib/middleware/query.js',
          fullPath: 'full:node_modules/express/lib/middleware/query.js',
          size: '885 B',
        },
        {
          modulePath: 'lib/router/index.js',
          relPath: 'node_modules/express/lib/router/index.js',
          fullPath: 'full:node_modules/express/lib/router/index.js',
          size: '14.9 kB',
        },
        {
          modulePath: 'lib/router/layer.js',
          relPath: 'node_modules/express/lib/router/layer.js',
          fullPath: 'full:node_modules/express/lib/router/layer.js',
          size: '3.3 kB',
        },
      ],
    },
  ],
]
```

## LICENSE

MIT
