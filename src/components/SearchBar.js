import React from 'react';
import { Select, Input, Icon } from 'antd'


const InputGroup = Input.Group;

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