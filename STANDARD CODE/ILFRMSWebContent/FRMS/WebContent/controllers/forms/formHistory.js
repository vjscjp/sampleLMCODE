//Predefined tokens
/*global define : true*/
/*global console : true*/
/*global dijit : true*/


/*global FORM_VIEW_OR_EDIT,FROM_HISTSCRN_TO_FORMCRTORUPD : true*/

define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "controllers/widgets/functions.js", "dojo/data/ObjectStore",
    "dojo/store/Memory"],
    function (dom, on, lang, registry, array, EnhancedGrid, Functions, ObjectStore, Memory) {
        "use strict";

        var formHistGrid = null, jsonRestformHistoryStore, optionType,
            Function = new Functions();
        return {
            init: function () {
                // For getting form history details.
                var layout = null;
                jsonRestformHistoryStore = this.app.loadedStores.jsonRestEndPoint;
				function isoDateFormatter(value) {
                    if (value) {
                        return Function.formatDateHourMin(value);
                    }
                }
                layout = [
                    {
                        name : "Modified By: Last Name",
                        field : "modfiedByLName",
                        width : "12%"
                    }, {
                        name : "First Name",
                        field : "modifiedByFName",
                        width : "12%"

                    },{
                        name : "N#",
                        field : "userPIN",
                        width : "10%"
                    },
                    /*{
                        name : "Created By:Last Name",
                        field : "createdByLName",
                        width : "10%"
                    },
                    {
                        name : "Created By:First Name",
                        field : "createdByFName",
                        width : "10%"
                    },*/
                    {
                        name : "Modified Date",
                        field : "modifiedDate",
						formatter : isoDateFormatter,
                        width : "12%"
                    }, {
                        name : "Previous Value",
                        field : "change",
                        width : "44%"
                    }
                ];
                formHistGrid = registry.byId("formHistGrid_formHist");
                formHistGrid.set("structure", layout);
                formHistGrid.set("autoHeight", true);
                formHistGrid.set("loadingMessage", "Retrieving form history results..");
                formHistGrid.set("selectionMode", "single");
                formHistGrid.startup();

                //Event for Done button.
                on(dijit.byId("back_formHist"), "click",  lang.hitch(this, function (e) {

                    var data = {}, transOpts, path = {};
					data.type = optionType;
					data.path = FROM_HISTSCRN_TO_FORMCRTORUPD;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    this.app.transitionToView(e.target, transOpts);

                }));

            },
            beforeActivate: function (previousView, data) {
                var formId, formHistMemStore = null, formNumTxtComp, createdByTxtComp, createdDateTxtComp,
                    defferedObj;
				if (data) {
					dom.byId("historyGridMsg_formHist").innerHTML = '';
					optionType = data.optionType;
					console.debug("Form history option type is -->", optionType);
					formId = data.formId;
					if (formId) {
						Function._setJsonRestEndpointTable(jsonRestformHistoryStore);
						console.debug('jsonRestformHistoryStore.target::', jsonRestformHistoryStore.target);
						defferedObj = jsonRestformHistoryStore
							.query("/" + formId + "/history", {}).then(function (results) {
								if (results !== null) {

									var formHistArray = results.formHistory;
									formHistMemStore = new ObjectStore({
										objectStore : new Memory({
											data : results.formHistory,
											idProperty : "id"
										})
									});
									formHistGrid.setStore(formHistMemStore);
									Notice.showSuccess(PREVIOUS_HISTORY_RETRIEVAL_SUCCESS);
								} else {
									/* dom.byId("historyGridMsg_formHist").innerHTML = '<div style="color: green;"><b>' +
										'Request completed.No Previous history found</b> </div>'; */
									Notice.showInfo(NO_PREVIOUS_HISTORY);
									formHistGrid.setStore(null);
								}
							}, function (error) {
								console.error('Problem while fetching the form history details.', error);
								switch (error.status) {
								case 404:
								case 406:
								case 415:
								case 500:
									formHistGrid.setStore();
									Notice.showError(PREVIOUS_HISTORY_RETRIEVAL_FAILURE);
									/* dom.byId("historyGridMsg_formHist").innerHTML = '<div style="color: red;"><b>' +
										'Problem while fetching the form history details.. </b> </div>'; */
									break;
								default:
									formHistGrid.setStore();
									Notice.showError(PREVIOUS_HISTORY_RETRIEVAL_FAILURE);
									/* dom.byId("historyGridMsg_formHist").innerHTML = '<div style="color: red;"><b>' +
										'Problem while fetching the form history details.. </b> </div>'; */
									break;
								}
							});

					} else {
						console.debug("Error while fetching the results.");
					}
				}
                formNumTxtComp = dijit.byId("formNum_formHist");
                formNumTxtComp.set('value', data.formNum);
                formNumTxtComp.set('disabled', true);

                createdByTxtComp = dijit.byId("createdBy_formHist");
                createdByTxtComp.set('value', data.createdBy);
                createdByTxtComp.set('disabled', true);

                createdDateTxtComp = dijit.byId("createdDate_formHist");
				console.debug('data.createDate-->', data.createDate);
				if(data.createDate) {
					createdDateTxtComp.set('value', Function._isoDateFormatter(data.createDate));
				}
                createdDateTxtComp.set('disabled', true);

            },
            afterActivate: function (previousView, data) {

            }
        };
    });