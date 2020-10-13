import React from 'react';
import { Tabs, Spin } from 'antd';
import { connect } from 'dva';
import Literature from '../components/Literature';
import LawCase from '../components/LawCase';
import ToolsBook from '../components/ToolsBook';
import SgList from '../components/SgList';
import styles from './index.less';

function Law({ repositoryData, sgData, loading, dispatch }) {
  repositoryData = repositoryData && repositoryData.filter((item) => item.intentDomain !== '案由'); //案由

  const referenceData = repositoryData && repositoryData.filter((item) => item.template === 'referencebook'); //工具书

  const literatureData = repositoryData && repositoryData.filter((item) => item.template === 'lawliterature'); //文献

  return (
    <Spin spinning={loading}>
      <div className={styles.law}>
        {repositoryData ? (
          <Tabs type="card" tabBarGutter={0}  tabPosition="left">
            {repositoryData.map((item, index) => {
              return (
                <Tabs.TabPane tab={`${item.intentDomain || item.tagName}`} key={item.id}>
                  {/* 渲染工具书 */}
                  {item.tagName === '百科问答' ? (
                    <ToolsBook data={referenceData} /> 
                  ) : null}
                  {/* 渲染法规组件 */}
                  {item.template === 'lawpost' ? <LawCase data={item} type='lawpost'  /> : null}
                  {/* 渲染法规条目 */}
                  {item.template === 'lawitem' ? <LawCase data={item} type='lawitem' /> : null}
                  {/* 渲染案例 */}
                  {item.template === 'lawcase' ? <LawCase data={item} type='lawcase' /> : null}
                  {/* 渲染法律相关论文 */}
                  {item.template === 'lawliterature' ? (
                    <Literature law literatureData={literatureData} dispatch={dispatch} />
                  ) : null}
                </Tabs.TabPane>
              );
            })}
            {/* 句群 */}
            {sgData ? (
              <Tabs.TabPane tab="知识片段" key="知识片段">
                <SgList data={sgData} needEvaluate={false} />
              </Tabs.TabPane>
            ) : null}
          </Tabs>
        ) : null}
      </div>
    </Spin>
  );
}

function mapStateToProps(state) {
  return {
    ...state.result,

    ...state.law,
    loading: state.loading.models.law
  };
}

export default connect(mapStateToProps)(Law);
