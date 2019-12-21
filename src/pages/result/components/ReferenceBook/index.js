import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function ReferenceBook(props) {
  const { data, title } = props;

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
            dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.Answer || item.介绍) }}
          />
          <a
            href={`http://192.168.103.24/qa.web/query/link?id=${item.工具书编号}&db=crfd`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ReferenceBook_more}
          >
            查看全文>>
          </a>
        </div>
      ))}
    </div>
  );
}

export default ReferenceBook;
