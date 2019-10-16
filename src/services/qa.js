import request from '../utils/request';
const serverurl = 'http://192.168.103.24/qa.api';
export default {
  getAnswer(question) {
    return request.get(serverurl + `/getanswer?q=${question}&appid=1&aid=2`);
  },
  getSg(question) {
    return request.get(serverurl + `/getSGData?q=${question}`)
  }
};
