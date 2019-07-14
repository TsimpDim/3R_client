import React from 'react'
import {
    Form, Icon, Input, Button,
} from 'antd';
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import './styles/LoginForm.scss';
import { ntwrk_err, succ_login, must_auth } from './shared/messages';


class NormalLoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            username: '',
            password: '',
            loading: false,
    };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidMount() {
        if(this.props.location.state === "redir")
            must_auth();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({loading : true});

        this.props.form.validateFields((err) => {
            if(!err)
                this.props.onAuth(this.state.username, this.state.password).then(res => {
                    this.setState({loading : false}); // Added on top to prevent componentWillUnmount errors

                    if(this.props.isAuthenticated){
                        this.props.history.push('/', {
                            selection: "home"
                        });
                        succ_login();
                    }else{
                        if(this.props.error.response === undefined){
                            this.props.form.setFields({
                                "username": {
                                    value: this.props.form.getFieldValue("username"),
                                    errors: [new Error("")],
                                },
                                "password": {
                                    value: "",
                                    errors: [new Error("Network Error")],
                                },
                            });

                            ntwrk_err();
                        }else{
                            this.props.form.setFields({
                                "username": {
                                    value: this.props.form.getFieldValue("username"),
                                    errors: [new Error("")],
                                },
                                "password": {
                                    value: "",
                                    errors: [new Error("Wrong username and/or password. Try again.")],
                                },
                            }); 
                        }               
                    }
                });
            else
                this.setState({loading : false});
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        if(this.props.isAuthenticated)
            return (<Redirect to="/" />)
        else
            return (
                <div id="flex-container">
                    
                        <h3 className="logo"><span className="logo-gold">L</span>ogin</h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your username!',
                                            whitespace: true 
                                        }],
                                })(
                                    <Input name="username" onChange={this.handleChange} prefix={<Icon type="user"/>} placeholder="Username"/>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator("password", {
                                    rules:[
                                        {
                                            required:true,
                                            message:"Please input your password!",
                                            whitespace: true 
                                        }
                                    ]
                                })(
                                    <Input name="password"  type="password" prefix={<Icon type="lock"/>} onChange={this.handleChange} placeholder="Password" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {/* Route <Link> properly when the functionality gets implemented */}
                                <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                                <Link className="login-form-forgot" to=""> Forgot password </Link>
                            </Form.Item>
                        </Form>

                    {this.state.loading &&
                        <div><Icon id="loading-spinner" type="loading" spin /></div>
                    }
                </div>
            );
    }
}




const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username,password) => dispatch(actions.authLogin(username,password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm);