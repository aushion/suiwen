import React, { useState } from 'react';
import { List, Icon } from 'antd';
import styles from './inputRecord.less';
import RestTools from '../../utils/RestTools';

const HISTORYKEY = RestTools.HISTORYKEY;
const InputRecord = props => {
  // const data = props.data;
  const [data, setData] = useState(props.data);
  return data.length ? (
    <div className={styles['record-list']}>
      <List
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            onClick={props.clickItem.bind(this, item)}
            onMouseDown={e => e.preventDefault()}
          >
            <div className={styles['list-item']}>{item}</div>
            <Icon
              type="close"
              onClick={e => {
                e.stopPropagation();
                let inputRecords = RestTools.getLocalStorage(HISTORYKEY);
                inputRecords.splice(index, 1);
                setData(inputRecords);
                window.localStorage.setItem(HISTORYKEY, JSON.stringify(inputRecords));
              }}
            />
          </List.Item>
        )}
      />
    </div>
  ) : null;
};
export default InputRecord;
