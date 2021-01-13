export default {
  define: {
    'process.env.apiUrl': 'https://qa.cnki.net/sw.api',
    // 'process.env.apiUrl': 'http://10.14.20.101:81/sw.api',
    'process.env.apiUrl_help': 'https://kc.cnki.net/fb/api',
    'process.env.apiUrl_collect': 'https://qa.cnki.net/SWcollect',
    'process.env.returnUrl': 'https://qa.cnki.net/web',
    'process.env.basePath': '/sw.web'
  },
  base: '/sw.web',
  publicPath: '/sw.web/'
};
