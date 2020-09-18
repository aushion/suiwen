import React, { useEffect, useState } from 'react';
import { Icon, Badge, Popover, Tabs, Tooltip, Modal, Avatar } from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { connect } from 'dva';
import { Link } from 'umi';

import {
  getUnReadNotification,
  getUnReadCount,
  getCommentNotify,
  getLikeNotify,
  getAnswerNotify
} from '../../services/message';
import MessageList from './components/MessageList';
import RestTools from '../../utils/RestTools';

const { TabPane } = Tabs;
function MessageBox(props) {
  const { userName, messageCount, dispatch } = props;
  const [notifyList, setNotifyList] = useState([]); //列表数据
  const [visible, setVisible] = useState(false); //是否弹出消息层
  const [tabKey, setTabKey] = useState('3'); //消息tabs默认的key
  const [loading, setLoading] = useState(false); //数据list的loading状态

  const [modalVisible, setModalVisible] = useState(false);
  const [messageDetail, setMessageDetail] = useState(null);

  function hidePopover() {
    setVisible(false);
  }

  //查看所有通知
  const ViewAll = ({ to }) => {
    return (
      <Link onClick={hidePopover} style={{ color: '#999' }} to={to}>
        查看所有通知
      </Link>
    );
  };

  function getMessageDetail(item, content) {
    // dispatch({
    //   type: 'global/save',
    //   payload: {
    //     messageCount: messageCount - 1
    //   }
    // });
    const { action } = item;
    if (action === 1) {
      getCommentNotify({
        date: item.createDate,
        entityId: item.groupId,
        entityType: item.entityType,
        hasRead: 0,
        operator: userName,
        pageSize: 10,
        pageStart: 1,
        toUser: item.toId
      }).then((res) => {
        if (res.data.code === 200) {
          setMessageDetail({ title: content, ...res.data.result });
          hidePopover();
          setModalVisible(true);
          fetchMessageCount();
        }
      });
    } else if (action === 0) {
      getLikeNotify({
        date: item.createDate,
        entityId: item.groupId,
        entityType: item.entityType,
        hasRead: 0,
        operator: userName,
        pageSize: 10,
        pageStart: 1,
        toUser: item.toId
      }).then((res) => {
        if (res.data.code === 200) {
          setMessageDetail({ title: content, ...res.data.result });
          hidePopover();
          setModalVisible(true);
          fetchMessageCount();
        }
      });
    } else if (action === 3) {
      getAnswerNotify({
        date: item.createDate,
        entityId: item.groupId,
        entityType: item.entityType,
        hasRead: item.hasRead,
        operatorName: userName,
        pageSize: 10,
        pageStart: 1,
        toUser: item.toId
      }).then((res) => {
        if (res.data.code === 200) {
          setMessageDetail({ title: content, ...res.data.result });
          hidePopover();
          setModalVisible(true);
          fetchMessageCount();
        }
      });
    }
  }

  function fetchMessageCount() {
    getUnReadCount({ userName }).then((res) => {
      if (res.data.code === 200) {
        // setCount(res.data.result);
        dispatch({
          type: 'global/save',
          payload: {
            messageCount: res.data.result
          }
        });
      }
    });
  }

  function handleChange(activeKey) {
    setTabKey(activeKey);
    setNotifyList([]);
  }

  function fetchData(pageStart = 1) {
    setLoading(true);
    getUnReadNotification({
      pageSize: 10,
      pageStart,
      type: tabKey,
      userName
    })
      .then((res) => {
        setLoading(false);
        if (res.data.code === 200) {
          const { dataList } = res.data.result;
          setNotifyList(notifyList.concat(dataList));
        }
      })
      .then((err) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const sock = new SockJS(`http://192.168.103.25:8080/sw.test.api/im/conn?uid=${userName}`);
    const stompClient = Stomp.over(sock);
    // 创建连接
    stompClient.connect({}, function() {
      //订阅消息
      stompClient.subscribe(`/user/${userName}/msg`, function(data) {
        const res = JSON.parse(data.body);
        if (res.action) {
          dispatch({
            type: 'global/save',
            payload: {
              messageCount: messageCount + 1
            }
          });
          // setTabKey(res.action);
        }
      });
    });
  }, [dispatch, messageCount, userName]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  useEffect(() => {
    fetchMessageCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = (
    <Tabs activeKey={tabKey} animated={false} size="small" onChange={handleChange}>
      <TabPane
        tab={
          <Tooltip title="通知消息">
            <Icon type="bars" />
          </Tooltip>
        }
        key="3"
      >
        <MessageList
          data={notifyList}
          userName={userName}
          showLoading={loading}
          type="3"
          onContentClick={getMessageDetail}
        />
        <ViewAll to={`/notify?type=3`} />
      </TabPane>
      <TabPane
        tab={
          <Tooltip title="评论相关">
            <Icon type="message" theme="filled" />
          </Tooltip>
        }
        key="1"
      >
        <MessageList
          data={notifyList}
          userName={userName}
          showLoading={loading}
          type="1"
          onContentClick={getMessageDetail}
        />
        <ViewAll to={`/notify?type=1`} />
      </TabPane>
      <TabPane
        tab={
          <Tooltip title="关注消息">
            <Icon type="contacts" theme="filled" />
          </Tooltip>
        }
        key="2"
      >
        <MessageList
          data={notifyList}
          userName={userName}
          showLoading={loading}
          type="2"
          onContentClick={getMessageDetail}
        />
        <ViewAll to={`/notify?type=2`} />
      </TabPane>
      <TabPane
        tab={
          <Tooltip title="点赞消息">
            <Icon type="heart" theme="filled" />
          </Tooltip>
        }
        key="0"
      >
        <MessageList
          data={notifyList}
          userName={userName}
          showLoading={loading}
          type="0"
          onContentClick={getMessageDetail}
        />
        <ViewAll to={`/notify?type=0`} />
      </TabPane>
    </Tabs>
  );

  const CommentPop = ({ messageDetail }) => (
    <div>
      <div>
        <Avatar
          src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${messageDetail?.answer?.dataList?.userName}`}
        />
        <span>{RestTools.formatPhoneNumber(messageDetail?.answer?.dataList?.userName)}</span>
        <div
          style={{ padding: '4px 20px' }}
          dangerouslySetInnerHTML={{ __html: messageDetail?.answer?.dataList.answer }}
        />
      </div>

      <div style={{ background: '#eee', padding: '4px', marginLeft: 20 }}>
        {messageDetail?.answer?.dataList?.comment?.dataList.map((item) => {
          return (
            <div key={item.commentId}>
              <Avatar
                size="small"
                src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
              />
              <span>{RestTools.formatPhoneNumber(item.userName)}</span>
              <div style={{ padding: '4px 20px' }}>{item.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const LikePop = ({ messageDetail }) => (
    <div>
      <Avatar
        src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${messageDetail?.userName}`}
      />
      <span>{RestTools.formatPhoneNumber(messageDetail?.userName)}</span>
      <div style={{ background: '#eee', padding: '4px 10px' }}>
        <div
          style={{ fontWeight: 'bold', padding: '4px 0' }}
          dangerouslySetInnerHTML={{ __html: messageDetail?.answer || messageDetail?.content }}
        />
        <div style={{ color: '#aaa' }}>
          <Icon type="like" theme="filled" />
          {messageDetail?.likedCount || messageDetail?.likeCount}
        </div>
      </div>
    </div>
  );

  const AnswerPop = ({ messageDetail }) => (
    <div>
      <div>
        <Avatar
          src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${messageDetail?.answer.dataList[0].userName}`}
        />
        <span>{RestTools.formatPhoneNumber(messageDetail?.answer.dataList[0].userName)}</span>

        <div
          style={{ background: '#eee', padding: '4px 20px', fontWeight: 'bold' }}
          dangerouslySetInnerHTML={{ __html: messageDetail?.answer.dataList[0].answer }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Popover
        placement="bottom"
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={(visible) => {
          setVisible(visible);
        }}
      >
        <Badge count={messageCount}>
          <Icon style={{ fontSize: 20 }} type="bell" theme="filled" />
        </Badge>
      </Popover>

      <Modal
        footer={null}
        visible={modalVisible}
        title={messageDetail?.title}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        {tabKey === '0' ? <LikePop messageDetail={messageDetail}></LikePop> : null}
        {tabKey === '1' ? <CommentPop messageDetail={messageDetail}></CommentPop> : null}
        {tabKey === '3' ? <AnswerPop messageDetail={messageDetail} /> : null}
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.global
  };
}

export default connect(mapStateToProps)(MessageBox);
