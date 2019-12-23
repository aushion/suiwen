import RestTools from './utils/RestTools';
import Cookies from 'js-cookie';
if (!Cookies.get('cnki_qa_uuid')) {
  Cookies.set('cnki_qa_uuid', RestTools.createUid(), {
    expires: 3650
  });
}
