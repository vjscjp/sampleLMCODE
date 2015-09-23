/**
 * This model will store package version information and document list
 */
define([
        "dojo/store/Memory", "dojo/promise/all", "dojo/_base/lang", "dojo/_base/array",  "controllers/widgets/functions.js"
    ], function (
       Memory, all, lang, array, Functions
    ) {

    var Function = new Functions(); // Functions.js helper Widget
    var Notice = this.app.NoticeHelper;
    
    packageVersionStore = new Memory();
    classList = new Memory();
    subClassList = new Memory();

    return {
        /**
		 * Load All base packages for selected code
         * Called on initial page load or when a package selection is needed
         * Returns a promise of results if needed - used with all()
		 */
        loadPackages: function(code){
            var tempPackageVersions = [], tempTarget;
            //Modified by Venkata : Fix : if second time this store is fired, it is pertaining the  pkgCd and  '/versions'. 
			tempTarget = cachePackagesStore.__proto__.target;
			loadedVersionsResults = cachePackagesStore.query(code+"/versions/").then(function(results) {
					// build select list from versions return
                    var i = 0;
                    var loadedVersions = results.pkgVersionHeaders;  
                    array.forEach(results.pkgVersionHeaders, function(resultsItem){
                        tempPackageVersions.push( {
                            id:resultsItem.id,
                            effectiveDate : Function._isoDateFormatter(resultsItem.effectiveDate),
                            expirationDate : Function._isoDateFormatter(resultsItem.expirationDate),
                            origEffDate: resultsItem.effectiveDate,
                            origExpDate: resultsItem.expirationDate,
                            documents: []
                        } );
                    });
                    packageVersionStore.data = tempPackageVersions;
                    //console.log('New Auto Packages: ', ,  packageVersionStore.data);
                    return loadedVersions;
            }, function(error){
                Function.handleError(error);
            });
			
            cachePackagesStore.__proto__.target = tempTarget;
			
            return loadedVersionsResults;
        },
        
        /**
		 * Load new version document list from endpoint
         * called on init, first version in drop down, and when version drop down changes - versionSelect_packageModify
		 */
        loadVersion: function(index, code, id) {
            var self = this;
            var returnDefered = null;
            // query store based on current package list packageList.code
            //var selectedVersion = versionSelect_packageModify.get("value");
			//console.log("New Version loading ", id, " and code "+code);	
            
            returnDefered = cachePackagesStore.query(code+"/versions/"+id).then(function(results) {
                //console.log("Results for Versions " , results);
                
                //console.log("accessing ", index);
                packageVersionStore.data[index].documents = results.pkgListDocuments;
                

                return results;
            }, function(error){
				Function.handleError(error);
			});
            
            return returnDefered;
            
		},
        
        checkForCurrent: function(myDate){
            var futureDate = 'current';
            if(myDate != ''){
                var futureDateDt = Function._returnDateObj(myDate);
                var afterDate = new Date("01/01/2100");
                if(futureDateDt < afterDate){
                    futureDate = Function._isoDateFormatter(futureDateDt);
                }
            }
            return futureDate;
        },
        
        /**
		 * Create array for drop down Version list selector
         * called on init, and whenver the version list of packageVersionStore is updated
		 */
        loadVersionsDropDown: function(){
            var packageVersionDropDown = [];
            var self = this;
            
            // Id was set to resultsItem.id, but switched to index 
            array.forEach(packageVersionStore.data, function(resultsItem, i){
                packageVersionDropDown.push({
                    id:i,
                    label:
                        Function._isoDateFormatter(resultsItem.effectiveDate) + " - " + self.checkForCurrent(resultsItem.expirationDate)
                });
            }); 
            
            return packageVersionDropDown;
        },
        
        /**
		 * Create array for drop down Version list selector
         * called on init, and whenver the version list of packageVersionStore is updated
		 */
        loadChangedVersionsDropDown: function(){
            var packageVersionDropDown = [];
            var self = this;
            
            array.forEach(packageVersionStore.data, function(resultsItem, i){
                var isChanged = false;
                array.forEach(resultsItem.documents, function(docItem){
                    if(typeof docItem.changeInd != "undefined" && docItem.changeInd != '')
                        isChanged = true;
                });
                if(isChanged){
                    packageVersionDropDown.push({
                        id:i,
                        label:
                            Function._isoDateFormatter(resultsItem.effectiveDate) + " - " + self.checkForCurrent(resultsItem.expirationDate)
                    });
                }
            }); 
            
            return packageVersionDropDown;
        },
        
        /**
		 * Create array of empty versions for drop down
         * used on clone page
		 */
        loadEmptyVersionsDropDown: function(){
            var packageVersionDropDown = [];
            var self = this;
            
            array.forEach(packageVersionStore.data, function(resultsItem, i){
                var isEmpty = false;
                if(resultsItem.documents.length == 0){
                    packageVersionDropDown.push({
                        id:i,
                        label:
                            Function._isoDateFormatter(resultsItem.effectiveDate) + " - " + self.checkForCurrent(resultsItem.expirationDate)
                    });
                }
            }); 
            
            return packageVersionDropDown;
        },
        
        /**
		 * Create array of empty versions for drop down
         * used on clone page
		 */
        loadFirstEmptyVersionsDate: function(){
            var firstDate = "";
            array.forEach(packageVersionStore.data, function(resultsItem, i){
                var isEmpty = false;
                if(resultsItem.documents.length == 0 && !firstDate){
                    firstDate = resultsItem.effectiveDate;
                }
            }); 
            return firstDate;
        },
        
        /**
         * -- NoT used anymore as all documents are loaded on load
		 * Load documents to any packages that are affected by new start and end date
         * called before sortingDates
		 */
        sortingDatesGetDocuments: function(startDate, endDate, code) {
            var neededDocuments = [], neededDocumentsID = [], finished;
            var self = this;
            var i =0;
            var getPackages = null;
            
            array.forEach(packageVersionStore.data, function(packageItem) {
                var packageStartDate = Function._returnDateObj(packageItem.effectiveDate);
                var packageEndDate = Function._returnDateObj(packageItem.expirationDate);
                var process = false;
                
                // start or end date are inside the version
                if( (startDate >= packageStartDate  &&  startDate <= packageEndDate) || (endDate >= packageStartDate  &&  endDate <= packageEndDate)){
                    process = true;
                // spans over a package
                }else if( (startDate <= packageStartDate  &&  endDate >= packageEndDate) ){
                    process = true;
                }
                
                 
                if(process && packageItem.id){
                    if( packageItem.documents.length == 0){
                        getPackages = self.loadVersion(i, code, packageItem.id);
                        neededDocuments.push(getPackages);
                        neededDocumentsID.push(packageItem.id);
                    }
                }
                
                i = i + 1;
            });
            
            // wait for all defered versions before processing, then add them to packages
            return finished = all(neededDocuments).then(function(results){
                i = 0;
                // loop all defereds items, matchi with packageVersion ID and add results
                array.forEach(results, function(docList) {
                    array.forEach(packageVersionStore.data, function(packageItem) {
                        array.forEach(neededDocumentsID, function(neededID) {
                        
                            if(neededID == packageItem.id){
                                packageItem.documents = docList.pkgListDocuments
                            }
                        });
                    });
                    i = i ++;
                });
                //console.log("What to use ",results);
                var test = 1;
            });
        },
        
        /**
		 * Add Docs by list, split dates first, then add docs
         * Called before any document inserts
		 */
        addTo: function(startDate, endDate, code, documentList) {
            var self = this;
            var finished;
            var packageVersion = packageVersionStore.data;
            var someFutureDate = new Date("01/01/2100"); // future date set in DB is 12/31/9999, but just to be safe
            // need to see if its earlier then first package
            var newStartDate = new Date(startDate);
            var newEndDate = new Date(endDate);
            var verLength = (packageVersion.length - 1);
            var lastPackageEndDate =  Function._returnDateObj( packageVersion[verLength].expirationDate );
            var firstPackageStartDate =  Function._returnDateObj( packageVersion[0].effectiveDate );
            
            // it its earlier we need to run end deate first so we can validate
            var earlier = false;
            if(newStartDate.getTime() < firstPackageStartDate.getTime() && newEndDate.getTime() < firstPackageStartDate.getTime()){
                earlier = true;
            }
            
            // make sure all needed packages have doc list
            // -- Not needed loading all versions on view modify page
            //var inFinished = self.sortingDatesGetDocuments(newStartDate, newEndDate, code);
            // -- no need to defered code bellow
            //return finished = all(inFinished).then(function(results){
            
            // figure out if end date is blank and set it 
            if(isNaN(newEndDate.getTime())){
                if(lastPackageEndDate.getTime() > someFutureDate.getTime()){
                    newEndDate = lastPackageEndDate;
                }else{
                    newEndDate = new Date("12/31/99999");
                }
            }
            
            // construct new packages based on dates and date spans
            if(earlier){
                self.sortingDates(newStartDate, "startDate");
                self.sortingDates(newEndDate, "endDate");
                
            }else{
                self.sortingDates(newEndDate, "endDate");
                self.sortingDates(newStartDate, "startDate");
            }
            
            

            //broken out for Unit Test
            this.addingDocsToDates(newStartDate, newEndDate, documentList);    
        },
        
        
        /**
		 * Sorting Date based on new selected start end date.
         * Called before any document inserts
		 */
        sortingDates: function(newDate, type) {
            var i = 0;
            //console.log("Old Store"+ packageVersionStore.data);
            
            var lastPackageEndDate = '';
            var verLength = '';
            var firstPackageStartDate = '';
            var lastPackageDocs = '';
            
            array.forEach(packageVersionStore.data, function(packageItem){
                // TODO IE9 needs .getTime() at end of Date()
                var newEndDatePlus, newStartDatePlus;
                var packageStartDate = Function._returnDateObj(packageItem.effectiveDate);
                var packageEndDate = Function._returnDateObj(packageItem.expirationDate);
                var packageDateDocs = packageItem.documents;
                verLength = packageVersionStore.data.length - 1;
                lastPackageEndDate =  Function._returnDateObj( packageVersionStore.data[verLength].expirationDate );
                if(packageVersionStore.data[verLength].expirationDate == "")
                    lastPackageEndDate =  Function._returnDateObj( packageVersionStore.data[verLength].effectiveDate );
                firstPackageStartDate =  Function._returnDateObj( packageVersionStore.data[0].effectiveDate );
                lastPackageDocs = packageVersionStore.data[i].documents;
                
                // 3 cases, inside an existing package, spans existing package, and spans and outside existing package
                // inside
                //console.log("Last End " + lastPackageEndDate );
               
                if( (newDate.getTime() > packageStartDate.getTime()  &&  newDate.getTime() < packageEndDate.getTime())){
                    //console.log("Start Inside Date", packageStartDate , " " , newDate);
                    //console.log("Old Version", packageVersionStore.data[i]);
                    
                    // if its and end date it needs to be = 1 on the date
                    newEndDatePlus = newDate;
                    if(type ==  "endDate"){
                        newEndDatePlus = Function.plusDay(newDate, 1);
                    }
                    
                    // slicing in new package after affected date
                    packageVersionStore.data.splice( (i+1), 0, {
                        effectiveDate : Function._isoDateFormatter( newEndDatePlus ),
                        expirationDate : Function._isoDateFormatter(packageEndDate),
                        documents:  packageDateDocs
                    } );
                    
                    // changing previous expiration date to new start date
                    newStartDatePlus = newDate;
                    if(type ==  "startDate"){
                        newStartDatePlus = Function.plusDay(newDate, (-1));
                    }
                    packageVersionStore.data[i].expirationDate = Function._isoDateFormatter( newStartDatePlus );
                    //packageVersionStore.data[(i+1)].expirationDate = Function._isoDateFormatter( Function.plusOneDay(newDate) );
                    //console.log("fixing Version", packageVersionStore.data[i]);
                }
                
                i = i + 1;
            });
            
            // it its in the future just make it the next date for the package
            if(newDate.getTime() > lastPackageEndDate.getTime() && type == "startDate"){
                //alert("New package dates must follow the current package end date, setting new package start date to " + lastPackageEndDate);
                packageVersionStore.data.push( {
                    effectiveDate : Function._isoDateFormatter(lastPackageEndDate),
                    expirationDate : Function._isoDateFormatter(newDate),
                    documents: lastPackageDocs
                } );
                packageVersionStore.data[verLength].expirationDate = Function._isoDateFormatter( newDate );
            }
            
            
            //console.log("lastPackageEndDate" + lastPackageEndDate);
            if(newDate.getTime() > lastPackageEndDate.getTime() && type ==  "endDate"){
                packageVersionStore.data.push( {
                    effectiveDate : Function._isoDateFormatter(lastPackageEndDate),
                    expirationDate : Function._isoDateFormatter(newDate),
                    documents: lastPackageDocs
                } );
            }
            
            // it its in the past just make it the next date for the package
            if(newDate < firstPackageStartDate && type == "endDate"){
                //alert("Package end dates can't be before the first package Start date, setting new package end date to " + firstPackageStartDate);
            }
            
            if(newDate.getTime() < firstPackageStartDate.getTime() && type ==  "startDate"){
                packageVersionStore.data.unshift( {
                    effectiveDate : Function._isoDateFormatter(newDate),
                    expirationDate : Function._isoDateFormatter(firstPackageStartDate),
                    documents: lastPackageDocs
                } );
            }
            
            
            
            console.log("New Store", packageVersionStore.data);
            
        },
        
        /**
		 * After Sorting add an new documents to affected package versions
         * Called after sortingDates
		 */
        addingDocsToDates: function(startDateIn, endDateIn, documentList, location) {
            //console.log("Going for the list",documentList);
            var startDate = new Date(startDateIn );
            var endDate = new Date(endDateIn );
            
            var i = 0;
            array.forEach(packageVersionStore.data, function(packageItem, countx){
                var tempDocumentList = [];
                var packageStartDate = Function._returnDateObj(packageItem.effectiveDate);
                var packageEndDate = Function._returnDateObj(packageItem.expirationDate);
                //console.log("dating: ",packageEndDate,packageStartDate); 
                // start and end span over version
                if(startDate.getTime() < packageStartDate.getTime() && endDate.getTime() > packageEndDate.getTime()){
                   tempDocumentList = [];
                   tempDocumentList = packageItem.documents.concat( lang.clone(documentList) );
                    array.forEach(tempDocumentList, function(listItem,counti){
                        listItem.seqNum = counti+1;
                    });
                   packageItem.documents = tempDocumentList;
                    
                    // fix sort after insert
                    //var ii = 0;
//                    array.forEach(packageItem.documents, function(listItem,counti){
//                        listItem.seqNum = counti+1;
//                        //packageItem.documents[ii].seqNum = (ii+1);
//                        //ii = ii + 1;
//                    });
                    //ii = 0;
                // 1. Start dates falls inside a version, 2. enddata falls inside a version
                }else if( (startDate.getTime() >= packageStartDate.getTime() && startDate.getTime() < packageEndDate.getTime()) ||  
                        (endDate.getTime() > packageStartDate.getTime() && endDate.getTime() <= packageEndDate.getTime())){
                    console.log("Should add it here ",  packageVersionStore.data[i], documentList);
                    
//                    if(typeof location != "undefined" && location <= packageItem.documents.length){
//                        packageItem.documents.splice(location, 0, documentList );
//                    }else{
                        tempDocumentList = [];
                        tempDocumentList = packageItem.documents.concat( lang.clone(documentList) );
                        array.forEach(tempDocumentList, function(listItem,counti){
                            listItem.seqNum = counti+1;
                        });
                        packageItem.documents = tempDocumentList;
                    //}
                    
                    // fix sort after insert
                    //var ii = 0;
//                    array.forEach(packageItem.documents, function(listItem,counti){
//                        listItem.seqNum = counti+1;
//                        //packageItem.documents[ii].seqNum = (ii+1);
//                        //ii = ii + 1;
//                    });
                    //ii = 0;  
                }
                
//                array.forEach(packageItem.documents, function(listItem,counti){
//                    //listItem.seqNum = counti+1;
//                    //packageItem.documents[ii].seqNum = (ii+1);
//                    packageVersionStore.data[countx].documents[counti].seqNum = counti+1
//                    //ii = ii + 1;
//                });
                
                i = i ++;
            });
        },
        
        // General Moving and inserting
        /**
		 * Moving item in grid and changing stores
         * Called on move up click
		 */
        documentMove: function(direction, activeIndex, documentGrid){
            var packageVersionActiveStore = packageVersionStore.data[activeIndex].documents;
            
            var rowData = documentGrid.selection.getSelected();
			if(!rowData[0]){
				Notice.showWarning("Please select a row in the document list");
				return;
			}
            
            movingTo = 1;
            if(direction == "up") movingTo = -1;
            
            
			console.log("Moving row ", rowData[0].seqNum, " of ", packageVersionActiveStore.length);
            var moving = rowData[0].seqNum-1;
            var propel = (moving+movingTo);
            if( (propel >= 0) && (packageVersionActiveStore.length > propel) ){
                // update seqNum then move
                var from_move = packageVersionActiveStore[(moving+movingTo)].seqNum;
                var to_move = packageVersionActiveStore[(moving)].seqNum;
                packageVersionActiveStore[moving].seqNum = from_move; //(moving+movingTo)+1;
                packageVersionActiveStore[moving].changeInd = "C";
                packageVersionActiveStore[(moving+movingTo)].seqNum = to_move; // moving+1;
                packageVersionActiveStore[(moving+movingTo)].changeInd = "C";


                if(moving >= 0){

                    var arr = packageVersionActiveStore;
                    console.log("Fr ", arr);

                    var tmp = arr.splice(moving,1);
                    arr.splice((moving+movingTo),0,tmp[0]);

                    console.log("To ", arr);
                }
                
            }
            
            
        },
        
        /**
		 * Moving item in grid and changing stores
         * Called on move up click
		 */
        documentRemove: function(activeIndex, documentGrid){
            var packageVersionActiveStore = packageVersionStore.data[activeIndex].documents;
            
            // could use documentGrid.selection.selectedIndex
            var rowData = documentGrid.selection.getSelected();
            var itemSeqNum = (rowData[0].seqNum - 1);
			if(!rowData[0]){
				Notice.showWarning("Please select a row in the document list");
				return;
			} 
            //console.log("removing", documentGrid.selection);
            //console.log("before", packageVersionStore.data);
            var deleteItem = packageVersionActiveStore[itemSeqNum];
            deleteItem.changeInd = "D";
            packageVersionActiveStore.splice(itemSeqNum,1);
            
            // create a new param called deleteDocs and add the delete item
            var deleteDocs = packageVersionStore.data[activeIndex];
            if(typeof deleteDocs.deleteDocs == "undefined"){
                deleteDocs.deleteDocs = [];
            }
            deleteDocs.deleteDocs.push(deleteItem); 
            
            
            console.log("Deleting ",deleteItem);
            console.log("after", packageVersionStore.data);
            
            //this.documentFixOrder(itemSeqNum, 1, activeIndex);
            
            var i = 0;
            array.forEach(packageVersionActiveStore, function(listItem){
                packageVersionActiveStore[i].seqNum = (i+1);
                i = i + 1;
            });
        },
        
        /**
		 * Fixing order after deleting items
         * Called after deleting one doc or several docs via class sub clss
         DELETE ?
		 */
//        documentFixOrder: function(index, moving, activeIndex){
//            var packageVersionActiveStore = packageVersionStore.data[activeIndex].documents;
//            
//            var i = 0;
//            array.forEach(packageVersionActiveStore, function(listItem){
//                console.log("now at " + listItem.seqNum + " of " + index);
//                if(listItem.seqNum > index){
//                    console.log("Fixing " + listItem.seqNum + " to " + (listItem.seqNum - moving));
//                    packageVersionActiveStore[i].seqNum = i; //listItem.seqNum - moving;   
//                 }
//                i = i + 1;
//            });
//        },
        
        // --- Classification Functions --- //
        
        /**
		 * Sorts Classification data into Class -> Doc Object Array
         * Called before the datagrids are loaded
		 */
        classificationFromPackageDocs:function(activeIndex){
            var packageVersionActiveStore = packageVersionStore.data[activeIndex].documents;
            classList.data = [];
            
            var prevClass, prevItem, classPos, classDocsPush, mixPush, classDocs = [];
            var seqCount = 0;
            array.forEach(packageVersionActiveStore, function(listItem){	
                if(prevClass != listItem.classification){
                    
                    classDocsPush = {docs:classDocs}
                    classPos = {seqCount:seqCount};
                    mixPush = lang.mixin( prevItem, classPos);
                    if(prevItem){
                        classList.data.push( lang.mixin( mixPush, classDocsPush) );
                    }
                    seqCount =  0;
                    classDocs = [];
                }
                prevClass = listItem.classification;
                // TO DO, ADD class namd ,,, Donbe ?
                prevItem = { 
                    classification:listItem.classification,
                    subclassification:listItem.subclassification,
                    seqNum:listItem.seqNum,
                }
                classDocs.push(listItem);
                seqCount = seqCount + 1;
            });
            classDocsPush = {docs:classDocs};
            classPos = {seqCount:seqCount};
            mixPush = lang.mixin( prevItem, classPos);
            classList.data.push( lang.mixin( mixPush, classDocsPush) );
            
            return classList;
        },
        
        /**
		 * Sorts SubClassification data into SubClass -> Doc Object Array
         * Called before the datagrids are loaded
		 */
        subClassificationFromPackageDocs:function(activeIndex){
            var packageVersionActiveStore = packageVersionStore.data[activeIndex].documents;
            subClassList.data = [];
            
            var prevClass, prevSubClass, prevItem, classPos, classDocsPush, mixPush, classDocs = [];
            var seqCount = 0;
            array.forEach(packageVersionActiveStore, function(listItem){	
                if(prevClass != listItem.classification || prevSubClass != listItem.subclassification){
                    
                    classDocsPush = {docs:classDocs}
                    classPos = {seqCount:seqCount};
                    mixPush = lang.mixin( prevItem, classPos);
                    if(prevItem){
                        subClassList.data.push( lang.mixin( mixPush, classDocsPush) );
                    }
                    seqCount =  0;
                    classDocs = [];
                }
                prevClass = listItem.classification;
                prevSubClass = listItem.subclassification;
                prevItem = { 
                    classification:listItem.classification,
                    subclassification:listItem.subclassification,
                    seqNum:listItem.seqNum,
                }           
                classDocs.push(listItem);
                seqCount = seqCount + 1;
            });
            classDocsPush = {docs:classDocs};
            classPos = {seqCount:seqCount};
            mixPush = lang.mixin( prevItem, classPos);
            subClassList.data.push( lang.mixin( mixPush, classDocsPush) );
            
            return subClassList;
        },
        
        classificationMove:function(direction, activeIndex, gridItem){
            this.moveArray(direction, classList.data, gridItem);
            
            var i=1;
            var newDocList = [];
            // Now set the Active Package Version documents from the updated Class list
            array.forEach(classList.data, function(listItem){	
                array.forEach(listItem.docs, function(docItem){
                    docItem.seqNum = i;
                    newDocList.push(docItem);
                    i ++;
                });
            });
            packageVersionStore.data[activeIndex].documents = newDocList;
        },
        
        
        subClassificationMove:function(direction, activeIndex, gridItem){
            this.moveArray(direction, subClassList.data, gridItem);
            
            var i=1;
            var newDocList = [];
            // Now set the Active Package Version documents from the updated SubClass list
            array.forEach(subClassList.data, function(listItem){	
                array.forEach(listItem.docs, function(docItem){
                    docItem.seqNum = i;
                    newDocList.push(docItem);
                    i ++;
                });
            });
            packageVersionStore.data[activeIndex].documents = newDocList;
        },
        
        
        moveArray: function(direction, arrayList, gridItem){

            
            var rowData = gridItem.selection.getSelected();
			if(!rowData[0]){
				Notice.showWarning("Please select a row in the list");
				return;
			}
            
            
            
			//console.log("Moving row ", rowData[0].seqNum, " of ", packageVersionActiveStore.length);
            var moving = rowData[0].seqNum;
            var movingCount = rowData[0].seqCount;
            var movingIndex = 0;
            
            var i = 0;
            array.forEach(arrayList, function(classItem){
                if(moving == classItem.seqNum) movingIndex = i;  
                i ++;
            });
            
            var movingTo = 1;
            if(direction == "up") movingTo = (-1);
            
            if( ((movingIndex + movingTo) >= 0) && (arrayList.length > (movingIndex+movingTo)) ){

//                if(movingIndex >= 0){

                console.log("Fr ", arrayList);

                var tmp = arrayList.splice(movingIndex,1);
                // flag as changed for Doc list
                tmp[0].changeInd = "C"
                // Mark the docs list as C for classifications and sub
                if(typeof tmp[0].docs != "undefined"){
                    array.forEach(tmp[0].docs, function(docItem){
                        docItem.changeInd = "C";
                    });
                }

                arrayList.splice((movingIndex+movingTo),0,tmp[0]);

                console.log("To ", arrayList);
                
            }
            
            return arrayList;
            
        },
        
        /**
		 * Used for validating if any pending changes are present
         * Called before changing versions
		 */
        validateDocumentChange: function(){
            var edited = false;
            array.forEach(packageVersionStore.data, function(listItem){
                array.forEach(listItem.documents, function(documents){
                    if(typeof documents.changeInd != "undefined"){
                        edited = true;
                    }
                });
                
                if(typeof listItem.deleteDocs != "undefined"){
                    array.forEach(listItem.deleteDocs, function(documents){
                        if(typeof documents.changeInd != "undefined"){
                            edited = true;
                        }
                    });
                }
                
            });
            
            return edited;
        },
        
        /**
		 * Clean up packageVersionStore.data for save to run package update, only packags that have a changedInd value
         * Called before most save options
		 */
        returnForSave : function (code, save) {
            //[ { "effectiveDate": "02/15/2014", "expirationDate": "02/28/2014", "documents": [
            var self = this;
            var keepIndex = [];
            var keepingPackages = [];
            var i = 0;
            array.forEach(packageVersionStore.data, function(listItem){
                
                var orgStartTime ="T05:00:00.000+0000", orgEndTime ="T05:00:00.000+0000", tmpStart, tmpEnd;
                
                //{"docId":"11201981","origDocId":"11201981", "dateTypeCd":null, "seqNum":"001", "changeInd": "C"},
                var keep = false;
                // doc list has changed
                array.forEach(listItem.documents, function(doc) {
                    
                    if(typeof doc.changeInd != "undefined" && doc.changeInd != ""){
                        keep = true;
                    }
                });
                
                // fix date format 
                tmpStart = listItem.origEffDate;
                tmpEnd = listItem.origExpDate;
                if(typeof tmpStart != "undefined") orgStartTime = tmpStart.substr(tmpStart.length - 18);
                if(typeof tmpEnd != "undefined") orgEndTime = tmpEnd.substr(tmpEnd.length - 18);
                
                listItem.effectiveDate = Function.formatLocalDateOnly(listItem.effectiveDate)+ orgStartTime;
                listItem.expirationDate = Function.formatLocalDateOnly(listItem.expirationDate)+ orgEndTime;
                
                // parse back in the delete docs
                if(typeof listItem.deleteDocs != "undefined" && listItem.deleteDocs.length != 0){
                    array.forEach(listItem.deleteDocs, function(delDoc) {
                        listItem.documents.push(delDoc);
                    });
                    keep = true;
                }
                
                if(keep)
                    keepIndex.push( i );
                i = i + 1;
            });
            //
            
            
            array.forEach(keepIndex, function(index){
                var adding = packageVersionStore.data[index];
                keepingPackages.push( adding );
            });

            // reformat array to match save schema
            i = 0;
            array.forEach(keepingPackages, function(mylistItem){
                if(typeof mylistItem != "undefined" && typeof mylistItem.documents != "undefined"){
                //keepingPackages[i].pkgDocuments = [{}];
                var newItemList = [];
                array.forEach(mylistItem.documents, function(docItem){
                    var newItem = {};
                    /* FROM 
                    "id": "11201981",
                      "origDocId": "11201981",
                      "documentTitle": "Test",
                      "documentNumber": "Tc129",
                      "classification": "1043400086",
                      "classNm": "Claims",
                      "subclassification": "1043400633",
                      "subclassNm": "Claims Summary",
                      "state": "AKA NL Newfoundland and Labrador",
                      "effectiveDate": "2015-01-29",
                      "expirationDate": "9999-12-31",
                      "seqNum": "1",
                      "docDtTypeCd": null,
                      "docDtTypeNm": null
                      */
                    
                    // To
                    newItem = {
                        "docId":docItem.id,
                        "origDocId":docItem.origDocId, 
                        "dateTypeCd":docItem.docDtTypeCd,
                        "seqNum": self.doubleZeros(docItem.seqNum), 
                        "changeInd": ((typeof docItem.changeInd != "undefined") ? docItem.changeInd : "")
                    }
                    newItemList.push(newItem);
                });
                keepingPackages[i].pkgDocuments = newItemList;
                
                delete keepingPackages[i].documents;
                delete keepingPackages[i].origEffDate;
                delete keepingPackages[i].origExpDate;
                delete keepingPackages[i].id;
                if(typeof keepingPackages[i].deleteDocs != "undefined")
                    delete keepingPackages[i].deleteDocs;
                
                i = i + 1;
                }
            });
            
            if(!save){
                return keepingPackages;
            }else{
            
                // now save packages
                console.debug("Saving: ", dojo.toJson(keepingPackages));

                var cachePackageSaveEndpoint = Function._returnUnSetEndpoint(cachePackagesStore);
                //console.debug(cachePackageSaveEndpoint + code + "/versions");

                tempTarget = cachePackagesStore.__proto__.target;
                cachePackagesStore.__proto__.target = cachePackagesStore.__proto__.target + code + '/versions';
                console.debug('cachePackagesStore.target', cachePackagesStore);

                console.log("Updating: ", keepingPackages);
                
                Notice.loading();
                var doneSave = cachePackagesStore.put(keepingPackages, {}).then(function (results) {
                    Notice.doneLoading();
                    console.debug('Successfully saved packages..', results);
                    if(results.updatedIds.length > 0){
                        Notice.showSuccess('Successfully saved packages');
                    }else{
                        Notice.showError('An Error occured durring save');
                    }
                    return results;
                },
                function (error) {
                    Function.handleError(error);
                    console.error('Error in  saving packages.', error);
                });
                cachePackagesStore.__proto__.target = tempTarget;

                return doneSave;
            
        }
        },
        
        /**
		 * double padding zero's for sequence number
         * called before savve
		 */
        doubleZeros: function(inNumber){
            if(inNumber < 9) 
                return "00"+inNumber;
            if(inNumber < 99) 
                return "0"+inNumber;
        },
        
        
        /**
		 * Update changed version flag to true if something is different
         * Called after, delete, move, insert for package version
		 */
        flagVersionForSave: function(){
            
        },
        
        setPackageVersionStore:function(newPackageVersionStore){
            packageVersionStore.data = newPackageVersionStore;
        },
        
        getPackageVersionStore:function(){
            return packageVersionStore.data;
        }
        
        
    };
});
