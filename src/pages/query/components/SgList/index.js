import React, { useState } from 'react';
import { Button, List } from 'antd';
import groupBy from 'lodash/groupBy';
import querystring from 'querystring';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate/index';
import FoldText from '../../../../components/FoldText';
import styles from './index.less';
let nameIndex = 0; //计数点击分页是在那个类目下面
function SgList(props) {
  const { data, q, needEvaluate = true, dispatch } = props;
  const [initType, setType] = useState(data[nameIndex].name);
  const { topic = '' } = querystring.parse(window.location.href.split('?')[1]);
  return (
    <div className={`${styles.SgList} copy`} id="sg">
      <h2>
        <a
          href={`https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CJFQ&kw=${q}&korder=FT`}
          rel="noreferrer"
          target="_blank"
        >
          <span>知网期刊</span>
        </a>{' '}
        - 片段重组
      </h2>
      <div>
        {data.map((item) => {
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
        })}
      </div>
      <div style={{ marginTop: 20 }}>
        {data.map((item, index) => {
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
                pagination={{
                  current: item.pagination.pageStart,
                  size: item.pagination.pageCount,
                  total: item.pagination.total,
                  hideOnSinglePage: true,
                  onChange: (page) => {
                    nameIndex = index;
                    dispatch({
                      type: 'result/getSG',
                      payload: {
                        type: item.name,
                        pageSize: 10,
                        pageStart: page,
                        q,
                        domain: topic
                      }
                    });
                  }
                }}
                renderItem={(item) => {
                  const year =
                    (item.dataList[0].sgAdditionInfo && item.dataList[0].sgAdditionInfo.年) || '';
                  const qikanName =
                    (item.dataList[0].sgAdditionInfo && item.dataList[0].sgAdditionInfo.中文刊名) ||
                    '';
                  const caption = item.dataList[0].data.caption;
                  const source_id = item.dataList[0].data.source_id;
                  const source_type = item.dataList[0].data.soure_type;
                  return (
                    <List.Item>
                      {item.dataList.map((current, index) => {
                        const originText = current.data.semantic_text || current.data.context;
                        const fullText = originText + current.data.sub_context;

                        return (
                          <div key={index} style={{ paddingBottom: 10, wordBreak: 'break-all' }}>
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
                            __html: `${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                          }}
                        />
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
                          href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.kns[source_type].dbcode}&&dbname=${RestTools.kns[source_type].dbname}&filename=${source_id}`}
                        >
                          {caption}
                        </a>
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
        })}
      </div>
    </div>
  );
}

export default React.memo(SgList);
