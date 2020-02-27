import React from 'react'
import {Tag,Icon} from 'antd'

const SortTag = function(props) {
  const { sortKeyText, name, sqlKey, tagStyle, activeTag, count, sortKey, onClick } = props;
  return (
    <Tag
      onClick={onClick.bind(this, sqlKey)}
      style={sortKey === sortKeyText ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
    >
      {sortKey === sortKeyText ? <Icon type={count % 2 ? 'caret-up' : 'caret-down'} /> : null}
      {name}
    </Tag>
  );
};

export default SortTag
