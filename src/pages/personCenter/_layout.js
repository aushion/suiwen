import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import PersonMenu from './components/PersonMenu';
import PersonAvatar from './components/PersonAvatar';
function _layout(props) {
  return (
    <div>
      <PersonAvatar />
      <div style={{ marginTop: 40, margin: '2% 18.75% 0' }}>
        <Row gutter={24}>
          <Col span={5}>
            <PersonMenu />
          </Col>

          <Col span={19}>
            <div style={{ padding: 20, backgroundColor: '#fff' }}>{props.children}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter
  };
}

export default connect(mapStateToProps)(_layout);
