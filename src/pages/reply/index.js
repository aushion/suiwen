/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Row, Col, Affix, Drawer, Skeleton, message } from 'antd';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/zh-cn';

import UserInfo from '../help/components/UserInfo';
import AnswerList from './components/AnswerList';
import replyStyle from './index.less';
import AnswerForm from './components/AnswerForm';
import WaitAnswer from '../../components/WaitAnswer';
import AnswerHelper from './components/AnswerHelper';

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');

let timerCount = null;
function Reply(props) {
  const { dispatch, followed, location, userCommunityInfo, answerList, loading } = props;
  const params = location.query;
  const { QID, editStatus = false } = params;

  const [showEditor, switchEditor] = useState(true); //是否显示回答框
  const [isFollowQ, switchFollowQ] = useState(followed); //问题关注状态
  const [showDrawer, setDrawer] = useState(false); //展示抽屉

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  useEffect(() => {
    switchFollowQ(followed);
  }, [followed]);

  useEffect(() => {
    switchEditor(JSON.parse(editStatus));
  }, [editStatus]);

  function followQuestion() {
    if (!userCommunityInfo) {
      message.warning('请您先登录');
      return;
    }
    clearTimeout(timerCount);
    setTimeout(() => {
      switchFollowQ(!isFollowQ);
      dispatch({
        type: isFollowQ ? 'reply/unFollowQuestion' : 'reply/followQuestion',
        payload: {
          qId: QID,
          userId: userCommunityInfo.userName
        }
      }).then((res) => {
        if (res.code === 200) {
          dispatch({
            type: 'help/getUserCommunityInfo',
            payload: {
              userName: userCommunityInfo.userName
            }
          });
        }
      });
    }, 300);
  }

  return (
    <div className={replyStyle.reply}>
      <div className={replyStyle.content}>
        <Row gutter={40}>
          <Col span={18} className={replyStyle.content_left}>
            <Skeleton loading={loading}>
              <div className={replyStyle.title}>
                <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
                <span>{params.q}</span>
                {userInfo ? (
                  <div className="display_flex" style={{ marginTop: 20 }}>
                    <div style={{ marginRight: 10 }}>
                      <Button
                        type="primary"
                        style={isFollowQ ? { background: 'gray', borderColor: 'gray' } : null}
                        onClick={followQuestion}
                        disabled={!userCommunityInfo}
                      >
                        {isFollowQ ? '取消关注' : '关注问题'}
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="primary"
                        icon="edit"
                        ghost
                        onClick={() => {
                          switchEditor(!showEditor);
                          if (showEditor) {
                            dispatch({
                              type: 'reply/saveAnswers',
                              payload: {
                                answerHelpData: {
                                  contents: '',
                                  resource: ''
                                }
                              }
                            });
                          }
                        }}
                      >
                        {showEditor && answerList.length ? '取消回答' : '写回答'}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              <Divider style={{ margin: 0 }} />
              <div className={replyStyle.draft}>
                {showEditor || answerList.length === 0 ? <AnswerForm /> : null}
              </div>
              <AnswerList qId={QID} />
            </Skeleton>
          </Col>
          <Col span={6} style={{ paddingRight: 0 }}>
            <div>
              {userCommunityInfo ? <UserInfo /> : null}
              <WaitAnswer />
              <Button
                type="primary"
                style={{ marginTop: 10 }}
                block
                href={`${process.env.basePath}/help/newHelp`}
              >
                去社区首页
              </Button>
            </div>
          </Col>
        </Row>
        {/* {showEditor ? ( */}
        <Affix offsetBottom={300} style={{ position: 'absolute', right: 20, bottom: 10 }}>
          <Button
            onClick={() => {
              setDrawer(true);
            }}
          >
            <Icon type="alert" theme="filled" style={{ color: 'gold', fontSize: 24 }} />
          </Button>
        </Affix>
        {/* ) : null} */}

        <Drawer
          title="参考回答助手"
          placement="right"
          width={800}
          onClose={() => {
            setDrawer(false);
          }}
          visible={showDrawer}
          getContainer={false}
        >
          <AnswerHelper />
        </Drawer>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.reply, loading: state.loading.effects['reply/getAnswer'] };
}

export default connect(mapStateToProps)(Form.create()(Reply));
