import { useState, useEffect } from 'react';
import { Tag } from 'antd';

function DomainTags(props) {
  const checkedStyle = {
    backgroundColor: '#1890ff',
    color: '#fff'
  };
  const normalStyle = {
    cursor: 'pointer',
    marginBottom: 10,
  };
  const { data, onClickTag, localDomain } = props;
  const localChecked = data.map((item) => item._domainname).indexOf(localDomain);
  const [checked, setChecked] = useState(localChecked || -1);
  useEffect(() => {
    setChecked(localChecked);
  }, [localChecked]);
  function handleClick(index, item) {
    const payload = { domain: encodeURIComponent(item), size: 10, index: 1 };
    setChecked(index);
    onClickTag(payload);
  }
  return (
    <div>
      <Tag
        style={checked === -1 ? {...checkedStyle,...normalStyle} : normalStyle}
        onClick={handleClick.bind(this, -1, '全部')}
      >
        全部
      </Tag>
      {data.map((item, index) => {
        return (
          <Tag
            style={checked === index ? {...checkedStyle,...normalStyle} : normalStyle}
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
