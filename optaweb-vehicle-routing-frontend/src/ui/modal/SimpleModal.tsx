import '@patternfly/react-core/dist/styles/base.css';


import React from 'react';
import { Modal, Button,FormGroup,FormSelect,FormSelectOption } from '@patternfly/react-core';



export interface IProps {
    canShow: boolean
    eventData : any
    options: option[],
    onConfirm: (data : any) => void,
    onClose: () => void
}

export interface option
{
    disabled: boolean,
    label: string,
    value: string
}

export interface IState {
    isModalOpen: boolean,
    options: option[],
    requiredSkill : string
}

export class SimpleModal extends React.Component<IProps,IState> {


  public state : IState = {
    isModalOpen : false,
    options: [],
    requiredSkill : ""
  }

  constructor(props: IProps) {
    super(props);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state.isModalOpen = props.canShow;
    this.state.options = props.options;
    this.state.requiredSkill = "";
  }
  

 

 public handleModalToggle() {
     this.setState({isModalOpen : !this.state.isModalOpen});
     console.log(this.state.isModalOpen);
  }

  public handleChange(e: any) {
   this.setState({requiredSkill : e});
   console.log(e);
  }; 

  render() {
    console.log("Invoking render function" + this.state.isModalOpen);
    return (
      <React.Fragment>
        <Modal
          title="Select Skill"
          isSmall={true}
          isOpen={this.props.canShow}
          onClose={this.handleModalToggle}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={ ( )=> {
                   this.props.onConfirm({ eventData: this.props.eventData.latlng?this.props.eventData.latlng : this.props.eventData.latLng,skill : this.state.requiredSkill,address : this.props.eventData.address})
                  }
                }
            >
              Confirm
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={this.props.onClose}
            >
              Cancel
            </Button>,
          ]}
        >
          <div>
             <p>Latitude : {this.props.eventData.latlng && this.props.eventData.latlng.lat} {this.props.eventData.latLng && this.props.eventData.latLng.lat}</p>
             <p>Longitude : {this.props.eventData.latlng && this.props.eventData.latlng.lng} {this.props.eventData.latLng && this.props.eventData.latLng.lng}</p>
          </div>
          <FormGroup label="Skill" fieldId="horizontal-form-title" style={{marginTop: "10px"}}>
              <FormSelect value={this.state.requiredSkill} onChange={this.handleChange}>
                {
                   this.state.options.map(function(option,index) {
                        return <FormSelectOption key={index} value={option.value} label={option.label} />
                    })
                }   
              </FormSelect>
          </FormGroup>
        </Modal>
      </React.Fragment>
    );
  }
}
