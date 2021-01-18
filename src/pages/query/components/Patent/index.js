import React from 'react';
import { Table } from 'antd';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';
const { Column } = Table;
function Patent(props) {
  const { dataNode, evaluate, intentJson, id, title } = props.data;
  const { good, bad, isevalute } = evaluate;
  const name = intentJson && intentJson.results[0].fields['专利名'];
  return (
    <div className={styles.Patent}>
      <h2>{name ? `${name} - 相关专利` : title}</h2>
      <Table
        rowKey={'文件名'}
        dataSource={dataNode}
        pagination={false}
        size="middle"
        bordered={false}
      >
        <Column
          title="专利名"
          dataIndex="TITLE"
          key="TITLE"
          width={250}
          ellipsis
          render={(text, item) => (
            <a
              className={styles.title}
              target="_blank"
              title={RestTools.removeFlag(item.TITLE)}
              rel="noopener noreferrer"
              href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=SCPD&dbname=SCPD&filename=${item.文件名}`}
              dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.TITLE) }}
            />
          )}
        />
        <Column
          title="发明机构"
          dataIndex="发明机构"
          key="发明机构"
          width={200}
          ellipsis
          render={(text, record) => <span>{record.发明机构 ? record.发明机构 : '-'}</span>}
        />
        <Column title="发表时间" dataIndex="发表时间" key="发表时间" width={100} ellipsis />
        <Column
          title="发明人"
          dataIndex="发明人"
          key="发明人"
          ellipsis
          style={{ overflow: 'hidden' }}
        />
      </Table>

      <div>
        {name ? (
          <div style={{ textAlign: 'right' }}>
            <a
              className={styles.more}
              target="_blank"
              rel="noopener noreferrer"
              href={`http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCPD&kw=${encodeURIComponent(
                intentJson.results[0].fields['专利名']
              )}&korder=0&sel=1`}
            >
              更多相关专利
            </a>
          </div>
        ) : null}
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default Patent;
