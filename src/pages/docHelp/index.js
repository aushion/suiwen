import React from 'react';
import { Anchor, Layout } from 'antd';
import { router } from 'umi';
import logo from '../../assets/logo1.png';
import styles from './index.less';
const { Header } = Layout;
const { Link } = Anchor;

export default function DocHelp() {
  function goHome() {
    router.push('/');
  }
  return (
    <div className={styles.docHelp}>
      <Header className={styles.header}>
        <div className={styles.wrapper}>
          <div onClick={goHome.bind(this)} className={styles.logo} id="logo">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.title}>文档助手功能介绍</div>
        </div>
      </Header>
      <div className={styles.container}>
        <div className={styles.left}>
          <Anchor>
            <Link href="#新建文档" title="新建文档">
              <Link href="#新建空白文档" title="新建空白文档" />
              <Link href="#新建模板文档" title="新建模板文档" />
            </Link>

            <Link href="#构建提纲目录" title="构建提纲目录">
              <Link href="#添加章节标题" title="添加章节标题" />
              <Link href="#添加节标题" title="添加节标题" />
              <Link href="#问题配置" title="问题配置" />
              <Link href="#节标题新增-快速问题配置" title="节标题新增-快速问题配置" />
            </Link>
            <Link href="#文档生成" title="文档生成" />

            <Link href="#文档修饰" title="文档修饰">
              <Link href="#编辑文档属性" title="编辑文档属性" />
              <Link href="#编辑章标题" title="编辑章标题" />
              <Link href="#编辑节标题" title="编辑节标题" />
              <Link href="#文档模式切换" title="文档模式切换" />
            </Link>
            <Link href="#文档发布" title="文档发布" />
            <Link href="#文档下载" title="文档下载" />
            <Link href="#个人文档" title="个人文档" />
          </Anchor>
        </div>
        <div className={styles.right}>
          <div id="新建空白文档">
            <p>
              空白文档即没有应用文档模板的文档。
              <br /> ①点击“新建文档”按钮
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_1.png')} alt="" />
            <p>
              ②在“新建文档”弹窗中，输入文档标题等信息
              <br />这里以“新能源”为主题词。文档标题为：“新能源简述”；文档标签选择为：“科研技术”；公开属性选择默认的“公开”；空白文档的文档模板为“无”。预览如下：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_2.png')} alt="" />
            <p>
              ③新建空白文档成功后，预览如下：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_3.png')} alt="" />
          </div>
          <div id="新建模板文档">
            <p>模板文档即应用某一个文档模板的文档。
              <br />①点击“新建文档”按钮</p>
          </div>
        </div>
      </div>
    </div>
  );
}
