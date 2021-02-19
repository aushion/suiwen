import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import querystring from 'querystring';
import { groupBy } from 'lodash';
import FoldText from '../FoldText';
import Evaluate from '../../pages/query/components/Evaluate';
import RestTools from '../../utils/RestTools';
import styles from './index.less';

let nameIndex = 0;
let prevData = []; //记录上一次操作的数据，数据快照
function SgListView({
  data,
  q,
  needEvaluate = true,
  loading = false,
  style = null,
  handlePageChange
}) {
  const [initType, setType] = useState(null);
  const [newData, setData] = useState(prevData);
  const { topic = '' } = querystring.parse(window.location.href.split('?')[1]);

  useEffect(() => {
    const sgTop = window.localStorage.getItem('sgTop');
    document.body.scrollTop = document.documentElement.scrollTop = Number(sgTop); //页面滚动到记忆位置

    if (data && data.length > 1) {
      //记录第一次的数据
      prevData = data;
    } else if (data.length === 1 && prevData.length) {
      //做数据快照
      prevData = prevData.map((item) => {
        if (item.name === data[0].name) {
          return { ...data[0], data: data[0].data };
        }
        return item;
      });
    } else {
      //特殊情况阅读理解重置的时候需要的而操作
      prevData = prevData.map((item, index) => {
        if (index === nameIndex) {
          return {
            ...item,
            data: []
          };
        }
        return item;
      });
    }

    setData(prevData);
    setType(prevData && prevData.length > 1 ? prevData[nameIndex].name : null);
  }, [data]);
  return (
    <div>
      <div>
        {newData && newData.length
          ? newData.map((item) => {
              return (
                <Button
                  type={initType === item.name ? 'primary' : null}
                  style={{ marginRight: 10 }}
                  key={item.name}
                  onClick={() => {
                    setType(item.name);
                  }}
                >
                  {`${item.name}（${item.pagination.total}）`}
                </Button>
              );
            })
          : null}
      </div>
      <div style={{ marginTop: 20 }}>
        {loading && loading.spinning ? <List loading={loading} style={style} /> : null}
        {newData && newData.length && !loading?.spinning
          ? newData.map((item, index) => {
              const list = item.data;
              const groupData = groupBy(list, (item) => item.data.source_id);
              const keys = Object.keys(groupData);
              const sgData = keys.map((item) => ({
                id: item,
                dataList: groupData[item]
              }));

              return (
                <div hidden={item.name !== initType} key={item.name}>
                  <List
                    itemLayout="vertical"
                    dataSource={sgData}
                    // loading={loading}
                    style={style}
                    pagination={{
                      current: item.pagination.pageStart,
                      size: item.pagination.pageCount,
                      total: item.pagination.total,
                      hideOnSinglePage: true,
                      onChange: (page) => {
                        nameIndex = index;
                        handlePageChange({
                          type: item.name,
                          pageSize: 10,
                          pageStart: page,
                          q,
                          domain: topic
                        });
                      }
                    }}
                    renderItem={(item) => {
                      const year =
                        (item.dataList[0].sgAdditionInfo && item.dataList[0].sgAdditionInfo.年) ||
                        '';
                      const qikanName =
                        (item.dataList[0].sgAdditionInfo &&
                          item.dataList[0].sgAdditionInfo.中文刊名) ||
                        '';
                      const caption = item.dataList[0].data.caption;
                      const source_id = item.dataList[0].data.source_id;
                      const source_type = item.dataList[0].data.soure_type;
                      const source_db =
                        (item.dataList[0].sgAdditionInfo &&
                          item.dataList[0].sgAdditionInfo.来源数据库) ||
                        '';

                      return (
                        <List.Item>
                          {item.dataList.map((current, index) => {
                            const originText = current.data.semantic_text || current.data.context;
                            const fullText = originText + current.data.sub_context;

                            return (
                              <div
                                key={index}
                                style={{ paddingBottom: 10, wordBreak: 'break-all' }}
                              >
                                <FoldText originText={originText} fullText={fullText} />
                              </div>
                            );
                          })}
                          <div
                            style={{
                              paddingTop: '10px',
                              textAlign: 'right',
                              fontSize: 13,
                              color: '#999',
                              overflow: 'hidden'
                            }}
                          >
                            <div
                              style={{
                                textAlign: 'right',
                                display: 'inline-block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              dangerouslySetInnerHTML={{
                                __html: `${source_db}&nbsp;&nbsp;&nbsp;${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                              }}
                            />
                            {source_type ? (
                              <a
                                style={{
                                  color: '#999',
                                  display: 'inline-block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={caption}
                                href={
                                  source_type
                                    ? `http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.kns[source_type].dbcode}&&dbname=${RestTools.kns[source_type].dbname}&filename=${source_id}`
                                    : ''
                                }
                              >
                                {caption}
                              </a>
                            ) : (
                              <div
                                style={{
                                  color: '#999',
                                  display: 'inline-block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {caption}
                              </div>
                            )}
                            <div className={styles.sg_evaluate}>
                              {needEvaluate ? (
                                <Evaluate
                                  id={item.dataList[0].id}
                                  goodCount={item.dataList[0].evaluate.good}
                                  badCount={item.dataList[0].evaluate.bad}
                                  isevalute={item.dataList[0].evaluate.isevalute}
                                />
                              ) : null}
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default SgListView;
