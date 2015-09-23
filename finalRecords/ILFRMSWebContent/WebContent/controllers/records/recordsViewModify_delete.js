/*global define:true,dijit:true,dojo:true,alert:true,console:true*/
define([
    "dojo/dom", "dojo/on", "dojo/_base/lang", "dojo/dom-form", "dojo/json", "dojo/store/Cache",
    "dojo/_base/array", "dojo/store/Memory", "dijit/registry", "dijit/ConfirmDialog", 
	"controllers/widgets/functions.js", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style" 
	], function (dom, on, lang, domForm, json, Cache, array, Memory, registry, ConfirmDialog, Functions,
		domClass, domAttr, domStyle) {
    'use strict';
     Function = new Functions();
    var recordIdToEdit, isFirstEdit = 0, subClassCode, passParams = null, createTime, createdUser, recTitle, 
		cacheRecordsStore, displayErrorDiv, displayInfoDiv, somethingHasChanged = false;;
    
		/* function initializeCleanup() {
			isFirstEdit = 0, subClassCode = {}, passParams = null, 
			createTime = null, createdUser = null, recTitle = null, 
			displayErrorDiv, displayInfoDiv;
		} */
	
		function populateRecord(respJson) {
			var respJson, expDate, effDate, nppiPciDesignations, nppLength, nppArray, timingCds,
                        timingCdsLength, timingCdsArray, i;
			console.debug('Populating the record details.');
			registry.byId("txtLunarDocType_recordsViewModify")
                        .set("value", respJson.record.lunarDocTypeNm);        
			createTime = respJson.record.crtdDtTm;
			createdUser = respJson.record.crtdByUsrId;
			recTitle = respJson.record.recordTitle;
			expDate = respJson.record.lifeExprtnDt;
			if(expDate != null && expDate.indexOf("T") > 0) {
				expDate =  new Date(expDate.slice(0, expDate.indexOf("T")));
			} else {                
				expDate = new Date(expDate);
			}
			expDate = Function._isoDateFormatter(expDate);
			registry.byId("expirationDate_recordsViewModify")
				.set("displayedValue", expDate);
			effDate = respJson.record.lifeEffDt;
			if(effDate!= null && effDate.indexOf("T") > 0) {
				effDate =  new Date(effDate.slice(0, effDate.indexOf("T")));
			} else {                
				effDate = new Date(effDate);
			}
			effDate =  Function._isoDateFormatter(effDate);
			registry.byId("effectiveDate_recordsViewModify").set("displayedValue", effDate);
			registry.byId("txtRecordNumber_recordsViewModify").set("value", respJson.record.recordNumber);
			registry.byId("txtRecordTitle_recordsViewModify").set("value", respJson.record.recordTitle);
			registry.byId("RIC_recordsViewModify").set("value", respJson.record.recIdxNum);
			nppiPciDesignations = respJson.record.nppiPciDesignations;
			nppLength = nppiPciDesignations.length;
			nppArray = [];
			for (i = 0; i < nppLength; i++) {
				nppArray[i] = nppiPciDesignations[i].cd;
			}
			registry.byId("ddlNPPI_recordsViewModify").set("value", nppArray);
			timingCds = respJson.record.timingCds;
			timingCdsLength = timingCds.length;
			timingCdsArray = [];
			for (i = 0; i < timingCdsLength; i++) {
				timingCdsArray[i] = timingCds[i].cd;
			}
			registry.byId("ddlTimingCode_recordsViewModify").set("value", timingCdsArray);
			isFirstEdit = 1;
			subClassCode = respJson.record.subclassificationCd;
			registry.byId("ddlClass_recordsViewModify").set("value", respJson.record.classtnCd);
		}
		
	return {
		
		
		init: function () {
            var classftnObj, subClassftnObj, nppiPciDesnObj, tmgCdObj, subClsWRTClsStore, labelValueObj = {}, somethingHasChanged = false, confDialog,
                self = this,
                nppiPcciData = secLvlCdMemStore.data,                 
                nppiPcciDesgns = [],
                create = dom.byId("cancelBtn_recordsViewModify"),
                saveBtn = dom.byId("saveBtn_recordsViewModify"),
                history = dom.byId("historyBtn_recordsViewModify"),
			    memRecords = this.app.loadedStores.recordsMemory, arrLength, arrValue, localApp = this.app;
				
			displayErrorDiv = dom.byId("displayErrorMsg_recordsViewModify");
            displayInfoDiv = dom.byId("displayInfoMsg_recordsViewModify");			
			
            cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords);

            array.forEach(nppiPcciData, function (nppiPcci) {
                var nppiValue, targetCode = nppiPcci.targetCode,
                    nppiPcciDesgnsArray = nppiPcci.targetShortDescription.split(" ");
                 if(nppiPcciDesgnsArray.length == 1 && nppiPcci.targetShortDescription === 'N/A') {
                    labelValueObj.label = nppiPcci.targetShortDescription;
                    labelValueObj.value = nppiPcci.targetShortDescription;
                    nppiPcciDesgns.push(labelValueObj);
                    labelValueObj = {};
                } else if(arrLength == null) {
                    arrLength = nppiPcciDesgnsArray.length;
                    arrValue = nppiPcci.targetShortDescription;
                } else if (arrLength < nppiPcciDesgnsArray.length) {
                    arrLength = nppiPcciDesgnsArray.length;
                    arrValue = nppiPcci.targetShortDescription;                    
                }
             });
            
            if(arrValue !== undefined) {
                var nppiPcciDesgnsArray = arrValue.split(" "), nppiValue;
                for (var j = 0; j < nppiPcciDesgnsArray.length; j++) {
                     nppiValue = nppiPcciDesgnsArray[j];
                     labelValueObj.label = nppiValue;
                     labelValueObj.value = nppiValue.charAt(0);                 
                     nppiPcciDesgns.push(labelValueObj);
                     labelValueObj = {};
               }
           }

            nppiPciDesnMemStore.setData(nppiPcciDesgns);
            // Loading sub classification Details
            classftnObj = dijit.byId("ddlClass_recordsViewModify");
            classftnObj.set("searchAttr", "targetDescription");
            classftnObj.set("placeHolder", "--Select--");
            classftnObj.set("required", true);
            classftnObj.watch("value", somethingChanged);
            labelValueObj = {};

            subClassftnObj = dijit.byId("ddlSubClass_recordsViewModify");
            subClassftnObj.set("searchAttr", "targetDescription");
            subClassftnObj.set("placeHolder", "--Select--");
            subClassftnObj.set("required", true);
            subClassftnObj.watch("value", somethingChanged);

            nppiPciDesnObj = dijit.byId("ddlNPPI_recordsViewModify");
            nppiPciDesnObj.set("labelAttr", "label");
            nppiPciDesnObj.set("required", true);
            nppiPciDesnObj.watch("value", somethingChanged);

            tmgCdObj = dijit.byId("ddlTimingCode_recordsViewModify");
            tmgCdObj.set("labelAttr", "targetDescription");
            tmgCdObj.watch("value", somethingChanged);

            classftnObj.store = clasftnMemStore;
            subClassftnObj.store = subClassMemStore;
            nppiPciDesnObj.setStore(nppiPciDesnMemStore);
            tmgCdObj.setStore(timingCdMemStore);

			
			
            on(dijit.byId("ddlClass_recordsViewModify"), "change", function (selectedVal) {
                var subclassiftnResults = null,
                    subClsftnsWRTClsftnArray = [];
                if (selectedVal !== null || typeof (selectedVal) !== "undefined") {
                    subclassiftnResults = subClassMemStore.query({
                        parentCode: selectedVal
                    });
                    if (subclassiftnResults !== null && typeof (subclassiftnResults) !== "undefined") {
                        array.forEach(subclassiftnResults, function (subclasftn) {
                            subClsftnsWRTClsftnArray.push(subclasftn);
                        });
                        subClsWRTClsStore = new Memory({
                            data: subClsftnsWRTClsftnArray,
                            idProperty: 'targetCode'
                        });
                        subClassftnObj = dijit.byId("ddlSubClass_recordsViewModify");
                        subClassftnObj.store = subClsWRTClsStore;
                        subClassftnObj.set("searchAttr", "targetDescription");
                        subClassftnObj.set("value", "");
                        subClassftnObj.set("placeHolder", "--Select--");
                        subClassftnObj.set("required", true);

                    } else {
                        console.debug(
                            'There are no subclassifications for the selected classification..'
                        );
                    }
                    if (isFirstEdit === 1) {
                        registry.byId("ddlSubClass_recordsViewModify").set("value", subClassCode);
                        isFirstEdit = 0;
                    }
                }
            });
            
            // set up check for change and stop navigation
            confDialog = new ConfirmDialog({
                title: "Notice",
                content: "You have unsaved changes. <br>Do you wish to discard your unsaved changes?",
                closable: false,
                style: "width: 300px"
            });
            confDialog.set("buttonOk", "Dismiss");
            confDialog.set("buttonCancel", "Cancel");
            dijit.byId("ddlRecordSource_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("txtRecordTitle_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("txtRecordNumber_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("effectiveDate_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("expirationDate_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("txtLunarDocType_recordsViewModify").watch("value", somethingChanged);
            dijit.byId("RIC_recordsViewModify").watch("value", somethingChanged);
            
            somethingHasChanged = false;
            function somethingChanged(){
              somethingHasChanged = true;
            }
            
            // to Cancel button to navigate to records search screen
            on(create, "click", function (formEvent) {
                if(somethingHasChanged){
                    //alert("You have unsaved changes. Do you wish to discard your unsaved changes?");
                    confDialog.show();
                    confDialog.on("execute", function (dialogEvent) {
                        self.transitionTo(formEvent, "recordsSearch", null);
                    });
                }else{
                    self.transitionTo(e, "recordsSearch", null);
                }
            });
            
            on(history, "click", function (e) {
                passParams = {
                        "id": recordIdToEdit,
                        "crtdDtTm": createTime,
                        "crtdByUsrId": createdUser,
                        "recordTitle": recTitle,
						"path" :RECORD_VIEW_MODIFY_TO_HISTORY
                };
                self.transitionTo(e, "recordsHistory", passParams);
            });
            
            // to update the record information
            on(saveBtn, "click", lang.hitch(this, function (e) {
                var isFormValid, recordCreateJson, createRecReq, classfiValue, subclassifValue,
                    nppiPciDesignations,
                    output, nppLength, timingCds, timingCdsLength, SMUser,
					crecteRecResDeferred;
				Notice.loading();
                isFormValid = dijit.byId("modifyForm_recordsViewModify")
                    .validate();
                if (!isFormValid) {
					Notice.doneLoading();
                    return;
                }
                recordCreateJson = domForm.toObject("modifyForm_recordsViewModify");
                createRecReq = dojo.fromJson(json.stringify(recordCreateJson));
                classfiValue = dijit.byId('ddlClass_recordsViewModify').get('value');
                subclassifValue = dijit.byId('ddlSubClass_recordsViewModify').get('value');
                createRecReq.classtnCd = classfiValue;
                createRecReq.subclassificationCd = subclassifValue;
                createRecReq.effDtTm = dijit.byId("effectiveDate_recordsViewModify").get("value");
                createRecReq.endDtTm = dijit.byId("expirationDate_recordsViewModify").get("value");
				createRecReq.recIdxNum = registry.byId("RIC_recordsViewModify").get('value');
                nppiPciDesignations = createRecReq.nppiPciDesignations;
                if (nppiPciDesignations.length > 0) {
					createRecReq.nppiPciDesignations = Function.getLabelValueObj(nppiPciDesignations);
				}
				timingCds = createRecReq.timingCds;
				if(timingCds.length > 0) {
					createRecReq.timingCds = Function.getLabelValueObj(timingCds);
				}
                SMUser = cacheRecordsStore.headers.SM_USER;
				var tempTarget = cacheRecordsStore.__proto__.target;
				crecteRecResDeferred = dojo.xhrPut(
					Function.getXhrArguments(cacheRecordsStore.__proto__.target + recordIdToEdit, 
						createRecReq, SM_USER));
				crecteRecResDeferred.then(function (results) {
						console.debug(RECORD_MODIFY_SUCCES);
						var params = {}, displayMsg;
						params.displayMsg = RECORD_MODIFY_SUCCES;
						var transOpts = {
							target: 'recordsSearch',
							data: params
						};
						localApp.transitionToView(e.target, transOpts);
						//localApp.transitionTo(e, "recordsSearch", params);
						cacheRecordsStore.__proto__.target = tempTarget;
						
					}, function (error) {
						displayErrorDiv.innerText = "";
						displayInfoDiv.innerText = "";
						domClass.remove(displayErrorDiv, 'error');
						domClass.remove(displayInfoDiv, 'info');
						switch (error.status) {
							case 409:
								domClass.add(displayErrorDiv, 'error');
								displayErrorDiv.innerHTML = 'DUPLICATE RECORD';
								Notice.doneLoading();
								break;
							case 403:	
							case 404:
							case 415:
							case 500:
								domClass.add(displayErrorDiv, 'error');
								displayErrorDiv.innerHTML = RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN;
								Notice.doneLoading();
								break;
							default:
								domClass.add(displayErrorDiv, 'error');
								displayErrorDiv.innerHTML = RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN;
								Notice.doneLoading();
								break;
						}
						cachePackagesStore.__proto__.target = tempTarget;
					}
				);
				
            }));
        },
		beforeActivate: function(previousView, data) {
			//initializeCleanup();
			console.debug('In before activate of previous recordsViewModify');
			displayErrorDiv.innerText = "";
			displayInfoDiv.innerText = "";
			domClass.remove(displayErrorDiv, 'error');
			domClass.remove(displayInfoDiv, 'info');
		
		},
		afterActivate: function (previousView, data) {
            console.log(this.name + " afterActivate called" + recordIdToEdit);
			var duplicateRecordObj ;
			if(data) {
				duplicateRecordObj = data.duplicateRecordObj;
				console.debug('Received duplicate record is ::', data.duplicateRecordObj);
				if (duplicateRecordObj) { 
					recordIdToEdit = duplicateRecordObj.record.id;
					populateRecord(duplicateRecordObj);
				}
			} else if(this.params && !(this.params.path === RECORD_VIEW_MODIFY_TO_HISTORY)){
				recordIdToEdit = this.params.id;
				cacheRecordsStore.query(recordIdToEdit)
					.then(function (results) {
						var respJson = dojo.fromJson(json.stringify(results));
						populateRecord(respJson);
						console.debug(RECORD_FETCH_SUCCESS);
						displayInfoDiv.innerText = RECORD_FETCH_SUCCESS;
						domClass.add(displayInfoDiv, 'info');
					}, function (error) {
						console.error("Exception while fetching the record details: ", error);
						displayErrorDiv.innerText = RECORD_FETCH_FAILURE;
						domClass.add(displayErrorDiv, 'error');
				});
			}
        },
        transitionTo: function (e, targetView, passParams) {
            var transOpts = {
                target: targetView,
                params: passParams
            };
            this.app.transitionToView(e.target, transOpts);
        }
    };
});