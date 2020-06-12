import React, { useEffect } from 'react';
import querystring from 'querystring';

function HandleRedirect() {
  useEffect(() => {
    let h = window.opener;
    if (!h) return undefined;
    let search = window.location.search;
    search = search.indexOf('?') === 0 ? search.substr(1) : search;
    let query = querystring.parse(search);
  
    let redirectURL = decodeURIComponent(query['Redirect']);
    h.parent.postMessage(
      {
        type: 'success',
        target: redirectURL
      },
      window.location.origin
    );
    // close self window
    window.close();
    return undefined;
  }, [])
 

  return <div>跳转中，请稍后...</div>;
}

export default HandleRedirect;
