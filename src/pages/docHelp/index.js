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
            <Link href="#1. 新建文档" title="1. 新建文档">
              <Link href="#1.1 新建空白文档" title="1.1 新建空白文档" />
              <Link href="#1.2 新建模版文档" title="1.2 新建模版文档" />
            </Link>

            <Link href="#2. 构建提纲目录" title="2. 构建提纲目录">
              <Link href="#2.1 添加章标题" title="2.1 添加章标题" />
              <Link href="#2.2 添加节标题" title="2.2 添加节标题" />
              <Link href="#2.3 问题配置" title="2.3 问题配置" />
              <Link href="#2.4 节标题新增-快速问题配置" title="2.4 节标题新增-快速问题配置" />
            </Link>
            <Link href="#3. 文档生成" title="3. 文档生成" />

            <Link href="#4. 文档修饰" title="4. 文档修饰">
              <Link href="#4.1 编辑文档属性" title="4.1 编辑文档属性" />
              <Link href="#4.2 编辑章标题" title="4.2 编辑章标题" />
              <Link href="#4.3 编辑节标题" title="4.3 编辑节标题" />
              <Link href="#4.4 文档模版切换" title="4.4 文档模版切换" />
            </Link>
            <Link href="#5. 文档发布" title="5. 文档发布" />
            <Link href="#6. 文档下载" title="6. 文档下载" />
            <Link href="#7. 个人文档" title="7. 个人文档" />
          </Anchor>
        </div>
        <div className={styles.right}>
          <div id="1. 新建文档">
            <h1>1. 新建文档</h1>
          </div>
          <div id="1.1 新建空白文档">
            <h2>1.1 新建空白文档</h2>
            <p>
              <b>说明</b>：空白文档即没有应用文档模版的文档。
              <br />
              <b>操作演示</b>：
              <br /> ①点击“新建文档”按钮
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_1.png')} alt="" />
            <p>
              ②在“新建文档”弹窗中，输入文档标题等信息
              <br />
              这里以“新能源”为主题词。文档标题为：“新能源简述”；文档标签选择为：“科研技术”；公开属性选择默认的“公开”；空白文档的文档模版为“无”。预览如下：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_2.png')} alt="" />
            <p>③新建空白文档成功后，预览如下：</p>
            <img src={require('../../assets/doc/doc_help_ins_1_1_3.png')} alt="" />
          </div>
          <div id="1.2 新建模版文档">
            <h2>1.2 新建模版文档</h2>
            <p>
              <b>说明</b>：模版文档即应用某一个文档模版的文档。
              <br />
              <b>操作演示</b>：
              <br />
              ①点击“新建文档”按钮
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_2_1.png')} alt="" />
            <p>
              ②在“新建文档”弹窗中，输入文档标题等信息
              <br />
              &nbsp;&nbsp;这里以“新能源”为主题词。文档标题为：“新能源简述”；文档标签选择为：“科研技术”；公开属性选择默认的“公开”；模版文档的文档模版为“调研类、综述类论文模版1”。
              <br />
              首先选择文档模版，预览如下：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_2_2.png')} alt="" />
            <p>
              文档模版选择后，模版和文档标题中间会出现必填的“主题词”填写框。
              <br />
              提示：例如主题词填写“新能源”，文档模版中所有提纲目录里的“XXX”都将被替换成“新能源”，同时文档模版中也携带者模版问题，问题诸如“XXX定义”会自动替换成“新能源定义”。
              <br />
              预览如下：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_2_3.png')} alt="" />
            <p>
              点击确定后，模版文档新建成功，预览原图如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_2_4.png')} alt="" />
            <p>
              提纲目录与文档预览区域注解图如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_1_2_5.png')} alt="" />
          </div>
          <div id="2. 构建提纲目录">
            <h1>2. 构建提纲目录</h1>
          </div>
          <div id="2.1 添加章标题">
            <h2>2.1 添加章标题</h2>
            <p>
              <b>说明</b>：为当前文档增加章标题。
              <br />
              <b>操作演示</b>：
              <br />
              ①鼠标悬浮在文档标题“新能源简述”上，同行右边会浮现三个图标按钮，从左往右，依次为：新增章标题、编辑文档标题、删除文档。
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_1_1.png')} alt="" />
            <p>
              ②点击新增章标题图标按钮，弹窗填充章标题。这里填写“引言”，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_1_2.png')} alt="" />
            <p>③点击确定，新建成功。</p>
            <br />
            <img src={require('../../assets/doc/doc_help_ins_2_1_3.png')} alt="" />
            <p>
              提示：
              <br />
              &nbsp;&nbsp;1.新建章标题不需要输入章节号信息，系统自动生成。
              <br />
              &nbsp;&nbsp;2.新创建的章标题由于底下没有节标题，而且自身章标题未配置问题，所有会出现黄色的三角图标，提示用户当前未配置问题。
              <br />
              &nbsp;&nbsp;3.黄色三角图标出现规则：当只有章标题，该章标题底下无节标题，而且章标题里未配置问题情况下，图标显示在章标题的左侧；当章标题底下有节标题（这种情况章标题不需要配置问题，节标题需要配置），且节标题未配置问题时，当前节标题行左侧出现标识。
              <br />
            </p>
          </div>
          <div id="2.2 添加节标题">
            <h2>2.2 添加节标题</h2>
            <p>
              <b>说明</b>：为当前章添加节标题。
              <br />
              <b>操作演示</b>：
              <br />
              ①鼠标悬浮在章标题上，同行右侧会浮现4个图标按钮。从左到右，依次为：问题配置、新增节标题、编辑章标题、删除章标题。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_2_1.png')} alt="" />
            <p>
              ②这里建立第二章，并在第二章下建立第一节。预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_2_2.png')} alt="" />
            <p>③点击【+】图标，即新增节标题按钮，预览如下： 这里暂时不对问题配置进行操作。</p>
            <br />
            <img src={require('../../assets/doc/doc_help_ins_2_2_3.png')} alt="" />
            <p>
              ④点击确定，新增成功。预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_2_4.png')} alt="" />
            <p>
              ⑤同样的操作，进行第二章第二个节标题的新增。结果预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_2_5.png')} alt="" />
          </div>
          <div id="2.3 问题配置">
            <h2>2.3 问题配置</h2>
            <p>
              <b>说明</b>：问题配置指的是，为节标题或者底下无节标题的章标题来配置问题。配置了问题，文档内容才能对应刷新出想要的答案片段，问题的顺序也决定着文档片段的先后顺序。
              <br />
              <b>操作演示</b>：
              <br />
              ①鼠标悬浮在章标题或者节标题上，同行右侧浮现的第一个图标按钮。即为问题配置按钮。
              章标题问题配置按钮如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_1.png')} alt="" />
            <p>
              节标题问题配置按钮如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_2.png')} alt="" />
            <p>
              ②这里为章标题（第1章 引言）、节标题（第2章的两个节标题）配置问题。
              配置问题页面及流程相同， 不区分章标题、节标题。 首先点击“第1章
              引言”的“问题配置”按钮。弹出页面如下：
            </p>
            <br />
            <img src={require('../../assets/doc/doc_help_ins_2_3_3.png')} alt="" />
            <p>
              ③选择问题标签，这里选择的是：“背景”、“意义”，右侧会出现对应的可填充输入框。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_4.png')} alt="" />
            <p>
              ④这里主题词均填充为：“新能源”，可以依次点击输入框同行右侧的“√”图标按钮进行单个保存，也可以全部填充完，点击右上角的“全部保存”按钮，进行全部保存。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_5.png')} alt="" />
            <p>
              ⑤表格里的每个问题，右侧的5个操作按钮，从左到右，依次为：编辑问题、删除问题、点击显示答案预览、排序上升、排序下降。
              <br />
              其中，点击显示答案预览操作。会在页面右侧出现生成的文档片段，这里预览看到的片段就是问题配置后，外面内容刷新后，生成的所属这个问题的文档片段。
              <br />
              排序:问题的先后顺序直接决定外面，文档内容相关片段的先后顺序。
              <br />
              这里点击显示答案预览操作按钮，进行答案片段的生成预览：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_6.png')} alt="" />
            <p>
              ⑥再次点击可进行回收右半部分页面，点击其他问题的预览按钮，可以看到其他问题对应的生成片段预览。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_7.png')} alt="" />
            <p>
              ⑦页面的右上角有个模式切换，默认使用的是“问题标签模式”。如果有自定义的问题，可以切换模式。在文本域里进行填写，进行“保存更新”即可。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_8.png')} alt="" />
            <p>
              ⑧同样的操作，为第2章的两个节标题配置问题。结果如下：
              <br />
              在提纲目录上，鼠标悬浮在节标题上，可以查看里面配置的具体问题内容。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_3_9.png')} alt="" />
            <br />
            <img src={require('../../assets/doc/doc_help_ins_2_3_10.png')} alt="" />
            <p>
              注意：此时由于两章实际上都配置了问题，所以前面的黄色图标都消失了。
              <br />
            </p>
          </div>
          <div id="2.4 节标题新增-快速问题配置">
            <h2>2.4 节标题新增-快速问题配置</h2>
            <p>
              <b>说明</b>：在节标题新增功能框里，如果明确后续待配置的问题，可以直接在这里将问题配置上。
              <br />
              <b>操作演示</b>：
              <br />
              前面把前两章都配置了问题，现在新建第三章。并在底下的节标题新建过程中。直接快速配置问题。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_4_1.png')} alt="" />
            <p>
              新建节标题成功后，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_2_4_2.png')} alt="" />
          </div>
          <div id="3. 文档生成">
            <h1>3. 文档生成</h1>
            <p>
              <b>说明</b>：在配置完提纲目录的情况下，可以进行文档的生成，来预览自己的文档。
              <br />
              <b>操作演示</b>：
              <br />
              上面已经创建了一个提纲目录，并为其配置了问题。下面可以通过点击“内容刷新”按钮，来进行文档的生成。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_3_1_1.png')} alt="" />
            <p>
              点击“内容刷新”，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_3_1_2.png')} alt="" />
            <p>
              过少许时间，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_3_1_3.png')} alt="" />
            <p>
              点击提纲目录来跳转对应的文档内容区域，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_3_1_4.png')} alt="" />
            <p>
              文档预览区域，内容结构图如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_3_1_5.png')} alt="" />
          </div>
          <div id="4. 文档修饰">
            <h1>4. 文档修饰</h1>
          </div>
          <div id="4.1 编辑文档属性">
            <h2>4.1 编辑文档属性</h2>
            <p>
              <b>说明</b>：可编辑的文档属性包括文档标题、文档标签、文档公开属性。
              <br />
              <b>操作演示</b>：
              <br />
              点击重命名按钮，弹出编辑文档标题弹窗页面，可以对文档属性进行修改。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_1_1.png')} alt="" />
          </div>
          <div id="4.2 编辑章标题">
            <h2>4.2 编辑章标题</h2>
            <p>
              <b>说明</b>：顾名思义，直接对章的标题进行修改。
              <br />
              <b>操作演示</b>：
              <br />
              点击当前章标题右侧浮现的编辑图标按钮，弹出编辑章标题弹窗页面，可以对章标题进行修改。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_2_1.png')} alt="" />
            <p>
              点击后，弹出编辑章标题弹窗页面，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_2_2.png')} alt="" />
            <p>
              这里的章节号代表当前章节的目录号。例如这里代表“第2章 概念简介”。
              <br />
            </p>
          </div>
          <div id="4.3 编辑节标题">
            <h2>4.3 编辑节标题</h2>
            <p>
              <b>说明</b>：顾名思义，直接对节的标题进行修改。
              <br />
              <b>操作演示</b>：
              <br />
              点击当前节标题右侧浮现的编辑图标按钮，弹出编辑节标题弹窗页面，可以对节标题进行修改。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_3_1.png')} alt="" />
            <p>
              点击后，弹出编辑节标题弹窗页面，预览如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_3_2.png')} alt="" />
          </div>
          <div id="4.4 文档模版切换">
            <h2>4.4 文档模版切换</h2>
            <p>
              <b>说明</b>：当前如果有正在编辑或者已经编辑好的文档，此时切换文档模版，意味着重新开始新建一个模版文档。参见第一章里的第二节——1.2
              新建模版文档。之前编辑的文档除了文档标题，都会丢失。
              <br />
              <b>操作演示</b>：
              <br />
              ①文档模版选择，可以在下拉时，鼠标悬浮在每个选项上去预览每个模版内的提纲目录。 如下图：
              <br />
              悬浮在第1个模版选项上时：
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_4_1.png')} alt="" />
            <p>
              悬浮在第2个模版选项上时：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_4_2.png')} alt="" />
            <p>
              ②当感觉有必要舍去当前编辑的文档，去应用某个文档模版时，直接选择目标文档模版。例如选择文档模版一。此时跳出编辑主题词的弹窗页面，输入即将应用的文档模版的主题词，这里以“新能源”为主题词。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_4_3.png')} alt="" />
            <p>
              ③点击应用，便会生成文档模版所预览的提纲目录，由于模版中也携带者具体问题，所以也会同时生成文档内容。如下所示：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_4_4.png')} alt="" />
            <p>
              稍等片刻，文档内容就会生成出来，如下：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_4_4_5.png')} alt="" />
          </div>
          <div id="5. 文档发布">
            <h1>5. 文档发布</h1>
            <p>
              <b>说明</b>：
              <br />
              &nbsp;&nbsp;(1) 文档分为公开文档和私有文档。
              <br />
              &nbsp;&nbsp;(2)
              私有文档无法进行发布，别人通过个人中心查看他人的文档时，无法看到私有类型的文档。
              <br />
              &nbsp;&nbsp;(3) 公开文档可以进行发布，是新建文档时的默认属性。
              <br />
              &nbsp;&nbsp;(4) 公开文档发布后，他人才可以看到自己的这个文档。
              <br />
              &nbsp;&nbsp;(5) 点击文档发布，进行文档发布。
              <br />
              <br />
              <b>操作演示</b>：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_5_1_1.png')} alt="" />
            <img src={require('../../assets/doc/doc_help_ins_5_1_2.png')} alt="" />
          </div>
          <div id="6. 文档下载">
            <h1>6. 文档下载</h1>
            <p>
              <b>说明</b>：生成的文档可以进行下载，下载时可设置选择剔除来源信息。
              <br />
              <b>操作演示</b>：
              <br />
              点击“文档下载”按钮，可以下载当前文档。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_6_1_1.png')} alt="" />
            <p>
              选择是否包含来源。默认是包含来源的。这里两种都下载。下载后的文档打开后截图如下所示：
              <br />
              ①包含来源的文档：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_6_1_2.png')} alt="" />
            <p>
              ②不包含来源的文档：
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_6_1_3.png')} alt="" />
          </div>
          <div id="7. 个人文档">
            <h1>7. 个人文档</h1>
            <p>
              <b>说明</b>：当已登录时，可以查看个人的所有文档，在个人中心里的文档页签里可以进行对每个文档的发布、编辑、删除操作。
              <br />
              <b>操作演示</b>：
              <br />
              点击“个人文档”按钮，可以跳转到个人中心里的文档页签下。
              <br />
            </p>
            <img src={require('../../assets/doc/doc_help_ins_7_1_1.png')} alt="" />
            <p>
              在这里，可以对文档进行发布、编辑、删除操作。
              <br />
              每个文档右侧的三个图标按钮从左往右，依次为：发布、编辑、删除。
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
