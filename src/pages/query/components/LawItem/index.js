import React from 'react';
import { List, Descriptions } from 'antd';
import FoldText from '../../../../components/FoldText';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function LawItem({ data }) {
  return (
    <div className={styles.LawItem}>
      <List
        itemLayout="vertical"
        footer={
          <div style={{ textAlign: 'right' }}>
            <a
              style={{ color: '#999' }}
              href="https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKLK"
              rel="noreferrer"
              target="_blank"
            >
              CNKI法律法规库
            </a>
          </div>
        }
        dataSource={data}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className={styles.fullContent}>
                <Descriptions size="small" bordered layout="horizontal">
                  <Descriptions.Item label="所属法规" >
                    <div
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.所属法规) }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="条目全文" span={12}>
                    {item.条目全文 && item.条目全文.length > 300 ? (
                      <FoldText originText={item.条目全文.slice(0, 300)} fullText={item.条目全文} />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: RestTools.translateToRed(`${item.全文}`)
                        }}
                      />
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawItem;
