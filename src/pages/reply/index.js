/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Row, Col } from 'antd';
import Link from 'umi/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/zh-cn';

import UserInfo from '../help/components/UserInfo';
import AnswerList from './components/AnswerList';
import replyStyle from './index.less';
import AnswerForm from './components/AnswerForm';
import WaitAnswer from '../../components/WaitAnswer';

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.locale('zh-cn');

let timerCount = null;
function Reply(props) {
  const { dispatch, followed, location, userCommunityInfo } = props;
  const params = location.query;
  const { QID, editStatus = false } = params;

  const [showEditor, switchEditor] = useState(JSON.parse(editStatus)); //是否显示回答框
  const [isFollowQ, switchFollowQ] = useState(followed); //问题关注状态
 

  useEffect(() => {
    switchFollowQ(followed);
  }, [followed]);

  useEffect(() => {
    switchEditor(JSON.parse(editStatus));
  }, [editStatus]);

  function followQuestion() {
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
          <Link to="/help/newHelp"><Icon type="home"></Icon>返回社区</Link>
            <div className={replyStyle.title}>
              <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
              <span>{params.q}</span>
              <div className="display_flex" style={{ marginTop: 20 }}>
                <div style={{ marginRight: 10 }}>
                  <Button
                    type="primary"
                    style={isFollowQ ? { background: 'gray', borderColor: 'gray' } : null}
                    onClick={followQuestion}
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
                    }}
                  >
                    {showEditor ? '取消回答' : '写回答'}
                  </Button>
                </div>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <div className={replyStyle.draft}>{showEditor ? <AnswerForm /> : null}</div>
            <AnswerList qId={QID} />
          </Col>
          <Col span={6}>
            <div>
              {userCommunityInfo ? <UserInfo /> : null}
               <WaitAnswer /> 
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.reply, loading: state.loading.models.reply };
}

export default connect(mapStateToProps)(Form.create()(Reply));
