// ref: https://umijs.org/config/
export default {
  treeShaking: true,

  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: '知网随问',

        // dll: {
        //   exclude: ['jquery'],
        // },

        // links: [{ rel: 'stylesheet',charset:"UTF-8", href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css' },
        // {rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'}],
        scripts: [
          {
            src:
              'http://192.168.100.132/TopLogin/api/loginapi/get?type=top&returnurl=http://localhost:8000&style=2&iswithiplogin=false&isAutoIpLogin=false',
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
             `,
          },
        ],
        targets: {
          ie: 10,
        },
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],

  ],
};
