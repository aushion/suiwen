import React from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { connect } from 'dva';
import querystring from 'querystring';
import LawCase from '../LawCase';
import styles from './index.less';

function LawTabs({ repositoryData, loading, dispatch }) {
  repositoryData =
    repositoryData &&
    repositoryData
      .filter((item) => item.intentDomain !== '案由')
      .filter((item) => item.template !== 'lawliterature')
      .filter((item) => item.template !== 'referencebook')
      .filter((item) => item.template !== 'graphic');

  const query = querystring.parse(querystring.stringify(window.location.href.split('?')[1]));
  console.log('query', query);
  return repositoryData.length ? (
    <div className={styles.lawTabs}>
      <Spin spinning={loading}>
        <Tabs type="card" tabBarGutter={0}>
          {repositoryData
            ? repositoryData.map((item, index) => {
                return (
                  <Tabs.TabPane tab={`${item.intentDomain || item.tagName}`} key={index}>
                    {/* 渲染法规组件 */}
                    {item.template === 'lawpost' ? <LawCase data={item} type="lawpost" /> : null}
                    {/* 渲染法规条目 */}
                    {item.template === 'lawitem' ? <LawCase data={item} type="lawitem" /> : null}
                    {/* 渲染案例 */}
                    {item.template === 'lawcase' ? <LawCase data={item} type="lawcase" /> : null}
                  </Tabs.TabPane>
                );
              })
            : null}
        </Tabs>
        {!loading && !repositoryData ? <Empty /> : null}
      </Spin>
    </div>
  ) : null;
}

function mapStateToProps(state) {
  return {
    ...state.result,
    // ...state.law,
    loading: state.loading.models.result
  };
}

export default connect(mapStateToProps)(LawTabs);
