import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import Unocss from 'unocss/vite';

// 读取 manifest.json ，修改后重新写入
const fs = require('fs');

const manifestPath = './src/manifest.json';
let Manifest = fs.readFileSync(manifestPath, { encoding: 'utf-8' });
function replaceManifest(path, value) {
  const arr = path.split('.');
  const len = arr.length;
  const lastItem = arr[len - 1];

  let i = 0;
  const ManifestArr = Manifest.split(/\n/);

  for (let index = 0; index < ManifestArr.length; index++) {
    const item = ManifestArr[index];
    if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
    if (i === len) {
      const hasComma = /,/.test(item);
      ManifestArr[index] = item.replace(new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`), `"${lastItem}": ${value}${hasComma ? ',' : ''}`);
      break;
    }
  }

  Manifest = ManifestArr.join('\n');
}
// 使用
replaceManifest('app-plus.usingComponents', false);
replaceManifest('app-plus.splashscreen.alwaysShowBeforeRender', false);
replaceManifest('mp-baidu.usingComponents', false);
console.log(process.env.NODE_ENV, '我现在是啥环境呢');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  console.log('env', env);
  replaceManifest('mp-weixin.appid', `"${env?.VITE_WX_APPID}"`);

  fs.writeFileSync(manifestPath, Manifest, {
    flag: 'w',
  });
  return {
    // transpileDependencies: ['uview-plus'],
    server: {
      port: 8080,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://dev.mindmatrixes.com/cbti-gops',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [uni(), Unocss()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@static': resolve(__dirname, 'src/static'),
        'axios/lib': resolve(__dirname, 'node_modules/axios/lib'),
      },
    },
    build: {
      watch:
        process.platform === 'win32'
          ? {
              exclude: ['node_modules/**', '/__uno.css'],
            }
          : null,
    },
  };
});
