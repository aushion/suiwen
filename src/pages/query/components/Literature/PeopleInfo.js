  
import RestTools from '../../../../utils/RestTools'
  //学者信息组件
  
  const PeopleInfo = (props) => {
    const { 作者 = '', 学者单位 = '', 研究领域 = '' } = props.data;
    return (
      <div>
        <span
          style={{ fontSize: 16, paddingRight: '20px' }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(作者) }}
        />
        <span style={{ paddingRight: '20px' }}>{学者单位}</span>
        <span>{研究领域}</span>
      </div>
    );
  };

  export default PeopleInfo;