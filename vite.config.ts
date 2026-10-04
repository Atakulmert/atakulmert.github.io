import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Her derlemenin kimliği: Actions'ta commit hash'i, yerelde zaman damgası
const BUILD_ID = process.env.GITHUB_SHA?.slice(0, 7) ?? `local-${Date.now().toString(36)}`

// dist/version.txt: sayfa açılınca önbellekteki eski sürüm mü çalışıyor diye kontrol edilir (bkz. main.tsx)
const versionFile = (): Plugin => ({
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.txt', source: BUILD_ID })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionFile()],
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
})
