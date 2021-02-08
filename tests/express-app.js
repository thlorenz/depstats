'use strict'

const test = require('tape')
const path = require('path')
const { depStats } = require('../')

const expressAppDir = path.join(__dirname, 'fixtures', 'express-app')

function generalizeFullPaths(res) {
  for (const val of res.values()) {
    val.fullPath = `full:${path.relative(expressAppDir, val.fullPath)}`
    val.modules.forEach(
      (x) => (x.fullPath = `full:${path.relative(expressAppDir, x.fullPath)}`)
    )
  }
}

test('express app: no modules', async (t) => {
  const res = await depStats(expressAppDir, [])

  t.deepEqual(res, new Map(), 'empty map')
  t.end()
})

test('express app: body-parser modules', async (t) => {
  const res = await depStats(expressAppDir, [
    './node_modules/body-parser/lib/types/json.js',
    './node_modules/body-parser/lib/types/raw.js',
    './node_modules/body-parser/lib/types/text.js',
    './node_modules/body-parser/lib/types/urlencoded.js',
    './node_modules/body-parser/lib/read.js',
    './node_modules/body-parser/index.js',
  ])

  const expected = [
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
          {
            modulePath: 'lib/types/raw.js',
            relPath: 'node_modules/body-parser/lib/types/raw.js',
            fullPath: 'full:node_modules/body-parser/lib/types/raw.js',
            size: '1.88 kB',
          },
          {
            modulePath: 'lib/types/text.js',
            relPath: 'node_modules/body-parser/lib/types/text.js',
            fullPath: 'full:node_modules/body-parser/lib/types/text.js',
            size: '2.29 kB',
          },
          {
            modulePath: 'lib/types/urlencoded.js',
            relPath: 'node_modules/body-parser/lib/types/urlencoded.js',
            fullPath: 'full:node_modules/body-parser/lib/types/urlencoded.js',
            size: '5.8 kB',
          },
        ],
      },
    ],
  ]

  generalizeFullPaths(res)

  t.deepEqual(Array.from(res), expected, 'grouped map')
  t.end()
})

test('express app: some body-parser + some express modules', async (t) => {
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

  const expected = [
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

  generalizeFullPaths(res)

  t.deepEqual(Array.from(res), expected, 'grouped map')
  t.end()
})
