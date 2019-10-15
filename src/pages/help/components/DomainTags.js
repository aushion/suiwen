import { useState } from 'react';
import { Tag } from 'antd';

function DomainTags(props) {
  const checkedStyle = {
    background: '#1890ff',
    color: '#fff',
  };
  const { data, dispatch, current } = props;
  const [checked, setChecked] = useState(-1);
  function handleClick(index, item) {
    setChecked(index);
    const payload = { domain: item };
    if (current === 'newHelp') {
      dispatch({ type: 'help/getNewQuestions', payload });
    } else if (current === 'hotHelp') {
      dispatch({ type: 'help/getHotQuestions', payload });
    }
  }
  return (
    <div>
      <Tag
        style={checked === -1 ? checkedStyle : null}
        onClick={handleClick.bind(this, -1, '全部')}
      >
        全部
      </Tag>
      {data.map((item, index) => {
        return (
          <Tag
            style={checked === index ? checkedStyle : null}
            key={item._domainname}
            onClick={handleClick.bind(this, index, item._domainname)}
          >
            {item._domainname}
          </Tag>
        );
      })}
    </div>
  );
}

export default DomainTags;
