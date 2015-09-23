//Predefined tokens
/*global define, console, dijit, confirm, document, window : true*/

/*global FROM_TEMPLATE_TO_FORM_CRT_EDT, SUCCESS_IN_DELETE_FORM_TEMPLATE : true*/
/*global hasUserFormRWAccess : true*/
/*global FORM_VIEW_OR_EDIT : true*/


define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "controllers/widgets/functions.js", "dojo/data/ObjectStore",
    "dojo/store/Memory", "dijit/form/Button", "dojo/dom-class", "dojo/dom-attr", "dojo/dom-style"],
    function (dom, on, lang, registry, array, EnhancedGrid, Functions, ObjectStore, Memory,
        Button, domClass, domAttr, domStyle) {
        "use strict";
        //Global variables pertain to this file.
        var associatedFormTemplateGrid = null, deletedFormTemplateGrid = null, Function = new Functions(),
            optionType, formNum_formTemplate, revDate_formTemplate, formDesc_formTemplate, localApp, recIdxNum;
            /*displayErrorDiv, displayInfoDiv*/

        return {
            init: function () {
                var uploadedTmpltLayout = null, deletedTmpltLayout = null, viewFormatter, deleteFormatter,
                    formTemplateTypeFormatter;
                localApp = this.app;
                //isplayErrorDiv = dom.byId("displayErrorMsg_formTemplates");
                //displayInfoDiv = dom.byId("displayInfoMsg_formTemplates");

                function isoDateFormatter(value) {
                    if (value) {
                        return Function.formatDateHourMin(value);
                    }
                }

                viewFormatter = function (repositoryIdentifier) {
                    var btn = new Button({
                            label : "[View]",
                            onClick : function (e) {
                                var viewFormTmplRestEndpoint = null, tempTarget = null;
								if(!viewFormTmplRestEndpoint) {
									viewFormTmplRestEndpoint = localApp.loadedStores.formsTmplRepRestSvcsEndPoint;
									tempTarget = viewFormTmplRestEndpoint.target;
									Function._getJsonRestEndpoint(viewFormTmplRestEndpoint).query('rics/formtemplates/' + repositoryIdentifier, 
											{ sort: [{ attribute: "createdDate", descending: true }]}).then(
										function (result) {
											console.info('Success while viewing templates.', result.accessURL);
											console.debug('result.accessURL-->', result.accessURL);
											window.open(result.accessURL);
											viewFormTmplRestEndpoint.target = tempTarget;
											Notice.doneLoading();
										},
										function (error) {
											console.error('Error while viewing templates.');
											//domClass.add(displayErrorDiv, 'error');
											//displayErrorDiv.innerHTML = 'Error while viewing templates.';
											viewFormTmplRestEndpoint.target = tempTarget;
											Notice.doneLoading();
										}
									);
								}
                            }
                        });
                    
					return btn;
                };
                deleteFormatter = function (repositoryIdentifier) {
                    var btn;
                    if (!hasUserFormRWAccess) {
                        btn = new Button({
                            label : "[Delete]",
                            disabled : true
                        });
                    } else {
                        btn = new Button({
                            label : "[Delete]",
                            onClick : function (e) {
                                var confirmObj, deleteFormTmplRestEndpoint = null, tempTarget = null;
                                var confDialog = Notice.showConfirmDialog({text:FORM_TEMPLATE_DELETE_ALERT, type: "warning",
									okBtnText:"Yes", cancelBtnText:"No"});
                                confDialog.on("execute", function (dialogEvent) {
                                	if(!deleteFormTmplRestEndpoint) {
										deleteFormTmplRestEndpoint = localApp.loadedStores.formsTmplRepRestSvcsEndPoint;
										tempTarget = deleteFormTmplRestEndpoint.target;
										Function._getJsonRestEndpoint(deleteFormTmplRestEndpoint).remove('rics/' +
											repositoryIdentifier + '/formtemplates', {}).then(
											function (result) {
												console.info('Success in deleting the selected form template.', result);
												//domClass.add(displayInfoDiv, 'info');
												//displayInfoDiv.innerHTML = SUCCESS_IN_DELETE_FORM_TEMPLATE;
												Notice.showSuccess(SUCCESS_IN_DELETE_FORM_TEMPLATE);
												var data = {}, transOpts, formNum = {}, revDate = {}, formDesc = {};
												data.formNum = formNum_formTemplate;
												data.revDate = revDate_formTemplate;
												data.formDesc = formDesc_formTemplate;
												data.recIndxNum = recIdxNum;
												transOpts = {
													target : "formTemplates",
													data : data
												};
												localApp.transitionToView(e.target, transOpts);
												
											},
											function (error) {
												console.error('Error in deleting the selected template.');
												/*domClass.add(displayErrorDiv, 'error');
												displayErrorDiv.innerHTML = 'Error in deleting the selected form template.';*/
												Notice.showError(FAILURE_IN_DELETE_FORM_TEMPLATE);
												deleteFormTmplRestEndpoint.target = tempTarget;
												Notice.doneLoading();
											}
										);
									}
                                });
                             }
                        });
                    }
					return btn;
                };

                uploadedTmpltLayout = [
                    {
                        name : "View",
                        field : "repositoryIdentifier",
                        formatter : viewFormatter,
                        width : "8%"
                    },
                    {
                        name : "Delete",
                        field : "repositoryIdentifier",
                        formatter : deleteFormatter,
                        width : "8%"
                    },
                    {
                        name : "Form Template Type",
                        field : "docTmplTypeName",
                        width : "15%"
                    }, {
                        name : "Created Date",
                        field : "createdDate",
                        formatter : isoDateFormatter,
                        width : "15%"

                    }, {
                        name : "Uploaded By: Last Name",
                        field : "createdByUserLastName",
                        width : "20%"
                    }, {
                        name : "First Name",
                        field : "createdByUserFirstName",
                        width : "18%"
                    }, {
                        name : "N#",
                        field : "createdByUser",
                        width : "18%"
                    }
                ];
                associatedFormTemplateGrid = dijit.byId("associatedFormTemplateGrid_formTemplates");
                associatedFormTemplateGrid.set("structure", uploadedTmpltLayout);
                associatedFormTemplateGrid.set("autoHeight", true);
                associatedFormTemplateGrid.set("loadingMessage", "Retrieving form template results..");
                associatedFormTemplateGrid.set("selectionMode", "single");
                associatedFormTemplateGrid.startup();



                deletedTmpltLayout = [
                    {
                        name : "Form Template Type",
                        field : "docTmplTypeName",
                        width : "15%"
                    },
                    {
                        name : "Deleted Date",
                        field : "modifiedDate",
                        formatter : isoDateFormatter,
                        width : "10%"
                    },
                    {
                        name : "Deleted By: Last name",
                        field : "modifiedByUserLastName",
                        width : "10%"
                    }, {
                        name : "First",
                        field : "modifiedByUserFirstName",
                        width : "15%"

                    }, {
                        name : "N#",
                        field : "modifiedByUser",
                        width : "15%"
                    }
                ];

                deletedFormTemplateGrid = dijit.byId("deletedFormTemplateGrid_formTemplates");
                deletedFormTemplateGrid.set("structure", deletedTmpltLayout);
                deletedFormTemplateGrid.set("autoHeight", true);
                deletedFormTemplateGrid.set("loadingMessage", "Retrieving deleted form template results..");
                deletedFormTemplateGrid.set("selectionMode", "single");
                deletedFormTemplateGrid.startup();

                //Upload button event
                on(dijit.byId("uploadBtn_formTemplates"), "click", lang.hitch(this, function (e) {

                    var data = {}, formNum = {}, revDate = {}, formDesc = {},
                        transOpts = null, optionType = {}, ric = {};

                    data.optionType = optionType;
                    data.formNum = formNum_formTemplate;
                    data.revDate = revDate_formTemplate;
                    data.formDesc = formDesc_formTemplate;
                    data.ric = recIdxNum;
                    transOpts = {
                        target : "uploadFormTemplate",
                        params : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

                //Done button event
                on(dijit.byId("doneBtn_formTemplates"), "click",  lang.hitch(this, function (e) {
                    var data = {}, transOpts;
                    data.type = optionType;
                    data.path = FROM_TEMPLATE_TO_FORM_CRT_EDT;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

            },
            beforeActivate: function (previousView, data) {
                console.debug('In before Activate...');
                associatedFormTemplateGrid.setStore(emptyStore);
				deletedFormTemplateGrid.setStore(emptyStore);
            },
            afterActivate: function (previousView, data) {
               //alert("before activate");
                var formCmntMemStore = null, formNumTxtComp, revDateTxtComp, 
					formDescTxtComp, formNum = {}, revDate = {}, formDesc = {},  
                    fetchFormTmplSvcEndPoint = null, tempTarget;
					
                if (!hasUserFormRWAccess) {
                    domStyle.set(registry.byId("uploadBtn_formTemplates").domNode, 'display', 'none');
                } else {
                    domStyle.set(registry.byId("uploadBtn_formTemplates").domNode, 'display', 'inline');
                }
                /*displayErrorDiv.innerText = "";
                displayInfoDiv.innerText = "";
                domClass.remove(displayErrorDiv, 'error');
                domClass.remove(displayInfoDiv, 'info');*/
				data.type = optionType;
                recIdxNum = data.recIndxNum;
				fetchFormTmplSvcEndPoint = null;
				if(!fetchFormTmplSvcEndPoint) {
				
					console.debug('Trying to fetch the existing form templates for this form..');
					fetchFormTmplSvcEndPoint = localApp.loadedStores.formsTmplRepRestSvcsEndPoint;
					console.debug('GET TEMPLATE URL:: '+ fetchFormTmplSvcEndPoint.target + 'rics/' + recIdxNum + '/formtemplates');
                
					tempTarget = fetchFormTmplSvcEndPoint.target;
					Function._setJsonRestEndpointTable(fetchFormTmplSvcEndPoint);
					fetchFormTmplSvcEndPoint
						.query('rics/' + recIdxNum + '/formtemplates', {}).then(
							function (docTemplateTypeResultsObj) {
								var docTemplates, associatedFormTmplObjStore, deletedFormTmplObjStore, allFormTempMemory;

								associatedFormTemplateGrid.setStore(emptyStore);
								deletedFormTemplateGrid.setStore(emptyStore);
								
								docTemplates =  docTemplateTypeResultsObj.documentTemplates;
								console.debug('Successful retrieval of associated form templates..', docTemplates);

								allFormTempMemory = new Memory({data : docTemplates, idProperty : "repositoryIdentifier"});
								associatedFormTmplObjStore = new ObjectStore({
									objectStore : new Memory({
										data : allFormTempMemory.query({'softDeleteIndicator' : "0"}),
										idProperty : "repositoryIdentifier"
									})
								});

								deletedFormTmplObjStore = new ObjectStore({
									objectStore : new Memory({
										data : allFormTempMemory.query({'softDeleteIndicator' : "1"}, {sort: [{attribute: "modifiedDate", descending: true}]}),
										idProperty : "repositoryIdentifier"
									})
								});

								associatedFormTemplateGrid.setStore(associatedFormTmplObjStore);
								deletedFormTemplateGrid.setStore(deletedFormTmplObjStore);
								fetchFormTmplSvcEndPoint.target = tempTarget;
								Notice.showSuccess("Successful retrieval of form templates.");
								
								
							},
							function (error) {
								console.error('Error while fetching the form templates associated to this form.');
								Notice.showError("Error while fetching the form templates associated to this form.");
								fetchFormTmplSvcEndPoint.target = tempTarget;
							}
					);
				}
                
                formNum_formTemplate = data.formNum;
                formNumTxtComp = dijit.byId("formNum_formTemplates");
                formNumTxtComp.set('value', formNum_formTemplate);
                formNumTxtComp.set('disabled', true);

                revDate_formTemplate = data.revDate;
                revDateTxtComp = dijit.byId("revDate_formTemplates");
                revDateTxtComp.set('value', revDate_formTemplate);
                revDateTxtComp.set('disabled', true);

                formDesc_formTemplate = data.formDesc;
                formDescTxtComp = dijit.byId("formDesc_formTemplates");
                formDescTxtComp.set('value', formDesc_formTemplate);
                formDescTxtComp.set('disabled', true);
            }
        };
    });