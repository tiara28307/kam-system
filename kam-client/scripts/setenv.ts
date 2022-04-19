const { writeFile } = require('fs');
const { argv } = require('yargs');

// Read environment variables from .env file
require('dotenv').config();

// Read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;

if (!process.env.AWS_COGNITO_USER_POOL || !process.env.AWS_COGNITO_CLIENT_ID || !process.env.AWS_DEFAULT_REGION
  || !process.env.PRIVACY_POLICY_URI || !process.env.TERMS_CONDITIONS_URI || !process.env.WHITE_PAPER_URI
  || !process.env.WEB3_STORAGE_TOKEN) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   privacyPolicyUrl: "${process.env.PRIVACY_POLICY_URI}",
   termsAndConditionsUrl: "${process.env.TERMS_CONDITIONS_URI}",
   whitePaper: "${process.env.WHITE_PAPER_URI}",
   AWS_COGNITO_USER_POOL: "${process.env.AWS_COGNITO_USER_POOL}",
   AWS_COGNITO_CLIENT_ID: "${process.env.AWS_COGNITO_CLIENT_ID}",
   AWS_DEFAULT_REGION: "${process.env.AWS_DEFAULT_REGION}",
   WEB3_STORAGE_TOKEN: "${process.env.WEB3_STORAGE_TOKEN}"
};
`;

// Write the content to the target file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});