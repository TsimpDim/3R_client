import React from 'react';
import { Select, Input, Icon, Checkbox, Tooltip } from 'antd'


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
            <InputGroup style={{width:"50%", display:"inline-block", float:"right"}} compact>
                <Tooltip overlay="Check if you want the resources to contain exactly the tags listed">
                    <Checkbox
                    style={{width:"10%", marginTop:".25em"}}
                    onChange={(e) => this.props.setAbsolute(e.target.checked)}
                    >Absolute</Checkbox>
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
                style={{width: "50%"}}
                placeholder="Title may contain..."
                suffix={<Icon type="search"/>}
                maxLength={120}
                onChange={this.onTitleFilterChange}
                />
            </InputGroup>
        );
    }
}