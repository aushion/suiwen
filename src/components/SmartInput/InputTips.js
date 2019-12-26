import React from 'react';
import { List } from 'antd';
import styles from './inputTips.less';

const InputTips = (props) => {
    const { data, keyword } = props;
    console.log(7,data)
    return data.length ? (
      <div className={styles["tip-list"]}>
        <List
          dataSource={data.slice(0,10)}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              onClick={props.clickItem.bind(this, item.value)}
              onMouseDown={e => e.preventDefault()}
            >
              <div
                className={styles["list-item"]}
                dangerouslySetInnerHTML={{__html: item.value.replace(keyword, `<Strong style="color:red">${keyword}</Strong>`)}}
              />
            </List.Item>
          )}
        />
      </div>
    ) : null;

}
export default InputTips;
