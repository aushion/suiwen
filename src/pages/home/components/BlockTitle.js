export default function BlockTitle(props) {
  const { cnTitle = '', enTitle = '' } = props;
  return (
    <div>
      {cnTitle ? (
        <span
          style={{
            color: '#23242A',
            fontSize: 28,
            borderBottom: '2px solid #13BDE9',
            paddingBottom: '4px'
          }}
        >
          {cnTitle}
        </span>
      ) : null}
      {enTitle ? <span style={{ color: '#C4C4C4', fontSize: 16, paddingLeft: 10 }}>{enTitle}</span> : null}
    </div>
  );
}
