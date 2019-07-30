import React from 'react';
import { Select, Input, Icon } from 'antd'
import axios from 'axios'


const InputGroup = Input.Group;
const { Option } = Select;

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

    onTitleFilterChange = (e) => {
        this.props.setTagsFilter(e.target.value);
    }

    onTagsFilterChange = (e) => {
        this.props.setTextFilter(e.target.value);
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
                    showArrow
                    allowClear
                    onChange={this.onTitleFilterChange}
                >
                    {this.state.tags}
                </Select>

                <Input
                style={{ width: '50%' }}
                placeholder="Title may contain..."
                suffix={<Icon type="search"/>}
                maxLength={120}
                onChange={this.onTagsFilterChange}
                />
            </InputGroup>
        );
    }
}