import React from 'react'
import {connect} from 'dva'
import replyStyle from './index.less'

function Reply(props) {
  return <div className={replyStyle.reply}>
    <div></div>
  </div>
}

function mapStateToProps(state) {
  return {...state.reply}
}

export default connect(mapStateToProps)(Reply)