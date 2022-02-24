/* eslint-disable */
import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer4 b-t mini-spacer">
      <Container>
        <Row>
          <Col lg="3" md="6">
            <h5 className="m-b-10">Social</h5>
            <div className="round-social light">
              <Link href="https://github.com/tiara28307/kam-system">
                <a className="link">
                  <i className="fa-brands fa-github"></i>
                </a>
              </Link>
              <Link href="https://www.linkedin.com/in/ti-ara-carroll-623b00168/">
                <a className="link">
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </Link>
            </div>
          </Col>
        </Row>
        <div className="f4-bottom-bar">
          <Row>
            <Col md="12">
              <div className="d-flex font-14">
                <div className="m-t-2 m-b-1 copyright">
                  Created by Ti'Ara Carroll
                </div>
                <div className="links ml-auto m-t-10 m-b-10">
                  <div className="m-t-2 m-b-1 copyright">
                      UI Kit designed by {""}
                      <Link href="https://www.wrappixel.com/templates/nextkit-nextjs-free-uikit/">
                      wrappixel.com
                      </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default Footer;
