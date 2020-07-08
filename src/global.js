import RestTools from './utils/RestTools';
import Cookies from 'js-cookie';
import request from './utils/request';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(userInfo){
  request.post('/Login/refreshLogin',null,{
    params: {
      isPerson: userInfo.UserType === 'jf' || userInfo.PersonUserName,
      username: userInfo.UserName
    }
  }).then(res => {
    // console.log(res)
  }).catch(err => {
    console.log(err)
  })
}

if (!Cookies.get('cnki_qa_uuid')) {
  if(process.env.UMI_ENV === 'prod'){
    Cookies.set('cnki_qa_uuid', RestTools.createUid(), {
      expires: 3650,
      secure: true
    });
  }else{
    Cookies.set('cnki_qa_uuid', RestTools.createUid(), {
      expires: 3650,
    });
  }
  
}


if (/Android|Windows Phone|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  window.location.href = 'http://qa.cnki.net/sw.mobile';
} else if (/iPad/i.test(navigator.userAgent)) {
  window.location.href = 'http://qa.cnki.net/sw.mobile';
}
