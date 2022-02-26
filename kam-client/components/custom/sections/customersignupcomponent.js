import React from "react";
import {
  Label,
  FormGroup,
  Input,
} from "reactstrap";

const CustomerSignUpComponent = () => {
  return (
    <>
    <Label htmlFor="name" className="font-bold col-md-12">Name</Label>
    <FormGroup className="col-md-12 d-flex">
      <Input type="text" className="form-control mr-2" id="first-name" placeholder="First Name" />
      <Input type="text" className="form-control" id="last-name" placeholder="Last Name" />
    </FormGroup>
    <Label htmlFor="name" className="font-bold mr-4 col-md-12">Contact</Label>
    <FormGroup className="col-md-12 d-flex">
      <Input type="email" className="form-control mr-2" id="email" placeholder="Email" />
      <Input type="text" className="form-control" id="phone" placeholder="Phone" />
    </FormGroup>
    <Label htmlFor="password" className="font-bold col-md-12">Password</Label>
    <FormGroup className="col-md-12">
      <Input type="password" className="form-control" id="password" placeholder="Password" />
      <Input type="password" className="form-control mt-2" id="confirm-password" placeholder="Confirm password" />
    </FormGroup>
    </>
  );
};

export default CustomerSignUpComponent;