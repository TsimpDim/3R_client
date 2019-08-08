import 'antd'
import React from 'react'
import { Menu, Icon, Layout, message } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import * as actions from '../store/actions/auth'
import { NavLink, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { succ_logout } from './shared/messages'
import axios from 'axios'
import { inf_set_sort, succ_set_sort, err_set_sort } from './shared/messages'

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

    setSort = (type) => {
        inf_set_sort();

        axios.patch("http://localhost:8000/api/options/", {

            sort:type

        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            succ_set_sort();
        })
        .catch(err => {
            console.log(err);
            err_set_sort();
        });
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
                    
                    <SubMenu
                    title={
                        <span>
                            <Icon type="setting"/>
                            Options
                        </span>
                    }
                    >

                    
                        <SubMenu
                        title={
                            <span>
                                <Icon type="swap"/>
                                Sort
                            </span>
                        }
                        >

                            <Menu.Item key="sort_title_asc" onClick={() => {this.setSort("AAS")}}>
                                <Icon type="sort-ascending" /> Title - Ascending
                            </Menu.Item>
                            <Menu.Item key="sort_title_desc" onClick={() => {this.setSort("ADE")}}>
                                <Icon type="sort-descending" />Title - Descending
                            </Menu.Item>
                            <Menu.Item key="sort_time_asc" onClick={() => {this.setSort("TAS")}}>
                                <Icon type="to-top" style={{transform:"rotate(180deg)"}}/>Time - Ascending (now - before)
                            </Menu.Item>
                            <Menu.Item key="sort_time_desc" onClick={() => {this.setSort("TDE")}}>
                                <Icon type="to-top" />Time - Descending (before - now)
                            </Menu.Item>
                        </SubMenu>

                    </SubMenu>

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
