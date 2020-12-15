import React, { Component } from 'react';
import { Divider, Anchor, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CaretRightOutlined, CaretDownOutlined, SettingOutlined, WarningTwoTone } from '@ant-design/icons';

import styles from '../style.less';

const { Link } = Anchor;
class OutlineList extends Component {
  constructor(props) {
    super(props);
    let list = this.props.data;

    list.forEach((item, index) => {
      if (item.children) {
        item.children.forEach((i, iIndex) => {
          if (iIndex === 0) {
            i.flag = true
          } else {
            i.flag = false
          }
        }
        )
      }
      if (index === 0) {
        item.flag = true
      } else {
        item.flag = false
      }
    })

    this.state = {
      data: list,
      id: this.props.id
    }

  }


  componentWillReceiveProps(nextProps) {
    let list = nextProps.data

    list.forEach((item, index) => {
      if (item.children) {

        item.flag = true;
      }
    })
    this.setState({
      data: list,
      id: nextProps.id
    })
  }

  changeClick = (item, index, flag) => {

    let list = this.state.data
    list[index] = {
      ...item,
      flag: flag
    }
    this.setState({
      data: list
    })
  }

  changeClick2 = (item, index, flag) => {
    let list = this.state.data

    list[0].children[index] = {
      ...item,
      flag: flag
    }
    this.setState({
      data: list
    })
  }

  render() {
    const { data, id } = this.state;

    const List = data.map((docItem, docIndex) => {
      return (
        <div className={styles.item} key={docIndex}>
          <div className={styles.head}>
            <div className={styles.headleft} >
              {docItem.children && (docItem.flag === false ?
                <CaretRightOutlined onClick={(() => { this.changeClick(docItem, docIndex, true) })} />
                : <CaretDownOutlined onClick={(() => { this.changeClick(docItem, docIndex, false) })} />
              )}
              <Link
                key={docItem}
                href={`#${encodeURIComponent('docTitle' + docItem.id)}`}
                title={<div title={docItem.label} className={[styles.header, id === docItem.id ? styles.active : null].join(' ')}>{docItem.label}</div>}
              />
            </div>
            <div className={styles.titleheadright}>
              <PlusOutlined onClick={(() => { this.props.onChapterNew(docItem) })} title="新增章标题" />
              <Divider type="vertical" />
              <EditOutlined onClick={(() => { this.props.onDocEdit(docItem) })} title="编辑文档标题" />
              <Divider type="vertical" />
              <DeleteOutlined onClick={(() => { this.props.onDocDelete(docItem) })} title="删除章标题" />
            </div>
          </div>


          {docItem.children && (docItem.flag === false ? null :
            docItem.children.map((chapterItem, chapterIndex) => {
              return (
                <div className={styles.item} key={chapterIndex}>
                  <div className={styles.head}>
                    <div className={styles.headleft} >
                      <WarningTwoTone twoToneColor='orange' title="未配置问题" style={{
                        visibility: (chapterItem.questionList && chapterItem.questionList.length !== 0) ||
                          (chapterItem.children && chapterItem.children.length !== 0) ? 'hidden' : 'visible'
                      }} />
                      {chapterItem.flag === false ?
                        <CaretRightOutlined onClick={(() => { this.changeClick2(chapterItem, chapterIndex, true) })}
                          style={{ visibility: chapterItem.children ? 'visible' : 'hidden' }} />
                        : <CaretDownOutlined onClick={(() => { this.changeClick2(chapterItem, chapterIndex, false) })}
                          style={{ visibility: chapterItem.children ? 'visible' : 'hidden' }} />
                      }
                      <Link
                        key={chapterItem}
                        href={`#${encodeURIComponent('chapterTitle' + chapterItem.id)}`}
                        title={
                          <Tooltip
                            placement="top"
                            title={
                              <div>
                                <div
                                  title={docItem.label}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '170px',
                                    alignItems: 'center'
                                  }}
                                >
                                  {chapterItem.label}
                                </div>
                                {chapterItem.questionList && chapterItem.questionList.length !== 0 ? <Divider style={{ color: 'white' }}>配置问题</Divider> : null}
                                {chapterItem.questionList && chapterItem.questionList.length !== 0 ? chapterItem.questionList.map((questionListItem, questionListIndex) => {
                                  return (
                                    <div key={questionListIndex}>
                                      <div

                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          width: '170px',
                                          alignItems: 'center',
                                          marginLeft: '20px',
                                        }}
                                      >
                                        {questionListItem.question}
                                      </div>
                                    </div>)
                                }) : null}
                              </div>
                            }
                          >
                            <div className={[styles.header, id === chapterItem.id ? styles.active : null].join(' ')}>
                              {chapterItem.label}
                            </div>
                          </Tooltip>}
                      />
                    </div>
                    <div className={styles.headright}>
                      <SettingOutlined onClick={(() => { this.props.onNewQuestion(docItem, chapterItem) })} title="配置问题/关键字" />
                      <Divider type="vertical" />
                      <PlusOutlined onClick={(() => { this.props.onNew(chapterItem) })} title="新增节标题" />
                      <Divider type="vertical" />
                      <EditOutlined onClick={(() => { this.props.onEdit(chapterItem) })} title="编辑章标题" />
                      <Divider type="vertical" />
                      <DeleteOutlined onClick={(() => { this.props.onDelete(chapterItem) })} title="删除章标题" />
                    </div>
                  </div>

                  {chapterItem.children && (chapterItem.flag === false ? null :
                    chapterItem.children.map((nodeItem, nodeIndex) => {
                      return (
                        <div key={nodeIndex} className={styles.text}>
                          <Link
                            key={nodeItem}
                            href={`#${encodeURIComponent('nodeTitle' + chapterItem.id + '' + nodeItem.id)}`}
                            title={
                              <Tooltip
                                placement="top"
                                title={
                                  <div>
                                    <div
                                      title={nodeItem.label}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '170px',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {nodeItem.label}
                                    </div>
                                    {nodeItem.questionList && nodeItem.questionList.length !== 0 ? <Divider style={{ color: 'white' }}>配置问题</Divider> : null}
                                    {nodeItem.questionList && nodeItem.questionList.length !== 0 ? nodeItem.questionList.map((questionListItem, questionListIndex) => {
                                      return (
                                        <div key={questionListIndex}>
                                          <div

                                            style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              width: '170px',
                                              alignItems: 'center',
                                              marginLeft: '20px',
                                            }}
                                          >
                                            {questionListItem.question}
                                          </div>
                                        </div>)
                                    }) : null}
                                  </div>
                                }
                              >

                                <div className={[styles.content, id === nodeItem.id ? styles.active : null].join(' ')}>
                                  <WarningTwoTone twoToneColor='orange' title="未配置问题" style={{ visibility: nodeItem.questionList && nodeItem.questionList.length !== 0 ? 'hidden' : 'visible' }} />

                                  <span style={{ marginLeft: '28px' }}>{nodeItem.label}</span>
                                </div>
                              </Tooltip>}
                          />
                          <div className={styles.headright}>
                            <SettingOutlined onClick={(() => { this.props.onNewQuestion(chapterItem, nodeItem) })} title="配置问题/关键字" />
                            <Divider type="vertical" />
                            <EditOutlined onClick={(() => { this.props.onSEdit(chapterItem, nodeItem) })} title="编辑节标题" />
                            <Divider type="vertical" />
                            <DeleteOutlined onClick={(() => { this.props.onDelete(nodeItem) })} title="删除节标题" />
                          </div>
                        </div>
                      )
                    }))}


                </div>
              )
            }))
          }
        </div>
      )
    })
    return (
      // <div className={styles.domain}>
      //   <Anchor affix targetOffset={50} getContainer={()=> <div id="container"></div>}>
      //     {List}
      //   </Anchor>
      // </div>
      List
    )
  }

}
export default OutlineList;