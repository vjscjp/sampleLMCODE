/*global define:true,dijit:true,dojo:true,alert:true,console:true*/
define([
    "dojo/dom", "dojo/on", "dojo/_base/lang", "dojo/dom-form", "dojo/json", "dojo/store/Cache",
    "dojo/_base/array", "dojo/store/Memory",  "dijit/registry", "controllers/widgets/functions.js", "controllers/widgets/selectNA.js",
	"dojo/dom-class", "dojo/dom-attr", "dojo/dom-style", "dojo/promise/all", "dojo/html", "dojo/query",
	"dojo/date"
	], function (dom, on, lang, domForm, json, Cache, array, Memory, registry, Functions, selectNA,
		domClass, domAttr, domStyle, all, html, query, date) {
    "use strict";
    var labelValueObj = {},
        params;
	var Function, /* displayErrorDiv, displayInfoDiv, */ localApp = null, modifyBtnDup, cancelBtnDup, 
		confirmDialogDuplicate, duplicateRecordObj, effDtTmComp, endDtTmComp, nppiPciDesnComp, tmgCdComp,
		classftnComp, subClassftnComp, recordSrcComp, recordTitleComp, recordNumberComp, lunarDocTypeNmComp,
		recordIndTxtComp, displayNameComp, histBtnComp, commentComp, classftnEvntHndlr, subClsWRTClsStore,
		createdTime, createdByUser, recTitle, somethingHasChanged = false, orgnlDocId, 
		recordIdToEdit, optionType, recIdxNum, self, prevSelected = [], promotionParam;	
		
	Function = new Functions();
	
	
    return {
        init: function () {
            var memRecords,  cacheRecordsStore, 
                nppiPcciDesgns = [],                 
                cancelBtn = dom.byId("btnCancel_recordsCreate"),
                saveRecordBtnComp = registry.byId("btnSave_recordsCreate"),
                arrLength, arrValue, saveRecordEvent, nppiPciWidgetDiv, nppiPCI;
			self = this;	
			
            
            
            //displayErrorDiv = dom.byId("displayErrorMsg_recordCreate");
            //displayInfoDiv = dom.byId("displayInfoMsg_recordCreate");
			displayNameComp = dom.byId("displayName_recordCreate");
			commentComp = dijit.byId("txtInitialComment_recordsCreate");
			
			
			modifyBtnDup = dijit.byId("modify_duplicateRec");
            cancelBtnDup = dijit.byId("cancel_duplicateRec");
			histBtnComp = dijit.byId("historyBtn_recordsCreate");
			
			//confirmDialogDuplicate = dijit.byId("confirm_recordsCreate");
			
            localApp = this.app;
			if(!hasUserRecordWriteAccess) {
				saveRecordBtnComp.set("disabled", true); 
			} else {
				saveRecordBtnComp.set("disabled", false);
			} 

            memRecords = this.app.loadedStores.recordsMemory;
            cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords);
            

			
			recordSrcComp = dijit.byId('ddlRecordSource_recordsCreate');

            classftnComp = dijit.byId("ddlClass_recordsCreate");
            classftnComp.set("searchAttr", "targetDescription");
            classftnComp.set("placeHolder", "--Select--");
            classftnComp.set("required", true);
            classftnComp.set("fetchProperties", FRMS.FrmsConstants.SORTOBJECT);
            labelValueObj = {};

            subClassftnComp = dijit.byId("ddlSubClass_recordsCreate");
            subClassftnComp.set("searchAttr", "targetDescription");
            subClassftnComp.set("placeHolder", "--Select--");
            subClassftnComp.set("required", true);
            subClassftnComp.set("fetchProperties", FRMS.FrmsConstants.SORTOBJECT);
			
			recordTitleComp = dijit.byId('txtRecordTitle_recordsCreate');
            recordNumberComp = dijit.byId('txtRecordNumber_recordsCreate');
			lunarDocTypeNmComp = dijit.byId('txtLunarDocType_recordsCreate');

            tmgCdComp = dijit.byId("ddlTimingCode_recordsCreate");
            tmgCdComp.set("labelAttr", "targetDescription");
            
            var store1 = FRMS.loadedStores.timingCdMemStore; 
            var store2 = FRMS.loadedStores.nppiPciDesnMemStore;
            
            // new NPPI widget
            nppiPciWidgetDiv = dom.byId("ddlNPPIWidget_recordsCreate");
            nppiPCI = new selectNA();
            nppiPCI.placeAt(nppiPciWidgetDiv);
            
            all({
                deferredTimingCdMemStore: FRMS.deferredTimingCdMemStore,
                deferredsecLvlCdJsonStore: FRMS.deferredsecLvlCdJsonStore // deferredsecLvlCdJsonStore used to create NPPI
            }).then(function(results){
    
                nppiPCI.combo_selectNA.setStore(FRMS.loadedStores.nppiPciDesnMemStore);
                tmgCdComp.setStore(FRMS.loadedStores.timingCdMemStore);
                
            });
            
            

            classftnComp.store = clasftnMemStore;
            subClassftnComp.store = subClassMemStore;
            

			effDtTmComp = dijit.byId("effectiveDate_recordsCreate");
			effDtTmComp.constraints.min = new Date();
			endDtTmComp = dijit.byId("expirationDate_recordsCreate");
			endDtTmComp.constraints.min = effDtTmComp.get('value');
			
			recordIndTxtComp = registry.byId("RIC_recordsCreate");
			
//			classftnEvntHndlr = on(classftnComp, "change", function (selectedVal) {
//				self.changeSubClass(selectedVal);
//            });
                
            on(dijit.byId("form_recordCreate"), "*:change", function(evt){
                console.log("Clicked on node ", evt, " in form row ", this.value);
                somethingHasChanged = true;
            });
            
            
            on(classftnComp, "change", function(evt){ 
                self.changeSubClass(evt);
                somethingHasChanged = true; 
                console.debug('class CG');
            });
            on(subClassftnComp, "change", function(evt){ 
				somethingHasChanged = true; 
				console.debug('sub CG');
			});
			on(effDtTmComp, "change", function(evnt) {
				console.debug('Effective date time got changed');
				endDtTmComp.constraints.min =  date.add(effDtTmComp.get('value'), "day", 1);
			});
			
           
            
			
            on(nppiPCI.combo_selectNA, "click", function(evt){ 
				somethingHasChanged = true; 
				console.debug('nppi CG');
			});
            on(tmgCdComp, "click", function(evt){ 
				somethingHasChanged = true; 
				console.debug('tmgCd CG');
			});
            
            // to Cancel button to navigate to records search screen
            on(cancelBtn, "click", function (e) {
                if(somethingHasChanged ){ 
                    var confDialog = Notice.showConfirmDialog({text:ALERT_FOR_UNSAVED_CHANGES, type: "warning"});
                    confDialog.on("execute", function (dialogEvent) {
                        self.transitionTo(e, "recordsSearch", null);
                    });
                } else {
                    self.transitionTo(e, "recordsSearch", null);
                }
                
            });
            // to save the record information
            on(saveRecordBtnComp, "click", lang.hitch(this, function (saveEvent) {
                var isFormValid, recCreateReq = {}, classfiValue, subclassifValue, nppiPciDesignations,
                    timingCds, extlRecInd, createOrUpdRecResDeferred;
					
				Notice.loading();
                isFormValid = dijit.byId("form_recordCreate")
                    .validate();
                if (!isFormValid) {
					Notice.doneLoading();
                    return;
                }
				saveRecordEvent = saveEvent;
                
				extlRecInd = recordSrcComp.get('value');
				recCreateReq.extlRecInd = extlRecInd;
                
				classfiValue = classftnComp.get('value');
                recCreateReq.classtnCd = classfiValue;
				
				subclassifValue = subClassftnComp.get('value');
                recCreateReq.subclassificationCd = subclassifValue;
				
				recCreateReq.recordTitle = recordTitleComp.get('value');
                recCreateReq.recordNumber = recordNumberComp.get('value');
				
				/*recCreateReq.lifeEffDt = effDtTmComp.get('value');
				recCreateReq.lifeExprtnDt = endDtTmComp.get("value");*/
                recCreateReq.effDtTm = effDtTmComp.get('value');
				recCreateReq.endDtTm = endDtTmComp.get("value");
				
				nppiPciDesignations = nppiPCI.combo_selectNA.get('value');
                if (nppiPciDesignations.length > 0) {
					recCreateReq.nppiPciDesignations = Function.getLabelValueObj(nppiPciDesignations);
				}
				//nppiPCI.combo_selectNA.set("required", false);
				//tmgCdComp.set("required", false);
                timingCds = tmgCdComp.get('value');
				if(timingCds.length > 0) {
					recCreateReq.timingCds = Function.getLabelValueObj(timingCds);
				}
				recCreateReq.lunarDocTypeNm = lunarDocTypeNmComp.get('value');
				var tempTarget = cacheRecordsStore.target;
				if(optionType === VIEW_MODIFY_RECORD_DISPLAY_MSG) {
					recCreateReq.orgnlDocId = orgnlDocId;
					recCreateReq.recIdxNum = recIdxNum;
					console.log('UPDATE RECORD REQUEST :: ', recCreateReq);
					console.debug('UPDATE RECORD REQUEST URL::', cacheRecordsStore.target);
					createOrUpdRecResDeferred = dojo.xhrPut(Function.getXhrArguments(cacheRecordsStore.target+recordIdToEdit, recCreateReq, SM_USER));
				
				} else {
					console.log('CREATE RECORD REQUEST :: ', recCreateReq);
					console.debug("CREATE RECORD REQUEST URL::", cacheRecordsStore.target);
					createOrUpdRecResDeferred = dojo.xhrPost(Function.getXhrArguments(cacheRecordsStore.target, recCreateReq, SM_USER));
				}
				
				createOrUpdRecResDeferred.then(function(value){
					var locationHeader, createdRecordId, recCmntsReqArray, recCommentReq = {}, singleCmntReq = {},
						docIds = [], xhrCommentsInput, commentsRes, displayMsg='', comments, commentsResDeferred;
						
					if (createOrUpdRecResDeferred.ioArgs.xhr.status === 201) {
						locationHeader = createOrUpdRecResDeferred.ioArgs.xhr.getResponseHeader("Location");
						createdRecordId = locationHeader
							.substring(locationHeader.lastIndexOf("/") + 1, locationHeader.length);
						console.debug('created record id-->', createdRecordId);
						if(optionType === VIEW_MODIFY_RECORD_DISPLAY_MSG) {
							displayMsg = RECORD_MODIFY_SUCCES;
							console.debug(RECORD_MODIFY_SUCCES);
						} else {
							displayMsg = RECORD_SAVE_SUCCESS;
							console.debug(RECORD_SAVE_SUCCESS);
						}
						comments = dijit.byId("txtInitialComment_recordsCreate").get('value');
						if(comments) {
							docIds.push(createdRecordId);
							recCmntsReqArray = [];
							recCommentReq.crtdByUsrId = SM_USER;
							recCommentReq.docIds = docIds;
							singleCmntReq.cmntTxt = comments;
							singleCmntReq.crtdDtTm = new Date();
							recCmntsReqArray.push(singleCmntReq);
							recCommentReq.comments = recCmntsReqArray;
							console.log('COMMENT REQUEST :: ', recCommentReq);
							var commentReqUrl = cacheRecordsStore.target + createdRecordId + "/comments";
							console.debug("COMMENT REQUEST URL::", commentReqUrl);
							commentsResDeferred = dojo.xhrPost(Function.getXhrArguments(commentReqUrl, recCommentReq, SM_USER));
							commentsResDeferred.then(function(value){
								if (commentsResDeferred.ioArgs.xhr.status === 201) {
									console.debug('Successful in saving the comments.');
									displayMsg = displayMsg + RECORD_SUCCESS_SAVE_COMMENTS;
									var params = {}, transOpts;
									params.displayMsg = displayMsg;
									transOpts = {
										target : "recordsSearch",
										data : params
									};
									localApp.transitionToView(saveEvent.target, transOpts);
								} 
								
							}, function(err){
							    //displayInfoDiv.innerText = "";
								//domClass.remove(displayInfoDiv, 'info');
								console.error('Error in saving the comments.');
								Notice.showError(RECORD_FAILURE_SAVE_COMMENTS);
								//domClass.add(displayErrorDiv, 'error');
								//displayErrorDiv.innerHTML = RECORD_FAILURE_SAVE_COMMENTS ;
								//Notice.doneLoading();
								
							});
						} else {                            
                            if(promotionParam) {  
                                var transOpts = {
                                    target : "releaseGroup",
								    data : {id:promotionParam.id, orgnlDocId:promotionParam.orgnlDocId, newId:createdRecordId}
							     };  
                                localApp.transitionToView(saveEvent.target, transOpts);
                                Notice.doneLoading();
                                var tabs = registry.byId("appTabs");                                
                                tabs.selectChild("PromotionTab"); 
                            } else { 
                                var params = {}, transOpts;
                                params.displayMsg = displayMsg;
                                transOpts = {
                                    target : "recordsSearch",
                                    data : params
                                };
                                localApp.transitionToView(saveEvent.target, transOpts);
                            }
						}
					}
					
				}, function(error){
					
					//displayInfoDiv.innerText = "";
					//domClass.remove(displayInfoDiv, 'info');
					console.debug('create record status cod::', error.status);
					switch (error.status) {
						case 409:
							var responseJson, duplicateRecDeferred, duplicateRecId;
							responseJson = dojo.fromJson(createOrUpdRecResDeferred.ioArgs.xhr.response);
							duplicateRecId = responseJson.duplicateRecIDs[0];
							Notice.doneLoading();
                            
                            // use new notice item
							//confirmDialogDuplicate.show();
                            
							console.debug('Fetching the duplicate record Information..');
							var tempTarget = cacheRecordsStore.target;
							console.debug('Fetch Record URL ::', cacheRecordsStore.target+'/'+duplicateRecId);
							duplicateRecDeferred = cacheRecordsStore.query(duplicateRecId);
                            Notice.loading();
							all({duplicateRecDeferred: duplicateRecDeferred}).then(function (results) {
								
								duplicateRecordObj = dojo.fromJson(json.stringify(results.duplicateRecDeferred));
								console.debug('Duplicate record response json is::', duplicateRecordObj);
								
//								dom.byId("clas_duplicateRecordConfirmation").innerText = classftnComp.get('displayedValue');
//								dom.byId("sClas_duplicateRecordConfirmation").innerText = subClassftnComp.get('displayedValue');
//								dom.byId("recId_duplicateRecordConfirmation").innerText = duplicateRecordObj.record.recordNumber;
//								dom.byId("recTit_duplicateRecordConfirmation").innerText = duplicateRecordObj.record.recordTitle;
                                
                                // New dialog pop up
                                var textEntry = '<div class="l_rounded_border_column">';
                                textEntry = textEntry + '<p>This is a duplicate entry. <br>Please update your Document Record values.</p>';
                                textEntry = textEntry + "<b>Classification:</b> " + classftnComp.get('displayedValue');
                                textEntry = textEntry + "<br><b>Sub-Classfication:</b> " + subClassftnComp.get('displayedValue');
                                textEntry = textEntry + "<br><b>Record #:</b> " + duplicateRecordObj.record.recordNumber;
                                textEntry = textEntry + "<br><b>Record Title:</b> " +duplicateRecordObj.record.recordTitle;
                                textEntry = textEntry + '</div>';

                                var confDialog = Notice.showConfirmDialog({
                                    text:textEntry, 
                                    type: "error", 
                                    title:"Duplicate Record",
                                    okBtnText:"Modify Existing"
                                });
                                confDialog.on("execute", function (dialogEvent) {
                                    var params  = {}, transOpts, optionType = {};
                                    optionType = VIEW_MODIFY_RECORD_DISPLAY_MSG;
                                    params.duplicateRecordObj =  duplicateRecordObj;
                                    params.optionType = optionType;
                                    transOpts = {
                                        target: 'recordsCreate',
                                        data: params
                                    };
                                    localApp.transitionToView(saveRecordEvent.target, transOpts);
                                });
								
								
							},function (error) {
								console.debug("Exception while fetching the duplicate record results: ", error);
								//domClass.add(displayErrorDiv, 'error');
								//displayErrorDiv.innerHTML = "Exception while fetching the duplicate record results.";
								Notice.showError(DUPLICATE_REC_FETCH_FAILURE);
								
							});
							cacheRecordsStore.target = tempTarget;
							break;
							
						case 403:	
						case 404:
						case 406:
							//domClass.add(displayErrorDiv, 'error');
							//displayErrorDiv.innerHTML = REQUIRED_FIELDS_MISSING;
							Notice.showError(REQUIRED_FIELDS_MISSING);
							break;
						case 415:
						case 500:
							//domClass.add(displayErrorDiv, 'error');
							//displayErrorDiv.innerHTML = RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN;
							//Notice.doneLoading();
							Notice.showError(RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN);
							break;
						default:
							//domClass.add(displayErrorDiv, 'error');
							//displayErrorDiv.innerHTML = RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN;
							//Notice.doneLoading();
							Notice.showError(RECORD_SAVE_FAILURE + CONTACT_SYS_ADMIN);
							break;
					}
					
				});
				cacheRecordsStore.target = tempTarget;
				
            }));
            
                    
            
//			on(modifyBtnDup, "click", lang.hitch(this, function (e) {
//				confirmDialogDuplicate.hide();
//				Notice.loading();
//				var params  = {}, transOpts, optionType = {};
//				optionType = VIEW_MODIFY_RECORD_DISPLAY_MSG;
//				params.duplicateRecordObj =  duplicateRecordObj;
//				params.optionType = optionType;
//				transOpts = {
//					target: 'recordsCreate',
//					data: params
//				};
//				localApp.transitionToView(saveRecordEvent.target, transOpts);
//			}));
//			on(cancelBtnDup, "click", lang.hitch(this, function (e) {
//				confirmDialogDuplicate.hide();
//            }));
			on(histBtnComp, "click", function (e) {
				Notice.loading();
                var passParams = {
                        "id": recordIdToEdit,
                        "crtdDtTm": createdTime,
                        "crtdByUsrId": createdByUser,
                        "recordTitle": recTitle
						
                };
                self.transitionTo(e, "recordsHistory", passParams);
            });
        },
		beforeActivate: function (previousView, data) {
		    //console.log(this.name + " afterActivate called");
            if(this.params.promotion) {
                promotionParam = this.params;
            }
            dijit.byId("form_recordCreate").reset();
            // is now a widget, doesn't work
//			nppiPCI.combo_selectNA.set("value", [], false);
//			nppiPCI.combo_selectNA._updateSelection();
			tmgCdComp.set("value", [], false);
			tmgCdComp._updateSelection();
		},
        afterActivate: function (previousView, data) {
            
			var self = this;
			console.debug('previous view name-->', previousView.name);
			if(previousView.name === 'recordsSearch' || previousView.name === 'recordsHistory') {
				
				recordIdToEdit = this.params.id;
				if(recordIdToEdit) {
					optionType = VIEW_MODIFY_RECORD_DISPLAY_MSG;
					html.set(displayNameComp, "<b><h3>"+VIEW_MODIFY_RECORD_DISPLAY_MSG +"</b></h3>");
					domStyle.set(dom.byId("RIClbl_recordsCreate"), 'display', 'inline');
					domStyle.set(histBtnComp.domNode, 'display', 'inline');
					domStyle.set(dom.byId("txtInitialCommentlbl_recordsCreate"), 'display', 'none');
					effDtTmComp.constraints.min = null;
					cacheRecordsStore.query(recordIdToEdit)
						.then(function (results) {
							//Notice.doneLoading();
							var respJson = dojo.fromJson(json.stringify(results));
							console.debug("record details are -->", respJson);
							orgnlDocId = respJson.record.orgnlDocId;
							recIdxNum = respJson.record.recIdxNum;
							self.populateRecord(respJson);
							console.debug(RECORD_FETCH_SUCCESS);
							Notice.showSuccess(RECORD_FETCH_SUCCESS);
							//displayInfoDiv.innerText = RECORD_FETCH_SUCCESS;
							//domClass.add(displayInfoDiv, 'info');
							
						}, function (error) {
							console.error("Exception while fetching the record details: ", error);
							//displayErrorDiv.innerText = RECORD_FETCH_FAILURE;
							//domClass.add(displayErrorDiv, 'error');
							Notice.showError(RECORD_FETCH_FAILURE);
					});
				} else {
					optionType = CREATE_RECORD_DISPLAY_MSG;
					html.set(displayNameComp, "<b><h3>"+CREATE_RECORD_DISPLAY_MSG +"</b></h3>");
					domStyle.set(dom.byId("RIClbl_recordsCreate"), 'display', 'none');
					domStyle.set(histBtnComp.domNode, 'display', 'none');
					domStyle.set(dom.byId("txtInitialCommentlbl_recordsCreate"), 'display', 'inline');
					duplicateRecordObj = {};
					nppiPCI.combo_selectNA.set('value', [], false);
					nppiPCI.combo_selectNA._updateSelection();
					tmgCdComp.set('value', [], false);
					tmgCdComp._updateSelection();
					//displayErrorDiv.innerText = "";
					//displayInfoDiv.innerText = "";
					//domClass.remove(displayErrorDiv, 'error');
					//domClass.remove(displayInfoDiv, 'info');
					createdTime = null;
					createdByUser = null;
					recTitle ='';
					recordIdToEdit = '';
					
					
				}
			
			} else if(previousView.name === 'recordsCreate'){
				orgnlDocId = null;
				if(data) {
					duplicateRecordObj = data.duplicateRecordObj;
					optionType = data.optionType;
					if(!optionType) {
						optionType = CREATE_RECORD_DISPLAY_MSG;
					}
					console.debug('Received duplicate record is ::', data.duplicateRecordObj);
					if (duplicateRecordObj) { 
						
						recordIdToEdit = duplicateRecordObj.record.id;
						orgnlDocId = duplicateRecordObj.record.orgnlDocId;
						recIdxNum = duplicateRecordObj.record.recIdxNum;
						self.populateRecord(duplicateRecordObj);
						html.set(displayNameComp, "<b><h3>"+VIEW_MODIFY_RECORD_DISPLAY_MSG +"</b></h3>");
						domStyle.set(histBtnComp.domNode, 'display', 'inline');
						domStyle.set(dom.byId("txtInitialCommentlbl_recordsCreate"), 'display', 'none');
						effDtTmComp.constraints.min = null;
						Notice.showSuccess('Successfully retrieved the duplicate record details');
					}
				} else {
					Notice.showError('Error in retrieving the duplicate record details.');
				}
			}
        },
        transitionTo: function (e, targetView, params) {
            var transOpts = {
                target: targetView,
                params: params
            };
            this.app.transitionToView(e.target, transOpts);

        },
        
        changeSubClass:function(selectedVal){
            console.debug('Changing the classification..');
            var subclassiftnResults = null,
                subClsftnsWRTClsftnArray = [];
            if (selectedVal) {

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
                    subClassftnComp = dijit.byId("ddlSubClass_recordsCreate");
                    subClassftnComp.store = subClsWRTClsStore;
                    subClassftnComp.set("searchAttr", "targetDescription");
                    subClassftnComp.set("value", "", false);
                    subClassftnComp.set("placeHolder", "--Select--");
                    subClassftnComp.set("required", true);

                } else {
                    console.debug('There are no subclassifications for the selected classification..');
                }
            }
        },
    
        populateRecord:function(respJson) {
            var effDate, expDate, nppiPciDesignations, nppLength, nppArray, timingCds,
                        timingCdsLength, timingCdsArray, self = this;
            console.debug('Populating the record details.');

            recordSrcComp.set("value", respJson.record.extlRecInd); 
            classftnComp.set("value", respJson.record.classtnCd, false);
            

            //classftnEvntHndlr.remove();
            subClassftnComp.store = subClassMemStore;
            
            // store is set now trigger limit sub class based on selected class
            self.changeSubClass(respJson.record.classtnCd);
            subClassftnComp.set('value', respJson.record.subclassificationCd, false); 
                
        
            recTitle = respJson.record.recordTitle;
            createdTime = respJson.record.crtdDtTm;
            createdByUser = respJson.record.crtdByUsrId;

            recordTitleComp.set("value", recTitle);  
            recordNumberComp.set("value", respJson.record.recordNumber); 
            lunarDocTypeNmComp.set("value", respJson.record.lunarDocTypeNm); 
            recordIndTxtComp.set("value", respJson.record.recIdxNum); 

            effDate = respJson.record.lifeEffDt;
            if(effDate!= null && effDate.indexOf("T") > 0) {
                effDate =  new Date(effDate.slice(0, effDate.indexOf("T")));
            } else {                
                effDate = new Date(effDate);
            }
            effDate =  Function._isoDateFormatter(effDate);
            effDtTmComp.set("displayedValue", effDate);
            effDtTmComp.set("required", false);

            expDate = respJson.record.lifeExprtnDt;
            if(expDate != null && expDate.indexOf("T") > 0) {
                expDate =  new Date(expDate.slice(0, expDate.indexOf("T")));
            } else {                
                expDate = new Date(expDate);
            }
            expDate = Function._isoDateFormatter(expDate);
            endDtTmComp.set("displayedValue", expDate);

            nppiPciDesignations = respJson.record.nppiPciDesignations;
            if(nppiPciDesignations && nppiPciDesignations.length) {
                nppArray = [];
                array.forEach( nppiPciDesignations,function(nppiPciDesignation){
                    nppArray.push(nppiPciDesignation.cd);
                });
                nppiPciDesnComp.set("value", nppArray,false);
            }

            timingCds = respJson.record.timingCds;
            if (timingCds && timingCds.length){
                timingCdsArray = [];
                array.forEach( timingCds,function(timingCd){
                    timingCdsArray.push(timingCd.cd);
                });
                tmgCdComp.set("value", timingCdsArray, false);
            }
            
            

        },
       
       };
});