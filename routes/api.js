const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const $ = require('cheerio');
const unirest = require('unirest');

// Authenticate Credentials
router.get('/login/:user/:password', (req, res) => {
    
    const user = req.params.user;
    const password = req.params.password;
    
    // GetUserBranches POST request to the BCR API
    var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/GetUserBranches");
    
    // GetUserBranches POST request Headers
    bcrAPI.headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });
    
    // GetUserBranches POST request Body
    bcrAPI.form({
        "WSAccountName": user,
        "WSPassword": password,
        "UserId": user
    });
    
    // Send the Results to the App
    bcrAPI.end((response) => {
        res.send(response.body);
    });
    
});

// Searches Experian using Company Name, Company DBA, Company Address, and Zip Code
router.get('/experianSearch/:user/:password/:branch/:testMode/:companyName/:companyCity/:companyState/:companyZip', (req, res) => {
    
    // captures the Company Name and Zip Code parameters passed through the URL
    const user = req.params.user;
    const password = req.params.password;
    const branch = req.params.branch;
    const testMode = req.params.testMode;
    const company = req.params.companyName;
    const city = req.params.companyCity;
    const state = req.params.companyState;
    const zip = req.params.companyZip;
    
    // USASearch POST request to the BCR API
    var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/USASearch");

    // USASearch POST request Headers
    bcrAPI.headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    // USASearch POST request Body
    bcrAPI.form({
        "WSAccountName": user,
        "WSPassword": password,
        "UserId": user,
        "Branch": branch,
        "Company": company,
        "City": city,
        "State": state,
        "Zip": zip,
        "ReportId": 60,
        "TestMode": testMode
    });
    
    // Send the Search Results to the App
    bcrAPI.end((response) => {
        res.send(response.body);
    });
    
});

// Searches Dun & Bradstreet using Company Name, Company DBA, Company Address, and Zip Code
router.get('/dnbSearch/:user/:password/:branch/:testMode/:companyName/:companyCity/:companyState/:companyZip', (req, res) => {
    
    // captures the Company Name and Zip Code parameters passed through the URL
    const user = req.params.user;
    const password = req.params.password;
    const branch = req.params.branch;
    const testMode = req.params.testMode;
    const company = req.params.companyName;
    const city = req.params.companyCity;
    const state = req.params.companyState;
    const zip = req.params.companyZip;
    
    // USASearch POST request to the BCR API
    var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/USASearch");

    // USASearch POST request Headers
    bcrAPI.headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    // USASearch POST request Body
    bcrAPI.form({
        "WSAccountName": user,
        "WSPassword": password,
        "UserId": user,
        "Branch": branch,
        "Company": company,
        "City": city,
        "State": state,
        "Zip": zip,
        "ReportId": 311,
        "TestMode": testMode
    });
    
    // Send the Search Results to the App
    bcrAPI.end((response) => {
        res.send(response.body);
    });
    
});

// Orders the report using Company Name, Company DBA, Company Address, and Zip Code
router.get('/order/:user/:password/:branch/:testMode/:reportId/:searchId/:companyId/:companyName/:companyAddress/:companyCity/:companyState/:companyZip', (req, res) => {
    
    // Captures the necessary parameters
    const user = req.params.user;
    const password = req.params.password;
    const branch = req.params.branch;
    const testMode = req.params.testMode;
    const reportId = req.params.reportId;
    const searchId = req.params.searchId;
    const companyId = req.params.companyId;
    const companyName = req.params.companyName;
    const companyAddress = req.params.companyAddress;
    const companyCity = req.params.companyCity;
    const companyState = req.params.companyState;
    const companyZip = req.params.companyZip;
    
    // OrderReport POST request to the BCR API
    var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/OrderReport");

    // OrderReport POST request Headers
    bcrAPI.headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    // OrderReport POST request Body
    bcrAPI.form({
        "WSAccountName": user,
        "WSPassword": password,
        "UserId": user,
        "Branch": branch,
        "SearchId": searchId,
        "CompanyId": companyId,
        "CompanyName": companyName,
        "CompanyAddress": companyAddress,
        "CompanyCity": companyCity,
        "CompanyState": companyState,
        "CompanyZip": companyZip,
        "CompanyCountry": "US",
        "ReportId": reportId,
        "TestMode": testMode
    });
    
    // Send the Generated Report Details to the GetReport Method
    bcrAPI.end((response) => {
        
        let requestID = response.body.RequestId;        
        
        // GetReport POST request to the BCR API
        var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/GetReport");

        // GetReport POST request Headers
        bcrAPI.headers({
            "Content-Type": "application/x-www-form-urlencoded"
        });

        // GetReport POST request Body
        bcrAPI.form({
            "WSAccountName": user,
            "WSPassword": password,
            "UserId": user,
            "Branch": branch,
            "RequestId": requestID,
            "ReportFormat": 'HTML',
            "TestMode": testMode
        });

        // Grab Report URL from GetReport POST request response
        bcrAPI.end(response => {
            
            // Scrape the Reports' Data
            rp(response.body.HTML)
                .then(html => {
                    const reportData = {
                        reportURL: response.body.HTML,
                        companyInfo: {
                            companyName: $('#ctl03_lblCompanyName', html).text(),
                            companyAddress: $('#ctl03_lnkCompanyAddress', html).text(),
                            companyPhone: $('#ctl03_lblCompanyPhone a', html).text()
                        },
                        companyAnalytics: {
                            creditLogicScore: $('#ctl05_CreditLogicScoreControl_CreditLogicScoreGauge_divPointerAnnotation', html).text(),
                            dataDepthScore: $('#ctl05_DataDepthControl_DataDepthScore_divPointerAnnotation', html).text(),
                            multiMax: $('#ctl05_MultiMAXCreditLimitControl_lblMultiMAXCreditLimit', html).text(),
                            businessFailureAssessment: $('#ctl05_BusinessFailureAssessmentControl_lblAssessment', html).text()
                        }
                    }

                    // Output the Report's Data
                    res.send(reportData);

                });

        });
        
    });
    
});

// Pass report ID through the url. i.e. api/report/4095901
router.get('/report/:user/:password/:branch/:testMode/:id', (req, res) => {

    // captures the report ID
    const user = req.params.user;
    const password = req.params.password;
    const branch = req.params.branch;
    const testMode = req.params.testMode;
    const requestId = req.params.id;

    // GetReport POST request to the BCR API
    var bcrAPI = unirest("POST", "https://reports.businesscreditreports.com/ReportWS/GetReport");

    // GetReport POST request Headers
    bcrAPI.headers({
        "Content-Type": "application/x-www-form-urlencoded"
    });

    // GetReport POST request Body
    bcrAPI.form({
        "WSAccountName": user,
        "WSPassword": password,
        "UserId": user,
        "Branch": branch,
        "RequestId": requestId,
        "ReportFormat": 'HTML',
        "TestMode": testMode
    });

    // Grab Report URL from GetReport POST request response
    bcrAPI.end(response => {

        // Scrape the Reports' Data
        rp(response.body.HTML)
            .then(html => {
                const reportData = {
                    reportURL: response.body.HTML,
                    companyInfo: {
                        companyName: $('#ctl03_lblCompanyName', html).text(),
                        companyAddress: $('#ctl03_lnkCompanyAddress', html).text(),
                        companyPhone: $('#ctl03_lblCompanyPhone a', html).text()
                    },
                    companyAnalytics: {
                        creditLogicScore: $('#ctl05_CreditLogicScoreControl_CreditLogicScoreGauge_divPointerAnnotation', html).text(),
                        dataDepthScore: $('#ctl05_DataDepthControl_DataDepthScore_divPointerAnnotation', html).text(),
                        multiMax: $('#ctl05_MultiMAXCreditLimitControl_lblMultiMAXCreditLimit', html).text(),
                        businessFailureAssessment: $('#ctl05_BusinessFailureAssessmentControl_lblAssessment', html).text()
                    }
                }

                // Output the Reports' Data
                res.send(reportData);

            });

    });

});

router.get('/search/', (req, res) => {
    rp('https://reports.businesscreditreports.com/Report?WSRPID=anj2nlQJzAI%3d')
        .then(html => {
            const name = $('#ctl03_lblCompanyName', html).text();
            const creditLogicScore = $('#ctl05_CreditLogicScoreControl_CreditLogicScoreGauge_divPointerAnnotation', html).text();
            const reportData = {
                companyName: name,
                creditLogicScore: creditLogicScore
            }
            res.send(reportData);
        });
});

module.exports = router;
