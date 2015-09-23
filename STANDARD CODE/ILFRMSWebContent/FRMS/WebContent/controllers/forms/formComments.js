//Predefined tokens
/*global define : true*/
/*global console : true*/
/*global dijit : true*/
/*global confirm : true*/

/*global pathfromCmntToFormCrtOrUpd : true*/
/*global hasUserFormRWAccess : true*/
/*global FORM_VIEW_OR_EDIT, FORM_CREATE : true*/


define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "controllers/widgets/functions.js", "dojo/data/ObjectStore",
    "dojo/store/Memory", "dojo/request", "dojo/promise/all", "models/forms/formCommentsModel.js",
	 "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style"],
    function (dom, on, lang, registry, array, EnhancedGrid, Functions, ObjectStore, Memory, request, 
		all, formCommentsModel, domClass, domAttr, domStyle) {
        "use strict";
        //Global variables pertain to this file.
        var formCmntGrid, formCommentsLayout = {}, jsonRestCommentEndPoint, Function = new Functions(), groupedFormIds = [], optionType,
            formId, formCommentArray = [], formCmntsReqArray = [], createCmntReq = {}, localApp
			/*, displayErrorDiv, displayInfoDiv */;

        return {
		
			
            init: function () {
			
				/* displayErrorDiv = dom.byId("displayErrorMsg_formComments");
                displayInfoDiv = dom.byId("displayInfoMsg_formComments"); */
				localApp = this.app;
                jsonRestCommentEndPoint = this.app.loadedStores.jsonRestEndPoint;
                function isoDateFormatter(value) {
                    if (value) {
                        return Function.formatDateHourMin(value);
                    }
                }
                formCommentsLayout = [
                    {
                        name : "Comment",
                        field : "cmntTxt",
                        width : "45%"
                    },
                    {
                        name : "Created By: Last Name",
                        field : "crtByLName",
                        width : "15%"
                    }, {
                        name : "First Name",
                        field : "crtByFName",
                        width : "15%"

                    }, {
                        name : "N#",
                        field : "crtdByUsrId",
                        width : "12%"
                    }, {
                        name : "Created Date",
                        field : "crtdDtTm",
                        formatter : isoDateFormatter,
                        width : "12%"
                    }
                ];
                formCmntGrid = registry.byId("formCommentGrid_formComments");
                formCmntGrid.set("structure", formCommentsLayout);
                //formCmntGrid.set("autoHeight", -1);
                formCmntGrid.set("selectionMode", "single");
                formCmntGrid.startup();
				
				var textAreaComp = dijit.byId("newFormComments_formComments");
				textAreaComp.set("cols", "60");
				textAreaComp.set("style","width:auto;height:450px");
				//Create comment dialog
                on(dijit.byId("newCmntBtn_formComments"), "click",  lang.hitch(this, function (e) {
					dom.byId("formCommentGridMsg_formComments").innerHTML = '';
                    textAreaComp.set('value', '');
                    dijit.byId("newCmntDialog_formComments").show();

                }));
                //Done button event
                on(dijit.byId("backBtn_formComments"), "click",  lang.hitch(this, function (e) {
                    var data = {}, createCmntReq = {}, transOpts;
					createCmntReq.comments = formCmntsReqArray;
					createCmntReq.crtdByUsrId = SM_USER;
					data.createCmntReq = createCmntReq; 
					data.type = optionType;
                    data.path = pathfromCmntToFormCrtOrUpd;
                    //data.comments = comments;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

                //Form comment save
                on(dijit.byId("saveBtnCmnt_formComments"), "click", lang.hitch(this, function (e) {
					
					var formCommentReq = {}, singleCmntReq = {}, commentRes, targetForPostOrPut , deferredCmntRes, requestUrl,
						cmntTxt = {}, comments = [], crtdDtTm = {}, crtdByUsrId, docIds, params = {}, transOpts, 
						type, path, localApp = this.app;
					//Creating the form comment request:
					
					
					//End of form comments request
					if ( optionType === FORM_VIEW_OR_EDIT) {
						formCmntsReqArray = [];
						formCommentReq.crtdByUsrId = SM_USER;
						formCommentReq.docIds = groupedFormIds;
						singleCmntReq.cmntTxt = textAreaComp.get('value');
						singleCmntReq.crtdDtTm = new Date();
						formCmntsReqArray.push(singleCmntReq);
						formCommentReq.comments = formCmntsReqArray;
						
						requestUrl = jsonRestCommentEndPoint.target + "/" + formId + "/comments";
						console.debug('FORM COMMENT REQUEST ::', JSON.stringify(formCommentReq));
						console.debug('FORM COMMENT REQUEST URL::', requestUrl);
						targetForPostOrPut = jsonRestCommentEndPoint.target;
						
						Function._setJsonRestEndpointTable(jsonRestCommentEndPoint);
						jsonRestCommentEndPoint.target = jsonRestCommentEndPoint.target + "/" + groupedFormIds[0] + "/comments";
						deferredCmntRes = jsonRestCommentEndPoint.put(formCommentReq, {});
						all({deferredCmntRes : deferredCmntRes}).then(function (results) {
								console.debug('Successful in saving the comments.');
								formCommentsModel.populateCmntDtlsInGrid(jsonRestCommentEndPoint, formId, formCmntGrid); 
								//domClass.add(displayInfoDiv, 'info');
								//displayInfoDiv.innerHTML = 'Successful in saving the comments.';
								Notice.showSuccess(RECORD_UPDATE_SUCCESS_SAVE_COMMENTS);
								dijit.byId("newCmntDialog_formComments").hide();
							}, function (err) {
								console.debug('Exception occured while saving the comments.');
								//domClass.add(displayErrorDiv, 'error');
								//displayErrorDiv.innerHTML = 'Exception occured while saving the comments..';
								Notice.showError(RECORD_UPDATE_FAILURE_SAVE_COMMENTS);
						});
						jsonRestCommentEndPoint.target = targetForPostOrPut;							
						
					} else if (optionType === FORM_CREATE) {
						var gridDisplayReq = {};
						singleCmntReq = {};
						singleCmntReq.cmntTxt = textAreaComp.get('value');
						singleCmntReq.crtdDtTm = new Date();
						formCmntsReqArray.push(singleCmntReq);
						
						gridDisplayReq.cmntTxt = textAreaComp.get('value');
						gridDisplayReq.crtByLName = currentUserMemStore.data.userLastName;
						gridDisplayReq.crtByFName = currentUserMemStore.data.userFirstName;
						gridDisplayReq.crtdByUsrId = SM_USER;
						gridDisplayReq.crtdDtTm = new Date();
						formCommentArray.push(gridDisplayReq);
						
						var formCmntMemStore = new ObjectStore({
							objectStore : new Memory({
								data : formCommentArray,
								idProperty : "cmntId"
							})
						});
						formCmntGrid.setStore(formCmntMemStore);
						dijit.byId("newCmntDialog_formComments").hide();
					}
					//
                }));
                //Form comment cancel
                on(dijit.byId("cancelBtn_formComments"), "click",  lang.hitch(this, function (e) {
                    var comments = null, yes = null;
                    comments = textAreaComp.get('value');
                    if (comments) {
                        /*yes = confirm('you have unsaved changes.Do you wish to discard your unsaved changes.');
                        if (yes) {
                            dijit.byId("newCmntDialog_formComments").hide();
                        }*/
                    	var confDialog = Notice.showConfirmDialog({text:ALERT_FOR_UNSAVED_CHANGES, type: "warning"});
                        confDialog.on("execute", function (dialogEvent) {
                            //self.transitionTo(e, "recordsSearch", null);
							
                        	var transOpts = {
                                 target: "formComments",
                                 params: null
                            };
                        	localApp.transitionToView(e.target, transOpts);
                        });
						
                    } else {
                    	dijit.byId("newCmntDialog_formComments").hide();
                    }
                }));


            },
            beforeActivate: function (previousView, data) {
                //alert("before activate");
                var formCmntMemStore, formNumTxtComp, revDateTxtComp, formDescTxtComp,
                    defferedObj = null;
                dijit.byId("newCmntDialog_formComments").hide();
				//displayErrorDiv.innerText = "";
                //displayInfoDiv.innerText = "";
                //domClass.remove(displayErrorDiv, 'error');
                //domClass.remove(displayInfoDiv, 'info');
				
				formCmntGrid.setStore(null);
				formCmntsReqArray = [];
				if (data) {
					groupedFormIds = data.groupedFormIds;
					optionType = data.optionType;
					if (optionType === FORM_VIEW_OR_EDIT) {
						console.debug('in edit view mode of comments');
						if (!hasUserFormRWAccess) {
							dijit.byId("newCmntBtn_formComments").set('disabled', true);
						}
						formId = data.formId;
						if (formId) {
							formCommentsModel.populateCmntDtlsInGrid(jsonRestCommentEndPoint, formId, formCmntGrid); 
						} else {
							console.debug("The given form id is--", formId);
						}
						Notice.doneLoading();

					} else if (optionType === FORM_CREATE) {
					
						formCmntGrid = registry.byId("formCommentGrid_formComments");
						formCmntGrid.set("structure", formCommentsLayout);
						//formCmntGrid.set("autoHeight", -1);
						formCmntGrid.set("selectionMode", "single");
						formCmntMemStore = new ObjectStore({
							objectStore : new Memory({
								data : formCommentArray,
								idProperty : "cmntId"
							})
						});
						formCmntGrid.setStore(formCmntMemStore);
						formCmntGrid.startup();
						Notice.doneLoading();
					}
				}

                formNumTxtComp = dijit.byId("formNum_formComments");
                formNumTxtComp.set('value', data.formNum);
                formNumTxtComp.set('disabled', true);

                revDateTxtComp = dijit.byId("revDate_formComments");
                revDateTxtComp.set('value', data.formRvnDt);
                revDateTxtComp.set('disabled', true);

                formDescTxtComp = dijit.byId("formDesc_formComments");
                formDescTxtComp.set('value', data.docDesc);
                formDescTxtComp.set('disabled', true);

            },
            afterActivate: function (previousView, data) {
                //alert("after activate");
				formCommentArray = [];
            }
        };
	});