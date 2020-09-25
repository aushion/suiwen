import React from 'react';
import { List, Descriptions } from 'antd';
import FoldText from '../../../../components/FoldText';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function LawCase({ data }) {
  return (
    <div className={styles.LawCase}>
      <List
        itemLayout="vertical"
        dataSource={data}
        footer={
          <div style={{ textAlign: 'right' }}>
            <a
              style={{ color: '#999' }}
              href="https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKC"
              rel="noreferrer"
              target="_blank"
            >
              CNKI法律案例库
            </a>
          </div>
        }
        renderItem={(item) => {
          return (
            <List.Item>
              <Descriptions title={item.标题} bordered colon={3} layout="vertical">
               
                  <Descriptions.Item label="裁判日期" span={1}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.裁判日期 || '/')
                      }}
                    ></div>
                  </Descriptions.Item>
                

            
                  <Descriptions.Item label="审理法院" span={2}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.审理法院 || '/')
                      }}
                    ></div>
                  </Descriptions.Item>
             

                <Descriptions.Item label="全文" span={3}>
                  <div className={styles.fullContent}>
                    {item.全文.length > 300 ? (
                      <FoldText originText={item.全文.slice(0, 300)} fullText={item.全文} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: `${item.全文}` }} />
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawCase;
