import React, { useState } from 'react';
import { Collapse, Divider } from 'antd';
import { find } from 'lodash';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

const { Panel } = Collapse;
function ToolsBook(props) {
  const { data } = props;
  const checkedStyle = {
    backgroundColor: '#1890ff',
    color: '#fff'
  };
  const normalStyle = {
    cursor: 'pointer',
    display: 'inline-block',
    padding: '2px 4px',
    color: '#333',
    marginRight: 10,
    fontSize: 13,
    borderRadius: 2
  };

  const [checkedIndex, setCheckIndex] = useState(0);
  const sortData = [
    '问答百科',
    '文学百科',
    '地理百科',
    '人物传记',
    '文学鉴赏',
    '中国通史',
    '文学典故',
    '历史名城',
    '植物栽培',
    '畜牧养殖',
    '水产养殖',
    '汉语词典',
    '汉英词典',
    '英汉词典',
    '文化百科',
    '化学百科',
    '医药百科',
    '姓氏起源',
    '美食烹饪'
  ];

  const initData = sortData
    .map((item) => {
      return find(data, { tagName: item });
    })
    .filter((item) => item);

  function cutAnswer(str, code) {
    if (str) {
      if (str.length > 400) {
        return (
          RestTools.subHtml(str, 400, false) +
          '<a href="http://gongjushu.cnki.net/refbook/detail.aspx?recid=' +
          code +
          '&db=crfd"' +
          'target="_blank"' +
          'rel="noopener noreferrer"' +
          'style="margin-left:8px;white-space:nowrap;border-radius:20px;background-color:#3A83EC;color:#fff;font-size:12px;padding:2px 4px;"' +
          '> 查看全文' +
          '</a>'
        );
      } else {
        return str;
      }
    }
    return '-';
  }

  function handleAnswer(str) {
    const re = /<span class="answerPart">(.*)<\/span>/gims;
    return str.toString().match(re)
      ? str
          .toString()
          .match(re)[0]
          .replace('<span class="answerPart">', '')
      : null;
  }

  function showOthers(str) {
    const re = /<p class="others">(.*)<\/p>/gims;
    return str.toString().match(re)
      ? str
          .toString()
          .match(re)[0]
          .replace('<span class="others>"', '')
      : str;
  }

  function handleClickTag(index, item) {
    setCheckIndex(index);
  }

  return (
    <div className={styles.ToolsBook}>
      <div className={styles.tags}>
        {initData &&
          initData.length > 1 &&
          initData.map((item, index) => {
            return (
              <div
                style={
                  index === checkedIndex ? { ...normalStyle, ...checkedStyle } : { ...normalStyle }
                }
                key={item.id}
                onClick={handleClickTag.bind(this, index, item)}
              >
                {item.tagName}
              </div>
            );
          })}
      </div>
      {initData && initData.length > 1 ? <Divider /> : null}
      <div className={styles.content}>
        {initData && initData.length
          ? initData.map((item, index) => {
              const intentFocus = item.intentFocus;
              const domain = item.domain;
              const title = item.dataNode[0].Title || item.dataNode[0].TITLE;
              const tagName = item.tagName;
              return (
                <div key={item.tagName + index} hidden={index !== checkedIndex}>
                  {item.dataNode.map((item, index) => {
                    const answer =
                      intentFocus === '谜语'
                        ? `谜底：${cutAnswer(item.Answer || item.介绍 || '-', item.条目编码)}`
                        : cutAnswer(item.Answer || item.介绍 || '-', item.条目编码);
                    const title =
                      intentFocus === '谜语'
                        ? `谜面: ${item.TITLE || item.Title || '-'}`
                        : `${item.TITLE || item.Title || '-'} ${item.条目拼音 || ''}`;
                    const blockAnswer = handleAnswer(answer);
                    return (
                      <div key={item.条目编码 + index}>
                        <div
                          className={styles.ReferenceBook_title}
                          // dangerouslySetInnerHTML={{
                          //   __html: RestTools.translateToRed(title)
                          // }}
                        >
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://gongjushu.cnki.net/RBook/Detail?entryId=${item.条目编码}`}
                            dangerouslySetInnerHTML={{
                              __html: RestTools.translateToRed(title)
                            }}
                          />
                        </div>
                        <div className={styles.ReferenceBook_answer}>
                          {blockAnswer ? (
                            <Collapse expandIconPosition="right">
                              <Panel header={RestTools.removeHtmlTag(blockAnswer)}>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: RestTools.completeToolsBook(
                                      showOthers(item.Answer),
                                      tagName
                                    )
                                  }}
                                />
                              </Panel>
                            </Collapse>
                          ) : (
                            <div
                              key={item.工具书编号 + index}
                              dangerouslySetInnerHTML={{
                                __html: RestTools.translateToRed(
                                  RestTools.completeToolsBook(
                                    cutAnswer(item.Answer, item.条目编码),
                                    tagName
                                  )
                                )
                              }}
                            />
                          )}
                        </div>
                        <div className={styles.ReferenceBook_extra}>
                          <a
                            className={styles.ReferenceBook_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`http://gongjushu.cnki.net/refbook/${RestTools.removeFlag(
                              item.工具书编号
                            )}.html`}
                            dangerouslySetInnerHTML={{
                              __html: `来源:《${RestTools.removeFlag(
                                item.工具书名称 || item.Title || item.TITLE
                              )}》`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ textAlign: 'right' }}>
                    <a
                      className={styles.ReferenceBook_more}
                      href={
                        domain === '翻译'
                          ? `http://dict.cnki.net/dict_result.aspx?searchword=${encodeURIComponent(
                              RestTools.removeFlag(data[0].TITLE || data[0].Title || '-')
                            )}`
                          : intentFocus === '成语'
                          ? `http://gongjushu.cnki.net/rbook/`
                          : `http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
                              RestTools.removeFlag(title || '')
                            )}&c=crfdsearch`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      dangerouslySetInnerHTML={{
                        __html:
                          domain === '翻译'
                            ? 'CNKI翻译助手'
                            : `更多“${RestTools.removeFlag(title || '-')}”的工具书`
                      }}
                    />
                  </div>
                  <div className={styles.ReferenceBook_evaluate}>
                    {/* <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} /> */}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default ToolsBook;
