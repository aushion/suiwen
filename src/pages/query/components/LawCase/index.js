import React, { useState } from 'react';
import { List, Descriptions, Tag, Divider } from 'antd';
import querystring from 'querystring';
import FoldText from '../../../../components/FoldText';
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
      dataItem: ['所属法规', '时效性', '发布日期', '全文'],
      moreUrl: `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=CLKLT`,
      moreText: '更多法规条目'
    },
    lawcase: {
      title: '标题',
      link: (kw) =>
        `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=clkc&kw=${kw}&korder=0&sel=1`,
      dataItem: ['案由', '裁判日期', '审理法院', '全文'],
      moreUrl: `https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKC`,
      moreText: '更多法律案例'
    },
    lawpost: {
      title: '标题',
      link: (
        kw
      ) => `https://lawnew.cnki.net/kns/brief/result.aspx?dbPrefix=clklk&kw=${kw}&korder=0&sel=1
      `,
      dataItem: ['时效性', '发布机关', '发布日期', '全文'],
      moreUrl: `https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKLK`,
      moreText: '更多法律法规'
    }
  };
  function fetchData(params) {
    setLoading(true);
    setResource({ ...resource, dataNode: [] }); //重置数据
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
        style={loading ? { minHeight: '60vh' } : null}
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
              pageCount: 5
            });
          }
        }}
        footer={
          <div style={{ textAlign: 'right', padding: 0 }}>
            <a
              style={{ color: '#999' }}
              href={showType[type].moreUrl}
              rel="noreferrer"
              target="_blank"
            >
              {showType[type].moreText}
            </a>
          </div>
        }
        renderItem={(item) => {
          return (
            <List.Item>
              <Descriptions
                title={
                  showType[type].title ? (
                    <>
                      <a
                        style={{ color: '#333', fontSize: 18, marginBottom: 10, marginRight: 10 }}
                        href={showType[type].link(RestTools.removeFlag(item[showType[type].title]))}
                        dangerouslySetInnerHTML={{
                          __html: RestTools.translateToRed(item[showType[type].title])
                        }}
                        target="_blank"
                        rel="noreferrer"
                      />
                      {item.时效性 ? <Tag color="green">{item.时效性}</Tag> : null}
                    </>
                  ) : null
                }
                colon={3}
              >
                {type === 'lawcase' ? (
                  <>
                    <Descriptions.Item span={3}>
                      <div style={{ color: '#999' }}>
                        <span
                          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.单位) }}
                        />
                        {item.案号 ? (
                          <>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: RestTools.translateToRed(item.案号)
                              }}
                            />
                          </>
                        ) : null}
                        {item.裁判日期 ? (
                          <>
                            <span style={{ margin: '0 4px' }}>|</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: RestTools.translateToRed(item.裁判日期)
                              }}
                            />
                          </>
                        ) : null}
                      </div>
                    </Descriptions.Item>

                    <Descriptions.Item span={3} label="案由">
                      <div>
                        {item.案由.split(';').map((item) => {
                          return (
                            <Tag color="volcano" key={item}>
                              <span
                                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item) }}
                              />
                            </Tag>
                          );
                        })}
                      </div>
                    </Descriptions.Item>
                    {item.全文 ? (
                      <Descriptions.Item span={3}>
                        {item.全文.length > 300 ? (
                          <FoldText
                            style={{ color: '#777', letterSpacing: '1px', lineHeight: '20px' }}
                            originText={item.全文.substring(0, 300)}
                            fullText={item.全文}
                          />
                        ) : (
                          <div
                            style={{
                              color: '#777',
                              letterSpacing: '1px',
                              lineHeight: '20px'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: RestTools.translateToRed(item.全文)
                            }}
                          />
                        )}
                      </Descriptions.Item>
                    ) : null}
                  </>
                ) : null}

                {type === 'lawpost' ? (
                  <>
                    <Descriptions.Item span={3}>
                      <div style={{ color: '#999' }}>
                        {item.效力级别 ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `${RestTools.translateToRed(item.效力级别)}`
                            }}
                          />
                        ) : null}
                        {item.发文字号 || item.发布机关 ? (
                          <>
                            <Divider type="vertical" />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${RestTools.translateToRed(
                                  item.发文字号 || item.发布机关
                                )}`
                              }}
                            />
                          </>
                        ) : null}
                        {item.发布日期 ? (
                          <>
                            <Divider type="vertical" />
                            <span dangerouslySetInnerHTML={{ __html: `${item.发布日期}发布` }} />
                          </>
                        ) : null}
                        {item.实施日期 ? (
                          <>
                            <Divider type="vertical" />
                            <span dangerouslySetInnerHTML={{ __html: `${item.实施日期}实施` }} />
                          </>
                        ) : null}
                      </div>
                    </Descriptions.Item>
                    <Descriptions.Item span={3}>
                      <div
                        style={{ color: '#777', letterSpacing: '1px' }}
                        dangerouslySetInnerHTML={{
                          __html: RestTools.translateToRed(item.正文快照)
                        }}
                      ></div>
                    </Descriptions.Item>
                  </>
                ) : null}

                {type === 'lawitem' ? (
                  <>
                    <Descriptions.Item span={3}>
                      <>
                        <span
                          style={{
                            fontSize: 18,
                            letterSpacing: '1px',
                            color: '#333',
                            fontWeight: '700',
                            marginRight: 10
                          }}
                          dangerouslySetInnerHTML={{
                            __html: RestTools.translateToRed(`【所属法规】${item.所属法规}`)
                          }}
                        />
                        <Tag color="green">{item.时效性}</Tag>
                      </>
                    </Descriptions.Item>

                    <Descriptions.Item span={3}>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>【条目全文】</span>
                        {item.全文.length > 300 ? (
                          <FoldText
                            style={{ color: '#777', letterSpacing: '1px', lineHeight: '20px' }}
                            originText={item.全文.substring(0, 300)}
                            fullText={item.全文}
                          />
                        ) : (
                          <div
                            style={{
                              color: '#777',
                              letterSpacing: '1px',
                              lineHeight: '20px'
                            }}
                            dangerouslySetInnerHTML={{
                              __html: RestTools.translateToRed(item.全文)
                            }}
                          />
                        )}
                      </div>
                    </Descriptions.Item>
                  </>
                ) : null}
              </Descriptions>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawCase;
