import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import Literature from '../query/components/Literature';
import LawPost from '../query/components/LawPost';
import LawItem from '../query/components/LawItem';
import LawCase from '../query/components/LawCase';
import styles from './index.less';

function Law({ data, dispatch }) {
  //   const topicInfo = sessionStorage.getItem('topicData') ? JSON.parse(sessionStorage.getItem('topicData')): null;

  //   const theme = topicInfo.filter(item => item.name === '法律')[0].info;

  return (
    <div className={styles.law}>
      {data ? (
        <Tabs
          // tabPosition="left"
          type="card"
          tabBarGutter={0}
          size="large"
          // tabBarStyle={{
          //   width: 180
          // }}
        >
          {data.map((item, index) => {
            return (
              <Tabs.TabPane tab={`${item.intentDomain}(${item.pagination.total})`} key={item.id}>
                {item.intentDomain === '法规篇' ? <LawPost data={item.dataNode} /> : null}
                {item.intentDomain === '法规条目' ? <LawItem data={item.dataNode} /> : null}
                {item.intentDomain === '案例' ? <LawCase data={item.dataNode} /> : null}
                {item.template === 'lawliterature' ? (
                  <Literature law literatureData={data} dispatch={dispatch} />
                ) : null}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      ) : null}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.law
  };
}

export default connect(mapStateToProps)(Law);
