  import {Link} from 'umi';
  
  //连接组件
  const LinkElement = ({ to, content, onClick }) => {
    return (
      <Link style={{ padding: '0 10px' }} to={to} onClick={onClick}>
        {content}
      </Link>
    );
  };

  export default LinkElement;