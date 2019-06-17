let vm = new Vue({
    el: '#app',
    data: {
        tempData: '',
        loggedIn: false,
        endpoint: 'http://localhost:3000/api/',
        searchFormVisible: false,
        reportHistorySearchFormVisible: false,
        searchResultsVisible: false,
        reportPreviewVisible: false,
        config: {
            Branches: [],
            user: '',
            password: '',
            branch: '',
            testMode: 'true',
            reportId: ''
        },
        companyName: '',
        companyCity: '',
        companyState: '',
        companyZip: '',
        requestID: '',
        experianSearchResultsVisible: true,
        experianSearchResults: {
            SearchId: '',
            Companies: [
                {
                    CompanyId: '',
                    BusinessName: '',
                    StreetAddress: '',
                    City: '',
                    State: '',
                    Zip: '',
                    NumberOfTradeLines: '',
                    PublicRecordDataIndicator: '',
                    CollectionIndicator: '',
                    UCCIndicator: ''
                }
            ]
        },
        dnbSearchResults: {
            SearchId: '',
            Companies: [
                {
                    CompanyId: '',
                    BusinessName: '',
                    StreetAddress: '',
                    City: '',
                    State: '',
                    Zip: '',
                    NumberOfTradeLines: '',
                    PublicRecordDataIndicator: '',
                    CollectionIndicator: '',
                    UCCIndicator: ''
                }
            ]
        },
        combinedSearchResults: {
            SearchId: '',
            Companies: [
                {
                    CompanyId: '',
                    BusinessName: '',
                    StreetAddress: '',
                    City: '',
                    State: '',
                    Zip: '',
                    NumberOfTradeLines: '',
                    PublicRecordDataIndicator: '',
                    CollectionIndicator: '',
                    UCCIndicator: ''
                }
            ]
        },
        orderData: {
            searchId: '',
            companyId: '',
            companyName: '',
            companyAddress: '',
            companyCity: '',
            companyState: '',
            companyZip: ''
        },
        tempData: '',
        reportData: {
            reportURL: '',
            companyInfo: {},
            companyAnalytics: {}
        },
        error: ''
    },
    methods: {
        login() {
            axios({
                method: "GET",
                "url": `${this.endpoint}login/${this.config.user}/${this.config.password}`
            }).then(result => {
                (result.data.CompletionCode === 1) ? this.loggedIn = true : this.loggedIn = false;
                this.config.Branches = result.data.Branches;
            }, error => {
                this.error = `Something went wrong.`;
            });
        },
        logout() {
            this.loggedIn = false;
            this.config.user = '';
            this.config.password = '';
            this.reportPreviewVisible = false;
            this.searchResultsVisible = false;
            this.companyName = '';
            this.companyCity = '';
            this.companyState = '';
            this.companyZip = '';
            this.config.branch= '';
            this.config.reportId = '';
        },
        getSearchResults() {
            this.reportPreviewVisible = false;
            let searchLoadState = document.getElementById('searchLoadState');
            searchLoadState.classList.add('active');
            axios({
                method: "GET",
                "url": `${this.endpoint}experianSearch/${this.config.user}/${this.config.password}/${this.config.branch}/${this.config.testMode}/${this.companyName}/${this.companyCity}/${this.companyState}/${this.companyZip}`
            }).then(result => {
                this.experianSearchResults = result.data;
                this.searchFormVisible = false;
            }, error => {
                this.error = `Something went wrong.`;
            });
            axios({
                method: "GET",
                "url": `${this.endpoint}dnbSearch/${this.config.user}/${this.config.password}/${this.config.branch}/${this.config.testMode}/${this.companyName}/${this.companyCity}/${this.companyState}/${this.companyZip}`
            }).then(result => {
                this.dnbSearchResults = result.data;
                this.searchFormVisible = false;
                this.searchResultsVisible = true;
                searchLoadState.classList.remove('active');
            }, error => {
                this.error = `Something went wrong.`;
            });
        },
        getReport(searchId, companyId, companyName, companyAddress, companyCity, companyState, companyZip) {
            let generationLoadState = document.getElementById('generationLoadState');
            generationLoadState.classList.add('active');
            
            this.searchResultsVisible = false;
            this.orderData.searchId = searchId;
            this.orderData.companyId = companyId;
            this.orderData.companyName = companyName.replace(/#/g, '');
            this.orderData.companyAddress = companyAddress;
            this.orderData.companyCity = companyCity;
            this.orderData.companyState = companyState;
            this.orderData.companyZip = companyZip;
           
            axios({
                method: "GET",
                "url": `${this.endpoint}order/${this.config.user}/${this.config.password}/${this.config.branch}/${this.config.testMode}/${this.config.reportId}/${this.orderData.searchId}/${this.orderData.companyId}/${this.orderData.companyName}/${this.orderData.companyAddress}/${this.orderData.companyCity}/${this.orderData.companyState}/${this.orderData.companyZip}`
            }).then(result => {
                this.reportData = result.data;
                this.reportPreviewVisible = true;
                generationLoadState.classList.remove('active');
            }, error => {
                this.error = `Something went wrong.`;
            });
            
            this.companyName = '';
            this.companyCity = '';
            this.companyState = '';
            this.companyZip = '';
        },
        getReportData() {
            this.searchResultsVisible = false;
            let retrievalLoadState = document.getElementById('retrievalLoadState');
            retrievalLoadState.classList.add('active');
            axios({
                method: "GET",
                "url": `${this.endpoint}report/${this.config.user}/${this.config.password}/${this.config.branch}/${this.config.testMode}/${this.requestID}`
            }).then(result => {
                this.reportData = result.data;
                this.reportPreviewVisible = true;
                retrievalLoadState.classList.remove('active');
            }, error => {
                this.error = `Something went wrong.`;
            });
            this.requestID = '';
        }
    }
});
