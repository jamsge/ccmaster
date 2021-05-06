import React from 'react';
import Form from 'react-bootstrap/Form';


class DropdownSelect extends React.Component{

	handleOptionChange = () =>{
		this.props.select(this.dropdown.value)
	}

	render(){
		return(
				<Form.Control defaultValue={this.props.default} ref={(ref) => this.dropdown = ref} size="lg" as="select" onChange={()=>this.handleOptionChange()}>
					{
						this.props.options.map((el, i)=>{
							return(<option key={i.toString()}>{el}</option>)
						})
					}
				</Form.Control>
			)
    }
}

export default DropdownSelect;