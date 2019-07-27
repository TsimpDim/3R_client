import React, { Component } from 'react'
import { List, Icon,Tag } from 'antd'
import { Redirect } from 'react-router-dom'
import './styles/Home.scss'
import axios from 'axios'
import { err_delete, succ_delete, err_recover, succ_recover } from './shared/messages'

export default class DeletedResources extends Component {


    constructor(props){
        super(props);

        this.state = {
            loading : false,
            deletedResources : [],
            shrunk: false
        }
    }

	// Remove resize listener
	componentWillUnmount() {
		window.removeEventListener("resize", this.resize);
    }
    
    resize() {
		let toShrink = (window.innerWidth <= 760); // 760px is deemed to be the limit
		if (toShrink !== this.state.shrunk)
			this.setState({shrunk: toShrink})
	}

    refreshList = () => {
        this.setState({ loading: true });

        axios.get("http://localhost:8000/api/trash/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => this.setState({ deletedResources: res.data, loading:false }))
        .catch(err => console.log(err));
    }

    deleteResource = (idx) => {
        this.setState({ loading: true });

        axios.delete("http://localhost:8000/api/trash/"+idx+"/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({
                deletedResources: this.state.deletedResources.filter(item => item.id !== idx),
                loading:false
            });
            succ_delete();
        })
        .catch(err => {
            err_delete();
            console.log(err)
        });
    }

    recoverResource = (idx) => {
        this.setState({ loading: true });

        axios.patch("http://localhost:8000/api/trash/"+idx+"/",
        {
            visible:true
        },{
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({
                deletedResources: this.state.deletedResources.filter(item => item.id !== idx),
                loading:false 
            });

            succ_recover();
        })
        .catch(err => {
            err_recover();
            console.log(err)
        });
    }

    componentDidMount(){
        // Add refresh listener
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        
        // Update list
        this.refreshList();
    }


    render() {
        if(!this.props.isAuthenticated)
            return(
                <Redirect to={{
                    pathname:"/login",
                    state:"redir"
                }}/>
            )
        else
            return (
                <div style={{display:"flex column", padding:"2em"}}>
                    <List
                    size="small"
                    dataSource={this.state.deletedResources}
                    renderItem={item => (
                        <List.Item
                        actions={[
                            <Icon
                            title="Recover"
                            type="undo"
                            style={{fontSize:"2em"}}
                            onClick={() => this.recoverResource(item.id)}
                            />,
                            <Icon
                            title="Delete Permanently"
                            type="close"
                            style={{color:"red", fontSize:"2em"}}
                            onClick={() => this.deleteResource(item.id)}
                            />
                        ]}
                        >

                            <List.Item.Meta
                            style={{wordBreak:"break-all"}}
                            title={<span style={{color:"#108ee9"}}>{item.title}</span>}
                            description={item.url}
                            />

                            {this.state.shrunk ? null : 
                            item.tags && item.tags.map(item => (
                                <Tag key={item} style={{marginTop:"10px"}}>{item}</Tag>
                            ))}
                        </List.Item>
                    )}
                    />
                </div>
            )
    }
}
