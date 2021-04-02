import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import Cookies from 'js-cookie';
let encrypt = new JSEncrypt();
let key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCp/VEIICn1E4CCUNXZ25tV5qwyAcZ08P/Vpixzq+c3h/HZ/WJawhNvU2vTezdLLti8ilW/C45kAGIK1rIYvyikehWfpuQ4OqQO2AN2tdfsC1aULrkjy+Bp/gUZBW8pYwr6yXti7UBV5vqjlDwnMNpjT/r8lJTngpf2gw7LNAxKBQIDAQAB`;
encrypt.setPublicKey(key);

let xToken = ''; //全局变量临时存储x-token
let isRefresh = false;
let requests = [];
// 创建一个axios实例
const request = axios.create({
  // baseURL: process.env.apiUrl, // url = base url + request url,
  'Cache-Control': 'no-cache',
  crossDomain: true,
  baseURL: process.env.apiUrl,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout,
});

// request拦截器里设置headers里的x-token
request.interceptors.request.use(
  (config) => {
    // config.headers['X-Token'] = xToken;
    config.params = { ...config.params, timestamp: Date.now() };
    config.headers['X-Token'] = window.sessionStorage.getItem('TokenKey')
      ? window.sessionStorage.getItem('TokenKey')
      : '';

    // config.headers['X-Token'] = `421c0d4b546f48d387b44f1eb040bdff`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 拦截器处理刷新token的逻辑
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 获取当前失败的请求
    let config = response.config;
    if (response && res.code === 401 && Cookies.get('cnki_qa_uuid')) {
      // 说明token过期了,刷新token

      if (!isRefresh) {
        isRefresh = true;
        return refreshToken()
          .then((res) => {
            // 刷新token成功，将最新的token更新到header中，同时保存在sessionStorage中
            xToken = res.headers['x-token'];
            if (xToken) {
              window.sessionStorage.setItem('TokenKey', xToken);
            }
            config.headers['X-Token'] = xToken;
            requests.forEach((cb) => cb(xToken));
            requests = [];
            // 重试当前请求并返回promise
            return request(config);
          })
          .catch((res) => {
            console.error('refreshtoken error =>', res);
          })
          .finally(() => {
            isRefresh = false;
          });
      }
    } else {
      return new Promise((resolve) => {
        requests.push((token) => {
          config.headers['X-Token'] = token;
          resolve(request(config));
        });
      });
    }
    return response;
  },
  (error) => {
    console.log('error', error); // for debug

    return Promise.reject(error);
  }
);

function refreshToken() {
  // requst中已创建的axios实例
  return request.post('/getToken', {
    appId: encrypt.encrypt(Cookies.get('cnki_qa_uuid'))
    // secret: '8b385d3cc269a1af02c37fa78eec18bd28778118'
  });
}

export default request;
