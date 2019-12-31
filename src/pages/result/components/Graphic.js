import RestTools from '../../../utils/RestTools';

function Graphic(props) {
  const { data } = props;
  return (
    <div
      style={{
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        padding: 20,
        marginBottom: 20,
        color: '#333',
        letterSpacing: '2px',
        lineHeight: '27.2px',
        textIndent: '2em'
      }}
    >
      {data.map((item) => {
        return (
          <div
            key={item.ID}
            dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.介绍) }}
          ></div>
        );
      })}
    </div>
  );
}

export default Graphic;
