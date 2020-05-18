import { Result, Button } from 'antd';
import router from 'umi/router';

function Four0Four() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的这个页面不存在"
      extra={<Button onClick={() => {router.push('/')}} type="primary">回到首页</Button>}
    />
  );
}

export default Four0Four;
