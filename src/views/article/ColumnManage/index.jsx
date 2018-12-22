import React from 'react';
import Pagination from '../../../components/pagination/';
import axios from 'axios';
import './index.less';
import { Form, Table, Row, Button, Modal, Input, message } from 'antd';

// form 布局配置
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19, offset: 1 },
  },
};

class ArticleAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tableLoading: false,
      showModal: false,
    };
    this.selectedColumn = {};
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.fetchList = this.fetchList.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleEditColumn = this.handleEditColumn.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.hasNext = false;
    this.current = 0;
    this.pageSize = 30;
    // table 配置
    this.columnConf = [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: "center"
    }, {
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      align: "center"
    }, {
      title: '文章总数',
      dataIndex: 'count',
      key: 'count',
      align: "center"
    }, {
      title: '创建时间',
      dataIndex: 'createdText',
      key: 'createdText',
      align: "center"
    }, {
      title: '操作',
      key: 'operation',
      align: "center",
      render: (item) => ( <a href="javascript:;" onClick={() => this.handleEditColumn(item)}>编辑</a>)
    }];
  }
  // 分页组件页数变更回调
  handlePaginationChange(current) {
    this.current = current;
    this.fetchList();
  }

  // 编辑显示新增栏目弹窗
  handleEditColumn(item) {
    this.selectedColumn = {
      title: item.title,
      id: item.id,
    };
    this.handleShowModal();
  }
  // 显示新增栏目弹窗
  handleShowModal(item) {
    this.setState({
      showModal: true,
    });
  }
  // 获取列表
  fetchList() {
    this.setState({
      tableLoading: true,
    });
    axios
      .get(`http://localhost:9090/bs/article/column.json?current=${this.current}&pageSize=${this.pageSize}`)
      .then(({ data }) => {
        if (data.flag === 1) {
          const columns = data.data;
          this.hasNext = columns.length >= this.pageSize;
          this.setState({
            columns,
            tableLoading: false,
          });
        } else {
          message.error(data.msg);
          this.setState({
            tableLoading: false,
          });
        }
      })
  }

  // 弹窗取消
  handleCancel() {
    this.selectedColumn = {};
    this.setState({
      showModal: false,
    });
  }

  // modal确定触发form提交
  handleFormSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const data = {
          ...values,
        };
        this.selectedColumn.id && (data.id = this.selectedColumn.id);
        axios({
          url: 'http://localhost:9090/bs/article/column.json',
          method: Object.keys(this.selectedColumn).length ? 'put' : 'post',
          data,
        }).then(({data}) => {
          if (data.flag === 1) {
            message.success('保存成功');
            this.handleCancel();
            this.fetchList();
          } else {
            message.error(data.msg);
          }
        })
      }
    });
  }

  componentDidMount() {
    this.fetchList();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { columns, tableLoading, showModal } = this.state;
    return (
      <div className="column-manage">
        <Row className="add-column">
          <Button
            type="primary"
            onClick={this.handleShowModal}
          >
            新增栏目
          </Button>
        </Row>
        <Table
          pagination={false}
          columns={this.columnConf}
          dataSource={columns}
          loading={tableLoading}
          rowKey={item => item.id}
        />
        <Pagination
          current={this.current}
          disableNext={!this.hasNext}
          onChange={this.handlePaginationChange}
        />
        <Modal
          destroyOnClose
          title={`${Object.keys(this.selectedColumn).length ? '编辑' : '新增'}栏目`}
          visible={showModal}
          closable={false}
          okText="提交"
          cancelText="取消"
          onCancel={this.handleCancel}
          onOk={this.handleFormSubmit}
        >
          <Form>
            <Form.Item {...formItemLayout} label="标题">
              {
                getFieldDecorator('title', {
                  rules: [{required: true, message: '标题不能为空'}],
                  initialValue: this.selectedColumn.title || '',
                })(
                  <Input placeholder="标题" type="text" autoComplete="off" />
                )
              }
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(ArticleAdd);
