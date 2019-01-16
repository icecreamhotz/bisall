import React from 'react'
import axios from 'axios'
import { Menu, Layout, Dropdown, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom'

const { Header } = Layout

class Headers extends React.Component {
    constructor(props) {
        super(props)
    }

    state = { employee: '', visible: false }

    async componentDidMount() {
        if(!localStorage.getItem('token')) {
            this.props.history.push('/login')
        }
       await axios.get(`http://l3est.cis-training.com/bisall/api/auth/employee?token=${localStorage.getItem('token')}`)
       .then((result) => {
           this.setState({employee: result.data})
       })
       .catch((err) => {
           localStorage.removeItem('token')
           this.props.history.push('/login')
       })
    }

    logout = () => {
        localStorage.removeItem('token')
        this.props.history.push('/login')
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <Link to="/profile">ข้อมูลส่วนตัว</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/staffcard">พิมพ์บัตรสตาฟ</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/timelines">ค้นหาสถานะทำงาน</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <a onClick={() => {this.logout()}}>ออกจากระบบ</a>
                </Menu.Item>
            </Menu>
        )
        const linkUrl = (window.atob(localStorage.getItem('checkpos')) == 11) ? '/worktimes' : '/managetimes'
        const linkContent = (window.atob(localStorage.getItem('checkpos')) == 11) ? 'ตารางงาน' : 'จัดตารางงาน'
        let pos
        if(this.props.location.pathname == '/') {
            pos = '1'
        } else if(this.props.location.pathname == '/worktimes' || this.props.location.pathname == '/managetimes') {
            pos = '2'
        } else {
            pos = '3'
        }
        return(
            <div>
            <Header style={{ position: 'fixed', zIndex: 999, width: '100%' }}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[pos]}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">หน้าหลัก</Link></Menu.Item>
                    <Menu.Item key="2">
                        <Link to={linkUrl}>
                            {linkContent}
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                    <Dropdown  overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                        {this.state.employee.emp_code}<Icon type="down" />
                        </a>
                    </Dropdown>
                    </Menu.Item>
                </Menu>
            </Header>
            </div>
        )
    }
}

export default withRouter(Headers)
