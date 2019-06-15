let vm = new Vue({
    el: '#app',
    data: {
        endpoint: 'http://localhost:3000/api/',
        searchFormVisible: false,
        reportHistorySearchFormVisible: false,
        searchResultsVisible: false,
        reportPreviewVisible: false,
        config: {
            configureWindowVisible: false,
            user: '',
            password: '',
            branch: '',
            testMode: 'true',
            reportId: '60',
            searchEngine: 60
        },
        tempData: '',
        companyName: '',
        companyCity: '',
        companyState: '',
        companyZip: '',
        requestID: '',
        searchResults: {
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
        getSearchResults() {
            this.reportPreviewVisible = false;
            let searchLoadState = document.getElementById('searchLoadState');
            searchLoadState.classList.add('active');
            axios({
                method: "GET",
                "url": `${this.endpoint}search/${this.config.user}/${this.config.password}/${this.config.branch}/${this.config.testMode}/${this.config.searchEngine}/${this.companyName}/${this.companyCity}/${this.companyState}/${this.companyZip}`
            }).then(result => {
                this.searchResults = result.data;
                this.searchFormVisible = false;
                this.searchResultsVisible = true;
                searchLoadState.classList.remove('active');
            }, error => {
                this.error = `Something went wrong.`;
            });
            this.companyName = '';
            this.companyCity = '';
            this.companyState = '';
            this.companyZip = '';
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
