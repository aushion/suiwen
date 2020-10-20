import React, { useState, useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import axios from 'axios';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

const { TabPane } = Tabs;

function Concept({ data }) {
  const { results } = data;
  const [result] = results;
  const { focus = '', 概念 = '' } = result.fields;
  const [conceptTypes, setTypes] = useState([]);
  const [conceptContent, setConceptContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (focus && 概念) {
      if (focus === '基本定义') {
        axios
          .post(`http://sxzsy.cnki-shanxi.net:8044/api/Concept/GetTermDataList?term=${概念}`)
          .then((res) => {
            if (res.data.Code === 0) {
              let Classifies = res.data.Data.Classifys;
              setTypes(Classifies);
              getConcept(概念, Classifies[0]);
            }
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

  function handleChange(tab) {
    setConceptContent(null);
    getConcept(概念, tab);
  }
  return (
    <div className={styles.concept}>
      <h2>
        <a
          href={`https://concept.cnki.net/search_result.aspx?w=${概念}`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{概念}</span>
        </a>
        -知网知识元库
      </h2>
      <div className={styles.card}>
        {conceptTypes.length ? (
          <Tabs onChange={handleChange} type="card">
            {conceptTypes.map((item) => {
              return (
                <TabPane tab={item} key={item}>
                  <Spin spinning={loading}>
                    <ol>
                      {conceptContent
                        ? conceptContent.map((item, index) => {
                            return (
                              <li key={index}>
                                {item.属性句子}
                                <div className={styles.source}>
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                                      RestTools.sourceDb[item.资源类型]
                                    }&filename=${item.文件名}`}
                                  >
                                    <span style={{ color: '#999' }}>来源：</span>
                                    <span>{item.中英文篇名}.</span>
                                    <span>{item.中英文作者}</span>
                                    <span>{item.更新日期}</span>
                                  </a>

                                  {/* <a
                                    href={`https://concept.cnki.net/search_sametext.aspx?id=${item.文件名}`}
                                    style={{ float: 'right' }}
                                  >
                                    查看同文知识元内容
                                  </a> */}
                                </div>
                              </li>
                            );
                          })
                        : null}
                    </ol>
                  </Spin>
                </TabPane>
              );
            })}
          </Tabs>
        ) : null}
      </div>
    </div>
  );
}

export default Concept;
