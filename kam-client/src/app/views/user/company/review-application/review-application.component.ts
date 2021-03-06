import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { KycScreeningService } from 'src/app/services/kyc-screening/kyc-screening.service';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';
import { ApplicationScreenedAlert, FailedCreateApplicationAlert, ScreenApplicationAlert } from 'src/constants/alerts.constant';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-review-application',
  templateUrl: './review-application.component.html',
  styles: [
  ]
})
export class ReviewApplicationComponent implements OnInit {
  isLoading = false;
  user: any[];
  applicationData;
  applicationId = '';
  applicationType: string;
  poiFileLink = '';
  poaFileLink = '';
  riskScore = 0;
  isScreened = false;
  request: any;
  params = 0;

  citizenshipScore = 0;
  pepExposureScore = 0;
  countryResidenceScore = 0;
  poiInformation = [];
  poaInformation = [];
  applicantSanctions = 0;
  fatherSanctions = 0;
  motherSanctions = 0;
  spouseSanctions = 0;
  companySanctions = 0;
  legalStructureScore = 0;

  pepTypes = [];

  citizenshipTypes = [
    { code: 1, name: 'U.S. Citizen or U.S. National' },
    { code: 2, name: 'U.S. Dual Citizen' },
    { code: 3, name: 'U.S. Permanent Resident' },
    { code: 4, name: 'U.S. Refugee or Asylee' },
    { code: 5, name: 'Other (Non-U.S.)' }
  ];

  businessTypes = [
    { code: 1, name: 'Corporate' },
    { code: 2, name: 'Partnership Firm' },
    { code: 3, name: 'Trust, Charity, or NGO' },
    { code: 4, name: 'Other' },
    { code: 5, name: 'Military or Government Agency' },
    { code: 6, name: 'Bank or Institutional Investor' },
    { code: 7, name: 'Foreign Insitutional Investor (FII)' },
    { code: 8, name: 'Registered Society' },
    { code: 9, name: 'Unincorporated Association or Body of Individuals' },
    { code: 10, name: 'Information Technology' },
    { code: 11, name: 'Health Care' },
    { code: 12, name: 'Mission' },
    { code: 13, name: 'Private Investment Company PIC' },
    { code: 14, name: 'LLC' },
  ];

  constructor(
    private screeningService: KycScreeningService,
    private userService: UserService,
    private onboardingService: KycOnboardingService,
    private requestService: RequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.request = this.requestService.currentReq.getReq();
    if (this.request.length === 0) {
      this.router.navigate(['/user/kyc/screening/dashboard']);
    }
    this.setPepTypes();
    this.getSubmittedApplicationDetails();
    this.getSubmittedApplicationPoiFile();
    this.getSubmittedApplicationPoaFile();
  }

  getSubmittedApplicationDetails() {
    this.isLoading = true;
    let appObj = {
      applicationId: this.request.application_id,
      cid: this.request.app_cid
    } 

    console.log(this.request);

    this.screeningService.getSubmittedApplicationDetails(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationDetails([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application details from blockchain: ', error);
      }
    );
  }

  // Set politically exposed person types
  setPepTypes() {
    this.onboardingService.getPepTypes().subscribe(
      res => {
        this.pepTypes = [res];
        this.pepTypes = this.pepTypes[0].pepTypesMap;
      },
      error => {
        console.error('Error with onboarding service for pep types: ', error);
      }
    )
  }

  setApplicationDetails(res) {
    this.applicationData = res[0].data;
    this.applicationId = res[0]?.data?.application_id;
    this.applicationType = res[0]?.data?.application_type;
  }

  setPoiLink(res) {
    this.poiFileLink = res[0].poiLink;
  }

  setPoaLink(res) {
    this.poaFileLink = res[0].poaLink;
  }

  getSubmittedApplicationPoiFile() {
    this.isLoading = true;
    
    let appObj = {
      applicationId: this.request.application_id,
      cid: this.request.app_cid,
      poifile: this.request.poi_file
    }

    this.screeningService.getSubmittedApplicationPoiFile(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.setPoiLink([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poi file from blockchain: ', error);
      }
    );
  }

  getSubmittedApplicationPoaFile() {
    this.isLoading = true;
    let appObj = {
      applicationId: this.request.application_id,
      cid: this.request.app_cid,
      poafile: this.request.poa_file
    }

    this.screeningService.getSubmittedApplicationPoaFile(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.setPoaLink([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poa file from blockchain: ', error);
      }
    );
  }

  riskCitizenshipStatus(citizenshipStatus) {
    if (citizenshipStatus === 1 || citizenshipStatus === 2) {
      return 1;
    } else if (citizenshipStatus === 3 || citizenshipStatus === 4) {
      return 3;
    } else if (citizenshipStatus === 5) {
      return 5;
    }
  }

  riskCountriesOfResidence(riskCountries, customerCountries) {
    let currentResidenceCountry = riskCountries[0].filter(country => country.$0.includes(customerCountries[0]));
    let permanentResidenceCountry = riskCountries[0].filter(country => country.$0.includes(customerCountries[1]));
    let risk = [currentResidenceCountry.Score, permanentResidenceCountry.Score];
    let score = Math.max(...risk);
    return score;
  }

  riskOfLegalStructure(legalStructures, companyType) {
    let risk = legalStructures[0].filter(country => country.$0.includes(companyType));
    return risk.Score;
  }

  riskPepExposure(pepInformation) {
    let pepInfo = pepInformation;
    if (pepInfo[1] === 'YES') {
      switch (pepInfo[0]) {
        case 'NONE':
          return 0;
        case 'LOW':
          return 1;
        case 'MEDIUM':
          return 3;
        case 'HIGH':
          return 5;
      }
    } else if (pepInfo[2] === 'YES') {
      switch (pepInfo[0]) {
        case 'NONE':
          return 0;
        case 'LOW':
          return 1;
        case 'MEDIUM':
          return 3;
        case 'HIGH':
          return 3;
      }
    } else {
      return 0;
    }
  }

  addToRiskScore(riskLevel) {
    this.riskScore += riskLevel;
    this.params++;
  }

  finalRiskScore() {
    console.log(`Risk Score before: ${this.riskScore}`);
    let risk = this.riskScore / 7;
    this.riskScore = Math.round(risk);
    console.log(`Risk Score after average: ${this.riskScore}`);
  }

  setCountryResidenceScore(score) {
    this.countryResidenceScore = score;
  }

  setLegalStructureScore(score) {
    this.legalStructureScore = score;
  }
  
  setSanctions(name, res) {
    if (name === 'applicant') {
      this.applicantSanctions = res[0].data.results.length;
      console.log(this.applicantSanctions);
      let risk = this.applicantSanctions;
      this.addToRiskScore(risk);
    } else if (name === 'father') {
      this.fatherSanctions = res[0].data.results.length;
      let risk = this.applicantSanctions;
      this.addToRiskScore(risk);
    } else if (name === 'mother') {
      this.motherSanctions = res[0].data.results.length;
      let risk = this.applicantSanctions;
      this.addToRiskScore(risk);
    } else if (name === 'spouse') {
      this.spouseSanctions = res[0].data.results.length;
      let risk = this.applicantSanctions;
      this.addToRiskScore(risk)
    } else if (name === 'company') {
      this.companySanctions = res[0].data.results.length;
      let risk = this.applicantSanctions;
      this.addToRiskScore(risk);
    }
  }

  setProofDocuments(type, res) {
    if (type === 'poi') {
      this.poiInformation = res[0];
    } else if (type === 'poa') {
      this.poaInformation = res[0];
    }
  }

  getRiskColor(risk) {
    if (risk === 0 || risk < 3) {
      return 'text-emerald-500';
    } else if (risk === 3 || risk < 5) {
      return 'text-orange-500';
    } else {
      return 'text-red-600';
    }
  }

  screenApplication() {
    this.isLoading = true;
    console.log('type: ', this.applicationType);
    const applicationType = this.applicationType

    if (applicationType === 'INDIVIDUAL') {
      let citizenshipStatus = Number(this.applicationData.details[0].citizenship_status);
      let residenceCountry = this.applicationData.details[0].current_address.country;
      let permanentResidenceCountry = this.applicationData.details[0].permanent_address.country;
      
      let pepExposure = this.pepTypes.filter(type => type.code === Number(this.applicationData.details[0].pep_exposure))[0].risk_level;
      let isPEP = this.applicationData.details[0].pep;
      let isRcaPEP = this.applicationData.details[0].rca_pep;

      let citizenShipRisk = this.riskCitizenshipStatus(citizenshipStatus);
      this.citizenshipScore = citizenShipRisk
      this.addToRiskScore(citizenShipRisk);
      let pepExposureRisk = this.riskPepExposure([pepExposure, isPEP, isRcaPEP]);
      this.pepExposureScore = pepExposureRisk;
      this.addToRiskScore(pepExposureRisk);
      
      this.screeningService.getResidenceCountries().subscribe(
        res => {
          let countriesOfResidenceRisk = this.riskCountriesOfResidence([res], [residenceCountry, permanentResidenceCountry]);
          this.setCountryResidenceScore(countriesOfResidenceRisk);
          this.addToRiskScore(countriesOfResidenceRisk);
        },
        error => {
          console.error('Unable to get countries of residence: ', error);
        }
      )

      let poiObj = {
        applicationId: this.applicationId,
        documentType: this.applicationData.documents[0].poi.file_name?.slice(10, 12)
      }

      let poaObj = {
        applicationId: this.applicationId,
        documentType: this.applicationData.documents[0].poa.file_name?.slice(10, 12)
      }

      this.screeningService.extractPoiInformation(poiObj).subscribe(
        res => {
          let poiExtraction = [res];
          this.poiInformation = [res];
          this.setProofDocuments('poi', [res]);
          console.log('POI Extracted Information', poiExtraction);
        },
        error => {
          console.error('Unable to get poi information: ', error);
        }
      )

      this.screeningService.extractPoaInformation(poaObj).subscribe(
        res => {
          let poaExtraction = [res];
          this.setProofDocuments('poa', [res]);
          console.log('POA Extracted Information', poaExtraction);
        },
        error => {
          console.error('Unable to get poa information: ', error);
        }
      )

      // Applicant Sanctions
      let firstName = this.applicationData.details[0].first_name;
      let lastName = this.applicationData.details[0].last_name;
      this.screeningService.getIndividualSanctions(firstName, lastName).subscribe(
        res => {
          this.setSanctions('applicant', [res]);
        },
        error => {
          console.error('Unable to get sanctions information: ', error);
        }
      )

      // Father Sanctions
      let fatherName = this.applicationData.details[0].father_name;
      fatherName.split(' ');
      this.screeningService.getIndividualSanctions(fatherName[0], fatherName[1]).subscribe(
        res => {
          let fatherSanctions = [res];
          this.setSanctions('father', [res]);
          console.log('Father Sanctions: ', fatherSanctions);
        },
        error => {
          console.error('Unable to get sanctions information: ', error);
        }
      )

      // Mother Sanctions
      let motherFirstName = this.applicationData.details[0].mother_name;
      let motherMaidenName = this.applicationData.details[0].mother_maidenname;

      if (motherMaidenName !== '') {
        this.screeningService.getIndividualSanctions(motherFirstName, motherMaidenName).subscribe(
          res => {
            let motherSanctions = [res];
            this.setSanctions('mother', [res]);
            console.log('Mother Sanctions: ', motherSanctions);
          },
          error => {
            console.error('Unable to get sanctions information: ', error);
          }
        )
      }

      // Spouse Sanctions
      let spouseName = this.applicationData.details[0].spouse_name;
      this.screeningService.getIndividualSanctions(spouseName, lastName).subscribe(
        res => {
          let spouseSanctions = [res];
          this.setSanctions('spouse', [res]);
          console.log('Spouse Sanctions: ', spouseSanctions);
        },
        error => {
          console.error('Unable to get sanctions information: ', error);
        }
      )
      this.isLoading = false;
      ApplicationScreenedAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.finalRiskScore();
        }
      })
      // update poiExtraction, poaExtraction, riskScore 
    }

    else if (applicationType === 'BUSINESS') {
      let companyType = this.businessTypes.filter(type => type.code === Number(this.applicationData.details[0].company_type))[0].name;
      
      this.screeningService.getLegalStructures().subscribe(
        res => {
          let legalStructures = this.riskOfLegalStructure([res], companyType);
          this.setLegalStructureScore(legalStructures);
          this.addToRiskScore(legalStructures);
        },
        error => {
          console.error('Unable to get countries of residence: ', error);
        }
      )

      let poiObj = {
        applicationId: this.applicationId,
        documentType: this.applicationData.documents[0].poi.file_name?.slice(10, 12)
      }

      let poaObj = {
        applicationId: this.applicationId,
        documentType: this.applicationData.documents[0].poa.file_name?.slice(10, 12)
      }

      this.screeningService.extractPoiInformation(poiObj).subscribe(
        res => {
          let poiExtraction = [res];
          this.poiInformation = [res];
          this.setProofDocuments('poi', [res]);
          console.log('POI Extracted Information', poiExtraction);
        },
        error => {
          console.error('Unable to get poi information: ', error);
        }
      )

      this.screeningService.extractPoaInformation(poaObj).subscribe(
        res => {
          let poaExtraction = [res];
          this.setProofDocuments('poa', [res]);
          console.log('POA Extracted Information', poaExtraction);
        },
        error => {
          console.error('Unable to get poa information: ', error);
        }
      )

      // Company Sanctions
      let companyName = this.applicationData.details[0].company_name;
      this.screeningService.getBusinessSanctions(companyName).subscribe(
        res => {
          let companySanctions = [res];
          this.setSanctions('company', [res]);
          console.log('Company Sanctions: ', companySanctions);
        },
        error => {
          console.error('Unable to get sanctions information: ', error);
        }
      )
      this.isLoading = false;
      ApplicationScreenedAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.finalRiskScore();
        }
      })
      // update poiExtraction, poaExtraction, riskScore
    }
    this.isScreened = true;
  }

  saveApplication() {
    this.isLoading = true;

    let companyId = 'F' + this.user[0].username.slice(-12);

    let application = {
      applicationId: companyId,
      companyId: companyId,
      applicationDetails: this.applicationData,
    }

    this.screeningService.createNewApplication(application).subscribe(
      res => {
        this.isLoading = false;
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedCreateApplicationAlert(error).fire({});
      }
    );
  }

  onScreen() {
    var steps = '';
    var stepNames = {
      1: 'Risk of Country',
      2: 'Risk of Legal Structure',
      3: 'Sanctions Check',
      4: 'Proof Documents Information Extraction',
      5: 'Risk Scoring'
    }
    for(var i = 1; i < 6; i++) {
        var str = '<p>' + i + '. ' + stepNames[i] + '</p>'
        steps += str;
    }

    ScreenApplicationAlert.fire({
      html:
        '<style> p{text-align: left}</style>' +
        '<p>Screening will conduct the following risk assessment: ' +
        '</br></br>' +
        steps +
        '</p>'
    })
    .then((result) => {
      if (result.isConfirmed === true) {
        this.screenApplication();
      }
    });
  }

  onApprove() {

  }

  onDeny() {

  }
}
