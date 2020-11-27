import styles from './index.less';
import { Button, List } from 'antd';
import RestTools from '../../../../utils/RestTools';

function Technology({ data, q }) {
  let journalData = null;
  let fieldData = null;

  if (data.length === 1) {
    journalData = data[0];
  } else {
    [fieldData = null, journalData] = data;
  }
  const fields = fieldData
    ? fieldData.intentJson
      ? fieldData.intentJson.results[0].fields
      : null
    : null;
  const subject = fields ? fields[fields['focus']] : null;

  return (
    <div className={styles.technology}>
      <h2>
        <span>{q}</span>
        <span> - 随问知识库</span>
      </h2>
      <div>
        <div className={styles.desc}>
          <span>{subject || q}核心技术包括：</span>
          {fieldData.dataNode.data.map((item, index) =>
            index === fieldData.dataNode.data.length - 1 ? (
              <span className={styles.cara} key={item.TERM}>
                {RestTools.translateToRed(item.TERM)}。
              </span>
            ) : (
              <span className={styles.cara} key={item.TERM}>
                {RestTools.translateToRed(item.TERM)}、
              </span>
            )
          )}
        </div>

        <div className={styles.list}>
          <List
            bordered
            header={
              <div className={styles.btn}>
                {journalData.dataNode.groupList.length ? (
                  <div>
                    <span>全部：</span>
                    {journalData.dataNode.groupList.map((item) => (
                      <Button type="primary" size="small" key={item.SOURE_TYPE}>
                        {item.SOURE_TYPE}（{item.cnt}）
                      </Button>
                    ))}
                  </div>
                ) : null}
              </div>
            }
            dataSource={journalData.dataNode.data}
            pagination={{
              pageSize: journalData.pagination.pageCount,
              current: journalData.pagination.pageStart,
              total: journalData.pagination.total,
              hideOnSinglePage: true
            }}
            renderItem={(item, index) => (
              <div className={styles.item}>
                <div>
                  <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.CONTEXT) }}
                  />
                </div>
                {item.addition ? (
                  <div style={{ color: '#999' }}>
                    <span>{item.addition.中文刊名}</span>
                    <span>{item.addition.发表时间}</span>
                    <span>{item.addition.篇名}</span>
                  </div>
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Technology;
