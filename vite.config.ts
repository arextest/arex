import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import proxy from './config/proxy'

const env = 'FAT'
const convertProxyConfig: any = {}
const proxyConfig = proxy[env]

for (const proxyConfigKey in proxyConfig) {
  const rewriteKey = Object.keys(proxyConfig[proxyConfigKey].pathRewrite)[0]
  const rewriteValue = String(
      Object.values(proxyConfig[proxyConfigKey].pathRewrite)[0],
  )
  convertProxyConfig[proxyConfigKey] = {}
  convertProxyConfig[proxyConfigKey].target = proxyConfig[proxyConfigKey].target
  convertProxyConfig[proxyConfigKey].changeOrigin =
      proxyConfig[proxyConfigKey].changeOrigin
  convertProxyConfig[proxyConfigKey].rewrite = (path: string) =>
      path.replace(rewriteKey, rewriteValue)
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: convertProxyConfig,
    host: '0.0.0.0',
    port: 8088,
  },
})
