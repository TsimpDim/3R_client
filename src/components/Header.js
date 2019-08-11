import React from 'react'
import { Menu, Icon, Layout } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import * as actions from '../store/actions/auth'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { succ_logout } from './shared/messages'

const { Header } = Layout;

class CustomHeader extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            selection: this.getSelectedKey(),
        }
    }

    
    getSelectedKey = () => {
        let path = this.props.location.pathname;
        let custSelection = this.props.history.state;
    
        let fallbackSelection = /\/(\w*)\/?/.exec(path)[1];

        if(custSelection !== undefined)
            return custSelection.selection;
        else
            if(path === '/')
                return 'resources';
            else
                return fallbackSelection;
    }

    render(){
        return (
            <Header className="header">
                <div className="logo logo-header">
                    <span className="logo-gold">3</span>
                    R
                </div>

                <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                selectedKeys={[this.getSelectedKey()]}
                >

                    <Menu.Item key="resources">
                        <Icon type="appstore"/>
                        Resources
                        <NavLink to='/'></NavLink>
                    </Menu.Item>
                    
                    <Menu.Item key="trash">
                        <Icon type="delete"/>
                        Trash
                        <NavLink to='/trash'></NavLink>
                    </Menu.Item>

                    <SubMenu
                    title={
                        <span>
                            <Icon type="user"/>
                            User
                        </span>
                    }
                    >

                        {this.props.isAuthenticated ?
                            <Menu.Item key="logout" onClick={this.props.logout}>
                                <Icon type="logout"/>
                                Logout
                                <NavLink to="/" onClick={succ_logout}></NavLink>
                            </Menu.Item>

                        :
                            <Menu.Item key="login">
                                <Icon type="login"/>
                                Login
                                <NavLink to="/login"></NavLink>
                            </Menu.Item>
                        }

                        {!this.props.isAuthenticated &&
                            <Menu.Item key="register">
                                <Icon type="user-add"/>
                                Register
                                <NavLink to="/register"></NavLink>
                            </Menu.Item>
                        }
                        </SubMenu>
                    </Menu>
                </Header>
            )
        }
    }

const MapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, MapDispatchToProps)(CustomHeader));
