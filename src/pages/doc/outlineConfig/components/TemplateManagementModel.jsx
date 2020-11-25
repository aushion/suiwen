import { Modal, Input, Card, Table, Button, message, Col, Row, Divider, Tooltip, Tree, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { EditOutlined, DeleteOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';

let editFlag = false;
const { TreeNode } = Tree;
const TemplateManagementModel = props => {
    const { modalVisible, onCancle,  } = props;

    const { TextArea } = Input;
    //多选框参数
    const [selectedRows, setSelectedRows] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState('');
    //编辑行数据相关
    const [tableEditedname, setTableEditedname] = useState('');
    const [inputIndex, setInputIndex] = useState(-1);
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([]);

    useEffect(() => {
        //加载文档模版数据
        getDocTemplate();


    }, [editFlag]);

    //获取所有的文档模版
    function getDocTemplate() {
        props.dispatch({
            type: 'Doc/getTemplateList'
        });
    }



    //多选框
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    //多选框触发事件
    function onSelectChange(selectedRowKeys, selectedRows) {
        setSelectedRows(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    }

    let columns = [
        { title: '序号', dataIndex: 'key', key: 'key', align: 'center', width: '10%' },
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '65%',
            render: (text, record, index) => {
                return <>
                    <TextArea
                        id={"nameInput" + record.id}
                        style={{ border: 0 }}
                        title={record.name}
                        autoSize={{ minRows: 1, maxRows: 10 }}
                        value={(index === inputIndex) ? (tableEditedname) : record.name}
                        //判断点击的键盘的keyCode是否为13，是就调用更新保存函数
                        onPressEnter={(e) => {
                            if (e.nativeEvent.keyCode === 13) { //e.nativeEvent获取原生的事件对像
                                //调用更新保存函数
                                editTemplateName(record);
                            }
                        }}
                        onChange={e => {
                            setTableEditedname(e.target.value.trim());
                            setInputIndex(index);
                            editFlag = true;

                        }}
                        onBlur={() => {
                            //调用更新保存函数
                            editTemplateName(record);
                        }}

                    />
                </>
            },
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            align: 'center',
            width: '25%',
            render: (text, record, index) => (

                <span>
                    {editFlag === true ?
                        (index === inputIndex ? <CheckOutlined onClick={(() => { editTemplateName(record) })} title="保存" />
                            : <EditOutlined onClick={(() => { document.getElementById("nameInput" + record.id).focus() })} title="编辑" />)
                        : <EditOutlined onClick={(() => { document.getElementById("nameInput" + record.id).focus() })} title="编辑" />}
                    <Divider type="vertical" />
                    <DeleteOutlined onClick={(() => { deleteTemplate({ id: record.id }) })} title="删除" />
                    <Button
                        type="primary"
                        size="small"
                        ghost
                        style={{ margin: '0 3px' }}
                        onClick={() => {
                            setTreeData(record.routeTemplate);
                        }}
                    >
                        展示提纲
          </Button>
                </span>
            ),
        },
    ]

    //定义数据数组并为其填充数据
    let docTemplateData = [];
    if (props.docTemplateData) {
        // console.log('nameSourceData', nameSourceData);
        for (let i = 0; i < props.docTemplateData.length; i++) {
            // console.log(nameSourceData[i].orderNum);
            docTemplateData.push({
                key: i + 1,
                id: props.docTemplateData[i].id,
                name: props.docTemplateData[i].name,
                routeTemplate: props.docTemplateData[i].routeTemplate,

            });
        }
    }

    //根据模板id编辑对应的模板名称
    function editTemplateName(record) {
        message.success('空响应 根据模板id编辑对应的模板名称事件 ！');

    }



    //批量删除操作触发事件
    function batchDeleteNodename() {
        if (selectedRows === '' || selectedRows.length === 0) {
            message.warning('请选择一条记录!');
            return;
        }
        var ids = new Array();
        selectedRows.forEach(value => ids.push(value.id));
        batchDeleteTemplateByids({ ids: ids });
    }

    //批量删除模板
    function batchDeleteTemplateByids(payload) {
        Modal.confirm({
            title: '确定批量删除选择的模板吗?',
            centered: true,
            onOk() {



                setSelectedRows(null);
                setSelectedRowKeys(null);
            }

        });
    }

    //删除指定的模板
    function deleteTemplate(payload) {
        Modal.confirm({
            title: '确定删除选择的模板吗?',
            centered: true,
            onOk() {



                setSelectedRows(null);
                setSelectedRowKeys(null);
            }

        });
    }


    //提交按钮事件
    const onHandleOk = () => {
        // const values = {
        //     'orderNum': null,
        //     'id': null,
        //     'parentId': chapterId,
        //     'routeId': data.id,
        //     'name': newNodenames,
        //     'nameSourceData': nameSourceData,

        // };
        props.handleOk();

    };

    const renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={<Tooltip title={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: 300, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>
                                {item.label}
                            </div>
                            <div style={{ float: 'right' }}>
                                <PlusOutlined style={{ marginRight: '10px', fontSize: '14px' }} onClick={(event) => {
                                    //   onAddTaskClicked(item);
                                    event.stopPropagation();
                                }} />

                                <span>
                                    <EditOutlined style={{ marginRight: '10px', fontSize: '14px' }}
                                        onClick={(event) => {
                                            //   onEditTaskButtonClicked(item);
                                            event.stopPropagation();
                                        }} />
                                    <DeleteOutlined style={{ fontSize: '14px' }} onClick={(event) => {
                                        // onDeleteButtonClicked(item.id);
                                        event.stopPropagation();
                                    }} />
                                </span>

                            </div>
                        </div>
                    </Tooltip>} key={item.id + item.label} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.id + item.label} title={<Tooltip title={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: 300, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>
                        {item.label}
                    </div>
                    <div style={{ float: 'right' }}>
                        <PlusOutlined style={{ marginRight: '10px', fontSize: '14px' }} onClick={(event) => {
                            // onAddTaskClicked(item);

                            event.stopPropagation();
                        }} />

                        <span>
                            <EditOutlined style={{ marginRight: '10px', fontSize: '14px' }}
                                onClick={(event) => {
                                    // onEditTaskButtonClicked(item);
                                    event.stopPropagation();
                                }} />
                            <DeleteOutlined style={{ fontSize: '14px' }} onClick={(event) => {
                                // onDeleteButtonClicked(item.id);
                                event.stopPropagation();
                            }} />
                        </span>

                    </div>
                </div>
            </Tooltip>} />;
        });


    return (
        <Modal
            destroyOnClose
            title={"文档模板管理"}
            visible={modalVisible}
            width={1200}
            centered={true}
            onOk={onHandleOk}
            onCancel={onCancle}
        >

            <Card>

                <Row gutter={[24, 24]} >
                    <Col span={12}>
                        <Card>
                            <div style={{ textAlign: 'center', marginTop: 0 }}>
                                <font face="楷体" size="4"><b>模板列表展示</b></font>
                            </div>
                            <div style={{ textAlign: 'right', marginBottom: 20, marginTop: 10 }}>

                                <Button onClick={batchDeleteNodename} loading={props.loading} style={{ marginLeft: 10, color: ' red' }} >
                                    批量删除
                                </Button>

                            </div>
                            <Table
                                rowSelection={rowSelection}
                                loading={props.loading}
                                columns={columns}
                                size='middle'
                                style={{ marginTop: 20, minHeight: 340 }}
                                pagination={false}
                                dataSource={props.docTemplateData}
                            />
                        </Card>

                    </Col>
                    <Col span={12}>
                        <Card>
                            <Tree
                                showLine={true}
                                showIcon={false}

                            // style={{ width: '100%' }}
                            //defaultExpandParent={true}
                            //autoExpandParent={autoExpandParent}
                            //onRightClick={treeNodeonRightClick2}
                            // expandedKeys={expandedKeys}
                            // onSelect={onSelect}
                            // treeData={treeData}
                            >
                                {renderTreeNodes(treeData)}
                            </Tree>
                        </Card>

                    </Col>

                </Row>





            </Card>
        </Modal>
    );
};

export default connect(({ Doc }) => ({

    docTemplateData: Doc.docTemplateData
}))(Form.create()(TemplateManagementModel));
