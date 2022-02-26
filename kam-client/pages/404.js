import Head from "next/head";
import Link from "next/link";
import { Container, Row, Col, Button } from "reactstrap";
import Image from "next/image";
import errorImg from "../assets/images/errors/error404.png";

const ErrorPage = () => {
  return (
    <div className="static-slider-head">
      <Head>
        <title>404 - Page not Found</title>
        <meta
          name="description"
          content="The page you are looking for is not found go back to the homepage"
        />
      </Head>
      <Container>
        <Row className="justify-content-center">
          <Col lg="8" md="6" className="align-self-center text-center m-t-30">
            <Image src={errorImg} alt="wrapkit" />
            <h1 className="text-white">404 Error</h1>
            <h4 className="text-white">Page could not be found please go back to homepage</h4>
            <Link href="/">
              <Button className="btn btn-md m-t-30 m-b-30 btn-danger-gradiant font-14">
                Back to Homepage
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ErrorPage;
