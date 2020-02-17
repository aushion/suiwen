import RestTools from '../../../utils/RestTools';
import Evaluate from './Evaluate';

function Graphic(props) {
  const { data, intentFocus, title, evaluate, id } = props;
  const { good, bad, isevalute } = evaluate;

  return (
    <div
      style={{
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        padding: 20,
        marginBottom: 20,
        color: '#333'
      }}
    >
      <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>{title}</div>
      {data.map((item) => {
        return (
          <div
            style={{
              letterSpacing: '2px',
              lineHeight: '27.2px',
            }}
            key={item.ID}
            dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item[intentFocus]) }}
          />
        );
      })}
      <div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default Graphic;
