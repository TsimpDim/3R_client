import React, { Component } from 'react'
import './styles/Home.scss'
import { Icon } from 'antd';
import { Redirect } from 'react-router-dom'

export default class Home extends Component {
    render() {
        if(!this.props.isAuthenticated)
            return (
                <Redirect push to={{
                        pathname:'/login',
                        state:"redir"
                        }} 
                />
            );
        else
            return (
                <div id="flex-container">
                    
                    {
                        !this.props.isAuthenticated ? 
                    
                    <h1><Icon type="frown" /> You are not logged in.</h1>
                    
                        :
                    
                    <h1><Icon type="smile" /> You are logged in.</h1>

                    }

                </div>
            )
    }
}
