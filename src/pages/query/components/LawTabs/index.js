import React from 'react';
import { Tabs, Spin, Empty } from 'antd';
import { connect } from 'dva';
import LawCase from '../LawCase';
import Literature from '../Literature';
import styles from './index.less';

function LawTabs({ repositoryData, loading, q, dispatch }) {
  repositoryData =
    repositoryData &&
    repositoryData
      .filter((item) => item.intentDomain !== '案由')
      .filter((item) => item.template !== 'referencebook')
      .filter((item) => item.template !== 'graphic');

  const lawLiteratureData = repositoryData.filter((item) => item.template === 'lawliterature');

  const tabName = {
    法规篇: '法规(篇)',
    法规条目: '法规(条目)',
    案例: '案例',
    论文类: '期刊'
  };

  return repositoryData.length ? (
    <div className={styles.lawTabs}>
      <h2>
        <span style={{ color: '#1890ff' }}>{q}</span>
        <span> - 知网法律知识库</span>
      </h2>
      <Spin spinning={loading}>
        {repositoryData.length > 1 ? (
          <Tabs type="card" tabBarGutter={0}>
            {repositoryData
              ? repositoryData.map((item, index) => {
                  return (
                    <Tabs.TabPane tab={tabName[item.intentDomain]} key={index}>
                      {item.template === 'lawliterature' ? (
                        <Literature
                          law
                          q={q}
                          literatureData={lawLiteratureData}
                          dispatch={dispatch}
                        />
                      ) : (
                        <LawCase data={item} type={item.template} />
                      )}
                    </Tabs.TabPane>
                  );
                })
              : null}
          </Tabs>
        ) : (
          <div>
            {repositoryData
              ? repositoryData.map((item, index) => {
                  return item.template === 'lawliterature' ? (
                    <Literature
                      key={index}
                      law
                      q={q}
                      literatureData={lawLiteratureData}
                      dispatch={dispatch}
                    />
                  ) : (
                    <LawCase key={index} data={item} type={item.template} />
                  );
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
