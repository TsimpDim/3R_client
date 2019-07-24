import 'antd';
import React from 'react';
import { Layout } from 'antd';
import './Layout.scss';
import CustomHeader from '../components/Header';

const { Content } = Layout;

export default class CustomLayout extends React.Component {

    render (){

        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {...this.props})
        );
        
        return (
            <Layout>
                <CustomHeader {...this.props}/>

                <Content style={{background:'white', borderTop:'1px solid lightgrey'}}>
                    { childrenWithProps }
                </Content>
            </Layout>
        )
    };

}
