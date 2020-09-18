import React from 'react';
import { List } from 'antd';
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
          <div style={{textAlign: 'right', }}>
            <a
              style={{color: '#999'}}
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
              <h3
                style={{ fontWeight: 'bold' }}
                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.标题) }}
              />
              <div className={styles.fullContent}>
                {item.全文.length > 300 ? (
                  <FoldText originText={item.全文.slice(0, 300)} fullText={item.全文} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: `${item.全文}` }} />
                )}
              </div>
              <div className={styles.otherInfo}>
                {item.裁判日期 ? (
                  <div className={styles.item}>【裁判日期】{item.裁判日期}</div>
                ) : null}
                {item.审理法院 ? (
                  <div className={styles.item}>
                    【审理法院】
                    <span
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.审理法院) }}
                    />
                  </div>
                ) : null}
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawCase;
