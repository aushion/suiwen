import request from './request';
import {Tag} from 'antd';

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
  subHtml(oHtml, nlen, isByte) {
    var rgx1 = /<[^<^>^\/]+>/; //前标签(<a>的href属性中可能会有“//”符号，先移除再判断)
    var rgx2 = /<\/[^<^>^\/]+>/; //后标签
    var rgx4 = /<[^<^>]+>/; //所有标签
    var selfTags = 'hr,br,img,input,meta'.split(',');
    if (typeof oHtml !== 'string') {
      return '';
    }
    oHtml = oHtml.replace(/(^\s*)|(\s*$)/g, '').replace(/\r|\n/g, '');
    var oStr = oHtml.replace(/<[^<^>]*>/g, '');
    // eslint-disable-next-line no-control-regex
    var olen = isByte ? oStr.replace(/[^\x00-\xff]/g, '**').length : oStr.length;
    if (!/^\d+$/.test(nlen) || olen <= nlen) {
      return oHtml;
    }
    var tStr = oHtml;
    var index = 0;
    var matchs = []; //含有所有html标签的数组
    while (rgx4.test(tStr)) {
      var m = {};
      m.index = index + tStr.search(rgx4);
      m.string = tStr.match(rgx4).toString();
      var len = tStr.search(/<[^<^>]+>/) + tStr.match(/<[^<^>]+>/)[0].length;
      tStr = tStr.substr(len);
      index += len;
      matchs.push(m);
    }
    if (isByte) {
      var i = 0;
      for (var z = 0; z < oStr.length; z++) {
        i += oStr.charCodeAt(z) > 255 ? 2 : 1;
        if (i >= nlen) {
          tStr = oStr.slice(0, z + 1);
          break;
        }
      }
    } else {
      tStr = oStr.substr(0, nlen);
    }
    var startTags = [];
    for (let i = 0; i < matchs.length; i++) {
      if (tStr.length <= matchs[i].index) {
        matchs = matchs.slice(0, i);
        break;
      } else {
        tStr = tStr.substring(0, matchs[i].index) + matchs[i].string + tStr.substr(matchs[i].index);
        if (rgx1.test(matchs[i].string.replace(/(\/\/)/g, ''))) {
          var name = matchs[i].string.replace(/[<>]/g, '').split(' ');
          if (name.length > 0) {
            name = name[0];
            if (selfTags.indexOf(name) === -1) {
              startTags.push(name);
            }
          }
        } else if (rgx2.test(matchs[i].string)) {
          let name = matchs[i].string.replace(/[<\/>]/g, '');
          if (startTags.length > 0 && startTags[startTags.length - 1] === name) {
            startTags.pop();
          }
        }
      }
    }
    if (startTags.length > 0) {
      for (let i = startTags.length - 1; i >= 0; i--) {
        tStr += '</' + startTags[i] + '>';
      }
    }
    return tStr;
  },
  //Unicode 转换 ASCII
  UnicodeToAscii(str) {
    let newStr = str.replace(/&#(\d+);/g, function(item) {
      return String.fromCharCode(item.replace(/[&#;]/g, ''));
    });
    return newStr;
  },
  handleStr(str, code, more) {
    if (str) {
      if (str.length > 300) {
        return this.subHtml(str, 300, true) + more
          ? '<a href="http://gongjushu.cnki.net/refbook/detail.aspx?recid=' +
              code +
              '&db=crfd"' +
              'target="_blank"' +
              'rel="noopener noreferrer"' +
              'style="white-space:nowrap"' +
              '> 查看全文>>' +
              '</a>'
          : '';
      } else {
        return str;
      }
    }
    return '-';
  },
  getInputTips(value) {
    return request.get(`${process.env.apiUrl}/sug`, {
      params: {
        s: encodeURIComponent(value)
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
    return (
      str
        // .replace(/<[^p]/g,' < ')
        // .replace(/>[^p]/g,' > ')
        .replace(/###/g, '<span style="color:red">')
        .replace(/\$\$\$/g, '</span>')
        .replace(/&nbsp;/g, '')
    );
  },
  headerInfo: {
    YX: {
      title: {
        cnText: '医学',
        enText: 'Medical'
      },
      headerStyle: {
        background: '#008EFF'
      }
    },
    NY: {
      title: {
        cnText: '农业',
        enText: 'Agriculture'
      },
      headerStyle: {
        background: '#00D356'
      }
    },
    default: {
      title: {
        cnText: '知网智能问答服务平台',
        enText: 'Intelligent Question and Answer'
      },
      headerStyle: null
    }
  },
  sourceDb: {
    博士: 'CDFD',
    硕士: 'CMFD',
    期刊: 'CJFD',
    中国会议: 'CPFD',
    报纸: 'CCND'
  },
  formatText(sgText) {
    sgText = sgText.replace(/<\sp>/g, '');
    sgText = sgText.replace(/<\s\/p>/g, '');
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
          if (i > 0 && /\u4E00-\u9FA5/.test(str.substr(0, i)[0])) {
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

  removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ''); //正则去掉所有的html标记
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

  completeToolsBook(str, intentDomain) {
    return intentDomain === '植物篇' || intentDomain === '病虫害'
      ? str
          .replace(/<img/g, '<img style="width:90%"')
          .replace(/src="/g, 'src="http://refbook.img.cnki.net')
          .replace(/src='/g, "src='http://refbook.img.cnki.net")
      : str
          .replace(/src="/g, 'src="http://refbook.img.cnki.net')
          .replace(/src='/g, "src='http://refbook.img.cnki.net");
  },

  formatPhoneNumber(str) {
    return str
      ? /^1[3-9]\d{9}$/.test(str)
        ? str.substring(0, 3) + '****' + str.substring(7, 11)
        : str
      : '';
  },
  status: {
    '0':   <Tag color="#2db7f5">未审核</Tag>,
    '1': <Tag color="#87d068">已审核</Tag>,
    '-1': <Tag color="#f50">审核未通过</Tag>
  },

  title: {
    law: {
      cnText: '法律',
      enText: 'Law'
    },
    medicine: {
      cnText: '医学',
      enText: 'Medicine'
    },
    agriculture: {
      cnText: '农业',
      enText: 'Agriculture'
    }
  },
  version: {
    P0101: '1992年版',
    P0102: '1996年版',
    P0103: '2000年版',
    P0104: '2004年版',
    P0105: '2008年版',
    P0106: '2011年版',
    P0107: '2014年版',
    P0108: '2017年版'
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
  },
  topicInfo: {
    法律: { enText: 'Law', topic: 'FL' },
    医学: { enText: 'Medical', topic: 'YX' },
    农业: { enText: 'Argriculture', topic: 'NY' }
  }
};
