import React from 'react';
import classnames from 'classnames';
import './index.less';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
      disableNext: props.disableNext,
    };
    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler(action) {
    const { disableNext, current } = this.state;
    if ((['index', 'prev'].includes(action) && current === 0) || (action === 'next' && disableNext)) {
      return false;
    }
    let page = current;
    switch (action) {
      case 'index':
        page = 0;
        break;
      case 'prev':
        page = current - 1;
        break;
      case 'next':
        page = current + 1;
        break;
      default:
        return;
    }
    this.props.onChange(page);
  }
  componentWillReceiveProps(props) {
    this.setState({
      current: props.current,
      disableNext: props.disableNext,
    });
  }
  shouldComponentUpdate(nextProps, nextState){
    const { current, disableNext } = this.state;
    return (nextState.current !== current || nextState.disableNext !== disableNext);
  }
  render() {
    const { disableNext, current } = this.state;
    const prevClass = classnames({
      'ant-pagination-prev': true,
      'ant-pagination-disabled': current === 0,
    });
    const nextClass = classnames({
      'ant-pagination-next': true,
      'ant-pagination-disabled': disableNext,
    });
    return (
      <ul className="ant-pagination custom-pagination">
        <li className="ant-pagination-total-text">当前页数：第{current + 1}页</li>
        <li className="ant-pagination-item">
          <a className={prevClass} onClick={() => this.clickHandler('index')}>
            首页
          </a>
        </li>
        <li className="ant-pagination-item">
          <a className={prevClass} onClick={() => this.clickHandler('prev')}>
          上一页
          </a>
        </li>
        <li className="ant-pagination-item">
          <a className={nextClass} onClick={() => this.clickHandler('next')}>
            下一页
          </a>
        </li>
      </ul>
    );
  }
}

export default Pagination;

