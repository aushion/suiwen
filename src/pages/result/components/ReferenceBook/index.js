import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function ReferenceBook(props) {
  const { data, title } = props;

  function handleAnswer(str, code) {
    if (str) {
      return (
        str.substr(0, 200) +
        '<a href="http://192.168.103.24/qa.web/query/link?id=' +
        code +
        '&db=crfd"' +
        'target="_blank"' +
        'rel="noopener noreferrer"' +
        '> 查看全文>>' +
        '</a>'
      );
    }
    return '-';
  }

  return (
    <div className={styles.ReferenceBook}>
      <div
        className={styles.ReferenceBook_title}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(title) }}
      />
      {data.map((item) => (
        <div key={item.工具书编号}>
          <div
            key={item.工具书编号}
            className={styles.ReferenceBook_answer}
            dangerouslySetInnerHTML={{
              __html: RestTools.translateToRed(
                RestTools.completeToolsBook(
                  handleAnswer(item.Answer || item.介绍 || '-', item.工具书编号)
                )
              )
            }}
          />
          <div className={styles.ReferenceBook_extra}>
            <a
              className={styles.ReferenceBook_name}
              target="_blank"
              rel="noopener noreferrer"
              href={`http://gongjushu.cnki.net/refbook/${item.工具书编号}.html`}
              dangerouslySetInnerHTML={{ __html: '--' + RestTools.translateToRed(item.工具书名称) }}
            />
            {/* <a
              href={`http://192.168.103.24/qa.web/query/link?id=${item.工具书编号}&db=crfd`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ReferenceBook_more}
            >
              查看全文>>
            </a> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReferenceBook;
