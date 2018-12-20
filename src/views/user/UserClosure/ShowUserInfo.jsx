import React from 'react';
import axios from 'axios';
import { Modal, Table } from 'antd';
import './ShowUserInfo.less';

const defaultColumnConf = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'statusText',
    key: 'statusText',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createText',
    key: 'createText',
    align: 'center',
  }
];
class ShowUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
    this.handleClosure = this.handleClosure.bind(this);
    this.handleRecover = this.handleRecover.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  handleClosure(id) {
    return axios({
      method: 'post',
      url: 'http://localhost:9090/bs/user/closure.json',
      data: {
        id,
      },
    });
  }
  handleRecover(id) {
    return axios({
      method: 'delete',
      url: 'http://localhost:9090/bs/user/closure.json',
      data: {
        id,
      },
    });
  }
  handleOk() {
    const { userInfo, onOk } = this.props;
    const user = userInfo[0];
    const pms = user.status ? this.handleClosure(user.userid) : this.handleRecover(user.userid);
    pms.then(({ data }) => {
      if (data.flag === 1) {
        onOk();
      } else {
        onOk(data.msg);
      }
    });
  }
  shouldComponentUpdate(nextProps) {
    const { visible } = this.state;
    if (visible === nextProps.visible) {
      return false;
    }
    this.setState({
      visible: nextProps.visible,
    });
    return true;
  }

  render() {
    const { userInfo, onCancel } = this.props;
    const { visible } = this.state;
    let columnConf = defaultColumnConf;
    return (
      <Modal
        className="modal-show-userinfo"
        visible={visible}
        keyboard
        width={800}
        closable={false}
        title="用户信息"
        cancelText="取消"
        okText={userInfo[0].status ? '封禁' : '解禁'}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
      {
        userInfo ? (
          <Table
            columns={columnConf}
            dataSource={userInfo}
            pagination={false}
          />) : null
      }
      </Modal>
    )
  }
}

export default ShowUserInfo;
