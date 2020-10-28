import React from 'react';
import { Icon } from 'antd';

function IconText({ type, onClick, text, style }) {
  const defaultStyle = {
    fontSize: 13,
    color: '#9EACB6',
    cursor: 'pointer',
    paddingRight: 20
  };
  return (
    <span style={style ? { ...defaultStyle, ...style } : defaultStyle} onClick={onClick}>
      <Icon
        type={type}
        style={style ? { marginRight: 8, ...style } : { marginRight: 8 }}
        theme={style ? 'filled' : 'outlined'}
      />
      <span style={{ fontSize: 12 }}>{text}</span>
    </span>
  );
}

export default IconText;
