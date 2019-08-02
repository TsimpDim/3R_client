import React from 'react';
import { Select, Input, Icon, Checkbox, Tooltip } from 'antd'
import './styles/SearchBar.scss'

const InputGroup = Input.Group;
const { Option } = Select;

export default class SearchBar extends React.Component{

    onTitleFilterChange = (e) => {
        this.props.setTextFilter(e.target.value);
    }

    onTagsFilterChange = (value) => {
        // Parameter value is an array
        this.props.setTagsFilter(value);
    }

    renderTagOptions = () => {
        return this.props.getTags().map(i => (
            <Option key={i}>{i}</Option>
        ));
    }

    render(){   
        return (
            <div id="search-bar">
                <InputGroup style={{width:"100%"}} compact>
                    <Tooltip overlay="Absolute search. Check if you want the resources to contain exactly the tags listed">
                        <Checkbox
                        style={{width:"10%", marginRight:".5em", marginTop:".25em"}}
                        onChange={(e) => this.props.setAbsolute(e.target.checked)}
                        >Abs</Checkbox>
                    </Tooltip>

                    <Select
                        mode="multiple"
                        placeholder="Tags may contain..."
                        style={{width:"40%"}}
                        suffixIcon={<Icon type="tag" />}
                        showArrow
                        allowClear
                        onChange={this.onTagsFilterChange}
                    >
                        {this.renderTagOptions()}
                    </Select>

                    <Input
                    style={{width: "45%"}}
                    placeholder="Title may contain..."
                    suffix={<Icon type="search"/>}
                    maxLength={120}
                    onChange={this.onTitleFilterChange}
                    />
                </InputGroup>
            </div>
        );
    }
}