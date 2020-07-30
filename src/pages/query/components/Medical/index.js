import React, { useState } from 'react';
import { Tabs, Table } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';
import arrow_up from '../../../../assets/arrow_up.png';
import arrow_down from '../../../../assets/arrow_down.png';

const { TabPane } = Tabs;
const { Column } = Table;
export default function Medical(props) {
  const { id, intentFocus, intentDomain, data, evaluate, intentJson } = props;
  RestTools.setLocalStorage('medicalData', data[0]);
  const [medicalData, updateMedicalData] = useState(data[0]);
  const [pageYOffset, setPageYOffest] = useState(0);
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
    '疾病-用药': data[0][intentFocus] ? intentFocus : '适应症',
    用药副作用: data[0][intentFocus] ? intentFocus : '适应症'
  };

  function handleShowMore(e, txt) {
    if (e.target.className === 'showMore') {
      const newTxt =
        txt +
        `<a class="up"> 收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`;
      updateMainstr(newTxt);
    } else if (e.target.className === 'up') {
      const uptext =
        RestTools.subHtml(removeHtmlTagMainStr, 300, false) +
        `<a class="showMore"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/></a>`;
      updateMainstr(uptext);
    }
  }

  function handleTabShowMore(e, item) {
    if (e.target.className === 'showMore') {
      setPageYOffest(window.pageYOffset);
      const newMedicalData = {
        ...medicalData,
        [item + 'new']:
          RestTools.removeHtmlTag(medicalData[item]) +
          ` <a class="up"> 收起<img  style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`
      };
      updateMedicalData(newMedicalData);
    } else if (e.target.className === 'up') {
      window.scrollTo({ top: pageYOffset });
      const newMedicalData = { ...medicalData, [item + 'new']: '' };
      updateMedicalData(newMedicalData);
    }
  }

  function generateStr(str) {
    return str && str.length > 400
      ? RestTools.subHtml(str, 400, false) +
          `<a class="showMore"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/></a>`
      : str;
  }

  const removeHtmlTagMainStr =
    data[0][focus[intentDomain]] &&
    RestTools.removeHtmlTag(
      data[0][focus[intentDomain]] ? data[0][focus[intentDomain]] : data[0]['概述']
    );
  const [mainStr, updateMainstr] = useState(
    removeHtmlTagMainStr && removeHtmlTagMainStr.length > 300
      ? RestTools.subHtml(removeHtmlTagMainStr, 300, false) +
          `<a class="showMore"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/></a>`
      : removeHtmlTagMainStr
  );

  const tableId = data[0].ID || data[0].文件名;
  return (
    <div className={styles.Medical}>
      {tableId ? (
        <Link
          className={styles.title}
          target="_blank"
          rel="noopener noreferrer"
          to={`/detail?name=${data[0].table}&id=${tableId}`}
        >
          {intentJson.parsed_key + '_医药知识库'}
        </Link>
      ) : (
        <div className={styles.title}>{intentJson.parsed_key + '_医药知识库'}</div>
      )}

      {intentDomain === '疾病-用药' ? (
        <div>
          <Table
            size="small"
            dataSource={data.map((item) => ({
              疾病名: RestTools.removeFlag(item['疾病名']),
              疾病用药: RestTools.translateToRed(RestTools.removeHtmlTag(item['疾病用药']))
            }))}
            pagination={false}
          >
            <Column title="疾病" dataIndex="疾病名" key="疾病名" />
            <Column
              title="药品"
              dataIndex="疾病用药"
              key="疾病用药"
              render={(text, record) => <span dangerouslySetInnerHTML={{ __html: text }} />}
            />
          </Table>
          <div style={{ padding: 10, fontSize: 12, color: 'red' }}>
            (注意:请在医生的指导下使用。)
          </div>
        </div>
      ) : intentDomain === '用药副作用' ? (
        <div>
          <ul style={{ padding: 0 }}>
            {data.map((item, index) => (
              <li
                style={{ listStyle: 'none', padding: '10px 0', borderBottom: '1px solid #eee' }}
                key={index}
                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item[intentFocus]) }}
              />
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
          <Tabs type="card">
            {tabs[intentDomain].map((item, index) => {
              const removeHtmlTagStr =
                medicalData[item] && RestTools.removeHtmlTag(medicalData[item]);
              const str = medicalData[item + 'new']
                ? medicalData[item + 'new']
                : generateStr(removeHtmlTagStr);

              return medicalData[item] ? (
                <TabPane tab={item} key={index}>
                  <div
                    className={styles.abstract}
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(str) }}
                    onClick={(e) => handleTabShowMore(e, item, index)}
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
    </div>
  );
}
