import React, { useEffect, useState } from 'react';
import { Spin, Tabs, Row, Col } from 'antd';
import axios from 'axios';
import request from '../../../../utils/request';
import styles from './index.less';
const { TabPane } = Tabs;
export default React.memo(function Covid() {
  const [covidData, setCovidData] = useState(null);
  const [loading, setLoading] = useState(null);
  useEffect(() => {
    setLoading(true);
    //网易

    // axios.get(`https://c.m.163.com/ug/api/wuhan/app/data/list-total`,null)

    //腾讯
    axios
      .get(
        'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list?modules=chinaDayList,chinaDayAddList,cityStatis,nowConfirmStatis,provinceCompare'
      )
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
    //新浪
    // axios
    //   .get('/test/fymap2020_data.d.json')
    //   .then((res) => {
    //     console.log('res', res);
    //     if (res.status === 200) {
    //       setCovidData(res.data.data);
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    // 阿里
    // axios
    //   .get('http://ncovdata.market.alicloudapi.com/ncov/cityDiseaseInfoWithTrend', {
    //     headers: {
    //       Authorization: `APPCODE 71a0b51e79444178ae2c509154309279`
    //     }
    //   })
    //   .then((res) => {
    //     console.log('res', res);
    //     if (res.status === 200) {
    //       setCovidData(res.data.data);
    //     }
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);
  return (
    <div className={styles.covid}>
      <h2>新冠疫情数据</h2>
      <Spin spinning={loading}>
        <div>{covidData?.times}</div>
        {covidData ? (
          <Tabs>
            <TabPane tab="国内疫情" key="1">
              <Row>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>现有确诊</div>
                  <div className={styles.count} style={{ color: '#FE350E' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].nowConfirm}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#FE350E' }}>
                      {covidData.chinaDayList[covidData.chinaDayList.length - 1].nowConfirm -
                        covidData.chinaDayList[covidData.chinaDayList.length - 2].nowConfirm}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>累计境外输入</div>
                  <div className={styles.count} style={{ color: '#FF792B' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].importedCase}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#FF792B' }}>
                      +
                      {covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].importedCase}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>现存无症状</div>
                  <div className={styles.count} style={{ color: '#fe9986' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].noInfect}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#fe9986' }}>
                      +{covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].infect}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>现存确诊重症</div>
                  <div className={styles.count} style={{ color: '#FE350E' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].nowSevere}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#FE350E' }}>
                      {covidData.chinaDayList[covidData.chinaDayList.length - 1].nowSevere -
                        covidData.chinaDayList[covidData.chinaDayList.length - 2].nowSevere}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }}>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>累计确诊</div>
                  <div className={styles.count} style={{ color: '#FF792B' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].confirm}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#FF792B' }}>
                      +{covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].confirm}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>累计死亡</div>
                  <div className={styles.count} style={{ color: '#666666' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].dead}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#666666' }}>
                      +{covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].dead}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>累计治愈</div>
                  <div className={styles.count} style={{ color: '#65CA00' }}>
                    {covidData.chinaDayList[covidData.chinaDayList.length - 1].heal}
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#65CA00' }}>
                      +{covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].heal}
                    </span>
                  </div>
                </Col>
                <Col span={6} className={styles.info}>
                  <div className={styles.title}>现存疑似</div>
                  <div className={styles.count} style={{ color: '#A36FFF' }}>
                    <span>{covidData.chinaDayList[covidData.chinaDayList.length - 1].suspect}</span>
                  </div>
                  <div className={styles.diff}>
                    较昨日
                    <span style={{ color: '#A36FFF' }}>
                      {covidData.chinaDayAddList[covidData.chinaDayAddList.length - 1].suspect}
                    </span>
                  </div>
                </Col>
              </Row>
            </TabPane>
            {/* <TabPane tab="北京疫情" key="2"></TabPane>
            <TabPane tab="国外疫情" key="3"></TabPane> */}
          </Tabs>
        ) : null}
      </Spin>
    </div>
  );
});
