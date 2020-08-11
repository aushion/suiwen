import { useState, useEffect } from 'react';
import { Tag, Popover } from 'antd';

function DomainTags(props) {
  const checkedStyle = {
    backgroundColor: '#1890ff',
    color: '#fff'
  };
  const normalStyle = {
    cursor: 'pointer',
    marginBottom: 10
  };
  const { data, onClickTag, localDomain } = props;
  const localChecked = data.map((item) => item).indexOf(localDomain);
  const [checked, setChecked] = useState(localChecked || -1);
  useEffect(() => {
    setChecked(localChecked);
  }, [localChecked]);
  function handleClick(index, item) {
    const payload = { domain: encodeURIComponent(item), size: 10, index: 1 };
    setChecked(index);
    onClickTag(payload);
  }

  function tagChildren(data) {
    return (
      <div>
        {data.map((item) => (
          <div key={item.cId}>{item.cName}</div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Tag
        style={checked === -1 ? { ...checkedStyle, ...normalStyle } : normalStyle}
        onClick={handleClick.bind(this, -1, '')}
      >
        全部
      </Tag>
      {data.map((item, index) => {
        if (item.communityClassList.length) {
          return (
            <Popover content={tagChildren(item.communityClassList)} key={index}>
              <Tag
                style={checked === index ? { ...checkedStyle, ...normalStyle } : normalStyle}
                key={item.cId}
                onClick={handleClick.bind(this, index, item)}
              >
                {item.cName}
              </Tag>
            </Popover>
          );
        }
        return (
          <Tag
            style={checked === index ? { ...checkedStyle, ...normalStyle } : normalStyle}
            key={item.cId}
            onClick={handleClick.bind(this, index, item)}
          >
            {item.cName}
          </Tag>
        );
      })}
    </div>
  );
}

export default DomainTags;
