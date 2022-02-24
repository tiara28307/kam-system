import React from "react";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";
import Image from "next/image";
import kycImg from "../../assets/images/landingpage/kyc.png";

// Banner on KAM Homepage
const Banner2 = () => {
  return (
    <div className="static-slider-head banner2">
      <Container>
        <Row className="">
          <Col lg="6" md="6" className="align-self-center">
            <h1 className="title">
              KAM System
            </h1>
            <h4 className="subtitle font-light">
              A KYC and AML Management System for
              <br /> Financial Institutions to fight money 
              <br /> laundering in the U.S.
            </h4>
            <a
              href="/signup"
              className="btn btn-success m-r-20 btn-md m-t-30 "
            >
              Sign Up
            </a>
            <Link href="/#about">
              <a className="btn btn-md m-t-30  btn-outline-light ">
                Learn More
              </a>
            </Link>
          </Col>
          <Col lg="6" md="6">
            <Image src={kycImg} alt="hero banner" />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Banner2;
