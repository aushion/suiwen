import request from '../utils/request';
const serverurl = 'http://192.168.107.232/';
export default {
  getNewHelpList() {
    return request.get(serverurl + 'qa.fb/api/GetNewQuestion?size=6');
  },
};
