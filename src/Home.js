import React from 'react'
import axios from 'axios'
import { Layout, Menu, Breadcrumb, Form, Icon, Input, Button } from 'antd';
import Headers from './Header.js'

const { Content, Footer } = Layout;

export default class Home extends React.Component {

    state = { user: undefined }

    render() {
        return(
            <div>
            <Layout>
                <Headers/>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380, margin: '16px 0',  display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <p>Hello</p>
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