/*global define:true,console:true*/
define(
    ["dojo/dom", "dojo/on", "dojo/_base/lang", "dojo/store/Cache", "dijit/registry", "dojox/grid/DataGrid",
        "dojo/data/ObjectStore", "dojo/store/Memory","dojo/_base/array",  "controllers/widgets/functions.js"],
    function (dom, on, lang, Cache, registry, DataGrid, ObjectStore, Memory,array, Functions) {
        'use strict';
        Function = new Functions();
        var cacheGetUser = null, grid = null;
		var recordNumber, recTitle, createTime,createdUserId, previousViewName ;
		
        return {
            beforeActivate: function (previousView, data) {
                // "txtRecordTitle_recordsHistory"
				previousViewName = previousView.name;
				console.debug('Previous view name is::', previousViewName);
				recordNumber=this.params.id;
				recTitle=this.params.recordTitle;
				
                createTime = Function._isoDateTimeFormatter(this.params.crtdDtTm);
                
                registry.byId("txtRecordTitle_recordsHistory").set("value", decodeURIComponent(this.params.recordTitle));
                registry.byId("txtCreatedDate_recordsHistory").set("value", createTime);
				registry.byId("txtCreateByFirstName_recordsHistory").set("value", currentUserMemStore.data.userFirstName);
				registry.byId("txtCreateByLastName_recordsHistory").set("value", currentUserMemStore.data.userLastName);
				/* cacheGetUser.query(this.params.crtdByUsrId).then(function (results) {
                    registry.byId("txtCreateByFirstName_recordsHistory").set("value", results.user.userFirstName);
                    registry.byId("txtCreateByLastName_recordsHistory").set("value", results.user.userLastName);
                }, function (error) {
                    console.debug("err: ", error);
                }); */
				grid.setStore(emptyStore);
                
                Notice.loading();
				Function._setJsonRestEndpointTable(cacheRecordsStore);
                cacheRecordsStore.query(this.params.id + "/history").then(function (results) {
                    //console.log("results", results);
                    if(results && results.recordHistory) {
                        var objStore = new ObjectStore({
                            objectStore: new Memory({
                                data: results.recordHistory
                            })
                        });
                        grid.setStore(objStore);
						
                    }
					Notice.showSuccess(PREVIOUS_HISTORY_RETRIEVAL_SUCCESS);
                }, function (error) {
					Notice.showError(error);
                    console.debug("err: ", error);
                });
				//Notice.doneLoading();
            },
            init: function () {
                var recordHistDone = dom.byId("btnDone_recordsHistory"),
                    memRecords = this.app.loadedStores.recordsMemory,
                    userDetails = this.app.loadedStores.userMemory,
					commentsBtn = dom.byId("commentsBtn_recordsHistory"),
                    archiveUserDetails = this.app.loadedStores.jsonUserDetails;
                cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords);
                cacheGetUser = new Cache(archiveUserDetails, userDetails);
			    grid = new DataGrid({
                    autoHeight: true,
                    structure: [{
                        name: "N#",
                        field: "userPIN",
                        width: "10%"
                    }, {
                        name: "Modified Date",
                        field: "modifiedDate",
                        width: "20%",
                        formatter: function(modifiedDate){
                            return Function._isoDateTimeFormatter(modifiedDate);
                        },
                    }, {
                        name: "Modified By:Last Name",
                        field: "modfiedByLName",
                        width: "20%"
                    }, {
                        name: "First Name",
                        field: "modifiedByFName",
                        width: "20%"
                    }, {
                        name: "Previous Value",
                        field: "change",
                        width: "20%"
                    }]
                }, "grid_recordsHistory");
                grid.startup();
                grid.set("autoHeight", true);
                
                
                on(recordHistDone, "click", lang.hitch(this, function (e) {
					if(previousViewName === 'recordsCreate') {
						var params = {}, id = {};
						params.id = recordNumber;
						this.transitionTo(e, "recordsCreate", params);
					} else {
						this.transitionTo(e, "recordsSearch", null);
					}
                }));
				
				on(commentsBtn, "click", lang.hitch(this, function (e) {
					var commentsParams = {}, transitionParms,SMUser,xhrInput,iniRecCmtArray = [], 
						createRecResDeferred;
					console.debug("passing record number to comments page"+recordNumber)
					commentsParams.recordId=recordNumber;
					commentsParams.createdTime=createTime;
					commentsParams.recordTitle=recTitle;
					commentsParams.crtdByUsrId=createdUserId;
					
					//SMUser = cacheRecordsStore.headers.SM_USER;
					createRecResDeferred = dojo.xhrGet(Function.getXhrArguments(
						cacheRecordsStore.target + recordNumber+"/comments", null, SM_USER));
					createRecResDeferred.then(
							function(data){
							if(data!=null){
								array.forEach(data.comments, function (comment) {
									var gridDisplayRow={};
									gridDisplayRow.cmntTxt = comment.cmntTxt;
									gridDisplayRow.crtByLName = comment.crtByLName;
									gridDisplayRow.crtByFName = comment.crtByFName;
									gridDisplayRow.crtdByUsrId = comment.crtdByUsrId;
									gridDisplayRow.crtdDtTm = comment.crtdDtTm;
									iniRecCmtArray.push(gridDisplayRow);    
								});
							}
							commentsParams.initialComments=iniRecCmtArray;
							},
							function(error){
								console.debug(json.stringify(error));
							}
					);
					transitionParms = {
								target : "recordComments",
								data : commentsParams
							};
					 this.app.transitionToView(e.target, transitionParms);
				}));
            },
            transitionTo: function (e, targetView, params) {
                var transOpts = {
                    target: targetView,
                    params: params
                };
                this.app.transitionToView(e.target, transOpts);
            }
        };
    });
