import {Icon} from 'antd';
import  styles from './dynamicArrow.less'
//动态箭头组件
const DynamicArrow = (props) => {
  const { currentLength, basicsLength, size, onClick } = props;
  if (basicsLength > size) {
    if (currentLength < basicsLength) {
      return (
        <Icon
          onClick={onClick.bind(this, props)}
          style={{ color: '#999' }}
          className={styles.dynamicIcon}
          type="caret-down"
        />
      );
    } else if (currentLength === basicsLength && basicsLength > size) {
      return (
        <Icon
          onClick={onClick.bind(this, props)}
          style={{ color: '#999' }}
          className={styles.dynamicIcon}

          type="caret-up"
        />
      );
    }
  }
  return null;
};


export default DynamicArrow;