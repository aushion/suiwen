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
  Tooltip,
  Icon,
  Divider
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import router from 'umi/router';
import RestTools from '../../../utils/RestTools';
import Link from 'umi/link';
import OutlineList from './components/OutlineList';
import AddDocModel from './components/AddDocModel';
import EditDocModel from './components/EditDocModel';
import ChapterModel from './components/ChapterModel';
import NodeModel from './components/NodeModel';
import NodeQuestionModel from './components/NodeQuestionModel';
import TemplateManagementModel from './components/TemplateManagementModel';
import DownloadDocModel from './components/DownloadDocModel';
import DocTemplateSelect from './components/DocTemplateSelect';
import querystring from 'querystring';
import styles from './style.less';
import helpImg from '../../../assets/doc_help.png';
import helpCloseImg from '../../../assets/doc_help_close.png';
import helpOpenImg from '../../../assets/doc_help_open.png';
import request from '@/utils/request';

const { confirm } = Modal;
const { TreeNode } = Tree;
let timer = null;
const OutlineConfig = (props) => {
  const { docId } = querystring.parse(window.location.href.split('?')[1], '#');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const username = userInfo ? userInfo.UserName : '';
  const { dispatch } = props;
  //控制获取文档内容结果loading
  const [docContentResultLoading, setDocContentResultLoading] = useState(true);
  //提纲标题变动加载loading（控制spin组件）
  const [outlineSpinLoading, setOutlineSpinLoading] = useState(false);
  //下载文档确定按钮loading
  const [downloadDocHandleOkLoading, setDownloadDocHandleOkLoading] = useState(false);
  //发布文档按钮loading
  const [documentPublishLoading, setDocumentPublishLoading] = useState(false);
  //控制文档标题、章、节、问题模态框
  const [addDocVisible, setAddDocVisible] = useState(false);
  const [editDocVisible, setEditDocVisible] = useState(false);
  const [chapterVisible, setChapterVisible] = useState(false);
  const [nodeVisible, setNodeVisible] = useState(false);
  const [addNodeQuestionVisible, setAddNodeQuestionVisible] = useState(false);
  const [templateManagementVisible, setTemplateManagementVisible] = useState(false);
  const [downloadDocVisible, setDownloadDocVisible] = useState(false);
  const [docTemplateSelectVisible, setDocTemplateSelectVisible] = useState(false);
  //保存章标题id
  const [chapterId, setChapterId] = useState('');
  //保存选中的文档数据组
  const [docData, setDocData] = useState('');
  const [currentDocTagList, setCurrentDocTagList] = useState([]);
  //保存选中的章标题数据组
  const [chapterData, setChapterData] = useState('');
  //保存选中的节标题数据组
  const [nodeData, setNodeData] = useState('');

  const [classID, setID] = useState(true);
  const [loadFlag, setLoadFlag] = useState(0);

  //文档标签数据
  const docClassifyList = props.docClassifyData;
  //文档模版选择
  const docTemplateList = props.docTemplateData;
  const [selectedDocTemplate, setSeletedDocTemplate] = useState('');
  //新建文档类型  1:直接点击新建文档弹出的页面; 2:切换文档模板弹出的页面.
  const [newType, setNewType] = useState(0);
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
  //新建文档后是否加载内容刷新函数状态值
  const [isToCallRefreshDocContent, setIsToCallRefreshDocContent] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState('');
  //文档使用帮助文档下载按钮显示状态
  const [docHelpOpenStatus, setDocHelpOpenStatus] = useState(true);

  useEffect(() => {
    //加载文档模版数据和标签数据
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getDocTemplate();
    getDocClassify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (docId) {
      //加载该文档id下的提纲目录
      queryForRoute();
      //加载文档内容
      if (isToCallRefreshDocContent || currentTaskId === '') {
        refreshDocContent();
      } else {
        getDocContent();
      }
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
    //当dom卸载时调用，清除定时器
    return () => {
      timer && clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFlag]);

  //获取所有的文档模版
  function getDocTemplate() {
    if (!docTemplateList || (docTemplateList && docTemplateList.length === 0)) {
      props.dispatch({
        type: 'Doc/getTemplateList'
      });
    }
  }

  //获取所有的文档标签
  function getDocClassify() {
    if (!docClassifyList || (docClassifyList && docClassifyList.length === 0)) {
      props.dispatch({
        type: 'Doc/getDocClassify'
      });
    }
  }

  //获取该文档id下的提纲目录
  function queryForRoute() {
    setOutlineSpinLoading(true);
    dispatch({
      type: 'Doc/queryForRoute',
      payload: {
        docId: docId
      }
    }).then((res) => {
      if (res.code === 200) {
        setOutlineSpinLoading(false);
      } else {
        message.error(res.msg);
      }
    });
  }

  //设置定时器
  function componentDidMount(currentTaskId) {
    timer = setInterval(() => {
      getContentTaskStatus(currentTaskId);
    }, 1 * 2000);
  }

  //获取内容刷新完成状态
  function getContentTaskStatus(currentTaskId) {
    props
      .dispatch({
        type: 'Doc/getContentTaskStatus',
        payload: {
          taskId: currentTaskId
        }
      })
      .then((res) => {
        if (res.code === 200) {
          //清除定时器
          clearInterval(timer);
          setIsToCallRefreshDocContent(false);
          //跳至当前瞄点位置
          getDocContent();
        } else {
          setDocContentResultLoading(true);
        }
      });
  }

  //取设定最大值与最小值之间的随机数
  function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //新建文档触发事件
  function addNewDoc() {
    //限制如果没有登录，则不能新建文档
    if (!username) {
      message.warn('非登录状态，无法新建文档！请先登录');
      return;
    }
    //设置新建文档类型（1:直接点击新建文档弹出的页面; 2:切换文档模板弹出的页面.）
    setNewType(1);
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
    //限制如果没有登录，则不能重命名文档
    if (!username) {
      message.warn('非登录状态，无法重命名文档！请先登录');
      return;
    }

    if (!docId) {
      message.warn('当前无有效文档，无法进行重命名操作！');
      return;
    }

    let docItem = props.outlineData ? props.outlineData[0] : '';
    if (!docItem) {
      message.warn('当前无有效提纲目录信息，无法进行重命名操作！');
      return;
    }
    //获取标签字段信息，并将其从逗号分隔的字符串转换成数组结构，便于显示在前端
    let tagStr = docItem.tag;
    let tagList = [];
    //判断该字符串里是否有“,”，如果有，则代表有多个标签，如果没有，则代表标签只有一个。
    if (tagStr && tagStr.indexOf(',') !== -1) {
      tagList = tagStr.split(',');
    } else if (tagStr && tagStr.trim() !== '') {
      tagList.push(tagStr);
    }
    //将当前文档的标签数组信息存入state
    setCurrentDocTagList(tagList);
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
          let currentUrlRight = window.location.href.split('?')[1];
          if (currentUrlRight && currentUrlRight.indexOf('#') !== -1) {
            let currentAnchorPoint = currentUrlRight.split('#')[1];
            window.location.href = '#' + encodeURIComponent(currentAnchorPoint);
          }
        } else {
          message.error(res.msg);
        }
      });
  }

  //新增文档题目，取消按钮事件
  const onHandleCancelAddDoc = () => {
    setAddDocVisible(false);
    setChapterId('');
    setChapterData('');
  };
  //编辑文档题目，取消按钮事件
  const onHandleCancelDoc = () => {
    setEditDocVisible(false);
    setChapterId('');
    setChapterData('');
  };
  //新建章，取消按钮事件
  const onHandleCancelChapter = () => {
    setChapterVisible(false);
    setChapterId('');
    setChapterData('');
  };
  //新建节，取消按钮事件
  const onHandleCancelNode = () => {
    setNodeVisible(false);
    setChapterId('');
    setChapterData('');
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
    //设置提纲目录区与文档内容预览区加载动画效果
    setDocContentResultLoading(true);
    //将标签数组转换成逗号分隔的字符串
    let tag = '';
    let tagList = values.tag ? values.tag : [];
    for (var i = 0; i < tagList.length; i++) {
      tag += tagList[i];
      if (i !== tagList.length - 1) {
        tag += ',';
      }
    }

    if (values.docTemplateId !== '') {
      setIsToCallRefreshDocContent(true);
      setDocContentResultLoading(true);
    }

    //新增文档
    props
      .dispatch({
        type: 'Doc/addUserDoc',
        payload: {
          docId: docId,
          docName: values.label,
          userName: username,
          templateId: values.docTemplateId === '' ? null : values.docTemplateId,
          tag: tag,
          type: values.tag === '' ? null : values.type,
          keyWord: values.keyWord && values.keyWord.trim() !== '' ? values.keyWord : null
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
          setDocContentResultLoading(false);
        }
      });
  };

  //编辑文档题目，提交按钮事件
  const onHandleOkDoc = (values) => {
    //设置提纲目录区与文档内容预览区加载动画效果
    setDocContentResultLoading(true);
    //将标签数组转换成逗号分隔的字符串
    let tag = '';
    let tagList = values.tag ? values.tag : [];
    for (var i = 0; i < tagList.length; i++) {
      tag += tagList[i];
      if (i !== tagList.length - 1) {
        tag += ',';
      }
    }

    dispatch({
      type: 'Doc/editUserDoc',
      payload: {
        docId: docId,
        docName: values.label,
        userName: username,
        tag: tag,
        type: values.tag === '' ? null : values.type
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
      setDocContentResultLoading(false);
    });
  };

  //新建或编辑章节，提交按钮事件
  const onHandleOk = (values) => {
    //设置文档预览区loading
    setDocContentResultLoading(true);
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
        setDocContentResultLoading(false);
      } else {
        setDocContentResultLoading(false);
        message.error(res.msg);
      }
    });
  };

  //编辑文档题目
  const onEditDoc = (item) => {
    setEditDocVisible(true);
    //获取标签字段信息，并将其从逗号分隔的字符串转换成数组结构，便于显示在前端
    let tagStr = item.tag;
    let tagList = [];
    //判断该字符串里是否有“,”，如果有，则代表有多个标签，如果没有，则代表标签只有一个。
    if (tagStr && tagStr.indexOf(',') !== -1) {
      tagList = tagStr.split(',');
    } else if (tagStr && tagStr.trim() !== '') {
      tagList.push(tagStr);
    }
    //将当前文档的标签数组信息存入state
    setCurrentDocTagList(tagList);
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
    //限制如果没有登录，则不能发布文档
    if (!docId) {
      message.warn('当前无有效文档，无法下载');
      return;
    }
    setDownloadDocVisible(true);
  }

  //下载文档
  const generateDoc = (values) => {
    setDownloadDocHandleOkLoading(true);
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
      setDownloadDocHandleOkLoading(false);
      setDownloadDocVisible(false);
    });
  };

  //文档发布
  const documentPublish = () => {
    //限制如果没有登录，则不能发布文档
    if (!username) {
      message.warn('非登录状态，无法发布文档！请先登录');
      return;
    }

    if (!docId) {
      message.warn('当前无有效文档，无法进行文档发布操作！');
      return;
    }

    //获取当前文档的文档标题数据
    let docItem = props.outlineData ? props.outlineData[0] : '';
    //判定只有文档“公开”类型下，才可进行编辑发布状态的操作
    if (!(docItem && docItem.type && docItem.type === '0')) {
      message.warn(
        '当前文档未公开，无法进行发布相关操作！若确定需要发布，请先修改文档类型为公开！'
      );
      return;
    }
    Modal.confirm({
      title: '确定发布吗?此操作将会使当前文档变得他人可见',
      centered: true,
      onOk() {
        //设置文档发布loading
        setDocumentPublishLoading(true);
        props
          .dispatch({
            type: 'Doc/editUserDoc',
            payload: {
              docId: docId,
              isPublish: 1,
              userName: username
            }
          })
          .then((res) => {
            if (res.code === 200) {
              setDocumentPublishLoading(false);
              message.success('文档发布成功！');
            } else {
              setDocumentPublishLoading(false);
              message.error(res.msg);
            }
          });
      }
    });
  };

  //刷新文档内容
  const refreshDocContent = () => {
    //限制如果没有登录，则不能重命名文档
    if (!username) {
      message.warn('非登录状态，无法刷新文档内容！请先登录');
      return;
    }

    if (!docId) {
      message.warn('当前无有效文档，无法进行内容刷新操作！');
      return;
    }

    //重新拉取文档内容数据前，预先清空文档内容缓存数据
    dispatch({
      type: 'Doc/save',
      payload: {
        docContentData: []
      }
    });
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
          let currentTaskId = res.result;
          setCurrentTaskId(currentTaskId);
          props
            .dispatch({
              type: 'Doc/getContentTaskStatus',
              payload: {
                taskId: currentTaskId
              }
            })
            .then((res) => {
              if (res.code === 200) {
                setIsToCallRefreshDocContent(false);
                //跳至当前瞄点位置
                getDocContent();
              } else {
                setDocContentResultLoading(true);
                //开启定时器，轮询后去内容刷新完成状态
                componentDidMount(currentTaskId);
              }
            });
        }
      });
  };

  //为当前节标题配置问题或关键字
  function addNodeQuestion(values) {
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

  let docClassifyOptions = [];
  if (docClassifyList.length) {
    for (let i = 0; i < docClassifyList.length; i++) {
      docClassifyOptions.push(
        <Select.Option value={docClassifyList[i]['cId']} key={i}>
          {docClassifyList[i]['cName']}
        </Select.Option>
      );
    }
  }

  //文档模板选择handleOK事件
  function docTemplateSelectHandleOk(values) {
    setDocTemplateSelectVisible(false);
    //设置文档预览区loading
    setDocContentResultLoading(true);
    setOutlineSpinLoading(true);
    props
      .dispatch({
        type: 'Doc/chooseTemplateRoute',
        payload: {
          docId: docId,
          templateId: selectedDocTemplate,
          keyWord: values.keyWord
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
          if (selectedDocTemplate !== '') {
            //调用含有定时器启动的内容刷新函数
            refreshDocContent();
          } else {
            getDocContent();
          }

          message.success('文档模板应用完毕');
        } else {
          setDocContentResultLoading(false);
          message.error(res.msg);
        }
      });
  }

  //选择文档模版改变时 触发事件
  function onDocTemplateSelectChange(value) {
    //判断非登录状态
    if (!username) {
      message.warn('非登录状态，无法展开模板列表！请先登录');
      return;
    }

    setSeletedDocTemplate(value);
    if (value === '') {
      return;
    }
    //当前无文档时，切换模板，判定：走新建文档流程，不过功能框里的文档标题需要跟着主题词进行改变。
    //例如主题词输入“内燃机”，那么控制文档标题自动输入“内燃机temp16081068352777428”
    if (!docId) {
      //设置新建文档类型（1:直接点击新建文档弹出的页面; 2:切换文档模板弹出的页面.）
      setNewType(2);
      setAddDocVisible(true);
    } else {
      setDocTemplateSelectVisible(true);
    }
  }

  //文档模版选择下拉框获取焦点事件
  function docTemplateSelectOnFocus() {
    //判断非登录状态
    if (!username) {
      message.warn('非登录状态，无法展开模板列表！请先登录');
      return;
    }
  }

  //下载文档使用说明书
  // function downloadDocInstructions() {
  //   generateDocInstructions();
  // }

  //生成文档使用说明书
  // function generateDocInstructions() {
  //   var url = `${process.env.apiUrl}/file/doc/辅助文档使用说明.doc`;
  //   var filename = '辅助文档使用说明.doc';
  //   // 创建隐藏的可下载链接
  //   var eleLink = document.createElement('a');
  //   eleLink.style.display = 'none';
  //   eleLink.setAttribute('href', url);
  //   eleLink.setAttribute('download', filename);
  //   // 触发点击
  //   document.body.appendChild(eleLink);
  //   eleLink.click();
  //   // 然后移除
  //   document.body.removeChild(eleLink);
  // }

  //控制文档使用说明书下载按钮的显示与隐藏
  function docHelpOpenOrClose() {
    if (docHelpOpenStatus === true) {
      setDocHelpOpenStatus(false);
    } else {
      setDocHelpOpenStatus(true);
    }
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
      <div style={{ display: 'flex' }}>
        <div style={{ width: '95vw' }}>
          <div style={{ width: 360, float: 'left' }}>
            <div className={styles.list}>
              <div className={styles.right}>
                <div style={{ position: 'absolute', top: '14px', background: '#fff' }}>
                  <Button
                    title={username ? '新建文档' : '非登录状态下，无法新建文档'}
                    onClick={addNewDoc}
                    loading={props.loading}
                    style={{ marginLeft: 0, background: '#2ae', color: '#FFFFFF' }}
                  >
                    新建文档
                  </Button>
                  <Button
                    title={
                      username
                        ? docId
                          ? '编辑文档'
                          : '当前无有效文档，无法进行重命名操作'
                        : '非登录状态下，无法编辑文档'
                    }
                    // disabled={username && docId ? false : true}
                    onClick={renameDoc}
                    loading={props.loading}
                    style={{ marginLeft: 5, background: ' #2ae', color: '#FFFFFF' }}
                  >
                    重命名
                  </Button>
                  {username ? (
                    <Select
                      style={{ width: 190, marginLeft: 5 }}
                      value={selectedDocTemplate}
                      onSelect={(v) => onDocTemplateSelectChange(v)}
                    >
                      <Select.Option value={''}>{'文档模板选择'}</Select.Option>
                      {docTemplateOptions}
                    </Select>
                  ) : (
                    <Select
                      open={false}
                      onFocus={() => docTemplateSelectOnFocus()}
                      style={{ width: 190, marginLeft: 5 }}
                      value={''}
                      onSelect={(v) => onDocTemplateSelectChange(v)}
                    >
                      <Select.Option title="非登录状态，无法选择文档模版！请登录" value={''}>
                        {'文档模板选择'}
                      </Select.Option>
                    </Select>
                  )}
                </div>
                <div className={styles.outlineArea}>
                  <div className={styles.domain}>
                    {docId ? (
                      <Spin spinning={outlineSpinLoading} indicator={antIcon} tip="目录加载中...">
                        <Anchor
                          // affix
                          // targetOffset={50}
                          className={styles.anchor}
                          style={{ minHeight: '50vh', maxHeight: '72vh' }}
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
                      </Spin>
                    ) : (
                      <Tree disabled defaultExpandAll>
                        <TreeNode title="文档标题：XXX" key="0-0">
                          <TreeNode title="第1章：XXX" key="0-0-0">
                            <TreeNode title="第1节：XXX" key="0-0-0-0" />
                            <TreeNode title="第2节：XXX" key="0-0-0-1" />
                          </TreeNode>
                          <TreeNode title="第2章：XXX" key="0-0-1">
                            <TreeNode title="第1节：XXX" key="0-0-1-0" />
                            <TreeNode title="第2节：XXX" key="0-0-1-1" />
                            <TreeNode title="第3节：XXX" key="0-0-1-2" />
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
                  docClassifyOptions={docClassifyOptions}
                  defaultDocumentTemplate={selectedDocTemplate}
                  newType={newType}
                />
              ) : null}
              {editDocVisible ? (
                <EditDocModel
                  onHandleCancel={onHandleCancelDoc}
                  onHandleOk={onHandleOkDoc}
                  data={docData}
                  tag={currentDocTagList}
                  dispatch={dispatch}
                  loading={props.loading}
                  docId={docId}
                  modalVisible={editDocVisible}
                  docClassifyOptions={docClassifyOptions}
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
                  answerContentDataForCurrentQuestion={props.answerContentDataForCurrentQuestion}
                  dispatch={dispatch}
                  loading={props.loading}
                  chapterId={chapterId}
                  onCancle={() => {
                    setAddNodeQuestionVisible(false);
                    // queryForRoute();
                    dispatch({
                      type: 'Doc/queryForRoute',
                      payload: {
                        docId: docId
                      }
                    });
                  }}
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
                  loading={downloadDocHandleOkLoading}
                  onCancle={() => setDownloadDocVisible(false)}
                  handleOk={generateDoc}
                />
              ) : null}
              {docTemplateSelectVisible ? (
                <DocTemplateSelect
                  modalVisible={docTemplateSelectVisible}
                  // loading={downloadDocHandleOkLoading}
                  onCancle={() => setDocTemplateSelectVisible(false)}
                  handleOk={docTemplateSelectHandleOk}
                />
              ) : null}
            </div>
          </div>
          <div style={{ marginLeft: 370, minWidth: 185, position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: '-42px' }}>
              <Button
                title={'前往文库中心'}
                loading={props.loading}
                style={{ marginBottom: 10, marginRight: 5, background: ' #2ae', color: '#FFFFFF' }}
                onClick={() => {
                  // window.open(`/web/special/doc`);
                  router.push({
                    pathname: '/special/doc'
                  });
                }}
              >
                文库中心
              </Button>
              <Button
                title={
                  username
                    ? docId
                      ? '内容刷新'
                      : '当前无有效文档，无法刷新内容'
                    : '非登录状态下，无法刷新内容'
                }
                // disabled={docId ? false : true}
                onClick={refreshDocContent}
                loading={props.loading}
                style={{ marginBottom: 10, marginRight: 5, background: ' #2ae', color: '#FFFFFF' }}
              >
                内容刷新
              </Button>
              <Button
                title={
                  username
                    ? docId
                      ? '文档发布'
                      : '当前无有效文档，无法发布文档'
                    : '非登录状态下，无法发布文档'
                }
                // disabled={docId ? false : true}
                onClick={documentPublish}
                loading={documentPublishLoading}
                style={{ marginBottom: 10, marginRight: 5, background: ' #2ae', color: '#FFFFFF' }}
              >
                文档发布
              </Button>
              <Button
                title={docId ? '文档下载' : '当前无有效文档，无法下载'}
                // disabled={docId ? false : true}
                onClick={selectDocDownloadMethod}
                loading={props.loading}
                style={{ marginBottom: 10, marginRight: 5, background: '#2ae', color: '#FFFFFF' }}
              >
                文档下载
              </Button>
              <Button
                title={username ? '前往个人文档' : '非登录状态下，无法前往个人文档'}
                // disabled={username ? false : true}
                loading={props.loading}
                style={{ marginBottom: 10, background: ' #2ae', color: '#FFFFFF' }}
                onClick={() => {
                  //限制如果没有登录，则不能重命名文档
                  if (!username) {
                    message.warn('非登录状态下，无法前往个人文档！请先登录');
                    return;
                  }
                  router.push(
                    `/personCenter/people/doc?userName=${RestTools.encodeBase64(username)}`
                  );
                }}
              >
                个人文档
              </Button>
            </div>
            <div id="scrollContent" className={styles.scrollContent}>
              <Spin spinning={docContentResultLoading} tip="文档内容生成中..." size="large">
                {props.docContentData ? (
                  <>
                    <div
                      key={encodeURIComponent('docTitle' + props.docContentData.docId)}
                      id={encodeURIComponent('docTitle' + props.docContentData.docId)}
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
                          key={encodeURIComponent('chapterTitle' + chapterItem.routeId)}
                          id={encodeURIComponent('chapterTitle' + chapterItem.routeId)}
                        >
                          {chapterItem.routeName ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: '<h2 align="center">' + chapterItem.routeName + '</h2>'
                              }}
                            />
                          ) : null}
                          <List.Item>
                            {chapterItem.sectionList && chapterItem.sectionList.length > 0 ? (
                              <List
                                split={false}
                                dataSource={chapterItem.sectionList}
                                renderItem={(nodeItem) => (
                                  <div
                                    key={encodeURIComponent(
                                      'nodeTitle' + chapterItem.routeId + '' + nodeItem.routeId
                                    )}
                                    id={encodeURIComponent(
                                      'nodeTitle' + chapterItem.routeId + '' + nodeItem.routeId
                                    )}
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
                                      {nodeItem.content && nodeItem.content.length > 0 ? (
                                        <List
                                          split={false}
                                          dataSource={nodeItem.content}
                                          renderItem={(nodeContentItem) => (
                                            <div>
                                              {nodeContentItem.question &&
                                              nodeContentItem.contentList &&
                                              nodeContentItem.contentList.length > 0 ? (
                                                <div style={{ height: '5px' }}>
                                                  <Divider style={{ dashed: true }}>
                                                    <h5>{nodeContentItem.question}</h5>
                                                  </Divider>
                                                </div>
                                              ) : null}
                                              <List.Item>
                                                {nodeContentItem.contentList &&
                                                nodeContentItem.contentList.length > 0 ? (
                                                  <List
                                                    split={false}
                                                    dataSource={nodeContentItem.contentList}
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
                            ) : null}
                          </List.Item>
                        </div>
                      )}
                    />

                    {props.docContentData.literatureList &&
                    props.docContentData.literatureList.length > 0 ? (
                      <div>
                        <div
                          key={'docLiteratureTitle' + props.docContentData.literatureName}
                          id={'docLiteratureTitle' + props.docContentData.literatureName}
                          dangerouslySetInnerHTML={{
                            __html:
                              '<h2 align="center">' + props.docContentData.literatureName + '</h2>'
                          }}
                        />
                        <List
                          split={false}
                          itemLayout="horizontal"
                          dataSource={props.docContentData.literatureList}
                          renderItem={(literatureItem, i) => (
                            <List.Item>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    '<p style="text-indent:2em">' +
                                    '<a style="color:#000000" target="_blank" rel="noopener noreferrer" href=http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=' +
                                    literatureItem.resourceId +
                                    '>' +
                                    '[' +
                                    ++i +
                                    '] ' +
                                    literatureItem.resource +
                                    '</a>' +
                                    '</p>'
                                }}
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    ) : null}
                  </>
                ) : null}
              </Spin>
            </div>
          </div>
        </div>
        {docHelpOpenStatus === true ? (
          <div style={{ width: '5vw', textAlign: 'center', marginTop: '25vh' }}>
            <div style={{ display: 'flex' }}>
              <div
                onClick={() => {
                  docHelpOpenOrClose();
                }}
              >
                <img
                  title={'收起'}
                  style={{ marginTop: '15px', marginLeft: '25px', cursor: 'pointer' }}
                  src={helpCloseImg}
                  alt="收起"
                />
              </div>
              <Link to={`/docHelp`} target="_blank">
                <div className={styles.dochelp}>
                  <img src={helpImg} alt="帮助" />
                  <div className={styles.buttonTxt}>帮助</div>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ width: '5vw', textAlign: 'right', marginTop: '25vh' }}>
            <div style={{ display: 'flex', float: 'right' }}>
              <div
                onClick={() => {
                  docHelpOpenOrClose();
                }}
              >
                <img
                  title={'展开'}
                  style={{ marginTop: '15px', cursor: 'pointer' }}
                  src={helpOpenImg}
                  alt="展开"
                />
              </div>
              <div className={styles.dochelpClose}>
                <img src={helpImg} alt="帮助" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
export default connect(({ Doc }) => ({
  outlineData: Doc.outlineData,
  docContentData: Doc.docContentData,
  docTemplateData: Doc.docTemplateData,
  docClassifyData: Doc.docClassifyData,
  answerContentDataForCurrentQuestion: Doc.answerContentDataForCurrentQuestion
}))(Form.create()(OutlineConfig));
