import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Modal,
  Card,
  Form,
  Col,
  Row,
  Divider,
  Spin,
  Select,
  List,
  Tag,
  Dropdown
} from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import router from 'umi/router';
import RestTools from '../../../utils/RestTools';

import OutlineList from './components/OutlineList';
import DocModel from './components/DocModel';
import ChapterModel from './components/ChapterModel';
import NodeModel from './components/NodeModel';
import NodeQuestionModel from './components/NodeQuestionModel';
import querystring from 'querystring';
import styles from './style.less';

import request from '@/utils/request';

const { confirm } = Modal;

const OutlineConfig = (props) => {
  const { docId } = querystring.parse(window.location.href.split('?')[1], '#');
  // const docId = '1';
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const { form, dispatch } = props;
  //控制获取文档内容结果loading
  const [docContentResultLoading, setDocContentResultLoading] = useState(true);
  //控制文档标题、章、节、问题模态框
  const [docVisible, setDocVisible] = useState(false);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [nodeVisible, setNodeVisible] = useState(false);
  const [addNodeQuestionVisible, setAddNodeQuestionVisible] = useState(false);
  //保存章标题id
  const [chapterId, setChapterId] = useState('');
  //保存选中的文档数据组
  const [docData, setDocData] = useState('');
  //保存选中的章标题数据组
  const [chapterData, setChapterData] = useState('');
  //保存选中的节标题数据组
  const [nodeData, setNodeData] = useState('');

  const [classID, setID] = useState(true);

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

  useEffect(() => {
    //加载该文档id下的提纲目录

    initializeDocument(docId, null, username);

    setID(docId);
  }, []);

  //初始化文档（辅助生成文档模块）
  function initializeDocument(docId, docName, userName) {
    console.log('docId', docId);
    props
      .dispatch({
        type: 'Doc/addUserDoc',
        payload: {
          docId: docId,
          docName: docName,
          userName: userName
        }
      })
      .then((res) => {
        if (res.code == 200) {
          queryForRoute();
          //加载文档内容
          getDocContentByDocId();
        }
      });
  }

  //获取该文档id下的提纲目录
  function queryForRoute() {
    dispatch({
      type: 'Doc/queryForRoute',
      payload: {
        docId: docId
      }
    });
  }

  //获取该文档id下的文档内容
  function getDocContentByDocId() {
    dispatch({
      type: 'Doc/refreshDocContent',
      payload: {
        docId: docId
      }
    }).then((res) => {
      if (res.code == 200) {
        setDocContentResultLoading(false);
      } else {
        message.error(res.msg);
      }
    });
  }

  //编辑文档题目，取消按钮事件
  const onHandleCancelDoc = () => {
    setDocVisible(false);
  };
  //新建章，取消按钮事件
  const onHandleCancelChapter = () => {
    setChapterVisible(false);
  };
  //新建节，取消按钮事件
  const onHandleCancelNode = () => {
    setNodeVisible(false);
  };

  //编辑文档题目，提交按钮事件
  const onHandleOkDoc = (values) => {
    dispatch({
      type: 'Doc/editUserDoc',
      payload: {
        docId: docId,
        docName: values.label,
        userName: username
      }
    }).then((res) => {
      if (res.code == 200) {
        setDocVisible(false);
        //重新加载提纲数据，展示最新目录
        queryForRoute();
        //清除文档标题、章标题、节标题、章标题id
        setDocData('');
        setChapterData('');
        setNodeData('');
        setChapterId('');
        //刷新文章内容
        getDocContentByDocId();
        message.success('编辑文档标题成功');
      } else {
        message.error(res.msg);
      }
    });
  };

  //新建或编辑章节，提交按钮事件
  const onHandleOk = (values) => {
    dispatch({
      type: 'Doc/saveRoute',
      payload: {
        //文档id
        docId: docId,
        //排序号(新增时可不传递)
        orderNum: values.orderNum === '' ? 0 : values.orderNum,
        //父节点id，一级节点传0
        parentId: values.parentId,
        //路径id(只在编辑时传递)
        routeId: values.routeId,
        //路径名称
        routeName: values.label,
        //节标题对应的问题或关键字
        question: values.question === undefined ? null : encodeURIComponent(values.question)
      }
    }).then((res) => {
      if (res.code == 200) {
        if (values.parentId === '0') {
          setChapterVisible(false);
          if (values.routeId === undefined) {
            message.success('新建章标题成功');
          } else {
            message.success('编辑章标题成功');
          }
        } else {
          setNodeVisible(false);
          if (values.routeId === undefined) {
            message.success('新建节标题成功');
          } else {
            message.success('编辑节标题成功');
          }
        }
        //重新加载提纲数据，展示最新目录
        queryForRoute();
        //清除章标题、节标题、章标题id
        setChapterData('');
        setNodeData('');
        setChapterId('');
      } else {
        message.error(res.msg);
      }
    });
  };

  //编辑文档题目
  const onEditDoc = (item) => {
    setDocVisible(true);
    setDocData(item);
  };
  //编辑章标题
  const onEditChapter = (item) => {
    setChapterVisible(true);
    setChapterData(item);
  };

  //删除章标题
  const onDeleteChapter = (item) => {
    console.log(item);
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk() {
        dispatch({
          type: 'Doc/delDocRoute',
          payload: {
            docId: docId,
            routeId: item.id,
            userName: username
          }
        }).then((res) => {
          if (res.code === 200) {
            message.success(res.msg);
            //重新加载提纲数据，展示最新目录
            queryForRoute();
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {}
    });
  };

  //新增小节
  const onNewNode = (item) => {
    setChapterId(item.id);
    //清除节标题数据组
    setNodeData('');
    setNodeVisible(true);
  };

  //编辑小节
  const onEditNode = (item, i) => {
    setNodeVisible(true);
    //保存选中的节标题数据组
    setNodeData(i);
    //保存选中的节标题归属的章标题id
    setChapterId(item.id);
  };

  //新增小节关联的问题或关键字
  const onNewNodeQuestion = (item, i) => {
    setNodeData(i);
    setChapterId(item.id);
    setAddNodeQuestionVisible(true);
  };

  //专题分类切换
  const onClassChange = (item) => {};

  //新增章标题
  const onEditOutLine = () => {
    setChapterId('');
    setChapterVisible(true);
  };

  //生成文档
  const generateDoc = () => {
    const form = new FormData();
    // 文件对象
    form.append('docId', docId);
    request({
      url: '/doc/generateDoc',
      responseType: 'blob',
      method: 'post',
      data: form
    }).then((res) => {
      console.log(res);
      const downlaodFileName = decodeURIComponent(res.headers.filename);
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = downlaodFileName;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      var blob = new Blob([res.data], {
        type: 'application/msword;charset=utf-8'
      });
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    });
  };

  //刷新文档内容
  const refreshDocContent = () => {
    setDocContentResultLoading(true);
    props
      .dispatch({
        type: 'Doc/refreshDocContent',
        payload: {
          docId: docId
        }
      })
      .then((res) => {
        if (res.code == 200) {
          setDocContentResultLoading(false);
        } else {
          message.error(res.msg);
        }
      });
  };

  //为当前节标题配置问题或关键字
  function addNodeQuestion(values) {
    //限制问题的数量最大值为5
    if (values.questionSourceData && values.questionSourceData.length >= 5) {
      message.warn('最多配置5个问题/关键字');
      return;
    }
    props
      .dispatch({
        type: 'Doc/saveRouteQuestion',
        payload: {
          qid: values.qId,
          routeId: values.routeId,
          parentId: values.parentId,
          question: encodeURIComponent(values.question),
          orderNum: values.orderNum
        }
      })
      .then((res) => {
        if (res.code == 200) {
          message.success(res.msg);
          setAddNodeQuestionVisible(false);
          queryForRoute();
        } else {
          message.error(res.msg);
        }
      });
  }

  //滚动条初始化方法
  function handleInfiniteOnLoad() {
    console.log(props.docContentData);
  }

  //删除指定的片段
  function deleteContent(contentItem) {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk() {
        dispatch({
          type: 'Doc/delContent',
          payload: {
            contentId: contentItem.contentId
          }
        }).then((res) => {
          if (res.code === 200) {
            //刷新
            getDocContentByDocId();
            message.success('片段已删除');
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {}
    });
  }

  return (
    <Card style={{ height: '80vh' }}>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ marginLeft: 10, border: '0px' }}
          icon={'rollback'}
          title="返回到上一个页面"
          onClick={() => {
            router.goBack();
          }}
        ></Button>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={4}>
          <div className={styles.list}>
            <div className={styles.right}>
              <Button
                onClick={generateDoc}
                loading={props.loading}
                style={{ marginLeft: 10, background: '#2ae' ,color:'#FFFFFF'}}
              >
                文档下载
              </Button>
              <Button
                onClick={refreshDocContent}
                loading={props.loading}
                style={{ marginLeft: 10, background: ' #2ae' ,color:'#FFFFFF'}}
              >
                内容刷新
              </Button>
              {/* <div style={{overflowY:'auto',overflowY:'hidden',height: 'calc(100vh - 297px)',}}> */}
              <div className={styles.outlineArea}>
                <div>
                  <OutlineList
                    data={props.outlineData}
                    id={classID}
                    onEdit={onEditChapter}
                    onDelete={onDeleteChapter}
                    onNew={onNewNode}
                    onSEdit={onEditNode}
                    onClick={onClassChange}
                    onNewQuestion={onNewNodeQuestion}
                    onChapterNew={onEditOutLine}
                    onDocEdit={onEditDoc}
                  />
                </div>
              </div>
            </div>
            {docVisible ? (
              <DocModel
                onHandleCancel={onHandleCancelDoc}
                onHandleOk={onHandleOkDoc}
                data={docData}
                docId={docId}
                modalVisible={docVisible}
              />
            ) : null}
            {chapterVisible ? (
              <ChapterModel
                onHandleCancel={onHandleCancelChapter}
                onHandleOk={onHandleOk}
                data={chapterData}
                modalVisible={chapterVisible}
              />
            ) : null}
            {nodeVisible ? (
              <NodeModel
                onHandleCancel={onHandleCancelNode}
                onHandleOk={onHandleOk}
                data={nodeData}
                chapterId={chapterId}
                modalVisible={nodeVisible}
              />
            ) : null}
            {addNodeQuestionVisible ? (
              <NodeQuestionModel
                modalVisible={addNodeQuestionVisible}
                data={nodeData}
                dispatch={dispatch}
                loading={props.loading}
                chapterId={chapterId}
                onCancle={() => setAddNodeQuestionVisible(false)}
                handleOk={addNodeQuestion}
              />
            ) : null}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={16}>
          <Spin spinning={docContentResultLoading}>
            <InfiniteScroll
              className={styles.demoInfiniteContainer}
              initialLoad={false}
              pageStart={0}
              loadMore={handleInfiniteOnLoad}
              useWindow={false}
            >
              {props.docContentData ? (
                <>
                  <div
                    key={'docTitle' + props.docContentData.docName}
                    id={'docTitle' + props.docContentData.docName}
                    dangerouslySetInnerHTML={{
                      __html:
                        '<h1 align="center">' +
                        [props.docContentData.docName ? props.docContentData.docName : ''] +
                        '</h1>'
                    }}
                  />
                  <List
                    split={false}
                    itemLayout="horizontal"
                    dataSource={props.docContentData.routeList}
                    renderItem={(chapterItem) => (
                      <div
                        key={'chapterTitle' + chapterItem.routeName}
                        id={'chapterTitle' + chapterItem.routeName}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: '<h2 align="center">' + chapterItem.routeName + '</h2>'
                          }}
                        />
                        <List.Item>
                          {chapterItem.sectionList ? (
                            <List
                              split={false}
                              dataSource={chapterItem.sectionList}
                              renderItem={(nodeItem) => (
                                <div
                                  key={
                                    'nodeTitle' + chapterItem.routeName + '' + nodeItem.routeName
                                  }
                                  id={'nodeTitle' + chapterItem.routeName + '' + nodeItem.routeName}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: '<h3 >' + nodeItem.routeName + '</h3>'
                                    }}
                                  />
                                  <List.Item>
                                    {nodeItem.contentList ? (
                                      <List
                                        split={false}
                                        dataSource={nodeItem.contentList}
                                        renderItem={(contentItem) => (
                                          <List.Item>
                                            <Col>
                                              <Row>
                                                <div
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      '<p style="text-indent:2em">' +
                                                      RestTools.translateDocToRed(
                                                        contentItem.content
                                                      ) +
                                                      '</p>'
                                                  }}
                                                />
                                              </Row>
                                              <Row>
                                                <div
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      '<p style="text-align: right">' +
                                                      '<a style="color:#999" target="_blank" rel="noopener noreferrer" href=http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=' +
                                                      contentItem.resourceId +
                                                      '>' +
                                                      contentItem.resource +
                                                      '</a>' +
                                                      '</p>'
                                                  }}
                                                />
                                              </Row>
                                            </Col>

                                            <div>
                                              <Row gutter={10}>
                                                <Col span={10}>
                                                  <Button
                                                    style={{ border: '0px', color: ' #FF0000   ' }}
                                                    icon={'close-circle'}
                                                    title={'删除片段'}
                                                    onClick={() => {
                                                      //去除原文
                                                      deleteContent(contentItem);
                                                    }}
                                                  ></Button>
                                                </Col>
                                              </Row>
                                            </div>
                                          </List.Item>
                                        )}
                                      />
                                    ) : null}
                                  </List.Item>
                                </div>
                              )}
                            />
                          ) : null}
                        </List.Item>
                      </div>
                    )}
                  />
                </>
              ) : null}
            </InfiniteScroll>
          </Spin>
        </Col>
      </Row>
    </Card>
  );
};
export default connect(({ Doc }) => ({
  outlineData: Doc.outlineData,
  docContentData: Doc.docContentData
}))(Form.create()(OutlineConfig));
