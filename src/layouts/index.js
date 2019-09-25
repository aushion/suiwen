// import styles from './index.css';
import BasicLayout from './BasicLayout'
import HomeLayout from './HomeLayout'

export default function (props) {
  console.log(props)
  if(props.location.pathname === '/home'){
    return <HomeLayout>{props.children}</HomeLayout>
  }
  return (
    <BasicLayout>{props.children}</BasicLayout>
  );
}


