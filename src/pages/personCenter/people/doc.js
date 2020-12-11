import React from 'react';
import { Divider, List, Modal, message, Row, Col } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import router from 'umi/router';
import styles from './people.less';
import RestTools from '../../../utils/RestTools';

import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  RocketOutlined,
  RocketTwoTone,
} from '@ant-design/icons';

function Doc(props) {
  const { userDoc, loading, location, dispatch } = props;
  const { query } = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const { confirm } = Modal;

  //删除个人文档
  function delUserDoc(docItem) {
    confirm({
      title: '确定删除?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      onOk() {
        dispatch({
          type: 'personCenter/delUserDoc',
          payload: {
            docId: docItem.docId,
            userName: userName
          }
        }).then((res) => {
          if (res.code === 200) {
            //刷新个人文档
            getUserDoc();
            message.success('文档已删除');
          } else {
            message.error(res.msg);
          }
        });
      },
      onCancel() {}
    });
  }

  //获取个人文档
  function getUserDoc() {
    dispatch({
      type: 'personCenter/getUserDoc',
      payload: {
        operatorName: userInfo.UserName,
        pageSize: 10,
        pageStart: 1,
        userName: userName
      }
    });
  }

  //文档发布
  function documentPublish(item) {
    //判定只有文档“公开”类型下，才可进行编辑发布状态的操作
    if (!(item && item.type && item.type === '0')) {
      message.warn('当前文档未公开，无法进行发布相关操作！');
      return;
    }
    Modal.confirm({
      title: '确定发布吗?此操作将会使当前文档变得他人可见！',
      centered: true,
      onOk() {
        dispatch({
          type: 'personCenter/editUserDoc',
          payload: {
            docId: item.docId,
            isPublish: 1,
            userName: userName
          }
        }).then((res) => {
          if (res.code === 200) {
            //刷新个人文档
            getUserDoc();
            message.success('文档发布成功！');
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  }

  //撤销文档发布
  function revokeDocumentPublish(item) {
    //判定只有文档“公开”类型下，才可进行编辑发布状态的操作
    if (!(item && item.type && item.type === '0')) {
      message.warn('当前文档未公开，无法进行发布相关操作！');
      return;
    }
    Modal.confirm({
      title: '确定撤销发布吗?此操作将会使当前文档只自己可见！',
      centered: true,
      onOk() {
        dispatch({
          type: 'personCenter/editUserDoc',
          payload: {
            docId: item.docId,
            isPublish: 0,
            userName: userName
          }
        }).then((res) => {
          if (res.code === 200) {
            //刷新个人文档
            getUserDoc();
            message.success('文档已撤销发布！');
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  }

  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName
            ? '我的文档'
            : `${RestTools.formatPhoneNumber(userName)}的文档`}
          <Link
            to={`/doc/outlineConfig`}
            target="_blank"
            style={{ marginLeft: '20px', fontSize: '15px', fontWeight: 'normal' }}
          >
            新建文档
          </Link>
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={userDoc.dataList}
            pagination={{
              pageSize: userDoc.pageCount || 10,
              current: userDoc.pageNum,
              total: userDoc.total,
              onChange: (page) => {
                dispatch({
                  type: 'personCenter/getUserDoc',
                  payload: {
                    operatorName: userInfo.UserName,
                    pageSize: 10,
                    pageStart: page,
                    userName: userName
                  }
                });
              }
            }}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Row gutter={[24, 24]}>
                    <Col span={20}>
                      <Link
                        to={`/doc/outlineConfig?docId=${item.docId}`}
                        style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                      >
                        {item.docName}
                      </Link>
                    </Col>
                    <Col span={4}>
                      <div style={{ textAlign: 'right' }}>
                        {item.isPublish && item.isPublish === '1' ? (
                          <RocketTwoTone
                            twoToneColor="orange"
                            style={{ marginRight: '20px' }}
                            onClick={() => {
                              revokeDocumentPublish(item);
                            }}
                            title="已发布"
                          />
                        ) : (
                          <RocketOutlined
                            style={{ marginRight: '20px' }}
                            onClick={() => {
                              documentPublish(item);
                            }}
                            title="未发布"
                          />
                        )}

                        <EditOutlined
                          style={{ marginRight: '20px' }}
                          onClick={() => {
                            router.push(`/doc/outlineConfig?docId=${item.docId}`);
                          }}
                          title="编辑文档"
                        />
                        <DeleteOutlined
                          style={{ marginRight: '0px' }}
                          onClick={() => {
                            delUserDoc(item);
                          }}
                          title="删除文档"
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <div
                        style={{
                          color: '#B3B3B3',
                          fontSize: 14,
                          paddingTop: 0
                        }}
                      >
                        <span>创建于{item.createTime}</span>
                      </div>
                    </Col>
                  </Row>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserDoc']
  };
}

export default connect(mapStateToProps)(Doc);
