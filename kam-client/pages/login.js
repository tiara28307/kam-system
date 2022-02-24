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
  Row,
  Col,
  Card,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import Link from "next/dist/client/link";
import Image from "next/dist/client/image";
import logo from "../assets/images/logos/kam-logo.png"

// Login Page
export default function Login() {
  const [isOpen, setIsOpen] = useState(false);

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
            <Col md="5">
              <Card body className="card-shadow bg-light text-info">
                <h2 className="text-center text-info m-t-10">Login</h2>
                <Col md="12">
                        <Form className="row nt-start">
                            <FormGroup className="col-md-12">
                                <Label htmlFor="name" className="font-bold">Email</Label>
                                <Input type="text" className="form-control" id="email" placeholder="Enter email" />
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <Label htmlFor="password" className="font-bold">Password</Label>
                                <Input type="password" className="form-control" id="password" placeholder="Enter password" />
                            </FormGroup>
                            <FormGroup className="col-md-8 ml-4">
                                <Input id="checkbox1" type="checkbox" />
                                <Label htmlFor="checkbox1"> Remember me </Label>
                            </FormGroup>
                            <Col className="text-center m-t-5">
                                <Button type="submit" className="btn btn-success waves-effect waves-light m-r-10">Submit</Button>
                            </Col>
                            <Col md="12" className="m-t-20 m-b-10">
                              <p>
                                Forgot <a href="#">password?</a>
                              </p>
                              <p>
                                Don't have an account? <a href="/signup">Sign Up</a>
                              </p>
                            </Col>
                        </Form>
                    </Col>
              </Card>
            </Col>
        </Row>
      </Container>
    </div>
  );
}