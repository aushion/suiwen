// ref: https://umijs.org/config/
import path from 'path';
export default {
  treeShaking: true,
  define: {
    'process.env.apiUrl': 'http://192.168.103.25:8080/sw.api',
    'process.env.UMI_ENV': process.env.UMI_ENV,
    'process.env.apiUrl_help': 'http://192.168.107.232/qa.fb/api',
    'process.env.apiUrl_collect': 'http://192.168.103.25:8080/SWcollect',
    'process.env.returnUrl': 'http://local.cnki.net:8002'
  },

  base: '/web',
  publicPath: '/web/',
  history: 'browser',
  hash: true,
  targets: {
    ie: 9
  },
  alias: {
    'Utils': path.resolve(__dirname, 'src/utils'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    // '@ant-design/icons/lib/dist$': path.resolve(__dirname, 'src/icon.js'),
    // '@': path.resolve(__dirname, 'src')
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        library: 'react',
        dva: true,
        dynamicImport: {
          webpackChunkName: true
        },
        title: '知网随问',
        scripts: [
          {
            src:
              'http://login.cnki.net/TopLogin/api/loginapi/get?type=top&returnurl=http://qa2.cnki.net/sw.web'
            //'http://132.cnki.net/TopLogin/api/loginapi/get?type=top&returnurl=http://local.cnki.net:8000'

            // 'http://132.cnki.net/TopLogin/api/loginapi/get?type=top&returnurl=http://localhost:8000&style=2&iswithiplogin=false&isAutoIpLogin=false',
          },
          {
            content: `try {
                  window.FlushLogin();
                } catch (e) {}
                
             `
          }
        ],

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//
          ]
        }
      }
    ]
  ],
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    });
  }
};
