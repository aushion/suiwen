import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import InputRecord from './InputRecord';
import InputTips from './InputTips';
import RestTools from '../../utils/RestTools';
import styles from './index.less';

const HISTORYKEY = RestTools.HISTORYKEY;
let timer = null;
message.config({
  maxCount: 1,
  top: 100,
});
const SmartInput = (props) => {
  const [value, setValue] = useState('');
  const [showRecord, setRecord] = useState(false);
  const [tipsData, setTips] = useState([]);
  const inputRecords = RestTools.getLocalStorage(HISTORYKEY) || [];
  const needTip = props.needTip;
  useEffect(() => {
    setValue(props.question);
    return () => {
      return false;
    };
  }, [props.question]);

  function handleChange(e) {
    const currentValue = e.target.value;
    setValue(e.target.value);
    setRecord(e.target.value ? false : true);
    setTips([])
    if (needTip) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        RestTools.getInputTips(currentValue)
          .then((res) => {
            const result = res.data.result;
            if (result) setTips(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 500);
    }
  }

  function hanldeClickItem(item) {
    setRecord(false);
    setTips([]);
    setValue(item);
    if (item) {
      RestTools.setStorageInput(HISTORYKEY, item.trim());
      props.onClickItem(item);
    } else {
      message.warning('请输入您的问题');
    }
  }

  function handleEnter(e) {
    // e.preventDefault();   //ie不兼容
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false; //注意加window
    }
    const maxLength = RestTools.maxLength;
    let str = value;
    let newStr = str;
    if (newStr && newStr.trim()) {
      if (value.length > maxLength) {
        message.warning(
          <span>
            您输入的问题字数超过了限制，
            <em>
              <strong style={{ color: 'red' }}>{value.substring(maxLength - 3, maxLength)}</strong>
            </em>
            之后的字数将不会计入问题中
          </span>
        );
        newStr = value.substring(0, maxLength);
      }
      RestTools.setStorageInput(HISTORYKEY, newStr.trim()); //存储输入
      props.onClickEnter(newStr);
    } else {
      message.warning('请输入您的问题');
      return;
    }
  }

  return (
    <div className={styles['input-wrap']}>
      <Input
        placeholder="请输入问题"
        size="large"
        autoComplete='off'
        allowClear
        value={value}
        onChange={handleChange}
        maxLength={50}
        onFocus={() => {
          if (value) {
            if (props.needTip) {
              RestTools.getInputTips(value)
                .then((res) => {
                  const result = res.data.result;
                  if (result) setTips(result);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } else {
            setTips([])
            setRecord(true);
          }
        }}
        onBlur={() => {
          setRecord(false);
          setTips([]);
        }}
        onPressEnter={handleEnter}
        addonAfter={
          <Button type="primary" onClick={handleEnter} style={{background: props.themeColor || '#0086FA'}}>
            提问
          </Button>
        }
      />
      {showRecord && inputRecords.length ? (
        <div className={'record-wrap'}>
          <InputRecord data={inputRecords} clickItem={hanldeClickItem} />
        </div>
      ) : null}

      {tipsData.length ? (
        <div className={'record-wrap'}>
          <InputTips keyword={value} data={tipsData} clickItem={hanldeClickItem} />
        </div>
      ) : null}
    </div>
  );
};

export default SmartInput;
