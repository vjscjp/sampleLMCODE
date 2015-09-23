//Predefined tokens
/*global define, console, dijit, dojox, dojo, confirm, FileReader, setTimeout, alert : true*/
/*global cachePackagesStore, emptyStore : true*/
/*global FROM_TEMPLATE_TO_FORM_CRT_EDT, REQUIRED_FIELDS_MISSING : true*/
/*global hasUserFormRWAccess, queryExceptionDateStore, sortObj, errorStyleClass : true*/

define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "controllers/widgets/functions.js", "dojox/grid/_CheckBoxSelector",
    "dojo/store/Memory", "dojo/data/ObjectStore", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style",
    "dojo/date", "models/forms/formAssociationToPkgModel.js", "dojo/promise/all",
    "dijit/form/Button"],
    function (dom, on, lang, registry, array, EnhancedGrid, Functions, CheckBoxSelector, Memory, ObjectStore,
        domClass, domAttr, domStyle, dojoDate, formAssociationToPkgModel, all, Button) {
        "use strict";
        //Global variables pertain to this file.
        var optionType, formNum = {}, revDate = {}, formDesc = {}, localApp,
            Function = new Functions(), /* displayErrorDiv, displayInfoDiv, */ formAsstnToPackageGrid,
            formId, orgnlDocId, formLifeEffDt, formLifeExpDt, packAsstnEffDtComp, packAsstnExpDtComp, packQueryExcDtComp,
            packageNmComp, formAsstnToPkgGridRows = [], count = 0, formAsstnToPackLayout,
            pkgVersionMemStore = new Memory(), packageVersionList = [], idAndOrgnlMapArray = [], formAsstnToPkgGridStore, 
			versionsToBeSaved = [], self;

        /**
        *   This method clears the error/informational/wargning msgs.
        */
        function clearDisplayMsgDivs() {

            //displayErrorDiv.innerText = "";
            //displayInfoDiv.innerText = "";
            //domClass.remove(displayErrorDiv, 'error');
            //domClass.remove(displayInfoDiv, 'info');

        }
        /**
         * This method disables or enables the label style
         */
        function disableOrEnableErrMsgForSelect(selectedVal, label) {
            if (selectedVal) {
                domAttr.remove(dojo.query(label)[0], "style");
            } else {
                domStyle.set(dojo.query(label)[0], errorStyleClass);
            }
        }
        return {

            init: function () {
                var packageNmMemStore = this.app.loadedStores.packageNmMemory, packageNmtempTarget, queryExtempTarget,
                    queryExDtRestSvcsEndPoint, viewFormatter, packagesStore;
				self = this;
                localApp = this.app; 
                 
                function isoDateFormatter(value) {
                    if (value) {
                        return Function.formatDateHourMin(value);
                    }
                }
                formAsstnToPackLayout = [
                    {
                        name : "Package Name",
                        field : "selectedPackageNm",
                        width : "15%"
                    }, {
                        name : "Eff. Date",
                        field : "asstnEffDt",
                        formatter : isoDateFormatter,
                        width : "15%"

                    }, {
                        name : "Exp. Date",
                        field : "asstnExpDt",
                        formatter : isoDateFormatter,
                        width : "20%"
                    },
                    {
                        name : "Query Exc. Date",
                        field : "selectedQueryExcDtNm",
                        width : "20%"
                    } 
                ];
 
                cachePackagesStore.query("").then(function (packageNmResultsObj) {
                    var packSortObj, packageNms, pkgObject, pkgNamesArray = [], labelValueObj = {};
                    packageNms = packageNmResultsObj.packages; 
                    packagesStore = new Memory({data : packageNms, idProperty : "code"});
                     for (var j = 0; j < packageNms.length; j++) {
                         pkgObject = packageNms[j]; 
                         labelValueObj.label = pkgObject.packageName;
                         labelValueObj.value = pkgObject.code;                 
                         pkgNamesArray.push(labelValueObj);
                         labelValueObj = {};
                   }  
                    packageNmMemStore.setData(pkgNamesArray); 
                    packageNmComp.setStore(packageNmMemStore); 
                },
					function (error) {
                        console.error('Error in retreving the package names..');
                    }
                );
                
                formAsstnToPackageGrid = dijit.byId("associatedPackagesGrid_formAsstnToPackage");
                formAsstnToPackageGrid.set("structure", formAsstnToPackLayout);
                formAsstnToPackageGrid.set("autoHeight", true);
                formAsstnToPackageGrid.set("selectionMode", "single");
                formAsstnToPackageGrid.startup();

                packAsstnEffDtComp = dijit.byId("packAsstnEffDt_formAsstnToPackage");
                packAsstnExpDtComp = dijit.byId("packAsstnExpDt_formAsstnToPackage");
                packageNmComp = dijit.byId("packageNames_formAsstnToPackage");
                packageNmComp.set("labelAttr", "label");               
                
                packQueryExcDtComp = dijit.byId("packQueryExcDt_formAsstnToPackage");
                packQueryExcDtComp.set("placeHolder", "Loading..");
                 
                queryExceptionDateStore = localApp.loadedStores.queryExceptionDateStore;
                queryExDtRestSvcsEndPoint = localApp.loadedStores.queryExDtRestSvcsEndPoint;
                queryExtempTarget = queryExDtRestSvcsEndPoint.target;
                Function._getJsonRestEndpoint(queryExDtRestSvcsEndPoint)
                    .query({}, {}).then(
                        function (queryExDtResultsObj) {
                            var queryExcDts =  queryExDtResultsObj.referenceData;
                            queryExceptionDateStore.setData(queryExcDts);
                            packQueryExcDtComp.set("searchAttr", "targetDescription");
                            packQueryExcDtComp.set("placeHolder", "--Select--");
                            packQueryExcDtComp.set("fetchProperties", sortObj);
                            packQueryExcDtComp.store = queryExceptionDateStore;
                        },
                        function (error) {
                            console.error('Error in retreving Query Exception Dates..');
                        }
                    );
                queryExDtRestSvcsEndPoint.target = queryExtempTarget;

                //displayErrorDiv = dom.byId("displayErrorMsg_formAsstnToPackage");
                //displayInfoDiv = dom.byId("displayInfoMsg_formAsstnToPackage");

                //Done file button event
                on(dijit.byId("doneBtn_formAsstnToPackage"), "click",  lang.hitch(this, function (e) {
                var data = {}, msgObj = {}, transOpts, jsonString, jsonObj,  packagesJsonRest = localApp.loadedStores.packagesRest;   
                     if(versionsToBeSaved.length > 0) {
                        packagesJsonRest.target = "/frmsadminservice/api/v1/packages/associate";                        
                        Function._setJsonRestEndpoint(packagesJsonRest);
                        
                        jsonString = JSON.stringify(versionsToBeSaved);
                        jsonObj = JSON.parse(jsonString);
                    
                        packagesJsonRest.put(jsonObj).then(function (saveResResultsObj) {  
                              //alert('The new form has been added to the selected package(s). The form order can be modified in the Create/Modify Package screen.');
	                          var confDialog = Notice.showDialog({text:FORM_ASSOCIATION_TO_PACKAGE_ALERT, 
	    							type: "info", cancelBtnText: DISMISS, style: "width:auto; height:auto"});
    						  confDialog.on("execute", function (dialogEvent) { 
    							 //self.transitionTo(dialogEvent, "formsCreate", null);
    							  versionsToBeSaved = [];                             
	                              data.formNum = formNum;
	                              data.revDate = revDate;
	                              data.formDesc = formDesc;
	                              formAsstnToPkgGridRows = [];
	                              formAsstnToPackageGrid.setStore(formAsstnToPkgGridStore); 
	                              formAsstnToPackageGrid.update();  
	                              transOpts = {
	                                    target : "formsCreate",
	                                    data : data
	                              };
	                              localApp.transitionToView(e.target, transOpts);
    						  });
                        },
                        function (error) { 
                            msgObj.status = 'FAILURE';
                            switch (error.response.status) {
                            case 400:
								var detailMsg = JSON.parse(error.responseText).statusDetailMsg;
                                msgObj.detailMsg = detailMsg;
                                //alert(msgObj.detailMsg);
								Notice.showError(detailMsg);
                                break;
                            case 500:
								var detailMsg = 'Error in  associating the selected forms to the package:';
                                msgObj.detailMsg = detailMsg;
                                //alert('Error in  associating the selected forms to the package..');
								Notice.showError(detailMsg);
                                break;
                            default:
								var detailMsg = 'Error in  associating the selected forms to the package:';
                                //msgObj.detailMsg = 'Error in  associating the selected forms to the package:';
								msgObj.detailMsg = detailMsg;
								Notice.showError(detailMsg);
                                //alert('Error in  associating the selected forms to the package..');
                                break;
                            }
                            //console.error('Error in  associating the selected forms to packages....', error);
                            //console.log("msgObj", msgObj);                            
                        });  
                     } 
                }));
                 
                //Cancel file button event
                on(dijit.byId("cancelBtn_formAsstnToPackage"), "click",  lang.hitch(this, function (e) {
                    var data = {}, transOpts;
                    data.formNum = formNum;
                    data.revDate = revDate;
                    data.formDesc = formDesc;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);
                }));

                //Add package association button event
                on(dijit.byId("addBtn_formAsstnToPackage"), "click",  lang.hitch(this, function (e) {
                    var selectedPackageCd = [], selectedPackageNm = [], pkgVersnsRestSvcsEndPoint,
                        asstnEffDt, asstnExpDt, queryExcDt, formAsstnToPkgGridRow = {}, 
                        selectedQueryExcDtNm, areMandatoryFldsNtPrsnt = false, jsonString,
                        formDetailsArray = [], formDetails = {}, docId = {}, origDocId = {}, dateTypeCd = {}, loadedVersions, currentVersion = {};
                    clearDisplayMsgDivs();
					//Notice.loading();
                    //Screen validation.
                    packageNmComp.focus();
                    packageNmComp.set("required", true);
                    if (!packageNmComp.validate()) { 
                        packageNmComp.set("missingMesssage", "Select Package.");
                        domStyle.set(dojo.query("label[for=packageNames_formAsstnToPackage]")[0],
                            errorStyleClass);
                        areMandatoryFldsNtPrsnt = true;
                    } else {                        
                        domAttr.remove(dojo.query("label[for=packageNames_formAsstnToPackage]")[0], "style");
                        selectedPackageCd = packageNmComp.get('value');
                        selectedPackageNm = packageNmComp.attr('displayedValue'); 
                    }
                    packAsstnEffDtComp.focus();
                    packAsstnEffDtComp.set("required", true);
                    if (!packAsstnEffDtComp.validate()) {
                        packAsstnEffDtComp.set("missingMesssage", "Enter the Association Exp Date.");
                        domStyle.set(dojo.query("label[for=packAsstnEffDt_formAsstnToPackage]")[0],
                            errorStyleClass);
                        areMandatoryFldsNtPrsnt = true;
                    }  else {
                        domAttr.remove(dojo.query("label[for=packAsstnEffDt_formAsstnToPackage]")[0], "style");
                        asstnEffDt = packAsstnEffDtComp.get('value'); 
                    } 
					if(areMandatoryFldsNtPrsnt){
						var confDialog = Notice.showDialog({text:REQUIRED_DATA_NOT_ENTERED, 
							type: "error", cancelBtnText: "Discard", style: "width:auto; height:auto"});
							confDialog.on("execute", function (dialogEvent) { 
								self.transitionTo(e, "formAssociationToPackage");
						});
						
					}
                    //End of Screen validation.

                    asstnExpDt = packAsstnExpDtComp.get('value');
                    queryExcDt = packQueryExcDtComp.get('value');
                    selectedQueryExcDtNm = packQueryExcDtComp.attr('displayedValue');
                    
                    if(asstnEffDt !== undefined && asstnEffDt !== null && selectedPackageCd.length > 0) {
                        var isValid = false, packageLifeEffDt, packageLifeExpDt, selectedPkgObj ;
                        for(var j=0; j<selectedPackageCd.length; j++) {
                            var code = selectedPackageCd[j], name;
                            for (var i=0; i<packageNmMemStore.data.length; i++) {
                                var data = packageNmMemStore.data[i];
                                if(data.value === code) {
                                    name = data.label;                                         
                                    selectedPkgObj = packagesStore.query({code: code})[0];
                                    if (selectedPkgObj) {
                                        packageLifeEffDt = Function._returnDateObj(selectedPkgObj.effectiveDate);
                                        packageLifeExpDt = new Date(selectedPkgObj.expirationDate); 
                                        if(Function.isBigerDate(Function._returnDateObj(asstnEffDt), packageLifeEffDt)) {
                                             isValid = true;
                                        } 
                                    }
                                     break;                                   
                                }
                            }
                            if(isValid) {
                                formAsstnToPkgGridRow.selectedPackageNm = name;  
                                formAsstnToPkgGridRow.asstnEffDt = asstnEffDt;
                                formAsstnToPkgGridRow.asstnExpDt = asstnExpDt;
                                formAsstnToPkgGridRow.selectedQueryExcDtNm = selectedQueryExcDtNm;    
                                formAsstnToPkgGridRow.count = count + 1;
                                formAsstnToPkgGridRows.push(formAsstnToPkgGridRow); 
                                formAsstnToPkgGridRow = {};
                            } else {
                                //alert("Association Effective Date or Association Expiration Date entered falls outside of the range of the Package Effective Date or Package Expiration Date");
                            	var confDialog = Notice.showDialog({text:FORM_ASSOCIATION_OUTSIDE_RANGE_ALERT, 
	    							type: "info", cancelBtnText: DISMISS, style: "width:auto; height:auto"});
		                            confDialog.on("execute", function (dialogEvent) { 
										self.transitionTo(e, "formAssociationToPackage");
		    						});
                             }                            
                        }                
                        if(isValid) {
                            jsonString = JSON.stringify(formAsstnToPkgGridRows);
                            formAsstnToPackageGrid.setStore(formAsstnToPkgGridStore); 
                            formAsstnToPackageGrid.update();   

                             if (idAndOrgnlMapArray.length) {
                                array.forEach(idAndOrgnlMapArray, function (map) {
                                    formDetails = {};
                                    formDetails.docId = map.id;
                                    formDetails.origDocId = map.orgnlDocId;
                                    formDetails.dateTypeCd = queryExcDt;
                                    formDetailsArray.push(formDetails);

                                });

                                //Generate Req Param 
                                currentVersion.effectiveDate = asstnEffDt;
                                currentVersion.expirationDate = asstnExpDt;
                                currentVersion.pkgDocuments = formDetailsArray;
                                currentVersion.pkgCodes = selectedPackageCd;    
                                versionsToBeSaved.push(currentVersion);  
                            }
                            //Clear all selection values 
                            packageNmComp.set("focused", false);                        
                            packageNmComp.set("required", false);
                            packageNmComp.set('value', '');
                            packAsstnEffDtComp.set('required', false);
                            packAsstnEffDtComp.set('focused', false);
                            packAsstnEffDtComp.set('value', null);
                            packAsstnExpDtComp.set('value', null);
                            packAsstnExpDtComp.set('required', false);
                            packQueryExcDtComp.set('value', '');
                            packQueryExcDtComp.set('required', false); 
							//Notice.doneLoading();
                       }
                    }
                }));
 
                //On change for package name select
                on(packageNmComp, "change",  lang.hitch(this, function (selectedPkgVal) {                   
                    var selectedPkgObj, packageLifeEffDt, packageLifeExpDt; 
                    if (selectedPkgVal) {
                        /* selectedPkgObj = packagesStore.query({code: selectedPkgVal})[0];
                        if (selectedPkgObj) {
                            packageLifeEffDt = new Date(selectedPkgObj.effectiveDate);
                            packageLifeExpDt = new Date(selectedPkgObj.expirationDate);                           
                            if (formLifeEffDt.getTime() < packageLifeEffDt.getTime()) { 
                                packAsstnEffDtComp.constraints.min = packageLifeEffDt;
                                packAsstnExpDtComp.constraints.min = dojoDate.add(packageLifeEffDt, "day", 1);
                            }
                        } */
						disableOrEnableErrMsgForSelect(selectedPkgVal, "label[for=packageNames_formAsstnToPackage]");
                    }

                }));
				on(packAsstnEffDtComp, "change",  lang.hitch(this, function (selectedAssoEffDt) {                   
                    var selectedPkgObj, packageLifeEffDt, packageLifeExpDt; 
                    if (selectedAssoEffDt) {
                        disableOrEnableErrMsgForSelect(selectedAssoEffDt, "label[for=packAsstnEffDt_formAsstnToPackage]");
                    }

                }));
                
            },
            beforeActivate: function (previousView, data) { 
                var formNumTxtComp, revDateTxtComp, formDescTxtComp,
                    defferedObj = null; 
                
                clearDisplayMsgDivs();

                if (data) {

                    formAsstnToPkgGridRows = [];
                    count = 0;
                    formAsstnToPackageGrid.set("structure", formAsstnToPackLayout);
                    formAsstnToPackageGrid.setStore(emptyStore);

                    formId = data.formId;
                    idAndOrgnlMapArray = data.idAndOrgnlMapArray;
                    formLifeEffDt = new Date(data.formLifeEffDt);
                    formLifeExpDt = new Date(data.formLifeExpDt);

                   /*if (formLifeEffDt) {
                        packAsstnEffDtComp.constraints.min = formLifeEffDt;
                        packAsstnExpDtComp.constraints.min = dojoDate.add(formLifeEffDt, "day", 1);
                    }*/

                    formNum = data.formNum;
                    formNumTxtComp = dijit.byId("formNum_formAsstnToPackage");
                    formNumTxtComp.set('value', formNum);
                    formNumTxtComp.set('disabled', true);

                    revDate = data.revDate;
                    revDateTxtComp = dijit.byId("revDate_formAsstnToPackage");
                    revDateTxtComp.set('value', revDate);
                    revDateTxtComp.set('disabled', true);

                    formDesc = data.formDesc;
                    formDescTxtComp = dijit.byId("formDesc_formAsstnToPackage");
                    formDescTxtComp.set('value', formDesc);
                    formDescTxtComp.set('disabled', true);

                    packQueryExcDtComp.set("placeHolder", "--Select--");
                    packageNmComp.set("labelAttr", "label");      
                    
                    //Prepare a store which contains package name, effective date, end date
                    formAsstnToPkgGridStore = new ObjectStore({
                        objectStore : new Memory({
                            data : formAsstnToPkgGridRows,
                            idProperty : 'count'
                        })
                    });

                }  
            },
            afterActivate: function (previousView, data) {
                
            },
			transitionTo: function(event, viewName){
				var transOpts = {
					target : viewName,
					params : null
				};
				localApp.transitionToView(event.target, transOpts);
			}
        };
    });