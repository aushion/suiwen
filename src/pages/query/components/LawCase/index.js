import React from 'react';
import { List, Descriptions } from 'antd';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
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
              <Descriptions
                title={
                  <div
                    style={{ color: '#047AE8' }}
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.标题) }}
                  />
                }
                colon={3}
              >
                {item.案由 ? (
                  <Descriptions.Item label={<Label text="案由" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.案由 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}
                {item.裁判日期 ? (
                  <Descriptions.Item label={<Label text="裁判日期" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.裁判日期 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}

                {item.审理法院 ? (
                  <Descriptions.Item label={<Label text="审理法院" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.审理法院 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}

                <Descriptions.Item span={3}>
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
