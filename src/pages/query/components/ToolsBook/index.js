import React, { useState } from 'react';
import { Tag, Collapse, Divider } from 'antd';
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
    marginBottom: 10
  };

  const [checkedIndex, setCheckIndex] = useState(0);

  function cutAnswer(str, code) {
    if (str) {
      if (str.length > 300) {
        return (
          RestTools.subHtml(str, 300, false) +
          '<a href="http://gongjushu.cnki.net/refbook/detail.aspx?recid=' +
          code +
          '&db=crfd"' +
          'target="_blank"' +
          'rel="noopener noreferrer"' +
          'style="white-space:nowrap;border-radius:20px;background-color:#3A83EC;color:#fff;font-size:12px;padding:2px 4px;"' +
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
    const re = /<span class="answerPart">(.*)<br><\/span>/gims;
    return str.toString().match(re)
      ? str
          .toString()
          .match(re)[0]
          .replace('<span class="answerPart">', '')
      : null;
  }

  function showOthers(str) {
    const re = /<span class="others">(.*)<\/span>/gims;
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
        {data.length > 1 &&
          data.map((item, index) => {
            return (
              <Tag
                style={
                  index === checkedIndex ? { ...checkedStyle, ...normalStyle } : { ...normalStyle }
                }
                key={item.id}
                onClick={handleClickTag.bind(this, index, item)}
              >
                {item.tagName}
              </Tag>
            );
          })}
      </div>
      {data.length > 1 ? <Divider /> : null}
      <div className={styles.content}>
        {data.map((item, index) => {
          const intentFocus = item.intentFocus;
          const domain = item.domain;
          const title = item.title;
          // const intentDomain = item.intentDomain;
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
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(title)
                      }}
                    />
                    <div
                      className={styles.ReferenceBook_answer}
                      // dangerouslySetInnerHTML={{
                      //   __html: RestTools.translateToRed(
                      //     RestTools.completeToolsBook(answer, intentDomain, domain)
                      //   )
                      // }}
                    >
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
                              RestTools.completeToolsBook(cutAnswer(item.Answer), tagName)
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
                          RestTools.removeFlag(data[0].TITLE || data[0].Title || '-')
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
        })}
      </div>
    </div>
  );
}

export default ToolsBook;
