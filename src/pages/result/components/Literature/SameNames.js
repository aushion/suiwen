import RestTools from '../../../../utils/RestTools'

const SameNames = (props) => {
  const { data } = props;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ padding: '20px 0', fontSize: 14 }}>
        同名学者：
        <a
          href={`http://xuezhe.cnki.net/Search/Search.aspx?ac=result&sm=0&sv=${RestTools.removeFlag(
            data[0].作者 || ''
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          更多学者
        </a>
      </div>
      <ul style={{ padding: 0 }}>
        {data.map((item, index) => (
          <li style={{ listStyle: 'none', padding: '5px 0' }} key={index}>
            <a
              href={`http://kns.cnki.net/kcms/detail/knetsearch.aspx?sfield=au&skey=${RestTools.removeFlag(
                item.作者
              )}&code=${item.学者代码}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {RestTools.removeFlag(item.作者)}
            </a>
            <span style={{ margin: '0 20px', color: '#999', fontSize: 12 }}>{item.学者单位}</span>
            <span style={{ color: '#999', fontSize: 12 }}>{item.研究领域}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SameNames;