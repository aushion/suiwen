import React from 'react';
import { Tabs, Spin } from 'antd';
import { connect } from 'dva';
import Literature from '../query/components/Literature';
import LawPost from '../query/components/LawPost';
import LawItem from '../query/components/LawItem';
import LawCase from '../query/components/LawCase';
import ToolsBook from '../query/components/ToolsBook';
import SgList from '../query/components/SgList';
import styles from './index.less';

function Law({ data, sgData, loading, dispatch }) {
  data = data && data.filter((item) => item.intentDomain !== '案由'); //案由

  const referenceData = data && data.filter((item) => item.template === 'referencebook'); //工具书

  const literatureData = data && data.filter((item) => item.template === 'lawliterature'); //文献

  return (
    <Spin spinning={loading}>
      <div className={styles.law}>
        {data ? (
          <Tabs type="card" tabBarGutter={0}  tabPosition="left">
            {data.map((item, index) => {
              return (
                <Tabs.TabPane tab={`${item.intentDomain || item.tagName}`} key={item.id}>
                  {/* 渲染工具书 */}
                  {item.tagName === '百科问答' ? (
                    <ToolsBook data={referenceData}></ToolsBook>
                  ) : null}
                  {/* 渲染法规组件 */}
                  {item.intentDomain === '法规篇' ? <LawPost data={item.dataNode} /> : null}
                  {/* 渲染法规条目 */}
                  {item.intentDomain === '法规章节' ? <LawItem data={item.dataNode} /> : null}
                  {/* 渲染案例 */}
                  {item.intentDomain === '案例' ? <LawCase data={item.dataNode} /> : null}
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
                <SgList data={sgData} needEvaluate={false}></SgList>
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
    ...state.law,
    loading: state.loading.models.law
  };
}

export default connect(mapStateToProps)(Law);
