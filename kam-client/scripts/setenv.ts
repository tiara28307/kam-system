const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

if (!process.env.AWS_COGNITO_USER_POOL || !process.env.AWS_COGNITO_CLIENT_ID || !process.env.AWS_DEFAULT_REGION
  || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.PRIVACY_POLICY_URI 
  || !process.env.TERMS_CONDITIONS_URI || !process.env.WHITE_PAPER_URI) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   privacyPolicyUrl: "${process.env.PRIVACY_POLICY_URI}",
   termsAndConditionsUrl: "${process.env.TERMS_CONDITIONS_URI}",
   whitePaper: "${process.env.WHITE_PAPER_URI}",
   AWS_COGNITO_USER_POOL: "${process.env.AWS_COGNITO_USER_POOL}",
   AWS_COGNITO_CLIENT_ID: "${process.env.AWS_COGNITO_CLIENT_ID}",
   AWS_DEFAULT_REGION: "${process.env.AWS_DEFAULT_REGION}",
   AWS_ACCESS_KEY_ID: "${process.env.AWS_ACCESS_KEY_ID}",
   AWS_SECRET_ACCESS_KEY: "${process.env.AWS_SECRET_ACCESS_KEY}"
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});