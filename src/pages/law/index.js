import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import Literature from '../query/components/Literature';
import LawPost from '../query/components/LawPost';
import LawItem from '../query/components/LawItem';
import LawCase from '../query/components/LawCase';
import styles from './index.less';

function Law({ data, dispatch }) {
  //获取专题相关信息
  // const topicInfo = sessionStorage.getItem('topicData') ? JSON.parse(sessionStorage.getItem('topicData')): null;
  //获取法律专题的主题色
  // const theme = topicInfo.filter(item => item.name === '法律')[0].info;

  /*  筛选出法律相关的数据
    法律相关 */
  data =
    data && data.filter((item) => item.template === 'lawcase' || item.template === 'lawliterature');

  return (
    <div className={styles.law}>
      {data ? (
        <Tabs type="card" tabBarGutter={0} size="large">
          {data.map((item, index) => {
            return (
              <Tabs.TabPane tab={`${item.intentDomain}`} key={item.id}>
                {/* 渲染法规组件 */}
                {item.intentDomain === '法规篇' ? <LawPost data={item.dataNode} /> : null}
                {/* 渲染法规条目 */}
                {item.intentDomain === '法规条目' ? <LawItem data={item.dataNode} /> : null}
                {/* 渲染案例 */}
                {item.intentDomain === '案例' ? <LawCase data={item.dataNode} /> : null}
                {/* 渲染法律相关论文 */}
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
