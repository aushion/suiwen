import { useState, useEffect } from 'react';
import { Tag, Popover, Row, Col } from 'antd';
import { connect } from 'dva';

function DomainTags(props) {
  const checkedStyle = {
    backgroundColor: '#1890ff',
    color: '#fff'
  };
  const normalStyle = {
    cursor: 'pointer',
    marginBottom: 10
  };
  const { data, onClickTag, localDomain, dispatch } = props;
  const localChecked = data.map((item) => item).indexOf(localDomain);
  const [checked, setChecked] = useState(localChecked || -1);
  useEffect(() => {
    setChecked(localChecked);
  }, [localChecked]);

  function handleClick(index, item) {
    const payload = { domain: encodeURIComponent(item.cName || ''), size: 10, index: 1 };
    setChecked(index);
    onClickTag(payload);
    const firstNode = index >=0 ? data[index].cName : '全部';
    const secondNode = index >= 0 ? item.cName : '';

    sessionStorage.setItem(
      'communityNode',
      JSON.stringify({
        firstNode,
        secondNode
      })
    );
    dispatch({
      type: 'help/changeDomain',
      payload: {
        communityNode: {
          firstNode,
          secondNode
        }
      }
    });
  }

  function tagChildren(data, index) {
    return (
      <div style={{ width: 160 }}>
        <Row>
          {data.map((item) => (
            <Col span={12} key={item.cId} style={{ margin: '10px 0', cursor: 'pointer' }}>
              <div onClick={handleClick.bind(this, index, item)}>{item.cName}</div>
            </Col>
          ))}
        </Row>
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
            <Popover content={tagChildren(item.communityClassList, index)} key={index}>
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

function mapStateToProps(state) {
  return {
    ...state.help,
    loading: state.loading.models.help
  };
}

export default connect(mapStateToProps)(DomainTags);
