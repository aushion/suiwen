import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import axios from 'axios';
import request from '../../../../utils/request';
import styles from './index.less';
const { TabPane } = Tabs;
export default React.memo(function Covid() {
  const [covidData, setCovidData] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    setLoading(true);
    axios
      .get('/test/fymap2020_data.d.json')
      .then((res) => {
        console.log('res', res);
        if (res.status === 200) {
          setCovidData(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <div className={styles.covid}>
      <h2>新冠疫情数据</h2>
      <Spin spinning={loading}>
        <div>{covidData?.times}</div>
        <Tabs>
          <TabPane tab="国内疫情" key="1">
            <div></div>
          </TabPane>
          <TabPane tab="北京疫情" key="2"></TabPane>
          <TabPane tab="国外疫情" key="3"></TabPane>
        </Tabs>
      </Spin>
    </div>
  );
});
