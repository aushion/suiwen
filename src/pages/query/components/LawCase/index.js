import React, { useState } from 'react';
import { List, Descriptions } from 'antd';
import querystring from 'querystring';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import { getAnswerByPage } from '../../service/result';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function LawCase({ data, type }) {
  const [resource, setResource] = useState(data);
  const [loading, setLoading] = useState(false);
  const { dataNode, pagination, domain, intentDomain, intentId } = resource;
  const { q, topic } = querystring.parse(window.location.search.substring(1));
  const showType = {
    lawitem: {
      dataItem: ['所属法规', '时效性', '发布日期', '全文']
    },
    lawcase: {
      title: '标题',
      link: (kw) =>
        `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=clkc&kw=${kw}&korder=0&sel=1`,
      dataItem: ['案由', '裁判日期', '审理法院', '全文']
    },
    lawpost: {
      title: '中文标题',
      link: (
        kw
      ) => `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=clklk&kw=${kw}&korder=0&sel=1
      `,
      dataItem: ['时效性', '发布机关', '发布日期', '全文']
    }
  };
  function fetchData(params) {
    setLoading(true);
    getAnswerByPage(params)
      .then((res) => {
        if (res.data.code === 200) {
          setResource(res.data.result.metaList[0]);
          setLoading(false);
          window.scrollTo({
            top: 0
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }
  return (
    <div className={styles.LawCase}>
      <List
        itemLayout="vertical"
        dataSource={dataNode}
        loading={loading}
        pagination={{
          current: pagination.pageStart,
          pageSize: pagination.pageCount,
          total: pagination.total,
          hideOnSinglePage: true,
          showTotal: (total, range) => `共 ${total} 条`,
          onChange: (page) => {
            fetchData({
              domain: encodeURIComponent(domain),
              intentDomain: encodeURIComponent(intentDomain),
              intentId,
              q: encodeURIComponent(q),
              topic,
              pageStart: page,
              pageCount: 10
            });
          }
        }}
        footer={
          <div style={{ textAlign: 'right', padding: 0 }}>
            <a
              style={{ color: '#999' }}
              href="https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKC"
              rel="noreferrer"
              target="_blank"
            >
              CNKI法律法规库
            </a>
          </div>
        }
        renderItem={(item) => {
          return (
            <List.Item>
              <Descriptions
                title={
                  showType[type].title ? (
                    <a
                      style={{ color: '#047AE8' }}
                      href={showType[type].link(RestTools.removeFlag(item[showType[type].title]))}
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item[showType[type].title])
                      }}
                      target="_blank"
                      rel="noreferrer"
                    />
                  ) : null
                }
                colon={3}
              >
                {showType[type].dataItem.map((current) => {
                  return item[current] ? (
                    <Descriptions.Item key={current} label={<Label text={current} />} span={3}>
                      {item[current].length > 300 ? (
                        <FoldText
                          originText={item[current].slice(0, 300)}
                          fullText={item[current]}
                        />
                      ) : (
                        <div
                          style={{
                            color: '#333',
                            letterSpacing: '2px',
                            lineHeight: '27.2px'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(item[current])
                          }}
                        />
                      )}
                    </Descriptions.Item>
                  ) : null;
                })}
              </Descriptions>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawCase;
