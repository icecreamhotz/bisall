import React from 'react'
import axios from 'axios'
import { Layout, Menu, Breadcrumb, Icon, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom'
import Headers from './Header.js'
import ReactToPrint from "react-to-print";
import logo from './logo.png';

const { Content, Footer } = Layout;

class ComponentToPrint extends React.Component {
    state = { emp_code: '', emp_name: '', emp_lastname: '', emp_tel: '', emp_address: '', pos_name: '', pos_id: '' }

    async componentDidMount() {
       await axios.get(`http://l3est.cis-training.com/bisall/api/auth/employee?token=${localStorage.getItem('token')}`)
       .then((result) => {
           this.setState({
               emp_code: result.data.emp_code,
               emp_name: result.data.emp_name,
               emp_lastname: result.data.emp_lastname,
               emp_tel: result.data.emp_tel,
               emp_address: result.data.emp_address,
               pos_id: result.data.pos_id
           })
       })
       await axios.get(`http://l3est.cis-training.com/bisall/api/positions/${this.state.pos_id}`)
       .then((result) => {
           this.setState({
               pos_name: result.data.pos_name
           })
       })
    }
  render() {
    return (
      <div class="container-fluid main">
                    <div class="card profile">
                            <div class="card-header profileName" style={{marginTop:'120px'}}>
                        {this.state.emp_tel}
                        <br/>
                        </div>
                        <div class="card-body profileBody">
                        
                        <div class="profilePic">
                                 <img class="avatar" src={logo} alt="employee" />
                        </div>
                        <div class="profileInfo">
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default class Backcard extends React.Component {

    render() {
        return(
            <div>
            <Layout>
                <Headers />
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <ReactToPrint
                        trigger={() => <a style={{zIndex: '999',position:'absolute',top:'90px'}}>พิมพ์แผ่นหลัง</a>}
                        content={() => this.componentRef}
                        />
                        <ComponentToPrint ref={el => (this.componentRef = el)} />
                        <Link to="/frontcard" style={{zIndex: '999',position:'absolute',bottom:'80px'}}>กลับไปพิมพ์แผ่นหน้า</Link>
                </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    BIS All Dummy Company ©2018 Created by BISALLSERVICES
                </Footer>
            </Layout>
            </div>
        )
    }
}