import React, { useEffect, useState } from 'react';
import { Icon, Badge, Popover, Tabs, List, Spin, Tooltip, Modal } from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'dva';
import { Link } from 'umi';
import { getUnReadNotification, getUnReadCount, getCommentNotify } from '../../services/message';
import RestTools from '../../utils/RestTools';

const { TabPane } = Tabs;
function MessageBox(props) {
  const { userName, messageCount, dispatch } = props;
  const [notifyList, setNotifyList] = useState([]); //列表数据
  const [visible, setVisible] = useState(false); //是否弹出消息层
  const [tabKey, setTabKey] = useState('3'); //消息tabs默认的key
  const [loading, setLoading] = useState(false); //数据list的loading状态
  const [hasMore, setHasMore] = useState(false); //加载更多状态
  const [pageInfo, setPageInfo] = useState(null); //初始分页信息
  const [modalVisible, setModalVisible] = useState(false);

  function hidePopover() {
    setVisible(false);
  }
  //连接组件
  const LinkElement = ({ to, content }) => {
    return (
      <Link style={{ padding: '0 10px' }} to={to} onClick={hidePopover}>
        {content}
      </Link>
    );
  };

  //查看所有通知
  const ViewAll = ({ to }) => {
    return (
      <Link onClick={hidePopover} style={{ color: '#999' }} to={to}>
        查看所有通知
      </Link>
    );
  };

  function getMessageDetail(item) {
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
        console.log('res', res);
      });
    }
  }

  //消息列表组件
  const MessageList = ({ data, type }) => {
    return (
      <div style={{ height: 300, overflowY: 'auto' }}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            fetchData(pageInfo.pageNum + 1);
          }}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List
            loading={loading}
            style={{ width: 300 }}
            dataSource={data}
            renderItem={(item) => {
              const sentence = {
                '00': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    喜欢了你的回答
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                ),
                '04': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    赞了你的评论
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                ),
                '05': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    赞了你的回复
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                ),
                '14': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    评论你的回答
                    <span onClick={getMessageDetail.bind(this,item)}>{item.content}</span>
                  </span>
                ),
                '15': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    回复了你在
                    <span  onClick={getMessageDetail.bind(this,item)}>{item.content}</span>
                    中的评论
                  </span>
                ),
                '22': (
                  <span>
                    <>
                      {item.fromId.split(',').map((item) => (
                        <LinkElement
                          key={item}
                          to={`/personCenter/people/ask?userName=${item}`}
                          content={RestTools.formatPhoneNumber(item)}
                        />
                      ))}
                    </>
                    关注了你
                  </span>
                ),
                '21': (
                  <span>
                    <>
                      {item.fromId.split(',').map((item) => (
                        <LinkElement
                          key={item}
                          to={`/personCenter/people/ask?userName=${item}`}
                          content={RestTools.formatPhoneNumber(item)}
                        />
                      ))}
                    </>
                    关注了你的问题
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                ),
                '31': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    回答了问题
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                ),
                '33': (
                  <span>
                    <LinkElement
                      to={`/personCenter/people/ask?userName=${item.fromId}`}
                      content={RestTools.formatPhoneNumber(item.fromId)}
                    />
                    回答了你关注的问题
                    <LinkElement
                      to={`/reply?q=${item.content}&QID=${item.groupId}`}
                      content={item.content}
                    />
                  </span>
                )
              };

              return (
                <List.Item>
                  <div>
                    {sentence[`${type}${item.entityType}`]}
                  </div>
                </List.Item>
              );
            }}
          >
            {loading && hasMore && <Spin />}
          </List>
        </InfiniteScroll>
      </div>
    );
  };

  useEffect(() => {
    const sock = new SockJS(`http://192.168.103.25:8080/sw.test.api/im/conn?uid=${userName}`);
    const stompClient = Stomp.over(sock);
    // 创建连接
    stompClient.connect({}, function(frame) {
      //订阅消息
      stompClient.subscribe(`/user/${userName}/msg`, function(data) {
        console.log(data.body);
      });
    });
  }, [userName]);

  function fetchData(pageStart = 1) {
    getUnReadNotification({
      pageSize: 10,
      pageStart,
      type: tabKey,
      userName
    })
      .then((res) => {
        setLoading(false);
        if (res.data.code === 200) {
          const { dataList, pageNum, pageCount, total } = res.data.result;
          setNotifyList(notifyList.concat(dataList));
          setPageInfo({
            pageCount: pageCount,
            pageNum: pageNum,
            total: total
          });
          setHasMore(total > pageNum * pageCount);
        }
      })
      .then((err) => {
        setLoading(false);
      });
  }
  useEffect(() => {
    fetchData();
  }, [fetchData, tabKey]);

  useEffect(() => {
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
  }, [dispatch, userName]);

  function handleChange(activeKey) {
    setTabKey(activeKey);
    setNotifyList([]);
  }

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
        <MessageList data={notifyList} type="3" />
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
        <MessageList data={notifyList} type="1" />
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
        <MessageList data={notifyList} type="2" />
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
        <MessageList data={notifyList} type="0" />
        <ViewAll to={`/notify?type=0`} />
      </TabPane>
    </Tabs>
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

      <Modal visible={modalVisible}>hah</Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.global
  };
}

export default connect(mapStateToProps)(MessageBox);
