import React from 'react';
import { Icon } from 'antd';

function IconText({ type, onClick, text }) {
  return (
    <span style={{ fontSize: 13, color: '#9EACB6', cursor: 'pointer' }} onClick={onClick}>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );
}

export default IconText;
