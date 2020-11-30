import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Modal,
  Card,
  Form,
  Col,
  Row,
  Spin,
  List,
  Anchor,
  Tree,
  Select,
  Tooltip
} from 'antd';
import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
import RestTools from '../../../utils/RestTools';

import OutlineList from './components/OutlineList';
import AddDocModel from './components/AddDocModel';
import EditDocModel from './components/EditDocModel';
import ChapterModel from './components/ChapterModel';
import NodeModel from './components/NodeModel';
import NodeQuestionModel from './components/NodeQuestionModel';
import TemplateManagementModel from './components/TemplateManagementModel';
import DownloadDocModel from './components/DownloadDocModel';
import querystring from 'querystring';
import styles from './style.less';

import request from '@/utils/request';

const { confirm } = Modal;
const { TreeNode } = Tree;
const OutlineConfig = (props) => {
  const { docId } = querystring.parse(window.location.href.split('?')[1], '#');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const username = userInfo ? userInfo.UserName : '';
  const { dispatch } = props;
  //控制获取文档内容结果loading
  const [docContentResultLoading, setDocContentResultLoading] = useState(true);
  //控制文档标题、章、节、问题模态框
  const [addDocVisible, setAddDocVisible] = useState(false);
  const [editDocVisible, setEditDocVisible] = useState(false);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [nodeVisible, setNodeVisible] = useState(false);
  const [addNodeQuestionVisible, setAddNodeQuestionVisible] = useState(false);
  const [templateManagementVisible, setTemplateManagementVisible] = useState(false);
  const [downloadDocVisible, setDownloadDocVisible] = useState(false);
  //保存章标题id
  const [chapterId, setChapterId] = useState('');
  //保存选中的文档数据组
  const [docData, setDocData] = useState('');
  //保存选中的章标题数据组
  const [chapterData, setChapterData] = useState('');
  //保存选中的节标题数据组
  const [nodeData, setNodeData] = useState('');

  const [classID, setID] = useState(true);
  const [loadFlag, setLoadFlag] = useState(0);

  //文档模版选择
  const docTemplateList = props.docTemplateData;
  const [selectedDocTemplate, setSeletedDocTemplate] = useState('');

  useEffect(() => {
    //加载文档模版数据
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getDocTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (docId) {
      //加载该文档id下的提纲目录
      queryForRoute();
      //加载文档内容
      getDocContent();
      setID(docId);
    } else {
      //不加载文档内容
      setDocData('');
      setChapterId('');
      setChapterData('');
      setNodeData('');
      dispatch({
        type: 'Doc/save',
        payload: {
          docContentData: []
        }
      });
      setDocContentResultLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFlag]);

  //获取所有的文档模版
  function getDocTemplate() {
    props.dispatch({
      type: 'Doc/getTemplateList'
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

  //取设定最大值与最小值之间的随机数
  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //新建文档触发事件
  function addNewDoc() {
    if (docId) {
      Modal.confirm({
        title:
          '当前文档已实时保存到"个人中心-文档"里，新建文档操作最终跳转新的文档界面，确定继续执行新建操作？',
        centered: true,
        onOk() {
          setAddDocVisible(true);
        }
      });
    } else {
      setAddDocVisible(true);
    }
  }

  //重命名文档标题
  function renameDoc() {
    let docItem = props.outlineData ? props.outlineData[0] : '';
    onEditDoc(docItem);
  }

  //获取该文档id下的文档内容
  function getDocContent() {
    props
      .dispatch({
        type: 'Doc/getDocContent',
        payload: {
          docId: docId
        }
      })
      .then((res) => {
        if (res.code === 200) {
          setDocContentResultLoading(false);
        } else {
          message.error(res.msg);
        }
      });
  }

  //获取该文档id下的文档内容
  // function getDocContentByDocId() {
  //   props
  //     .dispatch({
  //       type: 'Doc/refreshDocContent',
  //       payload: {
  //         docId: docId
  //       }
  //     })
  //     .then((res) => {
  //       if (res.code === 200) {
  //         setDocContentResultLoading(false);
  //       } else {
  //         message.error(res.msg);
  //       }
  //     });
  // }

  //新增文档题目，取消按钮事件
  const onHandleCancelAddDoc = () => {
    setAddDocVisible(false);
  };
  //编辑文档题目，取消按钮事件
  const onHandleCancelDoc = () => {
    setEditDocVisible(false);
  };
  //新建章，取消按钮事件
  const onHandleCancelChapter = () => {
    setChapterVisible(false);
  };
  //新建节，取消按钮事件
  const onHandleCancelNode = () => {
    setNodeVisible(false);
  };

  //新增文档题目，提交按钮事件
  const onHandleOkAddDoc = (values) => {
    var timestamp = new Date().getTime();
    let docId = 10000 * timestamp + random(1000, 9999);
    //初始化一个个人文档
    const loginUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (loginUser === null) {
      message.warn('请您登录后再操作');
      return;
    }
    //新增文档
    props
      .dispatch({
        type: 'Doc/addUserDoc',
        payload: {
          docId: docId,
          docName: values.label,
          userName: username,
          templateId: values.docTemplateId
        }
      })
      .then((res) => {
        if (res.code === 200) {
          setAddDocVisible(false);
          //清除文档标题、章标题、节标题、章标题id
          setDocData('');
          setChapterData('');
          setNodeData('');
          setChapterId('');
          message.success('新增文档标题成功');
          //跳转刚才新创建的文档
          router.push({
            pathname: '/doc/outlineConfig',
            query: {
              docId: docId
            }
          });
          setLoadFlag(docId);
        } else {
          message.error(res.msg);
        }
      });
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
      if (res.code === 200) {
        setEditDocVisible(false);
        //重新加载提纲数据，展示最新目录
        queryForRoute();
        //清除文档标题、章标题、节标题、章标题id
        setDocData('');
        setChapterData('');
        setNodeData('');
        setChapterId('');
        //刷新文章内容
        getDocContent();
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
      if (res.code === 200) {
        if (values.parentId === '0') {
          setChapterVisible(false);
          if (values.routeId === undefined) {
            message.success('新建章标题成功');
            //刷新文档预览区
            getDocContent();
          } else {
            message.success('编辑章标题成功');
            //刷新文档预览区
            getDocContent();
          }
        } else {
          setNodeVisible(false);
          if (values.routeId === undefined) {
            message.success('新建节标题成功');
            //刷新文档预览区
            getDocContent();
          } else {
            message.success('编辑节标题成功');
            //刷新文档预览区
            getDocContent();
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
    setEditDocVisible(true);
    setDocData(item);
  };

  //删除个人文档
  function onDocDelete(docItem) {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk() {
        dispatch({
          type: 'Doc/delUserDoc',
          payload: {
            docId: docItem.id,
            userName: username
          }
        }).then((res) => {
          if (res.code === 200) {
            //重新加载提纲数据，展示最新目录
            queryForRoute();
            getDocContent();
            //清除章标题、节标题、章标题id
            setChapterData('');
            setNodeData('');
            setChapterId('');
            setSeletedDocTemplate('');
            message.success('文档已删除');
            //跳转空白文档
            router.push({
              pathname: '/doc/outlineConfig'
            });
            var timestamp = new Date().getTime();
            let docId = 10000 * timestamp + random(1000, 9999);
            setLoadFlag(docId);
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {}
    });
  }

  //编辑章标题
  const onEditChapter = (item) => {
    setChapterVisible(true);
    setChapterData(item);
  };

  //删除章标题
  const onDeleteChapter = (item) => {
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
            getDocContent();
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

  //选择文档下载方式
  function selectDocDownloadMethod() {
    setDownloadDocVisible(true);
  }

  //下载文档
  const generateDoc = (values) => {
    const form = new FormData();
    // 文件对象
    form.append('docId', docId);
    form.append('isResource', values.isResource);
    request({
      url: '/doc/generateDoc',
      responseType: 'blob',
      method: 'post',
      data: form
    }).then((res) => {
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
      //文档下载方式选择框设置消失
      setDownloadDocVisible(false);
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
        if (res.code === 200) {
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
        if (res.code === 200) {
          message.success(res.msg);
          setAddNodeQuestionVisible(false);
          queryForRoute();
        } else {
          message.error(res.msg);
        }
      });
  }

  //滚动条初始化方法
  // function handleInfiniteOnLoad() {}

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
            getDocContent();
            message.success('片段已删除');
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {}
    });
  }

  let docTemplateOptions = [];
  if (docTemplateList.length) {
    for (let i = 0; i < docTemplateList.length; i++) {
      let docTemplateSigData = docTemplateList[i]['routeTemplate'];
      docTemplateOptions.push(
        <Select.Option value={docTemplateList[i]['id']} key={i}>
          <Tooltip
            placement="leftTop"
            title={
              <div>
                {docTemplateSigData.map((docItem, docIndex) => {
                  return (
                    <div key={docIndex}>
                      <div
                        title={docItem.label}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '170px',
                          // padding: '10px',
                          alignItems: 'center'
                        }}
                      >
                        {docItem.label}
                      </div>

                      {docItem.children &&
                        (docItem.flag === false
                          ? null
                          : docItem.children.map((chapterItem, chapterIndex) => {
                              return (
                                <div key={chapterIndex}>
                                  <div
                                    title={chapterItem.label}
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      width: '170px',
                                      marginLeft: '20px',
                                      alignItems: 'center'
                                    }}
                                  >
                                    {chapterItem.label}
                                  </div>

                                  {chapterItem.children &&
                                    (chapterItem.flag === false
                                      ? null
                                      : chapterItem.children.map((nodeItem, nodeIndex) => {
                                          return (
                                            <div key={nodeIndex}>
                                              <div
                                                title={nodeItem.label}
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  width: '170px',
                                                  marginLeft: '40px',
                                                  alignItems: 'center'
                                                }}
                                              >
                                                {nodeItem.label}
                                              </div>
                                            </div>
                                          );
                                        }))}
                                </div>
                              );
                            }))}
                    </div>
                  );
                })}
              </div>
            }
          >
            {docTemplateList[i]['name']}
          </Tooltip>
        </Select.Option>
      );
    }
  }

  //选择文档模版改变时 触发事件
  function onDocTemplateSelectChange(value) {
    setSeletedDocTemplate(value);
    if (value === '') {
      return;
    }

    Modal.confirm({
      title: '确定应用此文档模板吗?此操作将会使之前编辑的提纲内容被覆盖掉！',
      centered: true,
      onOk() {
        props
          .dispatch({
            type: 'Doc/chooseTemplateRoute',
            payload: {
              docId: docId,
              templateId: value
            }
          })
          .then((res) => {
            if (res.code === 200) {
              //清除文档标题、章标题、节标题、章标题id
              setDocData('');
              setChapterData('');
              setNodeData('');
              setChapterId('');
              queryForRoute();
              getDocContent();
              message.success('文档模板应用完毕');
            } else {
              message.error(res.msg);
            }
          });
      }
    });
  }

  return (
    <Card>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ marginLeft: 10, border: '0px', visibility: 'hidden' }}
          icon={'rollback'}
          title="返回到上一个页面"
          onClick={() => {
            router.goBack();
          }}
        ></Button>
      </div>
      <div style={{ paddingRight: '10%' }}>
        <div style={{ width: 350, float: 'left' }}>
          <div className={styles.list}>
            <div className={styles.right}>
              <div style={{ background: '#fff' }}>
                <Button
                  onClick={addNewDoc}
                  loading={props.loading}
                  style={{ marginLeft: 10, background: '#2ae', color: '#FFFFFF' }}
                >
                  新建文档
                </Button>
                <Button
                  disabled={docId ? false : true}
                  onClick={renameDoc}
                  loading={props.loading}
                  style={{ marginLeft: 10, background: ' #2ae', color: '#FFFFFF' }}
                >
                  重命名
                </Button>
                <Select
                  disabled={docId ? false : true}
                  style={{ width: 120, marginLeft: 10 }}
                  value={selectedDocTemplate}
                  onChange={(v) => onDocTemplateSelectChange(v)}
                >
                  <Select.Option value={''}>{'模板选择'}</Select.Option>
                  {docTemplateOptions}
                </Select>
                <SettingOutlined
                  disabled={docId ? false : true}
                  style={{ width: 5, marginLeft: 5, visibility: 'hidden' }}
                  onClick={() => {
                    setTemplateManagementVisible(true);
                  }}
                  title="模板管理"
                />
              </div>
              <div className={styles.outlineArea}>
                <div className={styles.domain}>
                  {docId ? (
                    <Anchor
                      // affix
                      // targetOffset={50}
                      className={styles.anchor}
                      style={{ maxHeight: '72vh' }}
                      getContainer={() => document.getElementById('scrollContent')}
                    >
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
                        onDocDelete={onDocDelete}
                      />
                    </Anchor>
                  ) : (
                    <Tree disabled defaultExpandAll>
                      <TreeNode title="文档标题：XXX" key="0-0">
                        <TreeNode title="第一章：XXX" key="0-0-0">
                          <TreeNode title="第一节：XXX" key="0-0-0-0" />
                          <TreeNode title="第二节：XXX" key="0-0-0-1" />
                        </TreeNode>
                        <TreeNode title="第二章：XXX" key="0-0-1">
                          <TreeNode title="第一节：XXX" key="0-0-1-0" />
                          <TreeNode title="第二节：XXX" key="0-0-1-1" />
                          <TreeNode title="第三节：XXX" key="0-0-1-2" />
                        </TreeNode>
                      </TreeNode>
                    </Tree>
                  )}
                </div>
              </div>
            </div>
            {addDocVisible ? (
              <AddDocModel
                onHandleCancel={onHandleCancelAddDoc}
                onHandleOk={onHandleOkAddDoc}
                modalVisible={addDocVisible}
                dispatch={dispatch}
                loading={props.loading}
                docTemplateOptions={docTemplateOptions}
                // onTemplateSelectChange={onTemplateSelectChange}
              />
            ) : null}
            {editDocVisible ? (
              <EditDocModel
                onHandleCancel={onHandleCancelDoc}
                onHandleOk={onHandleOkDoc}
                data={docData}
                dispatch={dispatch}
                loading={props.loading}
                docId={docId}
                modalVisible={editDocVisible}
              />
            ) : null}
            {chapterVisible ? (
              <ChapterModel
                onHandleCancel={onHandleCancelChapter}
                onHandleOk={onHandleOk}
                data={chapterData}
                dispatch={dispatch}
                loading={props.loading}
                modalVisible={chapterVisible}
              />
            ) : null}
            {nodeVisible ? (
              <NodeModel
                onHandleCancel={onHandleCancelNode}
                onHandleOk={onHandleOk}
                data={nodeData}
                dispatch={dispatch}
                loading={props.loading}
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
            {templateManagementVisible ? (
              <TemplateManagementModel
                modalVisible={templateManagementVisible}
                dispatch={dispatch}
                loading={props.loading}
                onCancle={() => setTemplateManagementVisible(false)}
                handleOk={() => setTemplateManagementVisible(false)}
              />
            ) : null}
            {downloadDocVisible ? (
              <DownloadDocModel
                modalVisible={downloadDocVisible}
                onCancle={() => setDownloadDocVisible(false)}
                handleOk={generateDoc}
              />
            ) : null}
          </div>
        </div>
        <div style={{ marginLeft: 350 }}>
          <Spin spinning={docContentResultLoading}>
            {/* <div id="scrollContent" style={{ height: 800,overflowY: 'auto' }}> */}

            <div id="scrollContent" className={styles.scrollContent}>
              <div style={{ position: 'absolute', right: 0, top: '-42px' }}>
                <Button
                  disabled={docId ? false : true}
                  onClick={selectDocDownloadMethod}
                  loading={props.loading}
                  style={{ marginBottom: 10, background: '#2ae', color: '#FFFFFF' }}
                >
                  文档下载
                </Button>
                <Button
                  disabled={docId ? false : true}
                  onClick={refreshDocContent}
                  loading={props.loading}
                  style={{ marginBottom: 10, background: ' #2ae', color: '#FFFFFF' }}
                >
                  内容刷新
                </Button>
              </div>

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
                        {chapterItem.routeName ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: '<h2 align="center">' + chapterItem.routeName + '</h2>'
                            }}
                          />
                        ) : null}
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
                                  {nodeItem.routeName ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          '<h3 >&nbsp;&nbsp;&nbsp;&nbsp;' +
                                          nodeItem.routeName +
                                          '</h3>'
                                      }}
                                    />
                                  ) : null}
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
                                                    style={{
                                                      border: '0px',
                                                      color: ' #FF0000   '
                                                    }}
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
            </div>
          </Spin>
        </div>
      </div>
      {/* <Row gutter={48}>
        <Col span={4} style={{ minWidth: 380 }}>
          <div className={styles.list}>
            <div className={styles.right}>
              <div style={{ position: 'absolute', top: '-42px', background: '#fff' }}>
                <Button
                  onClick={addNewDoc}
                  loading={props.loading}
                  style={{ marginLeft: 10, background: '#2ae', color: '#FFFFFF' }}
                >
                  新建文档
                </Button>
                <Button
                  disabled={docId ? false : true}
                  onClick={renameDoc}
                  loading={props.loading}
                  style={{ marginLeft: 10, background: ' #2ae', color: '#FFFFFF' }}
                >
                  重命名
                </Button>
                <Select
                  disabled={docId ? false : true}
                  style={{ width: 120, marginLeft: 10 }}
                  value={selectedDocTemplate}
                  onChange={(v) => onDocTemplateSelectChange(v)}
                >
                  <Select.Option value={''}>{'模板选择'}</Select.Option>
                  {docTemplateOptions}
                </Select>
                <SettingOutlined
                  disabled={docId ? false : true}
                  style={{ width: 5, marginLeft: 5, visibility: 'hidden' }}
                  onClick={() => {
                    setTemplateManagementVisible(true);
                  }}
                  title="模板管理"
                />
              </div>
              <div className={styles.outlineArea}>
                <div className={styles.domain}>
                  {docId ? (
                    <Anchor
                      // affix
                      // targetOffset={50}
                      className={styles.anchor}
                      style={{ maxHeight: '72vh' }}
                      getContainer={() => document.getElementById('scrollContent')}
                    >
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
                        onDocDelete={onDocDelete}
                      />
                    </Anchor>
                  ) : (
                    <Tree disabled defaultExpandAll>
                      <TreeNode title="文档标题：XXX" key="0-0">
                        <TreeNode title="第一章：XXX" key="0-0-0">
                          <TreeNode title="第一节：XXX" key="0-0-0-0" />
                          <TreeNode title="第二节：XXX" key="0-0-0-1" />
                        </TreeNode>
                        <TreeNode title="第二章：XXX" key="0-0-1">
                          <TreeNode title="第一节：XXX" key="0-0-1-0" />
                          <TreeNode title="第二节：XXX" key="0-0-1-1" />
                          <TreeNode title="第三节：XXX" key="0-0-1-2" />
                        </TreeNode>
                      </TreeNode>
                    </Tree>
                  )}
                </div>
              </div>
            </div>
            {addDocVisible ? (
              <AddDocModel
                onHandleCancel={onHandleCancelAddDoc}
                onHandleOk={onHandleOkAddDoc}
                modalVisible={addDocVisible}
                dispatch={dispatch}
                loading={props.loading}
                docTemplateOptions={docTemplateOptions}
                // onTemplateSelectChange={onTemplateSelectChange}
              />
            ) : null}
            {editDocVisible ? (
              <EditDocModel
                onHandleCancel={onHandleCancelDoc}
                onHandleOk={onHandleOkDoc}
                data={docData}
                dispatch={dispatch}
                loading={props.loading}
                docId={docId}
                modalVisible={editDocVisible}
              />
            ) : null}
            {chapterVisible ? (
              <ChapterModel
                onHandleCancel={onHandleCancelChapter}
                onHandleOk={onHandleOk}
                data={chapterData}
                dispatch={dispatch}
                loading={props.loading}
                modalVisible={chapterVisible}
              />
            ) : null}
            {nodeVisible ? (
              <NodeModel
                onHandleCancel={onHandleCancelNode}
                onHandleOk={onHandleOk}
                data={nodeData}
                dispatch={dispatch}
                loading={props.loading}
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
            {templateManagementVisible ? (
              <TemplateManagementModel
                modalVisible={templateManagementVisible}
                dispatch={dispatch}
                loading={props.loading}
                onCancle={() => setTemplateManagementVisible(false)}
                handleOk={() => setTemplateManagementVisible(false)}
              />
            ) : null}
            {downloadDocVisible ? (
              <DownloadDocModel
                modalVisible={downloadDocVisible}
                onCancle={() => setDownloadDocVisible(false)}
                handleOk={generateDoc}
              />
            ) : null}
          </div>
        </Col>

        <Col span={16}>
          <Spin spinning={docContentResultLoading}>
         

            <div id="scrollContent" className={styles.scrollContent}>
              <div style={{ position: 'absolute', right: 0, top: '-42px' }}>
                <Button
                  disabled={docId ? false : true}
                  onClick={selectDocDownloadMethod}
                  loading={props.loading}
                  style={{ marginBottom: 10, background: '#2ae', color: '#FFFFFF' }}
                >
                  文档下载
                </Button>
                <Button
                  disabled={docId ? false : true}
                  onClick={refreshDocContent}
                  loading={props.loading}
                  style={{ marginBottom: 10, background: ' #2ae', color: '#FFFFFF' }}
                >
                  内容刷新
                </Button>
              </div>

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
                        {chapterItem.routeName ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: '<h2 align="center">' + chapterItem.routeName + '</h2>'
                            }}
                          />
                        ) : null}
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
                                  {nodeItem.routeName ? (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          '<h3 >&nbsp;&nbsp;&nbsp;&nbsp;' +
                                          nodeItem.routeName +
                                          '</h3>'
                                      }}
                                    />
                                  ) : null}
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
                                                    style={{
                                                      border: '0px',
                                                      color: ' #FF0000   '
                                                    }}
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
            </div>
          </Spin>
        </Col>
      </Row> */}
    </Card>
  );
};
export default connect(({ Doc }) => ({
  outlineData: Doc.outlineData,
  docContentData: Doc.docContentData,
  docTemplateData: Doc.docTemplateData
}))(Form.create()(OutlineConfig));
