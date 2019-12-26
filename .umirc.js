// ref: https://umijs.org/config/
export default {
  // treeShaking: true,
  define: {
    'process.env.apiUrl': 'http://192.168.103.25:8080/sw.api',
    'process.env.UMI_ENV': process.env.UMI_ENV,
    'process.env.apiUrl_help': 'http://192.168.103.24/qa.fb/api'
  },
  base: '/',
  publicPath: './',
  history: 'hash',
  targets: {
    ie: 9
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: {
          webpackChunkName: true
        },
        title: '知网随问',
        // links: [{ rel: 'stylesheet', href: 'http://132.cnki.net/TopLogin/Content/TopLogin.css' }],
        scripts: [
          {
            src:
              'http://132.cnki.net/TopLogin/api/loginapi/get?type=top&returnurl=http://local.cnki.net'
            //  'http://132.cnki.net/TopLogin/api/loginapi/get?type=2&returnurl=http://localhost:8000&style=2&iswithiplogin=false&isAutoIpLogin=false',
          },
          {
            content: `try {
                  window.FlushLogin();
                } catch (e) {}

                function LoginSucess(data) {
                  console.log('logindata',data)
                  window.localStorage.setItem('userInfo',JSON.stringify(data))
                  window.location.reload()
                }
                function Logout() {
                  try {
                      Ecp_UserLogout();
                  }
                  catch (e) { }
              }
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
  ]
};
