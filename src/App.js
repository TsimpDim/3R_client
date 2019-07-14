import React, { Component } from 'react';
import './App.scss';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from 'react-redux'
import * as actions from './store/actions/auth'
import BaseRouter from './routes';
import CustomLayout from './containers/Layout'

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }


  render() {
    return (
      <div>
        <Router>
          <CustomLayout {...this.props}>
            <BaseRouter {...this.props}/>
          </CustomLayout>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
