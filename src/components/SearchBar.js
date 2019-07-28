import React from 'react';
import { Button, Select, Input, Tooltip, Icon } from 'antd'
import axios from 'axios'


const InputGroup = Input.Group;
const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}


export default class SearchBar extends React.Component{

    constructor(props){
        super(props);
    
        this.state = {
            tags: [],
        }
    }

    componentDidMount() {
        this.getTags();
    }

    getTags = () => {
        axios.get("http://localhost:8000/api/tags/",
        {
            headers:{
                "Authorization": "Token " + localStorage.getItem('token'),
            }
        })
        .then(res => {
            this.setState({ tags: res.data })
        })
        .catch(err => console.log(err));
    }


    render(){
        return (
            <InputGroup style={{width:"50%", display:"inline-block", float:"right"}} compact>


                <Select
                    mode="multiple"
                    placeholder="Tags may contain..."
                    style={{width:"50%"}}
                    suffixIcon={<Icon type="tag" />}
                    showArrow={true}
                >
                    {this.state.tags}
                </Select>
                <Input
                style={{ width: '50%' }}
                placeholder="Title may contain..."
                suffix={<Icon type="search"/>}
                maxLength="120"
                />
            </InputGroup>
        );
    }
}