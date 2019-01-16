import React from 'react'
import axios from 'axios'
import { Layout, Menu, Row, Col } from 'antd';
import Headers from './Header.js'
import ReactToPrint from "react-to-print";
import { Link } from 'react-router-dom'

const { Content, Footer } = Layout;

export default class Staffcard extends React.Component {

    render() {
        return(
            <div>
            <Layout>
                <Headers />
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <Link to="/frontcard">พิมพ์ด้านหน้า</Link>
                        <Link to="/backcard">พิมพ์ด้านหลัง</Link>
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