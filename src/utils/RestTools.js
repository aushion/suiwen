import request from './request';
export default {
  createUid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
    else return false;
  },
  maxLength: 38,
  HISTORYKEY: 'SUIWEN_RECORD',
  getInputTips(value) {
    return request.get(`${process.env.apiUrl}/sug`, {
      params: {
        s: value
      }
    });
    // return new Promise(function(reslove, reject) {
    //   fetch(
    //     `${process.env.apiUrl}/qa.api/sug?q=${value}`
    //   )
    //     .then(function(response) {
    //       return response.text();
    //     })
    //     .then(function(myJson) {
    //       const tipsData = JSON.parse(myJson.replace(/var oJson = /g, '')).results;
    //       reslove(tipsData);
    //     })
    //     .catch((err) => {
    //       console.log('err:', err); //网络请求失败返回的数据
    //       reject(err);
    //     });
    // });
  },
  removeTag(str) {
    return str.replace(/<p>/g, '').replace(/<\/p>/g, '');
  },
  setStorageInput(key, value) {
    let inputRecords = JSON.parse(window.localStorage.getItem(key)) || [];
    if (inputRecords.indexOf(value) < 0) {
      if (inputRecords.length < 10) {
        inputRecords.unshift(value);
      } else {
        inputRecords.pop();
        inputRecords.unshift(value);
      }
    } else {
      const index = inputRecords.indexOf(value);
      inputRecords.splice(index, 1);
      inputRecords.unshift(value);
    }
    window.localStorage.setItem(key, JSON.stringify(inputRecords));
    return inputRecords;
  },
  translateToRed(str) {
    return str
      .replace(/###/g, '<span style="color:red">')
      .replace(/\$\$\$/g, '</span>')
      .replace(/&nbsp;/g, '');
  },
  formatText(sgText) {
    sgText = sgText.replace(/;;/g, ';');
    sgText = sgText.replace(/；；/g, '；');
    sgText = sgText.replace(/::/g, ':');
    sgText = sgText.replace(/：：/g, '：');

    if (sgText.startsWith('\t\t\n')) {
      sgText = sgText.replace(/\t\t\n/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    let str = '';
    let lastPos = 0;
    for (let i = 0; i < sgText.length; i++) {
      str += sgText[i];
      switch (sgText[i]) {
        case ':':
        case ': ':
          if (i > 0) {
            str += '</p><p>';
          }
          lastPos = i;
          break;
        case ';':
        case '; ':
          if (i > 0) {
            if (i > lastPos + 15) {
              str += '</p><p>';
            }
          }
          lastPos = i;
          break;
        default:
          break;
      }
    }
    return str;
  },

  removeFlag(str) {
    return str.replace(/###/g, '').replace(/\$\$\$/g, '');
  },
  completeUrl(str) {
    return str
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '')
      .replace(/\n/g, '<br/>')
      .replace(/src="/g, 'src="/msshow/admin/file/faq/')
      .replace(/src='/g, "src='/msshow/admin/file/faq/")
      .replace(/<a href="AnswerImage/g, '<a href="/msshow/admin/file/faq/AnswerImage')
      .replace(/<a href="Images/gi, '<a href="/msshow/admin/file/faq/images');
  },
  urlFixed(url) {
    return url
      .replace(/\%/g, '%25')
      .replace(/\#/g, '%23')
      .replace(/\&/g, '%26');
  },

  completeToolsBook(str) {
    return str
      .replace(/\n/g, '<br/>')
      .replace(/src="/g, 'src="http://refbook.img.cnki.net')
      .replace(/src='/g, "src='http://refbook.img.cnki.net");
  },
  status: {
    '0': '状态：未审核',
    '1': '',
    '-1': '状态：审核未通过',
  },
  getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  setSession(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  },
  getSession(key) {
    return JSON.parse(window.sessionStorage.getItem(key));
  }
};
