import React from 'react';
import { Icon } from 'antd';

function IconText({ type, onClick, text }) {
  return (
    <span
      style={{ fontSize: 13, color: '#9EACB6', cursor: 'pointer', paddingRight: 20 }}
      onClick={onClick}
    >
      <Icon type={type} style={{ marginRight: 8 }} />
      <span style={{ fontSize: 12 }}>{text}</span>
    </span>
  );
}

export default IconText;
