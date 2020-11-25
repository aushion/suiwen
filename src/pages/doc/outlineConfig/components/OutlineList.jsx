import React, { Component } from 'react';
import { Divider, Anchor } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CaretRightOutlined, CaretDownOutlined, FormOutlined, SettingOutlined } from '@ant-design/icons';

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
                href={`#${'docTitle' + docItem.label}`}
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
                      {chapterItem.children && (chapterItem.flag === false ?
                        <CaretRightOutlined onClick={(() => { this.changeClick2(chapterItem, chapterIndex, true) })} />
                        : <CaretDownOutlined onClick={(() => { this.changeClick2(chapterItem, chapterIndex, false) })} />
                      )}
                      <Link
                        key={chapterItem}
                        href={`#${'chapterTitle' + chapterItem.label}`}
                        title={<div title={chapterItem.label} className={[styles.header, id === chapterItem.id ? styles.active : null].join(' ')}>{chapterItem.label}</div>}
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
                            href={`#${'nodeTitle' + chapterItem.label + '' + nodeItem.label}`}
                            title={<div title={nodeItem.label} className={[styles.content, id === nodeItem.id ? styles.active : null].join(' ')}>{nodeItem.label}</div>}
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