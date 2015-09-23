define([
    'intern!object',
    'intern/chai!assert',
    'dojo/text!test/frmsadminservice/api/v1/packages/full/',
    'dojo/text!test/frmsadminservice/api/v1/packages/full/single/',
    'dojo/text!test/frmsadminservice/api/v1/packages/full/docs/',
    'models/packages/packageVersionModel'
], function (registerSuite, assert, packageVersionStoreJson, packageVersionStoreSingleJson, documentListJson, packageVersionModel) {
    
    // global testing vars
    var packageVersionStoreJSON = JSON.parse(packageVersionStoreJson);
    var packageVersionStoreJSON2 = JSON.parse(packageVersionStoreJson);
    var packageVersion = null;
    var documentListTmp =  JSON.parse(documentListJson);
    var documentList = documentListTmp.documentList;
    
    registerSuite({
        name: 
       
        
        
        'Request Save - Test save after adding',
        
        // assert params http://chaijs.com/api/assert/
        
        
        addingOnJustEnd: function(){
            var newStartDate = new Date("08/15/2014");
            var newEndDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore( JSON.parse(packageVersionStoreJson) );
            packageVersion = packageVersionModel.getPackageVersionStore();
            var oldLength = packageVersion.length;
            //console.log("length 3 is: "+packageVersion.length);
            
            //packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            //console.log("New Store Two ", packageVersion);
            
            assert(newLength == oldLength
                ,'New package dates dont match');
            
        },
        
        
        addThenSaveSpanVersion: function () {

            var startDate = new Date("04/01/2014");
            var endDate = new Date("12/10/2014");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.addTo(startDate, endDate, "code", documentList, 3);
            
            packageVersionSave = packageVersionModel.returnForSave("test", false);
            
            assert( packageVersionSave.length == 3 
                ,'New Docs NOT INSERTED to package at [3]');
        }, 
        
        addThenSaveOnVersion: function () {

            var startDate = new Date("08/01/2014");
            var endDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.addTo(startDate, endDate, "code", documentList, 3);
            
            packageVersionSave = packageVersionModel.returnForSave("test", false);
            
            assert( packageVersionSave.length == 1 
                ,'New Docs NOT INSERTED to package at [3]');
        },   
        
        
    // New Sub Suite
    'Add Class - Add document list to new Packages':{ 
        checkFoInserted: function () {

            var startDate = new Date("11/10/2014");
            var endDate = new Date("11/15/2014");
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON2);
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            console.log("New for Docs ", packageVersion);
            packageVersionModel.addingDocsToDates(startDate, endDate, documentList);
            i = 0;
            dojo.forEach(packageVersion, function(packageItem){
                if(packageItem.documents.length > 5){
                    i = i + 1;
                    console.log('Inserted into: ', packageItem);
                }
            });
            //console.log("And Should be ", packageVersion[1].documents.length);
            assert( i == 1
                ,'New Docs NOT ADDED');
        },
        
//        addingToALocation: function () {
//
//            var startDate = new Date("06/25/2014");
//            var endDate = new Date("07/01/2014");
//            
//            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON2);
//            packageVersion = packageVersionModel.getPackageVersionStore();
//            
//            console.log("New for Docs Location ", packageVersion);
//            packageVersionModel.addingDocsToDates(startDate, endDate,documentList, 3);
//            assert.equal( packageVersion[1].documents[10].id, "9343214"
//                ,'New Docs NOT INSERTED to package at [3]');
//        },
        addingToAVersion: function () {

            var startDate = new Date("08/01/2014");
            var endDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            console.log("New for Docs Location ", packageVersion);
            packageVersionModel.addingDocsToDates(startDate, endDate,documentList, 3);
            assert.equal( packageVersion[1].documents[10].id, "9343214"
                ,'New Docs NOT INSERTED to package at [3]');
        },
        
        addingSpanningSeveral: function () {

            var startDate = new Date("01/01/2014");
            var endDate = new Date("12/01/2014");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            console.log("New for Docs Location ", packageVersion);
            packageVersionModel.addingDocsToDates(startDate, endDate,documentList, 3);
            assert( packageVersion[0].documents.length > 10 
                    && packageVersion[1].documents.length > 10 
                ,'New Docs NOT INSERTED to package at [3]');
        },
        
        addThenCheckChangedDropDown: function () {

            var startDate = new Date("08/01/2014");
            var endDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.addTo(startDate, endDate, "code", documentList, 3);
            
            var packageDD = packageVersionModel.loadChangedVersionsDropDown();
            
            assert( packageDD.length == 1 
                   && packageDD[0].label == "8/1/2014 - 11/20/2014"
                ,'New Docs NOT INSERTED to package at [3]');
        }, 
        
        
    },
        
    'Test Adding dates':{
        
        
        /**
		 * Ensure that a new package is added
         */
        checkForNewPackage: function () {
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON);
            packageVersion = packageVersionModel.getPackageVersionStore();
            console.log("length 1 is: "+packageVersion.length);
            
            var oldLength = packageVersion.length;
            var newStartDate = new Date("11/09/2014");
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            var newLength = packageVersion.length;
            
            assert(oldLength < newLength ,
                'No new package added');
        },
        
        /**
		 * Check for packages added inside an old package date range index[3]  "11/9/2014" to "11/21/2014"
         */
        addingInside: function(){
            var newStartDate = new Date("11/09/2014");
            var newEndDate = new Date("11/15/2014");
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON);
            packageVersion = packageVersionModel.getPackageVersionStore();
            console.log("length 2 is: "+packageVersion.length);
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            console.log("New Store ", packageVersion);
            assert(
                    packageVersion[2].effectiveDate == "11/9/2014" 
                    && packageVersion[2].expirationDate == "11/15/2014" 
                    && packageVersion[3].effectiveDate == "11/16/2014" 
                    && packageVersion[3].expirationDate == "11/20/2014"
                ,'New package dates dont match');
            
        },
        
        /**
		 * Check for packages added inside TWO old package date range 
         * index[2] "08/01/2014" to "11/9/2014" index[3]  "11/9/2014" to "11/21/2014"
         */
        addingInsideTwo: function(){
            var newStartDate = new Date("10/02/2014");
            var newEndDate = new Date("11/12/2014");
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON);
            packageVersion = packageVersionModel.getPackageVersionStore();
            console.log("length 3 is: "+packageVersion.length);
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            console.log("New Store Two ", packageVersion);
            assert(
                    packageVersion[2].effectiveDate == "10/2/2014" 
                    && packageVersion[2].expirationDate == "11/8/2014" 
                    && packageVersion[3].effectiveDate == "11/9/2014" 
                    && packageVersion[3].expirationDate == "11/12/2014" 
                ,'New package dates dont match');
            
        },
        
        /**
		 * Adding it to existing packages start and end date
         */
        addingOnExisting: function(){
            var newStartDate = new Date("08/01/2014");
            var newEndDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore( JSON.parse(packageVersionStoreJson) );
            packageVersion = packageVersionModel.getPackageVersionStore();
            var oldLength = packageVersion.length;
            //console.log("length 3 is: "+packageVersion.length);
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            //console.log("New Store Two ", packageVersion);
            
            assert(oldLength == newLength ,
                'New package added');
            
        },
        
         /**
		 * Adding it to existing packages start and NEW date
         */
        addingOnExistingStart: function(){
            var newStartDate = new Date("08/01/2014");
            var newEndDate = new Date("08/20/2014");
            
            packageVersionModel.setPackageVersionStore( JSON.parse(packageVersionStoreJson) );
            packageVersion = packageVersionModel.getPackageVersionStore();
            var oldLength = packageVersion.length;
            //console.log("length 3 is: "+packageVersion.length);
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            //console.log("New Store Two ", packageVersion);
            
            assert(
                    packageVersion[1].effectiveDate == "08/01/2014" 
                    && packageVersion[1].expirationDate == "8/20/2014"
                    && packageVersion[2].effectiveDate == "8/21/2014"
                ,'New package dates dont match');
            
        },
        
        /**
		 * Adding it to existing packages end and NEW date
         */
        addingOnExistingEnd: function(){
            var newStartDate = new Date("08/15/2014");
            var newEndDate = new Date("11/20/2014");
            
            packageVersionModel.setPackageVersionStore( JSON.parse(packageVersionStoreJson) );
            packageVersion = packageVersionModel.getPackageVersionStore();
            var oldLength = packageVersion.length;
            //console.log("length 3 is: "+packageVersion.length);
            
            packageVersionModel.sortingDates(newStartDate, "startDate");
            packageVersionModel.sortingDates(newEndDate, "endDate");
            
            var newLength = packageVersion.length;
            
            //console.log("New Store Two ", packageVersion);
            
            assert(
                    packageVersion[1].expirationDate == "8/14/2014" 
                    && packageVersion[2].effectiveDate == "8/15/2014"
                    && packageVersion[2].expirationDate == "11/20/2014"
                ,'New package dates dont match');
            
        },
                
        /**
		 * Check for packages added before first package start date
         * index[0] "01/01/2014" to "07/31/2014"
         */
        addingBefore: function(){
            var newStartDate = new Date("12/20/2013");
            var newEndDate = new Date("12/25/2013");
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON);
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.sortingDates(newEndDate, "endDate");
            packageVersionModel.sortingDates(newStartDate, "startDate");
            console.log("length 4 is: "+packageVersion.length);
            
            var newLength = packageVersion.length;
            
            //console.log("New Store Two ", packageVersion);
            assert(
                    packageVersion[0].effectiveDate == "12/20/2013" 
                    && packageVersion[0].expirationDate == "1/1/2014"
                ,'New package dates dont match');
            
        },
        
        /**
		 * Check for packages added before first package start date
         * index[0] "01/01/2014" to "07/31/2014"
         */
        addingAfter: function(){
            var newStartDate = new Date("03/20/2015");
            var newEndDate = new Date("04/25/2015");
            
            packageVersionModel.setPackageVersionStore(packageVersionStoreJSON);
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.sortingDates(newEndDate, "endDate");
            packageVersionModel.sortingDates(newStartDate, "startDate");
            
            var newLength = (packageVersion.length)-1;
            
            //console.log("New Store Two ", packageVersion);
            assert(
                    packageVersion[(newLength-1)].effectiveDate == "3/20/2015" 
                    && packageVersion[(newLength-1)].expirationDate == "4/25/2015"
                ,'New package dates dont match');
            
        },
        
        /**
		 * Check for packages added that span two packages
         * index[0] "01/01/2014" to "07/31/2014"
         */
        spaningTwo: function(){
            var newStartDate = new Date("06/15/2014");
            var newEndDate = new Date("02/25/2015");
            
            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            packageVersionModel.sortingDates(newEndDate, "endDate");
            packageVersionModel.sortingDates(newStartDate, "startDate");
            
            var newLength = (packageVersion.length)-1;
            
            console.log("New Store Three ", packageVersion);
            assert(
                    packageVersion[0].expirationDate == "6/14/2014" 
                    && packageVersion[(newLength-1)].expirationDate == "2/25/2015"
                ,'New package dates dont match');
            
        },
        
        /**
		 * Check for packages added that span two packages
         * index[0] "01/01/2014" to "07/31/2014"
         */
        blankEndDate: function(){
            var newStartDate = new Date("06/15/2014");
            var newEndDate = new Date("");

            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            //packageVersionModel.sortingDates(newEndDate, "endDate");
            packageVersionModel.addTo(newStartDate, newEndDate, "code", documentList);

            
            console.log("New Store Three ", packageVersion);
            assert(
                    packageVersion[1].effectiveDate == "6/15/2014" 
                    && packageVersion.length == 4
                ,'New package dates dont match');
            
        },
        
        /**
		 * Check for packages added that span two packages
         * index[0] "01/01/2014" to "07/31/2014"
         */
        addToSingle: function(){
            var newStartDate = new Date("06/15/2014");
            var newEndDate = new Date("07/15/2014");

            packageVersionModel.setPackageVersionStore(JSON.parse(packageVersionStoreSingleJson));
            packageVersion = packageVersionModel.getPackageVersionStore();
            
            //packageVersionModel.sortingDates(newEndDate, "endDate");
            packageVersionModel.addTo(newStartDate, newEndDate, "code", documentList);

            
            console.log("New Store Three ", packageVersion);
            assert(
                    packageVersion[0].expirationDate == "6/14/2014"    
                    && packageVersion[1].effectiveDate == "6/15/2014" 
                    && packageVersion[1].expirationDate == "7/15/2014"
                    && packageVersion[2].effectiveDate == "7/16/2014"
                    && packageVersion.length == 3
                ,'New package dates dont match');
            
        },
        
        
        /* End of Add Class - Insert Dates */         
        
         
    }
    });
});