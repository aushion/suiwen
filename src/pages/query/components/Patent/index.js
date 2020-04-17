import React from 'react';
import { Table } from 'antd';
import RestTools from 'Utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';
const { Column } = Table;
function Patent(props) {
  const { dataNode, evaluate, intentJson, id } = props.data;
  const { good, bad, isevalute } = evaluate;
  const title = intentJson && intentJson.results[0].fields['专利名'];
  return (
    <div className={styles.Patent}>
      <div className={styles.Patent_title}>{`${title}_相关专利`}</div>
      <Table rowKey={"文件名"} dataSource={dataNode} pagination={false} size="middle" bordered={false}>
        <Column
          title="专利名"
          dataIndex="TITLE"
          key="TITLE"
          width={300}
          render={(text, item) => (
            <a
              className={styles.title}
              target="_blank"
              title={RestTools.removeFlag(item.TITLE)}
              rel="noopener noreferrer"
              href={`http://dbpub.cnki.net/grid2008/dbpub/detail.aspx?dbcode=SCPD&dbname=SCPD&filename=${item.文件名}`}
              dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.TITLE) }}
            />
          )}
        />
        <Column
          title="发明机构"
          dataIndex="发明机构"
          key="发明机构"
          width={250}
          render={(text, record) => <span>{record.发明机构 ? record.发明机构 : '-'}</span>}
        />
        <Column title="发表时间" dataIndex="发表时间" key="发表时间" width={100} />
        <Column title="发明人" dataIndex="发明人" key="发明人" />
      </Table>

      <div>
        <div style={{textAlign:'right'}}>
          <a
            className={styles.more}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCPD&kw=${encodeURIComponent(intentJson.results[0].fields['专利名'])}&korder=0&sel=1`}
          >
            更多相关专利
          </a>
        </div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default Patent;
