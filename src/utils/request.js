import axios from 'axios';
// import { Notification } from 'antd';

let xToken = ''; //全局变量临时存储x-token
let isRefreshing = false;
let requests = [];

// 创建一个axios实例
const request = axios.create({
  // baseURL: process.env.apiUrl, // url = base url + request url,
  crossDomain: true,
  baseURL: process.env.apiUrl,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});

// request拦截器里设置headers里的x-token
request.interceptors.request.use(
  (config) => {
    config.headers['X-Token'] = sessionStorage.getItem('TokenKey');
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
    if (res.code === 401) {
      // 说明token过期了,刷新token
      // 获取当前失败的请求
      const config = response.config;
      if (!isRefreshing) {
        isRefreshing = true;
        return refreshToken()
          .then((res) => {
            // 刷新token成功，将最新的token更新到header中，同时保存在sessionStorage中
            xToken = res.headers['x-token'];
            if (xToken) {
              sessionStorage.setItem('TokenKey', xToken);
            }
            // 重置一下配置
            config.headers['X-Token'] = xToken;
            // 已经刷新了token，将所有队列中的请求进行重试
            requests.forEach((cb) => cb(xToken));
            requests = [];
            // 重试当前请求并返回promise
            return request(config);
          })
          .catch((res) => {
            console.error('refreshtoken error =>', res);
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        return new Promise((resolve) => {
          requests.push((token) => {
            config.headers['X-Token'] = token;
            resolve(request(config));
          });
        });
      }
    }
    return response;
  },
  (error) => {
    console.log('error', error); // for debug
    return Promise.reject(error);
  }
);

function refreshToken() {
  // request中已创建的axios实例
  return request.post('/getToken', {
    appId: '421c0d4b546f48d387b44f1eb040bdff',
    secret: '8b385d3cc269a1af02c37fa78eec18bd28778118'
  });
}

export default request;
