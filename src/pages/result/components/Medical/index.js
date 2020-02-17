import React, { useState } from 'react';
import { Tabs, Modal, Table } from 'antd';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';

const { TabPane } = Tabs;
const { Column } = Table;
export default function Medical(props) {
  const { title, id, intentFocus, intentDomain, data, evaluate, intentJson } = props;
  const { good, bad, isevalute } = evaluate;
  const tabs = {
    疾病: ['治疗', '别名', '发病机制', '并发症', '流行病学', '病因', '诊断'].filter(
      (item) => item !== intentFocus
    ),
    药品: ['适应症', '剂型', '药理作用', '禁忌症', '注意事项', '用法用量', '不良反应'].filter(
      (item) => item !== intentFocus
    ),
    医学规范: ['适应症', '禁忌症', '准备', '方法', '注意事项'].filter(
      (item) => item !== intentFocus
    ),
    规范: ['适应症', '禁忌症', '准备', '方法', '注意事项'].filter((item) => item !== intentFocus),
    辅助检查: ['概述', '原理', '试剂', '操作方法', '正常值', '临床意义'].filter(
      (item) => item !== intentFocus
    )
  };

  const focus = {
    疾病: data[0][intentFocus] ? intentFocus : '概述',
    药品: data[0][intentFocus] ? intentFocus : '药理作用',
    医学规范: data[0][intentFocus] ? intentFocus : '适应症',
    辅助检查: data[0][intentFocus] ? intentFocus : '概述',
    规范: data[0][intentFocus] ? intentFocus : '适应症',
    '疾病-用药': data[0][intentFocus] ? intentFocus : '适应症'
  };

  function callback(key) {
    // console.log(key);
  }

  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }

  function handleShowMore(e, txt) {
    if (e.target.className === 'showMore') {
      const str = RestTools.removeHtmlTag(txt);
      showMore(str.substr(300, str.length));
    }
  }

  const removeHtmlTagMainStr = RestTools.removeHtmlTag(
    data[0][focus[intentDomain]] ? data[0][focus[intentDomain]] : data[0]['概述']
  );
  const mainStr =
    removeHtmlTagMainStr && removeHtmlTagMainStr.length > 300
      ? RestTools.subHtml(removeHtmlTagMainStr, 300, false) + '<a class="showMore"> 更多>></a>'
      : removeHtmlTagMainStr;
  return (
    <div className={styles.Medical}>
      {data[0].ID ? (
        <a
          className={styles.title}
          target="_blank"
          href={`http://qa.cnki.net/web/query/link?id=${data[0].ID}&db=${data[0].table}`}
        >
          {intentJson.parsed_key + '_医药知识库'}
        </a>
      ) : (
        <div className={styles.title}>{intentJson.parsed_key + '_医药知识库'}</div>
      )}

      {intentDomain === '疾病-用药' ? (
        <div>
          <Table
            dataSource={data.map((item) => ({
              疾病名: RestTools.removeFlag(item['疾病名']),
              疾病用药: RestTools.removeHtmlTag(item['疾病用药'])
            }))}
            pagination={false}
          >
            <Column title="疾病" dataIndex="疾病名" key="疾病名" />
            <Column title="药品" dataIndex="疾病用药" key="疾病用药" />
          </Table>
          <div style={{ padding: 10, fontSize: 12, color: 'red' }}>
            (注意:请在医生的指导下使用。)
          </div>
        </div>
      ) : intentDomain === '用药副作用' ? (
        <div>
          <ul>
            {data.map((item) => (
              <li key={item}>{item[intentFocus]}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className={styles.abstract}
          dangerouslySetInnerHTML={{ __html: mainStr }}
          onClick={(e) => handleShowMore(e, removeHtmlTagMainStr)}
        />
      )}

      {tabs[intentDomain] ? (
        <div className={styles.tabs}>
          <Tabs onChange={callback} type="card">
            {tabs[intentDomain].map((item, index) => {
              const removeHtmlTagStr = data[0][item] && RestTools.removeHtmlTag(data[0][item]);
              const str =
                removeHtmlTagStr && removeHtmlTagStr.length > 300
                  ? RestTools.subHtml(removeHtmlTagStr, 300, false) +
                    '<a class="showMore"> 更多>></a>'
                  : removeHtmlTagStr;
              return data[0][item] ? (
                <TabPane tab={item} key={index}>
                  <div
                    className={styles.abstract}
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(str) }}
                    onClick={(e) => handleShowMore(e, data[0][item])}
                  />
                </TabPane>
              ) : null;
            })}
          </Tabs>
        </div>
      ) : null}
      <div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
      <Modal
        visible={visible}
        footer={null}
        style={{ top: 40, left: '29%' }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          style={{
            // width: 400,
            paddingTop: 10,
            color: '#333',
            letterSpacing: '2px',
            lineHeight: '27.2px',
            textIndent: '2em'
          }}
          className={styles.fontStyle}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.removeHtmlTag(initialText))
          }}
        />
      </Modal>
    </div>
  );
}
