import React, { useState, useEffect, Fragment } from 'react';
import {
  Layout,
  Menu,
  Card,
  List,
  Row,
  Col,
  Carousel,
  Spin,
  Popover,
  Icon,
  Button,
  Badge,
  Tree
} from 'antd';
import router from 'umi/router';
import find from 'lodash/find';
import querystring from 'querystring';
import { connect } from 'dva';
import styles from './index.less';

const { TreeNode, DirectoryTree } = Tree;
const { SubMenu } = Menu;
const { Header, Sider, Content, Footer } = Layout;
export default connect(({ Doc }) => ({
  outlineData: Doc.outlineData,
}))(function (props) {

  const { form, dispatch } = props;

  // const { docId } = querystring.parse(window.location.href.split('?')[1]);
  const  docId  = '1';
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');

  const [visible, setVisible] = useState(false);

    // outlineData = [
  //   {
  //     children: [
  //       { children: [], id: 46, label: '第一节' },
  //       { children: [], id: 47, label: '第二节' },
  //       { children: [], id: 48, label: '第三节' },
  //       { children: [], id: 49, label: '第四节' },
  //       { children: [], id: 50, label: '第五节' }
  //     ],
  //     id: 45,
  //     label: '第一章'
  //   },
  //   {
  //     children: [
  //       { children: [], id: 52, label: '第一节' },
  //       { children: [], id: 53, label: '第二节' },
  //       { children: [], id: 54, label: '第三节' },
  //       { children: [], id: 55, label: '第四节' }
  //     ],
  //     id: 51,
  //     label: '第二章'
  //   }
  // ];

  const outlineData = [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true }
  ];

  useEffect(() => {
    //加载该文档id下的提纲目录
    queryForRoute();
  }, []);

  //获取该文档id下的提纲目录
  function queryForRoute () {
    dispatch({
      type: 'Doc/queryForRoute',
      payload: {
        docId: docId,
      }
    });
  };

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

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
