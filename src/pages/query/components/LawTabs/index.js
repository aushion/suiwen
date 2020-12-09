import React from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { connect } from 'dva';
import LawCase from '../LawCase';
import styles from './index.less';

function LawTabs({ repositoryData, loading }) {
  repositoryData =
    repositoryData &&
    repositoryData
      .filter((item) => item.intentDomain !== '案由')
      .filter((item) => item.template !== 'lawliterature')
      .filter((item) => item.template !== 'referencebook')
      .filter((item) => item.template !== 'graphic');

  return repositoryData.length ? (
    <div className={styles.lawTabs}>
      <Spin spinning={loading}>
        {repositoryData.length > 1 ? (
          <Tabs type="card" tabBarGutter={0}>
            {repositoryData
              ? repositoryData.map((item, index) => {
                  return (
                    <Tabs.TabPane tab={`${item.intentDomain || item.tagName}`} key={index}>
                      <LawCase data={item} type={item.template} />
                    </Tabs.TabPane>
                  );
                })
              : null}
          </Tabs>
        ) : (
          <div>
            {repositoryData
              ? repositoryData.map((item, index) => {
                  return <LawCase key={index} data={item} type={item.template} />;
                })
              : null}
          </div>
        )}
        {!loading && !repositoryData ? <Empty /> : null}
      </Spin>
    </div>
  ) : null;
}

function mapStateToProps(state) {
  return {
    ...state.result,
    loading: state.loading.models.result
  };
}

export default connect(mapStateToProps)(LawTabs);
