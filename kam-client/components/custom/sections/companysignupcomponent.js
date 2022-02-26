import React, { useState } from "react";
import {
  Label,
  FormGroup,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup
} from "reactstrap";

const companyTypes = [
  { id: 1, name: 'Brokerage Firm' },
  { id: 2, name: 'Commercial Bank' },
  { id: 3, name: 'Credit Union' },
  { id: 4, name: 'Internet Bank' },
  { id: 5, name: 'Insurance' },
  { id: 6, name: 'Investment Bank' },
  { id: 7, name: 'Mortgage' },
  { id: 8, name: 'Savings and Loan Association' },
]

const CompanySignUpComponent = () => {
  const [companyType, setCompanyType] = useState("Select Company Type");
  
  const handleCompanyTypeChange = (e) => {
    setCompanyType(e.target.value);
  }

  return (
    <>
    <Label htmlFor="company" className="font-bold col-md-12">Company</Label>
    <FormGroup className="col-md-12">
      <Input type="text" className="form-control" id="company-name" placeholder="Company Name" />
    </FormGroup>
    <FormGroup className="col-md-12 d-flex">
      <Input type="text" className="form-control mt-2 mr-2 w-50" id="company-address" placeholder="Address" />
      <Input type="text" className="form-control mt-2 mr-2 w-25" id="company-address" placeholder="City" />
    </FormGroup>
    <FormGroup className="col-md-12 d-flex">
      <Input type="text" className="form-control mt-2 mr-2 w-50" id="company-address" placeholder="State" />
      <Input type="text" className="form-control mt-2 mr-2 w-25" id="company-address" placeholder="Zip code" />
    </FormGroup>
    <FormGroup className="col-md-12 d-flex">
      <Input type="text" className="form-control mt-2 mr-4 w-50" id="company-phone" placeholder="Phone" />
      <Input type="text" className="form-control mt-2 mr-4 w-50" id="company-website" placeholder="Website" />
    </FormGroup>
    <FormGroup className="col-md-12">
      <select className="form-control mt-2" onChange={handleCompanyTypeChange}>
        <option value={companyType}>Select Company Type</option>
        {
          companyTypes.map((companyType) => <option value={companyType.id}>{companyType.name}</option>)
        }
      </select>
    </FormGroup>   
    <Label htmlFor="name" className="font-bold col-md-12">Personal</Label>
    <FormGroup className="col-md-12 d-flex">
      <Input type="text" className="form-control mr-2" id="first-name" placeholder="First Name" />
      <Input type="text" className="form-control" id="last-name" placeholder="Last Name" />
    </FormGroup>
    <FormGroup className="col-md-12 d-flex">
      <Input type="email" className="form-control mr-2" id="email" placeholder="Email" />
      <Input type="text" className="form-control" id="phone" placeholder="Phone" />
    </FormGroup>
    <FormGroup className="col-md-12">
      <Input type="email" className="form-control mr-2" id="job-title" placeholder="Job Title" />
    </FormGroup>
    <Label htmlFor="password" className="font-bold col-md-12">Password</Label>
    <FormGroup className="col-md-12">
      <Input type="password" className="form-control" id="password" placeholder="Password" />
      <Input type="password" className="form-control mt-2" id="confirm-password" placeholder="Confirm password" />
    </FormGroup>
    </>
  );
};

export default CompanySignUpComponent;