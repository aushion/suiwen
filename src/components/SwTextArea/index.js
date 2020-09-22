import React from 'react';
import { Input, Button } from 'antd';

const { TextArea } = Input;

function SwTextArea(props) {
  const { disabled, onClick, buttonText = '发表', ...textAreaProps } = props;
  const suffixStyle = {
    position: 'relative',
    userSelect: 'none',
    left: '-50px',
    bottom: '-2px',
    color: '#999'
  };
  return (
    <>
      <TextArea {...textAreaProps} autoSize />
      <span style={suffixStyle}>{`${props.value.length}/200`}</span>
      <Button
        style={{ verticalAlign: 'top', marginLeft: -20 }}
        type="primary"
        disabled={props.disabled}
        onClick={props.onClick}
      >
        {buttonText}
      </Button>
    </>
  );
}

export default SwTextArea;
