import request from '../utils/request';
const serverurl = 'http://192.168.107.232/';
export default {
  getAnswer(question) {
    return request.get(serverurl + `sw.qa.api/getanswer?q=${question}&appid=1&aid=2`);
  },
};
