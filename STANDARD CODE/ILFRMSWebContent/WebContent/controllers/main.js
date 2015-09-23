
//Predefined tokens
/*global define : true*/
/*global console : true*/
/*global nomen: true*/

//Custom package stores
/*global memPackages : true*/
/*global cachePackagesStore : true*/
/*global cacheDocumentsStore : true*/
/*global currentUserMemStore : true*/
/*global subClassMemStore : true*/
/*global stateMemStore : true*/
/*global stateTypeMemStore : true*/
/*global docFormTpMemStore : true*/
/*global businessFunMemStore : true*/
/*global prodMemoryStore : true*/
/*global clasftnMemStore : true*/
/*global productLOBMemStore : true*/
/*global productTypesMemStore : true*/
/*global productSeriesMemStore : true*/
/*global productCSOMTMemStore : true*/
/*global productSubTypeMemStore : true*/
/*global productNamesMemStore : true*/
/*global productMktNamesMemStore : true*/
/*global timingReqMemStore : true*/
/*global timingCdMemStore : true*/
/*global secLvlCdMemStore : true*/
/*global nppiPciDesnMemStore : true*/
/*global docContentTypeMemStore : true*/
/*global distChanMemStore : true*/

define(["dojo/dom", "dojo/on", "dojo/store/JsonRest", "dojo/_base/json", "dojo/data/ObjectStore", "dojo/store/Memory",  "dojo/store/Cache", "dojo/on", "dojo/query", "dojo/NodeList-dom", "dojo/dom-class",
    "dijit", "dijit/form/ComboBox", "dijit/form/Button", "dijit/form/DateTextBox",
    "dijit/form/MultiSelect", "dojox/grid/EnhancedGrid",  "dojo/_base/lang", 
    "dojo/_base/array", "dojo/promise/all", "dojo/Deferred", 
    "controllers/widgets/functions.js", 
    "/common/widgets/notices.js", "/common/widgets/utilities.js","/common/widgets/sharedutils.js", "/common/widgets/utilitiesDate.js",
    "controllers/utilities/FrmsConstants.js", "controllers/utilities/FrmsRDMServiceUtils.js", "controllers/utilities/FrmsUtils.js",
    "dojo/domReady!"],
    function (
        dom, on, JsonRest, json, ObjectStore, Memory, Cache, on, query, NodeList, domClass,
        dijit, ComboBox, Button, DateTextBox, MultiSelect,
        EnhancedGrid, lang,  array, all, Deferred,
        Functions, Notices, LMUtils,SharedUtils, UtilsDate,
        FrmsConstants, FrmsRDMServiceUtils, FrmsUtils
        ) {
    
        //Global variable across the application
		FRMS = null;
    
        EMPTY_STORE = new ObjectStore({objectStore : new Memory({ data : []})});
		SORT_OBJECT = { sort: [{attribute:"targetDescription",descending: false}]};
		ERROR_STYLE_CLASS = {color: "red", fontWeight: "bold", fontStyle: "italic"},
        ERROR_BTN_STYLE_CLASS = {color: "red", fontWeight: "bold"},
            
        
        // ---------- DEPRICATED CODE - To be Removed after all code moved to new FRMS. global ----------------- ///
        this.app.FunctionHelper = new Functions();
        this.app.NoticeHelper = new Notices();
        var Function = this.app.FunctionHelper;
        Notice = this.app.NoticeHelper;
    
		//Global variables across the application
            fromCrtOrUpdFormToSearch = "FROM_CRTUPT_FORM_TO_SEARCH", NAVIGATION_LINK_PATH = "FROM_NAV_LINK", FORM_CREATE = "FORM_CREATE", 
			FORM_VIEW_OR_EDIT = "FORM_VIEW_OR_EDIT",
            pathFromprodToFormCrtorUpd = "FROM_PRODUCT_SCREEN", pathfromCmntToFormCrtOrUpd = "FROM_COMMENT_SCREEN",
            hasUserFormRWAccess = true, notApplicable = 'N/A', filedCd = "1043400001", nonFiledCd = "1043400002", hasUserPromoteAccess=false,
            hasUserRecordWriteAccess=false,    hasUserPkgWriteAccess=false, hasUserAdminstrationAccess=false,
            adminCd = "1043400003", correspondenceCd = "1043400004",
            errorStyleClass = {color: "red", fontWeight: "bold", fontStyle: "italic"},
            errorBtnStyleClass = {color: "red", fontWeight: "bold"},
			FROM_HISTSCRN_TO_FORMCRTORUPD = "FROM_HISTSCRN_TO_FORMCRTORUPD",
			FROM_SEARCH_ROW_TO_FORM_CRT_EDT = 'FROM_SEARCH_ROW_TO_FORM_CRT_EDT',
			FROM_TEMPLATE_TO_FORM_CRT_EDT = 'FROM_TEMPLATE_TO_FORM_CRT_EDT',
			TIMEOUT = 30000,
			REQUIRED_FIELDS_MISSING = "Required fields are missing.",
			SUCCESS_FORM_CMNT_SAVE = "Form comments are successfully saved.",
			EXCEPTION_IN_CMNT_SAVE = "Problem while saving  form comments.",
			NO_CMNTS_CRTD = "No Comments for the created form.",
			SUCCESS = 'success', FAILURE = 'failure', 
			SUCCESS_FORM_DTLS_CRT = "Form created successfully.", 
			EXCEPTION_IN_FORM_DTLS_CRT = "Problem in Form create.", 
			SUCCESSFUL_FORM_UPDT = "Form updated successfully.",
			EXCEPTION_IN_FORM_UPDT = "Problem in Form update.",
			NO_DETLS_FOR_CORM_CRT_OR_UPDT = "No details for form create or update. ",
			CONTACT_SYS_ADMIN = "Please contact the system administrator.",
			SUCCESS_IN_FETCHING_FORM_DTLS = "Successfully retrieved form details.",
			EXCEPTION_IN_FETCHING_FORM_DTLS = "Problem while fetching the form details.",
			MINIMUM_DATA_REQUIRED  = "The minimum data required to save this  form has not been entered.",
			REQUIRED_DATA_NOT_ENTERED = "Required data has not been entered.",
			ALERT_FOR_UNSAVED_CHANGES = "You have unsaved changes. <br>Do you wish to discard your unsaved changes?",
			FORM_SEARCH_SUCCESS_RESULTS = "Successful retrieval of forms for given search criteria.",
			SUCCESS_IN_DELETE_FORM_TEMPLATE = "Success in deleting the selected form template.",
			FAILURE_IN_DELETE_FORM_TEMPLATE = "Error in deleting the selected form template.",
			SUCCESS_UPLOAD_TEMPLATE = "Success in saving uploaded templates..",
			FAILURE_UPLOAD_TEMPLATE = "Error in saving uploaded templates.",
			OVERLAP_ALERT = "Multiple versions of the same Form would be in effect at the same time, please review.",
			OVERLAP_FORM_SAVE_SUCCESS = "Overlapped forms are created successfully.",
			OVERLAP_FORM_SAVE_FAILURE = "Error while saving Overlapped forms.",
			RECORD_SAVE_SUCCESS = "Record got successfully saved ",
			RECORD_SAVE_FAILURE = "Error while saving record.",
			RECORD_UPDATE_SUCCESS_SAVE_COMMENTS = "Comments are saved successfully.",
			RECORD_UPDATE_FAILURE_SAVE_COMMENTS = "Comments are saved successfully.",
			RECORD_SUCCESS_SAVE_COMMENTS = "with comments.",
			RECORD_FAILURE_SAVE_COMMENTS = "with out comments.",
			RECORD_MODIFY_SUCCES = "Successfully saved the modified record details.",
			RECORD_MODIFY_FAILURE = "Error in saving modified record details.",
			RECORD_FETCH_FAILURE = "Exception while fetching the record details.",
			RECORD_FETCH_SUCCESS = "Successfully retrieved the record details.",
			RECORD_SEARCH_SUCCESS = "Successfully retrieved the records based on the search criteria.",
			RECORD_SEARCH_FAILURE = "Error in retrieving the records based on the search criteria.",
			DUPLICATE_REC_FETCH_FAILURE = "Exception while fetching the duplicate record results.",
			RECORD_VIEW_MODIFY_TO_HISTORY = "RECORD_VIEW_MODIFY_TO_HISTORY",
			CREATE_RECORD_DISPLAY_MSG = "Create Record",
			VIEW_MODIFY_RECORD_DISPLAY_MSG = "View/Modify Record",
			CREATE_FORM_DISPLAY_MSG = "Create Forms Rule",
			VIEW_MODIFY_FORM_DISPLAY_MSG = "View/Modify Forms Rule",
			PREVIOUS_HISTORY_RETRIEVAL_FAILURE = "Problem while fetching form history details.",
			PREVIOUS_HISTORY_RETRIEVAL_SUCCESS  = "Retrieved previous history successfully",
			NO_PREVIOUS_HISTORY = "Request completed.No Previous history found",
			FORM_ASSOCIATION_TO_PACKAGE_ALERT = "The new form has been added to the selected package(s). <br>The form order can be modified in the Create/Modify Package screen.",
			FORM_ASSOCIATION_OUTSIDE_RANGE_ALERT = "Association Effective Date or Association Expiration Date entered falls outside of the range of the Package Effective Date or Package Expiration Date",
			FORM_TEMPLATE_DELETE_ALERT = "Are you sure you want to delete this form template?",
			//Common Button Labels
			DISMISS= "Dismiss",
			SAVE = "Save",
			DISCARD = "Discard",
			CANCEL = "Cancel",
			MODIFY_EXISTING = "Modify Existing",
			emptyStore = new ObjectStore({objectStore : new Memory({ data : []})}),
			sortObj = { sort: [{attribute:"targetDescription",descending: false}], }, userDetails  = null, SM_USER = null;
			

        //**********Global Methods********************//
        /**
         * This method disables or enables the label style
         */
        function setAllProductStores(prodResults) {
            console.debug('Setting all product details to the respective stores..');
            var labelValueObj = {}, label = {}, value = {},
                productLob = [], productTypes = [], prodSeriesNms = [], prodCSOMTTable = [], prodSubTypes = [],
                productNames = [], productMktNames = [], prodData,
                selectedPrdNms = [], selectedPrdMktNms = [], prodNmComp, prodMktNmComp,
                productLobHash = {}, prodTypeHash = {}, prodSeriesHash = {}, prodCSOMTableHash = {},
                prodsubTypeHash = {}, productNamesHash = {}, productMrktNmHash = {};

            array.forEach(prodResults, function (prodObj) {
                var prodlob, prodTypeName, prodSeriesName, prodCSOMTableName, prodsubTypeName,
                    prodNm, prodMarketingName;
                prodlob = prodObj.lineOfBusinessName;
                if (!productLobHash[prodlob]) {
                    labelValueObj.label = prodlob;
                    labelValueObj.value = prodlob;
                    productLob.push(labelValueObj);
                    productLobHash[prodlob] = prodObj;
                    labelValueObj = {};
                }
                prodTypeName = prodObj.typeName;
                if (!prodTypeHash[prodTypeName]) {
                    labelValueObj.label = prodTypeName;
                    labelValueObj.value = prodTypeName;
                    productTypes.push(labelValueObj);
                    prodTypeHash[prodTypeName] = prodObj;
                    labelValueObj = {};

                }
                prodSeriesName = prodObj.seriesName;
                if (!prodSeriesHash[prodSeriesName]) {
                    labelValueObj.label = prodSeriesName;
                    labelValueObj.value = prodSeriesName;
                    prodSeriesNms.push(labelValueObj);
                    prodSeriesHash[prodSeriesName] = prodObj;
                    labelValueObj = {};
                }
                prodCSOMTableName = prodObj.cSOMortalityTableName;
                if (!prodCSOMTableHash[prodCSOMTableName]) {
                    labelValueObj.label = prodCSOMTableName;
                    labelValueObj.value = prodCSOMTableName;
                    prodCSOMTTable.push(labelValueObj);
                    prodCSOMTableHash[prodCSOMTableName] = prodObj;
                    labelValueObj = {};

                }
                prodsubTypeName = prodObj.subTypeName;
                if (!prodsubTypeHash[prodsubTypeName]) {
                    labelValueObj.label = prodsubTypeName;
                    labelValueObj.value = prodsubTypeName;
                    prodSubTypes.push(labelValueObj);
                    prodsubTypeHash[prodsubTypeName] = prodObj;
                    labelValueObj = {};
                }

                prodNm = prodObj.name;
                if (!productNamesHash[prodNm]) {
                    labelValueObj.label = prodNm;
                    labelValueObj.value = prodNm;
                    productNames.push(labelValueObj);
                    productNamesHash[prodNm] = prodObj;
                    labelValueObj = {};
                }

                prodMarketingName = prodObj.marketingName;
                if (!productMrktNmHash[prodMarketingName]) {
                    labelValueObj.label = prodMarketingName;
                    labelValueObj.value = prodMarketingName;
                    productMktNames.push(labelValueObj);
                    productMrktNmHash[prodMarketingName] = prodObj;
                    labelValueObj = {};
                }
            });
            
            productLOBMemStore.setData(productLob);
            defferedProdLOBStore.resolve(productLOBMemStore);
            
            productTypesMemStore.setData(productTypes);
            defferedProdTypeStore.resolve(productTypesMemStore);
            
            productSeriesMemStore.setData(prodSeriesNms);
            defferedProdSeriesStore.resolve(productSeriesMemStore);
            
            productCSOMTMemStore.setData(prodCSOMTTable);
            defferedProdCSOMTStore.resolve(productCSOMTMemStore);
            
            productSubTypeMemStore.setData(prodSubTypes);
            defferedProdSubTypeStore.resolve(productSubTypeMemStore);
            
            productNamesMemStore.setData(productNames);
            defferedProdNamesStore.resolve(productNamesMemStore);
            
            productMktNamesMemStore.setData(productMktNames);
            defferedProdMktNamesStore.resolve(productMktNamesMemStore);
            
            console.debug('Completion of setting all product details to the respective stores..');
            // --- END of Depricated Code --- //
        }
        return {
            init: function () {
                var self = this;
                                
                
            	console.info("Initializing FRMS Application...");
            	FRMS = this.app;
                
                FRMS.FrmsConstants = new FrmsConstants();
                FRMS.FrmsUtils = new FrmsUtils();
                //FRMS.FrmsRDMServiceUtils = new FrmsRDMServiceUtils();
                
                FRMS.Notices = new Notices();
                FRMS.Utils = new LMUtils();
                FRMS.UtilsDate = new UtilsDate();
                FRMS.SharedUtils =SharedUtils;
                //FRMS.Notices.loading();
                FRMS.Notices.placeAt(dom.byId("notice_holder"));
                
                // Tab setup
                query(".l_head_tab a").on("click", function(e){
                    e.preventDefault();
                    query(".l_head_tab a").removeClass('active');
                    domClass.add(this,'active');
                    //this.app.emit("app-transition", {"viewId": e.target.rel});
//                    var transOpts = {
//                            target : e.target.rel,
//                            params : null
//                        };
//                    self.app.transitionToView(e.target, transOpts);		
                });
                
                // forms tab click
                on(dom.byId("show_forms"), "click", function (e) {
                    self.transitionTo(e, "formsNav", null);	
                    self.transitionTo(e, "formsSearch", null);
                });
                
                // records tab click
                on(dom.byId("show_records"), "click", function (e) {
                    self.transitionTo(e, "recordsNav", null);	
                    self.transitionTo(e, "recordsSearch", null);	
                }); 
                
                // package tab click
                on(dom.byId("show_packages"), "click", function (e) {
                    self.transitionTo(e, "packagesNav", null);	
                    self.transitionTo(e, "packagesSearch", null);		
                }); 
                
                // Promotions tab click
                on(dom.byId("show_promotions"), "click", function (e) {
                    self.transitionTo(e, "promotionNav", null);	
                    self.transitionTo(e, "promotionInProgress", null);	
                }); 
                
                
                // ----- DEPRICATED CODE - to be removed after all code moved to FRMS. Global ------///
            
                
                // var'ing out these variables makes them local to just main.js and not accesible to other views
                var localApp = this.app, jsonClassiftnRestDetails, jsonSubclassftnRestDetails, jsonRestProdStore,
                    timingReqJsonStore, productResults = [], timingCdJsonStore, distChanJsonStore,
                    docContentTypeJsonStore, secLvlCdJsonStore,
                    memPackages, memDocuments;
                
                
				//Initializing  all deferred product memory stores which are global.
//                defferedProdLOBStore = new Deferred();
//                defferedProdTypeStore = new Deferred();
//                defferedProdSeriesStore = new Deferred();
//                defferedProdCSOMTStore = new Deferred();
//                defferedProdSubTypeStore = new Deferred();
//                defferedProdNamesStore = new Deferred();
//                defferedProdMktNamesStore = new Deferred();
//                deferredUserAccessDtls = new Deferred();
//                
//                
//				//Setting application level 	
//                Notice.placeAt(dom.byId("notice_holder"));
//					
                //package stores
                memPackages = localApp.loadedStores.packagesMemory;
                cachePackagesStore = new Cache(localApp.loadedStores.packagesRest, memPackages);
                // this changes "target": "api/v1/packages/" to proxy/api/v1/packages/ if localhost, or test/api/v1/packages/ if ?localjson=true is set
                Function._setJsonRestEndpoint(cachePackagesStore);
//                
//                memUsers = localApp.loadedStores.userMemory;
//                cacheUsersStore = new Cache(localApp.loadedStores.jsonUserDetails, memUsers);
//                Function._setJsonRestEndpoint(cacheUsersStore);
//                
//            
//            	memRecords = localApp.loadedStores.recordsMemory,
//            	cacheRecordsStore = new Cache(localApp.loadedStores.jsonRestRecords, memRecords);
//            	Function._setJsonRestEndpoint(cacheRecordsStore);
//
//                memDocuments = localApp.loadedStores.documentsMemory;
//                cacheDocumentsStore = new Cache(localApp.loadedStores.documentsRest, memPackages);
//                Function._setJsonRestEndpoint(cacheDocumentsStore);
//
//                //Current user memory (logged in user) store
//                currentUserMemStore = localApp.loadedStores.currentUserMemory;
                //Classification elements store.
//                clasftnMemStore = localApp.loadedStores.classiftnMemory;
//                jsonClassiftnRestDetails = localApp.loadedStores.jsonClassiftnRestDetails;
//                Function._setJsonRestEndpointTable(jsonClassiftnRestDetails);
//                clasftnMemStore.attachedJsonRest = jsonClassiftnRestDetails;

                // Getting subclassification elements
//                subClassMemStore = localApp.loadedStores.subclassftnMemory;
//                jsonSubclassftnRestDetails = localApp.loadedStores.jsonSubclassftnRestDetails;
//                Function._setJsonRestEndpointTable(jsonSubclassftnRestDetails);
//                subClassMemStore.attachedJsonRest = jsonSubclassftnRestDetails;

                // Getting state elements
//                stateMemStore = localApp.loadedStores.stateMemory;
//                jsonStateStore = localApp.loadedStores.jsonStateRestDetails;
//                Function._setJsonRestEndpointTable(jsonStateStore);
//                stateMemStore.attachedJsonRest = jsonStateStore;
//                defStateMemStore =Function._getJsonRefDataMemoryStore({ memoryStore:stateMemStore});

                // Getting statetype elements
//                stateTypeMemStore = localApp.loadedStores.stateTypeMemory;
//                jsonStateTypeStore = localApp.loadedStores.jsonStateTypeRestDetails;
//                Function._setJsonRestEndpointTable(jsonStateTypeStore);
//                stateTypeMemStore.attachedJsonRest = jsonStateTypeStore;
//                defStateTypeMemStore =Function._getJsonRefDataMemoryStore({ memoryStore:stateTypeMemStore});

                // Getting the Document Form Type elements.
//                docFormTpMemStore = localApp.loadedStores.docFormTypeMemory;
//                jsonDocFrmTpStore = localApp.loadedStores.jsonDocFormTypeRestDetails;
//                docFormTpMemStore.attachedJsonRest = jsonDocFrmTpStore;

                // Getting Business Function elements.
//                businessFunMemStore = localApp.loadedStores.busiFunMemory;
//                
//                // Getting statetype elements
//                stateTypeMemStore = localApp.loadedStores.stateTypeMemory;
//                jsonStateTypeStore = localApp.loadedStores.jsonStateTypeRestDetails;
//                Function._setJsonRestEndpointTable(jsonStateTypeStore);
//                
//                // Getting classification elements
//                clasftnMemStore = localApp.loadedStores.classiftnMemory;
//                jsonClasftnStore = localApp.loadedStores.jsonClassiftnRestDetails;
//                Function._setJsonRestEndpointTable(jsonClasftnStore);
//                
//                // Getting subclassification elements
//                subClassMemStore = localApp.loadedStores.subclassftnMemory;
//                jsonSubClassStore = localApp.loadedStores.jsonSubclassftnRestDetails;
//                Function._setJsonRestEndpointTable(jsonSubClassStore);
//                
//                // -- Form Search elements present in the widget -- //
//                
//                // For getting form search details.
//                formSearchMemStore = localApp.loadedStores.formsSearchMemory;
//                jsonRestFormSearchStore = localApp.loadedStores.jsonRestFormList;
//                
//                // Getting the Document Form Type elements.
//                docFormTpMemStore = localApp.loadedStores.docFormTypeMemory;
//                jsonDocFrmTpStore = localApp.loadedStores.jsonDocFormTypeRestDetails;
//                Function._setJsonRestEndpointTable(jsonDocFrmTpStore);
//                docFormTpMemStore.attachedJsonRest = jsonDocFrmTpStore;
//                defDocFormTpMemStore = Function._getJsonRefDataMemoryStore({ memoryStore:docFormTpMemStore});
                
                // Getting Business Function elements.
//                businessFunMemStore = localApp.loadedStores.busiFunMemory;
//                jsonBusFunStore =  localApp.loadedStores.jsonbusiFunRestDetails;
//                Function._setJsonRestEndpointTable(jsonBusFunStore);
                
                // Getting state elements
//                stateMemStore = localApp.loadedStores.stateMemory;
//                jsonStateStore = localApp.loadedStores.jsonStateRestDetails;
//                Function._setJsonRestEndpointTable(jsonStateStore);
                
                // -- End Form Search -- //
                
                // For getting product details
//                prodMemoryStore = localApp.loadedStores.prodMemory;
//                jsonRestProdStore = localApp.loadedStores.jsonProdRestDetails;
//                // sets the proper endpoints
//                Function._setJsonRestEndpointTable(jsonRestProdStore);
//				
//                jsonRestProdStore.query({}, {}).then(function (resResults) {
//                    productResults = resResults;
//                    console.debug('Successful retrieval of productResults..', productResults);
//                    prodMemoryStore.setData(productResults);
//                    setAllProductStores(productResults);
//					
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the products data..');
//                    }
//                });
				/*setTimeout(function () {
						console.debug('waiting to get all product data.');
					}, 10000);*/
                //Waiting to get complete product memory results..

                /* all({productResults:productResults}).then(function(productResults) {
                    console.debug('Successful retrieval of product elements.');
                    prodMemoryStore.setData(productResults);
                    setAllProductStores(productResults);
                }); */

                // For product names
//                productLOBMemStore = localApp.loadedStores.productLOBMemStore;
//                // For product names
//                productTypesMemStore = localApp.loadedStores.productTypeMemStore;
//                // For product series
//                productSeriesMemStore = localApp.loadedStores.productSeriesMemStore;
//                // For product CSO Mortality table
//                productCSOMTMemStore = localApp.loadedStores.productCSOMTMemStore;
//                // For product syb types
//                productSubTypeMemStore = localApp.loadedStores.productSubTypeMemStore;
//                // For product names
//                productNamesMemStore = localApp.loadedStores.productNamesMemStore;
//                // For product marketing names
//                productMktNamesMemStore = localApp.loadedStores.productMktNamesMemStore;


                // Getting subclassification elements
//                timingReqMemStore = localApp.loadedStores.timingReqMemory;
//                timingReqJsonStore =  localApp.loadedStores.jsontimingReqRestDetails;
//                Function._setJsonRestEndpointTable(timingReqJsonStore);
//                timingReqMemStore.attachedJsonRest = timingReqJsonStore;
//                timingReqJsonStore.query({}, {}).then(function (timingReqResultsObj) {
//                    var timingReqResults = timingReqResultsObj.referenceData;
//                    console.debug('Successful retrieval of timingReqResults elements..', timingReqResults);
//                    timingReqMemStore.setData(timingReqResults);
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the timing requirement data..');
//                    }
//                });

                // Getting timing code elements
//                timingCdMemStore = localApp.loadedStores.timingCdMemory;
//                timingCdJsonStore =  localApp.loadedStores.jsontimingCdRestDetails;
//                Function._setJsonRestEndpointTable(timingCdJsonStore);
//                timingCdMemStore.attachedJsonRest = timingCdJsonStore;
//
//                timingCdJsonStore.query({}, {}).then(function (timingCdResultsObj) {
//                    var timingCdResults = timingCdResultsObj.referenceData;
//                    console.debug('Successful retrieval of timingCdResults elements..', timingCdResults);
//                    timingCdMemStore.setData(timingCdResults);
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving  timing codes data..');
//                    }
//                });
//
//                // Getting distribution channel elements
//                distChanMemStore = localApp.loadedStores.distChanMemory;
//                distChanJsonStore =  localApp.loadedStores.jsonDistChanRestDetails;
//                Function._setJsonRestEndpointTable(distChanJsonStore);
//
//                distChanJsonStore.query({}, {}).then(function (distChanResultsObj) {
//                    var distChanResults = distChanResultsObj.referenceData;
//                    console.debug('Successful retrieval of distChanResults elements..', distChanResults);
//                    //console.log('distChanResults elements are--'+distChanResults);
//                    distChanMemStore.setData(distChanResults);
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the distChanResults data..');
//                    }
//                });
//
//                // Getting doc form content type elements
//                docContentTypeMemStore = localApp.loadedStores.contentTypeMemory;
//                docContentTypeJsonStore =  localApp.loadedStores.jsonDocContentTypeRestDetails;
//                Function._setJsonRestEndpointTable(docContentTypeJsonStore);
//                docContentTypeMemStore.usingJsonRest = docContentTypeJsonStore;
//                docContentTypeJsonStore.query({}, {}).then(function (contentTypeResultsObj) {
//                    var contentTypeResults = contentTypeResultsObj.referenceData;
//                    console.debug('Successful retrieval of docContentType elements..', contentTypeResults);
//                    //console.log('contentTypeResults elements are--'+contentTypeResults);
//                    docContentTypeMemStore.setData(contentTypeResults);
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the doc ContentType data..');
//                    }
//                });
//
//                // Getting doc form content type elements
//                nppiPciDesnMemStore = localApp.loadedStores.nppiPciDesnMemStore;
//                secLvlCdMemStore = localApp.loadedStores.secLvlCdMemory;
//                secLvlCdJsonStore =  localApp.loadedStores.jsonsecLvlCdRestDetails;
//                Function._setJsonRestEndpointTable(secLvlCdJsonStore);
//                secLvlCdJsonStore.query({}, {}).then(function (seclvlResultsObj) {
//                    var secLvlResults = seclvlResultsObj.referenceData;
//                    console.debug('Successful retrieval of security level codes..', secLvlResults);
//                    secLvlCdMemStore.setData(secLvlResults);
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the security level codes..');
//                    }
//                });
//				
//				docTemplateTypeMemoryStore = localApp.loadedStores.docTemplateTypeMemory;
//                
//                
//
//				queryExceptionDateStore = localApp.loadedStores.queryExceptionDateStore;
//                queryExDtRestSvcsEndPoint = localApp.loadedStores.queryExDtRestSvcsEndPoint;
//                Function._setJsonRestEndpointTable(queryExDtRestSvcsEndPoint);
//                queryExceptionDateStore.attachedJsonRest = queryExDtRestSvcsEndPoint;
//                Function._getJsonRefDataMemoryStore({ memoryStore:queryExceptionDateStore});
//
////                queryExDtRestSvcsEndPoint.query({}, {}).then(
////                    function (queryExDtResultsObj) {
////                        var queryExcDts =  queryExDtResultsObj.referenceData;
////                        console.debug('Successful retrieval of Query Exception Dates..', queryExcDts);
////                        queryExceptionDateStore.setData(queryExcDts);
////                    },
////                    function (error) {
////                        console.error('Error in retreving Query Exception Dates..');
////                    }
////                );
//
//                
//                
//               //Get the logged in UserDetails
//				console.info("Trying to get logged in user details...");
//                currentUserMemStore = localApp.loadedStores.currentUserMemory;
//                currentUserJsonRestObj = localApp.loadedStores.jsonUserDetails;
//                Function._setJsonRestEndpointTable(currentUserJsonRestObj);
//                
//                currentUserJsonRestObj.query('currentuser', {}).then(function (userResponse) {
//                	userDetails = userResponse.user;
//                    if(userDetails != null) {
//                    	console.debug('Successful in getting current user details..', userDetails);
//                        currentUserMemStore.setData(userDetails);
//                        hasUserRecordWriteAccess=currentUserMemStore.data.recordsWriteIndicator === "1";
//                        hasUserPkgWriteAccess=currentUserMemStore.data.packagesWriteIndicator === "1";                        
//                        hasUserPromoteAccess = currentUserMemStore.data.frmsPromoteIndicator === "1";
//                        hasUserAdminstrationAccess=currentUserMemStore.data.userAdministratorIndicator === "1";
//                        deferredUserAccessDtls.resolve(currentUserMemStore);
//                    }                    
//                }, function (error) {
//                    if (error.status === 500 || error.status === 404) {
//                        console.error('Error in retreving the user details data..');
//                        
//                        /*var transOpts, params = 'The loggedin user does not have FRMS Access';
//                        var transOpts = {
//                            target : "errorPage",
//                            data: params
//                        };
//                        localApp.transitionToView(null, transOpts);*/
//                    }
//                });
                
                // --- End Depricated Code ---/
 
            },
            
            transitionTo: function(e, targetView, params) {
                var transOpts = {
                        target : targetView,
                        params : params
                    };
                this.app.transitionToView(e.target, transOpts);		
            },
        };

    });