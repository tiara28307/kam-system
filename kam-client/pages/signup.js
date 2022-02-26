import React, { useState } from "react";
import { useRouter } from "next/router";
import { 
  Navbar, 
  NavbarToggler,
  Nav, 
  Container, 
  NavbarBrand, 
  Collapse ,
  NavItem,
  NavLink,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonGroup
} from "reactstrap";
import Link from "next/dist/client/link";
import Image from "next/dist/client/image";
import logo from "../assets/images/logos/kam-logo.png"
import CompanySignUpComponent from "../components/custom/sections/companysignupcomponent";
import CustomerSignUpComponent from "../components/custom/sections/customersignupcomponent";

// SignUp Page
export default function SignUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  
  const router = useRouter();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="bg-theme">
      <div className="header6">
        <Container className="po-relative">
          <Navbar className="navbar-expand-lg h6-nav-bar">
            <NavbarBrand href="/">
              <Image src={logo} alt="wrapkit" width={70} height={75} />
            </NavbarBrand>
            <NavbarToggler onClick={toggle}>
              <span className="ti-menu"></span>
            </NavbarToggler>
            <Collapse
              isOpen={isOpen}
              navbar
              className="hover-dropdown ml-auto"
              id="h6-info"
            >
              <Nav navbar className="ml-auto">
                <NavItem>
                  <Link href="/">
                    <a
                      className={
                        router.pathname == "/"
                          ? "text-white nav-link"
                          : "nav-link"
                      }
                    >
                      Home
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/#about">
                    <a
                      className={
                        router.pathname == "/"
                          ? "text-white nav-link"
                          : "nav-link"
                      }
                    >
                      About
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/#contact">
                    <a
                      className={
                        router.pathname == "/"
                          ? "text-white nav-link"
                          : "nav-link"
                      }
                    >
                      Contact
                    </a>
                  </Link>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Container>
      </div>
      <Container className="py-5 mt-5">
        <Row className="justify-content-center">
          <Col md="8">
            <Card body className="card-shadow bg-light text-info">
              <h2 className="text-center text-info m-t-10">Sign Up</h2>
              <Col className="mb-4 text-center">
                <ButtonGroup>
                  <Button className="mt-4 btn-blocks" outline color="primary" onClick={() => setIsCompany(false)} active={!isCompany}>Customer</Button>
                  <Button className="mt-4 btn-blocks" outline color="primary" onClick={() => setIsCompany(true)}>Company</Button>
                </ButtonGroup>
              </Col>
              <Col md="12">
                <Form className="row nt-start col-md-12">
                  {
                    isCompany === false ? <CustomerSignUpComponent /> : <CompanySignUpComponent />
                  }
                  <FormGroup className="col-md-8 ml-4">
                    <Input id="checkbox-terms" type="checkbox" />
                    <Label htmlFor="checkbox1">
                      I agree to the <a href="/#" target="_blank">Terms &amp; Conditions</a>. 
                    </Label>
                  </FormGroup>
                </Form>
                  <Col className="m-t-30 text-center">
                    <Button type="submit" className="btn btn-success waves-effect waves-light">
                      Create Account
                    </Button>
                  </Col>
                  <Col className="m-t-20 m-b-10 text-center">
                    <p>
                      Already have an account? <a href="/login">Sign In</a>
                    </p>
                  </Col>
              </Col>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}