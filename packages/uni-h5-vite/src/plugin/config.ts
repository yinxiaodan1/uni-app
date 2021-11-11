import fs from 'fs'
import path from 'path'
import { normalizePath, Plugin, ResolvedConfig } from 'vite'
import { isInHBuilderX, resolveMainPathOnce } from '@dcloudio/uni-cli-shared'
import { createDefine, isSsr } from '../utils'
import { esbuildPrePlugin } from './esbuild/esbuildPrePlugin'
import { external } from './configureServer/ssr'
export function createConfig(options: {
  resolvedConfig: ResolvedConfig | null
}): Plugin['config'] {
  return function config(config, env) {
    if (isInHBuilderX()) {
      if (
        !fs.existsSync(path.resolve(process.env.UNI_INPUT_DIR, 'index.html'))
      ) {
        console.error(`请确认您的项目模板是否支持vue3：根目录缺少 index.html`)
        process.exit()
      }
    }
    return {
      optimizeDeps: {
        entries: resolveMainPathOnce(process.env.UNI_INPUT_DIR),
        exclude: external,
        esbuildOptions: {
          plugins: [esbuildPrePlugin()],
        },
      },
      define: createDefine(env.command, config),
      server: {
        host: true,
        fs: {
          strict: false,
        },
      },
      ssr: {
        external,
      },
      build: {
        rollupOptions: {
          // resolveSSRExternal 会判定package.json，hbx 工程可能没有，通过 rollup 来配置
          external: isSsr(env.command, config) ? external : [],
          onwarn(warning, warn) {
            if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
              const { message } = warning
              // ignore
              if (
                message.includes('"vue"') ||
                message.includes('"resolveComponent"') ||
                message.includes('"@dcloudio/uni-h5"')
              ) {
                return
              }
            }
            warn(warning)
          },
          output: {
            chunkFileNames(chunkInfo) {
              const { assetsDir } = options.resolvedConfig!.build
              if (chunkInfo.facadeModuleId) {
                const dirname = path.relative(
                  process.env.UNI_INPUT_DIR,
                  path.dirname(chunkInfo.facadeModuleId)
                )
                if (dirname) {
                  return path.posix.join(
                    assetsDir,
                    normalizePath(dirname).replace(/\//g, '-') +
                      '-[name].[hash].js'
                  )
                }
              }
              return path.posix.join(assetsDir, '[name].[hash].js')
            },
          },
        },
      },
    }
  }
}