/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Row, Col } from 'antd';
import queryString from 'querystring';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

import UserInfo from '../help/components/UserInfo';
import AnswerList from './components/AnswerList';
import replyStyle from './index.less';
import AnswerForm from './components/AnswerForm';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

function Reply(props) {
  const params = queryString.parse(window.location.href.split('?')[1]);
  const [editStatus, setEditorStatus] = useState(null);
  const [showEditor, switchEditor] = useState(false);

  return (
    <div className={replyStyle.reply}>
      <div className={replyStyle.content}>
        <Row gutter={40}>
          <Col span={18} className={replyStyle.content_left}>
            <div className={replyStyle.title}>
              <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
              <span>{params.q}</span>
              <div className="display_flex" style={{ marginTop: 20 }}>
                <div style={{ marginRight: 10 }}>
                  <Button type="primary">关注问题</Button>
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
                    写回答
                  </Button>
                </div>
              </div>
            </div>
            <Divider style={{ margin: 0 }} />
            <div className={replyStyle.draft}>
              {showEditor ? <AnswerForm editStatus={editStatus} /> : null}
            </div>
            <AnswerList />
          </Col>
          <Col span={6}>
            <div>
              <UserInfo />
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
