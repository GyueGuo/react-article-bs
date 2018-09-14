import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const MENU = [{
  title: '用户管理',
  key: '/user/',
  children: [{
    title: '用户列表',
    link: '/user/user-list',
  }, {
    title: '添加用户',
    link: '/user/user-add',
  }, {
    title: '文章列表',
    link: '/article/article-manage',
  }]
}, {
  title: '文章管理',
  key: '/article/',
  children: [{
    title: '栏目管理',
    link: '/article/column-manage',
  }, {
    title: '添加文章',
    link: '/article/article-add',
  },{
    title: '文章审核',
    link: '/article/article-auditing',
  }, {
    title: '文章列表',
    link: '/article/article-manage',
  }]
}];
const PATHNAME = window.location.pathname;
class App extends React.Component {
  constructor(props) {
    super(props);

    let i = 0;
    const length = MENU.length;
    let defaultSelectedKeys;
    let openKeys = [];
    for (; i < length; i++) {
      const menu = MENU[i];
      const children = menu.children;
      const childrenLength = children.length;
      if (PATHNAME.indexOf(menu.key) === 0) {
        openKeys = [menu.key];
      }
      let ci = 0;
      for (; ci < childrenLength; ci++) {
        if (PATHNAME === children[ci].link) {
          defaultSelectedKeys = [children[ci].link];
          break;
        }
      }
    }
    this.state = {
      openKeys,
      defaultSelectedKeys,
    };
    console.log()
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }
  handleMenuChange(keys) {
    const length = keys.length;
    const openKeys = length ? [keys[keys.length - 1]] : [];
    console.log(openKeys);
    this.setState({ openKeys });
  }

  render(props) {
    return (
      <Layout>
        <Header></Header>
        <Layout>
          <Sider width={160}>
            <Menu
              mode="inline"
              theme="dark"
              onOpenChange={this.handleMenuChange}
              defaultSelectedKeys={this.state.defaultSelectedKeys}
              openKeys={this.state.openKeys}
            >
            {
              MENU.map((item) => {
                return (
                  <SubMenu key={item.key} title={ item.title }>
                    { item.children.map((child) => {
                      return (
                        <Menu.Item key={child.link}>
                          <Link to={child.link}>{child.title}</Link>
                        </Menu.Item>
                      )
                    })}
                  </SubMenu>
                )
              })
            }
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 480 }}>
              { this.props.children }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
export default App;