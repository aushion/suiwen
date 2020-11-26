import React, { useEffect, Fragment } from 'react';
import { Card, Row, Col, Icon, Button, Tree } from 'antd';
import router from 'umi/router';
import querystring from 'querystring';
import { connect } from 'dva';

const { TreeNode } = Tree;
export default connect(({ Doc }) => ({
  outlineData: Doc.outlineData
}))(function (props) {
  const { dispatch } = props;

  const { docId } = querystring.parse(window.location.href.split('?')[1]);

  const outlineData = [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true }
  ];

  useEffect(() => {
    //加载该文档id下的提纲目录
    queryForRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //获取该文档id下的提纲目录
  function queryForRoute() {
    dispatch({
      type: 'Doc/queryForRoute',
      payload: {
        docId: docId
      }
    });
  }

  const onSelect = (selectedKeys, info) => {};

  return (
    <>
      <Fragment>
        <Card>
          <Button
            type="primary"
            style={{ marginLeft: 10 }}
            onClick={() => {
              router.push({
                pathname: '/doc/outlineConfig',
                query: {
                  docId: docId
                }
              });
            }}
          >
            文档章节-自定义
          </Button>
        </Card>

        <Card>
          <Row>
            <Col span={12}>
              <Card>
                <Tree
                  showLine
                  switcherIcon={<Icon type="down" />}
                  defaultExpandedKeys={['0-0-0']}
                  onSelect={onSelect}
                >
                  {outlineData.map((data) => (
                    <TreeNode />
                  ))}
                </Tree>
              </Card>
            </Col>
            <Col span={12}>
              <div style={{ height: 350, overflowY: 'scroll' }}></div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    </>
  );
});
