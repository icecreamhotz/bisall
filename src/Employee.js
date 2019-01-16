import React, { Component } from 'react'
import axios from 'axios'
import { Layout, Menu, Breadcrumb, Collapse, Row, Col, Divider, Button, Modal, Input, Icon } from 'antd';
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const Panel = Collapse.Panel;

class Employee extends Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false, 
            emp_code: '', 
            confirmLoading: false, 
            password: '',
            empData: [],
            posData: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.getLengthForDivider = this.getLengthForDivider.bind(this)
        this.success = this.success.bind(this)
    }

    async componentDidMount() {
        if(localStorage.getItem('token')) {
            this.props.history.push('/')
        }

        await axios.get('http://l3est.cis-training.com/bisall/api/employees')
        .then((result) => {
            this.setState({
                empData: result.data
            })
        })  
        
        await axios.get('http://l3est.cis-training.com/bisall/api/positions')
        .then((result) => {
            this.setState({
                posData: result.data
            })
        })
    }

    handleChange = (e) => {
        this.setState({password: e.target.value})
    }

    showModal = (code) => {
        this.setState({
            visible: true,
            emp_code: code
        });
    }

    handleOk = async (e) => {
        this.setState({
            confirmLoading: true,
        });
        await axios.post(`http://l3est.cis-training.com/bisall/api/employees/${this.state.emp_code}`, {
            emp_password: this.state.password
        })
        .then((result) => {
            this.success()
            this.setState({
                visible: false,
                confirmLoading: false,
            })
            this.props.history.push('/')
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    getLengthForDivider = (data) => {
        const getLength = this.state.empData.filter((item) => { return item.pos_id === data })
        const length = getLength.length
        
        return length == 1 ? true : false
    }

    success = () => {
        Modal.success({
            title: 'This is a success message',
            content: 'some messages...some messages...',
        });
    }

    render() {
        return(
            <div>
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/employee">รายชื่อ</Link></Menu.Item>
                    <Menu.Item key="2">อื่นๆ</Menu.Item>
                    <Menu.Item key="3"><Link to="/login">เข้าสู่ระบบ</Link></Menu.Item>
                </Menu>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0' }}>
                     <Collapse accordion>
                        {this.state.posData.map(item => {
                            return  <Panel header={item.pos_name} key={item.pos_id}>
                                        {this.state.empData.filter((emp) => {
                                            return emp.pos_id === item.pos_id
                                        }).map((data, index) => {
                                            return <div>
                                                <Row style={{padding: '25px 0', textAlign: 'center',
                                                    backgroundColor: (data.updated_at == null ? '#a0d911' : '#ff7875')}}>
                                                    <Col lg={{span: 3}}><h4>{(data.updated_at == null ? 'ว่าง' : 'ไม่ว่าง')}</h4></Col>
                                                    <Col lg={{span: 5}}><h4>{data.emp_code}</h4></Col>
                                                    <Col lg={{span: 6}}><h4>{data.emp_name}</h4></Col>
                                                    <Col lg={{span: 6}}><h4>{data.emp_lastname}</h4></Col>
                                                    <Col lg={{span: 4}}><Button type="primary" onClick={() => {this.showModal(data.emp_code)}} disabled={(data.updated_at != null ? true : false)}><h4>เลือกรหัสนี้</h4></Button></Col>
                                                </Row>
                                                {(this.getLengthForDivider(data.pos_id) ? '' : <Divider/>)}
                                                </div>
                                        })}
                                    </Panel>
                        })
                        }
                    </Collapse>
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    BIS All Dummy Company ©2018 Created by BISALLSERVICES
                </Footer>
                <Modal
                    title="กรุณาใส่รหัสผ่าน"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    >
                    <p>รหัสที่คุณเลือกคือ <b>{this.state.emp_code}</b></p>
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" name="emp_password" value={this.state.password} onChange={this.handleChange} />
                    <p style={{fontWeight:'bold', marginTop: '10px'}}>หมายเหตุ : หากยืนยันบันทึกรหัสนี้แล้วให้ยึดว่าใช้รหัสสตาฟนี้เป็นหลักเลย</p>
                </Modal>
            </Layout>
            </div>
        )
    }
}

export default withRouter(Employee);