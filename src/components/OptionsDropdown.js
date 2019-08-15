import React from 'react'
import { Menu, Icon, Dropdown, Button } from 'antd'
import SubMenu from 'antd/lib/menu/SubMenu'
import axios from 'axios'
import { inf_set_sort, succ_set_sort, err_set_sort } from './shared/messages'




export default class OptionsDD extends React.Component {

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
            this.props.triggerRefresh();
            succ_set_sort();
        })
        .catch(err => {
            console.log(err);
            err_set_sort();
        });
    }

    menu = (

        <Menu>
            <SubMenu
                title={
                    <span>
                        <Icon type="swap"/> Sort
                    </span>
                }
            >
    
                <Menu.Item
                key="AAS"
                onClick={() => {this.setSort("AAS")}}
                >
                    <Icon type="sort-ascending" />Title - Ascending
                </Menu.Item>

                <Menu.Item
                key="ADE"
                onClick={() => {this.setSort("ADE")}}>
                    <Icon type="sort-descending" />Title - Descending
                </Menu.Item>

                <Menu.Item
                key="TAS"
                onClick={() => {this.setSort("TAS")}}>
                    <Icon type="to-top" />Time - Ascending (before - now)
                </Menu.Item>

                <Menu.Item
                key="TDE"
                onClick={() => {this.setSort("TDE")}}>
                    <Icon type="to-top" style={{transform:"rotate(180deg)"}}/>Time - Descending (now - before)
                </Menu.Item>
            </SubMenu>
        </Menu>
    
    );    

    render(){
        return (
            <Dropdown overlay={this.menu} placement="bottomCenter">
                <Button size="large"><Icon type="setting" /></Button>
            </Dropdown>
        )
    }
}