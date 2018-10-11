import React from 'react';
import { Table, Input, Select, Botton } from 'antd';
import './index.less';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      tableLoading: true,
    };
    this.columnConf = [{
      title: '用户id',
      dataIndex: 'id',
      key: 'id',
      align: "center"
    }, {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: "center"
    } ,{
      title: '创建时间',
      dataIndex: 'created',
      key: 'created',
      align: "center"
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: "center"
    }, {
      title: '操作',
      key: 'operation',
      align: "center",
      render: (item) => (
        <React.Fragment>
          <a href="javascript:;" onClick={() => {this.handleDelete(item.id)}}>封禁</a>
          {' '}|{' '}  
          <a href="javascript:;" onClick={() => {this.handleEdit(item.id)}}>编辑</a>
        </React.Fragment>
      )
    }];
  }

  render() {
    const { list, tableLoading } = this.state;
    return (
      <div className="user-list">
        <Table
          pagination={false}
          rowKey={(row) => row.id}
          dataSource={list}
          loading={tableLoading}
          columns={this.columnConf}
        />
      </div>
    );
  }
}

export default UserList;
