import licia from 'licia';
export default {
  createUid() {
    return licia.uuid();
  },
  isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
    else return false;
  },
  maxLength: 38,
  HISTORYKEY: 'SUIWEN_RECORD',
  getInputTips(value) {
    return new Promise(function(reslove, reject) {
      fetch(
        `http://qa.cnki.net/qa.sug/su.ashx?action=getsmarttips&p=0.5842204899447518&kw=${value}&td=1570516528856`,
      )
        .then(function(response) {
          return response.text();
        })
        .then(function(myJson) {
          const tipsData = JSON.parse(myJson.replace(/var oJson = /g, '')).results;
          reslove(tipsData);
        })
        .catch(err => {
          console.log('err:', err); //网络请求失败返回的数据
          reject(err);
        });
    });
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
    return str.replace(/###/g, '<span style="color:red">').replace(/\$\$\$/g, '</span>');
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
  getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
};
