import React from 'react';
import { Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Home from './components/Home';


const BaseRouter = (props) => (
    <div>
        <Route exact path='/' name="home" render={(routeProps) => <Home {...routeProps} {...props}/>}></Route>
        <Route path="/login" render={(routeProps) => <LoginForm {...routeProps} {...props}/>}></Route>
        <Route path="/register" render={(routeProps) => <RegisterForm {...routeProps} {...props}/>}></Route>
    </div >

);

export default BaseRouter;