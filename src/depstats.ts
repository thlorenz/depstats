import { strict as assert } from 'assert'
import debug from 'debug'
import findUp from 'find-up'
import fs from 'fs'
import path from 'path'
import prettyBytes from 'pretty-bytes'

const logError = debug('depstats:error')

type ModulePathInfo = { packagePath: string; relPath: string; fullPath: string }
type ModuleInfo = ModulePathInfo & { size: number; humanSize: string }
export type PackageInfo = {
  name: string
  version: string
  main: string
  fullPath: string
  relPath: string
  modules: ModuleInfo[]
}

function canAccessSync(p: string) {
  try {
    fs.accessSync(p)
    return true
  } catch (_) {
    return false
  }
}

function detectMain(rootDir: string, name: string) {
  if (canAccessSync(path.join(rootDir, 'index.js'))) return 'index.js'
  if (canAccessSync(path.join(rootDir, `${name}.js`))) return `${name}.js`
  return '<unresolved>'
}

class DepStats {
  constructor(readonly basedir: string, readonly modules: string[]) {}

  async analyze(): Promise<Map<string, PackageInfo>> {
    const grouped = await this._group()
    return this._stats(grouped)
  }

  private async _group(): Promise<Map<string, ModulePathInfo[]>> {
    const grouped = new Map()

    for (const fullPath of this.modules) {
      const packageJSONPath = await findUp('package.json', {
        cwd: path.dirname(fullPath),
      })
      if (packageJSONPath == null) {
        logError('Unable to find package of %s, will exclude it from stats')
        continue
      }
      if (!grouped.has(packageJSONPath)) {
        grouped.set(packageJSONPath, [])
      }
      const group = grouped.get(packageJSONPath)
      assert(
        group != null,
        'just added the group to the map, JS must be broken'
      )
      const packageDir = path.dirname(packageJSONPath)
      group.push({
        modulePath: path.relative(packageDir, fullPath),
        relPath: path.relative(this.basedir, fullPath),
        fullPath,
      })
    }
    return grouped
  }

  private _stats(grouped: Map<string, ModulePathInfo[]>) {
    const packageInfos: Map<string, PackageInfo> = new Map()
    for (const [packagePath, modPathInfos] of grouped) {
      const { name, main, version } = this._packageInfo(packagePath)
      const key = `${name}@${version}`
      const modules = this._modulesStats(modPathInfos)
      const fullPath = path.dirname(packagePath)
      const relPath = path.relative(this.basedir, fullPath)
      packageInfos.set(key, { name, version, main, fullPath, relPath, modules })
    }
    return packageInfos
  }

  private _packageInfo(packageJSONPath: string) {
    const { name, main, version } = require(packageJSONPath)
    let confirmedMain = main ?? detectMain(path.dirname(packageJSONPath), name)
    return { name, main: confirmedMain, version }
  }

  private _modulesStats(modules: ModulePathInfo[]): ModuleInfo[] {
    return modules.map((x) => {
      const stats = fs.statSync(x.fullPath)
      return { ...x, size: stats.size, humanSize: prettyBytes(stats.size) }
    })
  }
}

export function depStats(
  basedir: string,
  modules: string[]
): Promise<Map<string, PackageInfo>> {
  const fullPathModules = modules.map((x) => path.resolve(basedir, x))
  const confirmedModules = []
  for (const mod of fullPathModules) {
    try {
      require.resolve(mod)
      confirmedModules.push(mod)
    } catch (err) {
      logError('Unable to find "%s", will exclude it from stats', mod)
      logError(err)
    }
  }

  confirmedModules.sort()
  return new DepStats(basedir, confirmedModules).analyze()
}
