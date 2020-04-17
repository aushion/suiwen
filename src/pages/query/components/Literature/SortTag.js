import React from 'react'
import {Tag, Icon} from 'antd'

const SortTag = function(props) {
  const { sortKeyText, onClick, sortKey, name, tagStyle, activeTag, count, showArrow } = props;
  return (
    <Tag
      onClick={onClick.bind(this, sortKeyText)}
      style={sortKey === sortKeyText ? { ...tagStyle, ...activeTag } : { ...tagStyle }}
    >
      {sortKey === sortKeyText && showArrow ? (
        <Icon type={count % 2 ===0  ? 'caret-down' : 'caret-up'} />
      ) : null}
      {name}
    </Tag>
  );
};

export default SortTag