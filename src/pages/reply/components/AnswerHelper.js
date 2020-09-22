/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Icon, Spin, Input, List, Empty } from 'antd';
import queryString from 'querystring';
import groupBy from 'lodash/groupBy';
import RestTools from '../../../utils/RestTools';
import replyStyle from '../index.less';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

const { Search } = Input;
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
let quoteArray = [];

function AnswerHelper(props) {
  const params = queryString.parse(window.location.href.split('?')[1]);

  const { loading, sgData, dispatch } = props;

  const { q } = params;

  const [selectText, setSelectText] = useState('');
  const [resourceInfo, setResourceInfo] = useState(null);

  const groupByData = groupBy(sgData, 'id');
  const keys = Object.keys(groupByData);

  useEffect(() => {
    function hideAddQuote(e) {
      const addQuote = document.getElementById('addQuote');
      if (e.target !== addQuote) {
        addQuote.style.display = 'none';
      }
    }
    document.addEventListener('click', hideAddQuote);
    return () => {
      document.removeEventListener('click', hideAddQuote);
      quoteArray = []; //重置缓存数组
    };
  }, []);

  function addQuoteIndex(text, resourceInfo) {
    const { year, qikanName, title, source_id, author } = resourceInfo;

    const len = quoteArray.length;
    const sourcedArray = len > 0 ? quoteArray.map((item) => item.source_id) : [];

    //定义一个索引，设置引用序号
    let index = len > 0 ? quoteArray[len - 1].index : 1;
    //判断如果来自同一个句群内容，引用内容及引用文献链接不变，简单处理
    if (len > 0 && !sourcedArray.includes(source_id)) {
      quoteArray.push({
        index: index + 1,
        text: `${text}[${index + 1}]`,
        resourceStr: `<a href="http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${source_id}"  style="text-decoration:none" target="_blank">${index +
          1}. 《${title}》 ${author} ${qikanName} ${year}</a>`,
        source_id: source_id
      });
    } else if (len === 0) {
      quoteArray.push({
        index: index,
        text: `${text}[1]`,
        resourceStr: `<a href="http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${source_id}"  style="text-decoration:none" target="_blank">${1}. 《${title}》 ${author} ${qikanName} ${year}</a>`,
        source_id: source_id
      });
    }

    return quoteArray;
  }
  function copyTextToEditor(text, resourceInfo) {
    //把引用信息转成引用数组
    const quoteArrayList = addQuoteIndex(text, resourceInfo);
    //获取文献引用数组并去重
    const resourceArray = [...new Set(quoteArrayList.map((item) => item.resourceStr))];
    //引用文本数组
    const textArray = [...new Set(quoteArrayList.map((item) => item.text))];
    //重新定义引文内容字符串，引用文献字符串，并处理格式
    let newText = '';
    let newResourceStr = '';

    for (let i = 0; i < resourceArray.length; i++) {
      newResourceStr += resourceArray[i] + '<br>';
      newText += textArray[i].replace('<p></p>', '');
    }

    if (newText) {
      dispatch({
        type: 'reply/saveAnswers',
        payload: {
          answerHelpData: {
            contents: newText,
            resource: newResourceStr
          }
        }
      });
    }
    const addQuote = document.getElementById('addQuote');
    addQuote.style.display = 'none';
  }

  function selectHtml() {
    let selectedHtml = '';
    if (document.selection) {
      //IE
      let selectionObj = document.selection;
      let rangeObj = selectionObj.createRange();
      selectedHtml = rangeObj.htmlText;
    } else {
      //ff chrom
      let selectionObj = window.getSelection();
      let rangeObj = selectionObj.getRangeAt(0);
      let docFragment = rangeObj.cloneContents();
      let testDiv = document.createElement('div');
      testDiv.appendChild(docFragment);
      selectedHtml = testDiv.innerHTML;
    }
    return selectedHtml;
  }

  function handleMouseUp(e, info) {
    let x = e.clientX;
    let y = e.clientY;
    const selectedHtml = selectHtml();
    setSelectText(selectedHtml.replace(/<span style="color:red">/g, '').replace(/<\/span>/g, ''));
    setResourceInfo(info);
    const addQuote = document.getElementById('addQuote');
    if (selectedHtml.length) {
      setTimeout(function() {
        addQuote.style.display = 'block';
        addQuote.style.left = x + 'px';
        addQuote.style.top = y + 'px';
      }, 100);
    } else {
      addQuote.style.display = 'none';
    }
  }

  return (
    <div>
      <div>
        <span>参考回答助手：</span>
        <Search
          style={{ width: '50%', marginBottom: 10 }}
          onSearch={(value) => {
            dispatch({
              type: 'reply/getSG',
              payload: {
                q: encodeURIComponent(value),
                pageStart: 1,
                pageCount: 10,
                userId: ''
              }
            });
          }}
          placeholder={q}
        />
        <Spin spinning={loading}>
          <div
            id="sg"
            style={{
              padding: '2px 2px'
            }}
          >
            {keys.length ? (
              keys.slice(0, 5).map((item) => {
                const year =
                  (groupByData[item][0].sgAdditionInfo && groupByData[item][0].sgAdditionInfo.年) ||
                  '';
                const author =
                  (groupByData[item][0].sgAdditionInfo &&
                    groupByData[item][0].sgAdditionInfo.作者) ||
                  '';
                const qikanName =
                  (groupByData[item][0].sgAdditionInfo &&
                    groupByData[item][0].sgAdditionInfo.中文刊名) ||
                  '';

                const title = groupByData[item][0].data.caption || '';
                const source_id = groupByData[item][0].data.source_id || '';
                return (
                  <div className={replyStyle.wrapper} key={item}>
                    <List
                      itemLayout="vertical"
                      dataSource={groupByData[item]}
                      renderItem={(item, index) => {
                        const answer = item.data.context + item.data.sub_context;
                        return (
                          <List.Item style={{ overflow: 'hidden' }}>
                            <div
                              onMouseUp={(e) =>
                                handleMouseUp(e, { year, qikanName, title, source_id, author })
                              }
                              className={replyStyle.fontStyle}
                              key={index}
                              dangerouslySetInnerHTML={{
                                __html: RestTools.formatText(RestTools.translateToRed(answer))
                              }}
                            />
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <Empty />
            )}
          </div>
        </Spin>
        <div
          id="addQuote"
          style={{
            display: 'none',
            position: 'fixed',
            cursor: 'pointer',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '5px 10px',
            boxShadow: '2px 2px 10px #999'
          }}
          onClick={copyTextToEditor.bind(this, selectText, resourceInfo)}
        >
          <Icon type="copy" theme="twoTone" />
          添加引用
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.reply, loading: state.loading.models.reply };
}

export default connect(mapStateToProps)(AnswerHelper);
