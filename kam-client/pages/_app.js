import "../styles/scss/style.scss";
import Layout from "../layout/Layout";

// Main function for KAM Client
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
