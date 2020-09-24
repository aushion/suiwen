import { useState, useEffect } from 'react';
import { Tag, Popover, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './DomainTag.less';

function DomainTags(props) {
  const checkedStyle = {
    background: 'rgba(235,247,255,1)',
    color: '#0084FF'
  };
  const normalStyle = {
    cursor: 'pointer',
    marginBottom: 10,
    background: 'transparent',
    border: 'none',
    color: '#585A5D',
    padding: '4px 15px',
    fontSize: 14,
    fontWeight: 'bolder',
  };
  const { data, onClickTag, dispatch, communityNode } = props;
  const localChecked = data.map((item) => item.cName).indexOf(communityNode?.firstNode.cName);
  const [checked, setChecked] = useState(localChecked || -1);
  useEffect(() => {
    setChecked(localChecked);
  }, [localChecked]);

  function handleClick(index, item, isChild) {
    const payload = { domain: encodeURIComponent(item.cId || ''), size: 10, index: 1 };
    setChecked(index);
    onClickTag(payload);
    const firstNode = index >= 0 ? { ...data[index] } : '';
    const secondNode = isChild && index >= 0 ? item : '';

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
              <div className={styles.tag} onClick={handleClick.bind(this, index, item, true)}>
                {item.cName}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 16, paddingBottom: '20px', paddingLeft: '10px', color: '#2B2C2E' }}>
        求助分类
      </div>
      <Tag
        style={checked === -1 ? { ...normalStyle, ...checkedStyle } : normalStyle}
        onClick={handleClick.bind(this, -1, '')}
      >
        全部
      </Tag>
      {data.map((item, index) => {
        if (item.communityClassList.length) {
          return (
            <Popover content={tagChildren(item.communityClassList, index)} key={index}>
              <Tag
                style={checked === index ? { ...normalStyle, ...checkedStyle } : normalStyle}
                key={item.cId}
                onClick={handleClick.bind(this, index, item, false)}
              >
                {item.cName}
              </Tag>
            </Popover>
          );
        }
        return (
          <Tag
            style={checked === index ? { ...normalStyle, ...checkedStyle } : normalStyle}
            key={item.cId}
            onClick={handleClick.bind(this, index, item, false)}
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
