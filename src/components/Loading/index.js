import React from 'react';
import { Spin } from 'antd';
// import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';

function Loading() {
  //   useEffect(() => {
  //     const progress = NProgress.start();
  //     return () => {
  //       progress.done();
  //     };
  //   }, []);
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  );
}

export default Loading;
