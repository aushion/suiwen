import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from 'antd';
import { find } from 'lodash';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function Concept({ data }) {
  const { results } = data;
  const [result] = results;
  const { focus = '', 概念 = '' } = result.fields;
  const [conceptTypes, setTypes] = useState([]);
  const [conceptContent, setConceptContent] = useState(null);
  const [basicContent, setBasicContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focus && 概念) {
      if (focus === '基本定义') {
        setLoading(true);
        axios
          .post(`http://sxzsy.cnki-shanxi.net:8044/api/Concept/GetTermDataList?term=${概念}`)
          .then((res) => {
            if (res.data.Code === 0) {
              let Classifies = res.data.Data.Classifys;
              setTypes(Classifies);
              const content = find(res.data.Data.Terms, { 属性类型: '基本定义' });
              setBasicContent(content);
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        getConcept(概念, focus);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getConcept(termName, attrType) {
    setLoading(true);
    axios
      .post(
        `http://sxzsy.cnki-shanxi.net:8044/api/Concept/GetConceptDataList?termName=${termName}&attrType=${attrType}`
      )
      .then((res) => {
        if (res.data.Code === 0) {
          setConceptContent(res.data.Data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <div className={styles.concept}>
      <h2>
        <a
          href={`https://concept.cnki.net/search_attribute.aspx?w=${概念}`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{概念} </span>
        </a>
        - 知网知识元库
      </h2>
      <div className={styles.card}>
        <Skeleton loading={loading} active>
          {basicContent ? (
            <div className={styles.content}>
              <div
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(basicContent.属性句子)
                }}
              />
              <div className={styles.source}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                    RestTools.sourceDb[basicContent.资源类型]
                  }&filename=${basicContent.文件名}`}
                >
                  <span style={{ color: '#999' }}>来源：</span>
                  {basicContent.中英文篇名 ? <span>{basicContent.中英文篇名}</span> : null}
                  {basicContent.中英文作者 ? (
                    <span>.{basicContent.中英文作者.slice(0, -1)}</span>
                  ) : null}
                  {basicContent.来源 ? <span>.{basicContent.来源}</span> : null}
                  {basicContent.更新日期 ? <span>.{basicContent.更新日期}</span> : null}
                </a>
              </div>
            </div>
          ) : null}
          {conceptTypes.length ? (
            <div>
              {conceptTypes.map((item) => (
                <a
                  className={styles.item}
                  key={item}
                  href={`https://concept.cnki.net/search_attribute.aspx?w=${概念}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item}
                </a>
              ))}
            </div>
          ) : null}
          {conceptContent ? (
            <ol>
              {conceptContent.map((item, index) => (
                <li key={index}>
                  <div style={{ paddingBottom: 6 }}>{item.属性句子}</div>
                  <div className={styles.source}>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                        RestTools.sourceDb[item.资源类型]
                      }&filename=${item.文件名}`}
                    >
                      <span style={{ color: '#999' }}>来源：</span>
                      {item.中英文篇名 ? <span>{item.中英文篇名}</span> : null}
                      {item.中英文作者 ? <span>.{item.中英文作者.slice(0, -1)}</span> : null}
                      {item.中文刊名 ? <span>.{item.中文刊名}</span> : null}
                      {item.更新日期 ? <span>.{item.更新日期}</span> : null}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </Skeleton>

        <a
          className={styles.more}
          rel="noreferrer"
          target="_blank"
          href={`https://concept.cnki.net/search_result.aspx?w=${概念}`}
        >
          查看更多
        </a>
      </div>
    </div>
  );
}

export default Concept;
