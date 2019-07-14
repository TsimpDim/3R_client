import 'antd';
import React from 'react';
import { Layout } from 'antd';
import './Layout.scss';
import CustomHeader from '../components/Header';

const { Content } = Layout;

export default class CustomLayout extends React.Component {

    render (){ 
        return (
            <Layout>
                <CustomHeader {...this.props}/>

                <Content style={{background:'white', borderTop:'1px solid lightgrey'}}>
                    {this.props.children}
                </Content>
            </Layout>
        )
    };

}
