import request from './request';
import { Tag } from 'antd';

export default {
  //创建一个UUid
  createUid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  //判断是否IE浏览器
  isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) return true;
    else return false;
  },
  //项目里输入字符限制
  maxLength: 128,
  //输入框历史记录的key
  HISTORYKEY: 'SUIWEN_RECORD',

  //分割,截取html
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
  //判断字符长度超过300截取加上查看全文按钮, 仅工具书里使用
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

  //联想词接口
  getInputTips(value) {
    return request.get(`${process.env.apiUrl}/sug`, {
      params: {
        s: encodeURIComponent(value)
      }
    });
  },
  //清除P标签
  removeTag(str) {
    return str && str.replace(/<p>/g, '').replace(/<\/p>/g, '');
  },
  //输入框历史记录的存储，先进先出
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
  //处理文本标红
  translateToRed(str) {
    return str
      ? str
          .replace(/###/g, '<span style="color:red">')
          .replace(/\$\$\$/g, '</span>')
          .replace(/&nbsp;/g, '')
      : '';
  },

  translateDocToRed(str) {
    return str ? str.replace(/###/g, '<span style="color:red">').replace(/\$\$\$/g, '</span>') : '';
  },
  //处理细粒度标红
  superMarkRed(str) {
    return (
      str
        .replace(/###/g, '<span style="color:red">')
        .replace(/\$\$\$/g, '</span>')
        .replace(/\|\|\|<<</g, '<span style="background-color:yellow;">')
        .replace(/>>>\|\|\|/g, '</span>')
        .replace(/\|\|\|___/g, '<span style="color:red;background-color:yellow;">')
        .replace(/---\|\|\|/g, '</span>')
        // .replace(/\^\^\^===/g, '<p>')
        // .replace(/===~~~/g, '</p>')
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
  //
  kns: {
    硕士: {
      dbcode: 'CMFD',
      dbname: 'CMFDTEMP'
    },
    博士: {
      dbcode: 'CDFD',
      dbname: 'CDFDTEMP'
    },
    中国会议: {
      dbcode: 'CIPD',
      dbname: 'CPFDTEMP'
    },
    国际会议: {
      dbcode: 'IPFD',
      dbname: 'IPFDTEMP'
    },
    期刊: {
      dbcode: 'CJFD',
      dbname: 'CJFDTOTAL'
    }
  },
  sourceDb: {
    博士: 'CDFD',
    硕士: 'CMFD',
    期刊: 'CJFD',
    法律_期刊: 'CJFD',
    中国会议: 'CPFD',
    报纸: 'CCND'
  },
  //判断是否是uuid
  isUUid(str) {
    return /[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(str);
  },

  //删除文本标红标记
  removeFlag(str) {
    return str ? str.replace(/###/g, '').replace(/\$\$\$/g, '') : '';
  },

  //删除html标签
  removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ''); //正则去掉所有的html标记
  },

  //补全图片路径，东南大学用的
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
  //url参数特殊字符转义
  urlFixed(url) {
    return url
      .replace(/\%/g, '%25')
      .replace(/\#/g, '%23')
      .replace(/\&/g, '%26');
  },
  //补全工具书图片路径
  completeToolsBook(str, intentDomain, domain) {
    return intentDomain === '植物栽培'
      ? str
          .replace(/<img/g, '<img class="imgpreview" style="width:70%"')
          .replace(/src="/g, 'src="https://refbookimg.cnki.net')
          .replace(/src='/g, "src='https://refbookimg.cnki.net")
      : str
          .replace(/<img/g, '<img class="imgpreview"')
          .replace(/src="/g, 'src="https://refbookimg.cnki.net')
          .replace(/src='/g, "src='https://refbookimg.cnki.net");
  },
  //格式化电话号码
  formatPhoneNumber(str) {
    return str
      ? /^1[3-9]\d{9}$/.test(str)
        ? str.substring(0, 3) + '******' + str.substring(9, 11)
        : str
      : '';
  },
  //隐藏邮箱信息
  hideEmailInfo(email) {
    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
      let newEmail,
        str = email.split('@'),
        _s = '';

      if (str[0].length > 4) {
        _s = str[0].substr(0, 4);
        for (let i = 0; i < str[0].length - 4; i++) {
          _s += '*';
        }
      } else {
        _s = str[0].substr(0, 1);
        for (let i = 0; i < str[0].length - 1; i++) {
          _s += '*';
        }
      }
      newEmail = _s + '@' + str[1];
      return newEmail;
    } else {
      return email;
    }
  },
  //base64编码字符
  encodeBase64(str) {
    return str ? btoa(encodeURIComponent(str)) : '';
  },
  //base64解码字符
  decodeBase64(str) {
    return str ? decodeURIComponent(atob(str)) : '';
  },

  status: {
    '0': <Tag color="#2db7f5">未审核</Tag>,
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
  //根据key获取缓存，不建议使用，建议使用ES6默认的方法
  getLocalStorage(key) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  //设置缓存，不建议使用，建议使用Es6默认方法
  setLocalStorage(key, value) {
    if (typeof value === 'string') {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
  //设置session缓存，不建议使用，建议使用ES6默认方法
  setSession(key, value) {
    if (typeof value === 'string') {
      window.sessionStorage.setItem(key, value);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  },

  //获取字符串长度，区分中英文
  getStrLength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      //单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  },
  //获取标红文本的内容
  getKeyword(str) {
    const redReg = /###(.*)\$\$\$/;
    if (str) {
      return redReg.test(str) ? str.match(redReg)[1] : str;
    }
  },
  //从缓存中获取用户信息
  getLocalUserInfo() {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    return userInfo;
  },
  //点击文档链接事件
  clickDoc(docId) {
    request.post(`/doc/clickedDoc`, null, {
      params: { docId }
    });
  },
  //替换换行符
  ReplaceCLRF(str, nstr = '<br />') {
    return str.replace('\r', nstr).replace('\n', nstr);
  },

  GetPreChar(c, p) {
    while (p > 0) {
      if (c[p - 1] === ' ' || c[p - 1] === '$') {
        p--;
      } else {
        return c[p - 1];
      }
    }
    return '';
  },
  //判断是否是中文字符
  IsChinese(s) {
    var re = /[^\u4E00-\u9FA5]/;
    if (re.test(s)) return false;
    return true;
  },
  IsInBrackets(c, p) {
    let i = 20;
    while (p > 0 && i > 0) {
      if (
        c[p - 1] === '《' ||
        c[p - 1] === '（' ||
        c[p - 1] === '(' ||
        c[p - 1] === '【' ||
        c[p - 1] === '['
      )
        return true;
      else {
        p--;
        i--;
      }
    }
    return false;
  },
  CheckContainsNum(text) {
    return (
      text.search(
        /['1','2','3','4','5','6','7','8','9','0','①','②','③','④','⑤','⑥','⑦','⑧','⑨',一','二','三','四','五','六','七','八','九','十']/g
      ) > -1
    );
  },
  //句群文本格式优化
  SplitSection(content) {
    if (!content) return '';
    content = '<p>' + content + '</p>';
    // content = this.ReplaceCLRF(content, '</p><p>'); //回车换行替换为br

    content = content.replace(/;;/g, ';');
    content = content.replace(/::/g, ':');
    content = content.replace(/：：/g, '：');
    content = content.replace(/；；/g, '；');

    let len = content.length;
    let sbContent = '';
    // let lastPos = 0;
    for (let i = 0; i < len; i++) {
      sbContent += content[i];
      switch (content[i]) {
        case ':':
        case '：':
          if (i > 0) {
            let preChar = this.GetPreChar(content, i);
            if (!preChar && this.IsChinese(preChar[0]) && this.IsInBrackets(content, i) === false) {
              sbContent += '</p><p>';
            }
          }
          break;

        case ';':
        case '；':
          //判断分号是否是转义字符
          if (
            content.substring(i - 3, i + 1) === '&lt;' ||
            content.substring(i - 3, i + 1) === '&gt;'
          ) {
            break;
          }
          if (this.CheckContainsNum(content.substring(i, i + 3))) {
            sbContent += '</p><p>';
          }
          break;
        case '。':
          if (this.CheckContainsNum(content.substring(i, i + 3))) {
            sbContent += '</p><p>';
          }
          break;

        default:
          break;
      }
    }

    return sbContent;
    //return "<p>" + Regex.Replace(content, @"(:|;|：|；)", "$1</p><p>",
    //   RegexOptions.Compiled | RegexOptions.IgnoreCase) + "</p>";
  },

  topicInfo: {
    法律: { enText: 'Law', topic: 'FL' },
    医学: { enText: 'Medical', topic: 'YX' },
    农业: { enText: 'Agriculture', topic: 'NY' }
  },
  followStatus: {
    '0': '我',
    '1': '关注',
    '2': '已关注',
    '3': '互相关注',
    '4': '取消关注'
  }
};
