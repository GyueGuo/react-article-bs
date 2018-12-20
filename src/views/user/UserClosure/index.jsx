import React from 'react';
import axios from 'axios';
import Pagination from '../../../components/pagination';
import ShowUserInfo from './ShowUserInfo.jsx';
import { Table, Input, Col, Row, Form, Button, message, Select } from 'antd';
import './index.less';

class UserClosure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      showModal: false,
      tableLoading: true,
    };
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleValid = this.handleValid.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleClosure = this.handleClosure.bind(this);

    this.columnConf = [{
      title: '用户名',
      dataIndex: 'username',
      key: 'id',
      align: "center",
    }, {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: "center",
    } ,{
      title: '创建时间',
      dataIndex: 'createTimeText',
      key: 'createTimeText',
      align: "center",
    }, {
      title: '封禁时间',
      dataIndex: 'closureTimeText',
      key: 'closureTimeText',
      align: "center",
    }, {
      title: '封禁原因',
      dataIndex: 'closureText',
      key: 'closureText',
      align: "center",
    }, {
      title: '操作',
      key: 'operation',
      align: "center",
      render: (item) => (
        <React.Fragment>
          <a href="javascript:;" onClick={() => {this.handleRecover(item.id)}}>解封</a>
        </React.Fragment>
      ),
    }];
    this.pageSize = 30;
    this.current = 0;
    this.disableNext = true;   
    this.selected = null;
  }

  handlePaginationChange(current) {
    this.currentPage = current;
    this.fetchList();
  }

  handleValid(rule, value, callback) {
    let msg;
    if (!value) {
      const { form } = this.props;
      const type = form.getFieldValue('type');
      switch (type) {
        case '1':
          msg = '昵称不能为空';
          break;
        case '2':
          msg = '用户id不能为空';
          break;
        default:
          msg = '用户名不能为空';
          break;
      }
    }
    callback(msg);
  }

  handleHideModal() {
    this.selected = null;
    this.setState({
      showModal: false,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        message.loading('查询中...');
        axios({
          url: `http://localhost:9090/bs/user/search.json`,
          method: 'post',
          data: values,
        }).then(({ data }) => {
          message.destroy();
          if (data.flag === 1) {
            if (data.data.length) {
              this.selected = data.data;
              this.setState({
                showModal: true,
              });
            } else {
              message.warn('未查找到对应用户');
            }
          } else {
            message.error(data.msg);
          }
        }).catch(() => {
          message.destroy();
          message.error('请检查网络');
        })
      }
    });
  }
  handleClosure(msg) {
    if (msg) {
      message.error(msg);
    } else {
      this.fetchList();
    }

    this.setState({
      showModal: false,
    });
  }
  
  fetchList() {
    this.setState({
      tableLoading: true,
    });
    axios.get(`http://localhost:9090/bs/user/closure.json?pageSize=${this.pageSize}&current=${this.current}`)
      .then(({ data }) => {
        const state = {
          tableLoading: false,
        };
        if (data.flag === 1) {
          this.disableNext = data.data.length < this.pageSize;
          state.list = data.data;
        } else {
          message.error(data.msg);
        }
        this.setState(state);
      })
      .catch((err) => {
        this.setState({
          tableLoading: false,
        });
      });
  }

  componentDidMount() {
    this.fetchList();
  }

  render() {
    const { list, tableLoading, showModal } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className="user-closure">
        <Form layout="inline" onSubmit={this.handleSearch} className="search-form">
          <Form.Item>
            {
              getFieldDecorator('type', {
                initialValue: '0',
              })(
                <Select>
                  <Select.Option value="0">用户名</Select.Option>
                  <Select.Option value="1">昵称</Select.Option>
                  <Select.Option value="2">用户id</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          
          <Form.Item>
            {
              getFieldDecorator('id', {
                rules: [{
                  required: true,
                  validator: this.handleValid,
                }],
                initialValue: '',
              })(
                <Input autoComplete="off" />
              )
            }
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">搜索用户</Button>
          </Form.Item>
        </Form>
        <Table
          pagination={false}
          rowKey={(row) => row.id}
          dataSource={list}
          loading={tableLoading}
          columns={this.columnConf}
        />
        <Pagination
          current={this.current}
          onChange={this.handlePaginationChange}
          disableNext={this.disableNext}
        />
        {
          this.selected ? (<ShowUserInfo
            userInfo={this.selected}
            visible={showModal}
            onCancel={this.handleHideModal}
            onOk={this.handleClosure}
          />) : null
        }
      </div>
    );
  }
}

export default Form.create()(UserClosure);
