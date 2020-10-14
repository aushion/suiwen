import React from 'react';
import { Tabs } from 'antd';
import LawCase from '../LawCase';
import styles from './index.less';

function LawTabs(props) {
  const { data } = props;
  return (
    <div className={styles.lawTabs}>
      <Tabs type="line">
        {data.length
          ? data.map((item) => {
              return (
                <Tabs.TabPane tab={item.intentDomain} key={item.intentDomain}>
                  <LawCase data={item} type={item.template} />
                </Tabs.TabPane>
              );
            })
          : null}
      </Tabs>
    </div>
  );
}

export default LawTabs;
