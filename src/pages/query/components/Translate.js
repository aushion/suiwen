import Evaluate from './Evaluate';
import styles from './Graphic.less';

function Translate(props) {
  const { data, title, evaluate = null, id, intentJson } = props;
  const { good = null, bad = null, isevalute = null } = evaluate || {};

  const Translate = function(props) {
    return (
      <div>
        <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>
          {intentJson.results[0].fields['词汇']}
        </div>
        <div style={{ textAlign: 'right' }}>
          <a
            style={{
              color: 'rgb(153, 153, 153)'
            }}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://dict.cnki.net/dict_result.aspx?scw=${encodeURIComponent(
              intentJson.results[0].fields['词汇']
            )}`}
          >
            试试CNKI翻译助手
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Graphic}>
      {data ? <div style={{ color: '#2f8bd6', fontSize: 20 }}>{title}</div> : null}

      <div className={styles.wrapper}>
        <Translate />
      </div>

      <div>
        {evaluate ? (
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        ) : null}
      </div>
    </div>
  );
}

export default Translate;
