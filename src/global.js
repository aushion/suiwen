import RestTools from './utils/RestTools';
import Cookies from 'js-cookie';


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

// if (Cookies.get('Ecp_LoginStuts')) {
//   window.localStorage.setItem('userInfo', Cookies.get('Ecp_LoginStuts'));
// } else {
//   if (domain.endsWith('cnki.net')) {
//     window.localStorage.setItem('userInfo', null);
//   }
// }

if (/Android|Windows Phone|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  window.location.href = 'http://qa.cnki.net/sw.mobile';
} else if (/iPad/i.test(navigator.userAgent)) {
} else {
}
