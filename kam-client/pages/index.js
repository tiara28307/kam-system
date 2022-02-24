import Head from "next/head";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Image from "next/image";
import Link from "next/dist/client/link";
import Banner2 from "../components/banner/Banner2";
import ContactComponent from "../components/custom/sections/contactcomponent";
import moneyLaunderingImg from "../assets/images/landingpage/money-laundering.png";
import Header from "../layout/header/Header";

// KAM Homepage
export default function Home() {
  return (
    <div>
      <Header />
      <Head>
        <title>KAM</title>
        <meta
          name="KAM Client for Microservice-based Application"
        />
      </Head>
      <Banner2 />
      <div className="spacer">
        <Container>
          <Row id="about" className="justify-content-between">
            <Col md="7" className="text-start">
              <h1 className="title font-bold">About</h1>
              <h6 className="subtitle">
              The <strong>KAM System</strong> is meant to be a solution for compliance teams within different financial institutions that are
              wanting to improve their AML and KYC programs for end-users and internal operations to avoid penalties from 
              regulators and aid in the fight against money laundering.  
              
              KAM, is a type of <strong>regulatory technology (RegTech)</strong> that provides seamless integration for existing operations and 
              combats the arduous challenges of regulatory compliance to reduce the risks of AML penalties.
            
              KAM employs the use of AI and blockchain technology for <strong>Know Your Customer (KYC)</strong> and <strong> Anti-Money Laundering (AML) </strong> 
              procedures to properly identify high-risk customers and offer secure data storage and sharing of information for 
              AML and KYC compliance.  
              </h6>
              <Link href="/#white-paper">
              <a className="linking text-primary m-t-10" target="_blank">
                White Paper <i className="ti-arrow-right"></i>
              </a>
            </Link>
            </Col>
            <Col lg="5">
                <Image src={moneyLaunderingImg} alt="wrapkit" />
            </Col>
          </Row>
          <h1 className="title font-bold">Services</h1>
          <Row className="justify-content-between">
          <Col md="4" className="wrap-feature4-box">
              <Card>
                <CardBody>
                  <div className="icon-round bg-light-info">
                    <i className="fa fa-id-card"></i>
                  </div>
                  <h5 className="font-medium">Know Your Customer</h5>
                  <p className="m-t-20">
                    Verify and authenticate your customers with advanced automated solutions for CIP and CDD
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md="4" className="wrap-feature4-box">
              <Card>
                <CardBody>
                  <div className="icon-round bg-light-info">
                  <i class="fa-solid fa-magnifying-glass-dollar"></i>
                  </div>
                  <h5 className="font-medium">Anti-Money Laundering </h5>
                  <p className="m-t-20">
                    Quickly and accurately identify suscipicious transactions with daily monitoring
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col md="4" className="wrap-feature4-box">
              <Card>
                <CardBody>
                  <div className="icon-round bg-light-info">
                    <i className="fa-solid fa-clipboard-check"></i>
                  </div>
                  <h5 className="font-medium">Case Management </h5>
                  <p className="m-t-20">
                    Use reliable tools to properly investigate and report AML activities through a secure network
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ContactComponent />
    </div>
  );
}
