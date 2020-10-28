import React from 'react';
import { Input, Button } from 'antd';

const { TextArea } = Input;

function SwTextArea(props) {
  const { disabled, onClick, buttonText = '发表', showButton = true, ...textAreaProps } = props;
  const suffixStyle = {
    position: 'relative',
    userSelect: 'none',
    left: '-50px',
    bottom: '-2px',
    color: '#999'
  };
  return (
    <>
      <TextArea {...textAreaProps}  />
      <span  style={suffixStyle}>{`${props.value.length}/200`}</span>
      {showButton ? (
        <Button
          style={{ verticalAlign: 'top', marginLeft: -20 }}
          type="primary"
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {buttonText}
        </Button>
      ) : null}
    </>
  );
}

export default SwTextArea;
