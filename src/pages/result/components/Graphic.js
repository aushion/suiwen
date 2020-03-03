import RestTools from '../../../utils/RestTools';
import Evaluate from './Evaluate';

function Graphic(props) {
  const { data, intentFocus, title, evaluate = null, id, domain, intentJson } = props;
  const { good = null, bad = null, isevalute = null } = evaluate || {};
  console.log('intentFocus', intentFocus)
  return (
    <div
      style={{
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        padding: 20,
        marginBottom: 20,
        color: '#333'
      }}
    >
      {domain === '翻译' ? (
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
              href={`http://dict.cnki.net/dict_result.aspx?searchword=${intentJson.results[0].fields['词汇']}`}
            >
              试试CNKI翻译助手
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>{title}</div>
          {data.map((item) => {
            console.log(item.hasOwnProperty('Answer'),intentFocus);
            return (
              <div
                style={{
                  letterSpacing: '2px',
                  lineHeight: '27.2px'
                }}
                key={item.ID}
                dangerouslySetInnerHTML={{
                  __html: RestTools.translateToRed(
                    item.hasOwnProperty('Answer') ? item.Answer : item[intentFocus]
                  )
                }}
              />
            );
          })}
        </div>
      )}
      <div>
        {evaluate ? (
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        ) : null}
      </div>
    </div>
  );
}

export default Graphic;
