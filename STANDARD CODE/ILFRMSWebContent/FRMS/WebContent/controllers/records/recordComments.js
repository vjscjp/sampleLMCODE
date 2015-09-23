
define([ "dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/_base/array",
    "dojox/grid/EnhancedGrid", "dojo/data/ObjectStore",
    "dojo/store/Memory", "dojo/request", "dojo/promise/all", "models/forms/formCommentsModel.js","dojo/date/stamp","dojo/date/locale","dojo/store/Cache","controllers/widgets/functions.js"],
    function (dom, on, lang, registry, array, EnhancedGrid, ObjectStore, Memory, request, all, formCommentsModel,stamp,locale,Cache,Functions) {
        "use strict";
		var recordCmntGrid,recordCommentsLayout,recordCommentArray = [],recordCmntMemStore,recordCmntsReqArray = [],Function = new Functions(),
			recordNumber, recTitle, createTime, createdUserId;
	    return {
			
            init: function () {
				var textAreaComp = dijit.byId("newRecordComments");
				recordCommentsLayout = [
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
                        width : "15%",
                        formatter: function(crtdDtTm){
                            return Function._isoDateFormatter(crtdDtTm);
                        },
                    }
                ];

				on(dijit.byId("newCmntBtn_recordComments"), "click",  lang.hitch(this, function (e) {
					dom.byId("recordCommentGridMsg").innerHTML = '';
                    textAreaComp.set('value', '');
                    dijit.byId("newCmntDialog_recordComments").show();

                }));
				 
                on(dijit.byId("backBtn_recordComments"), "click",  lang.hitch(this, function (e) {
                   var params = {}, createCmntReq = {},transitionParms,SMUser,xhrArgs,
				   memRecords = this.app.loadedStores.recordsMemory,
				   cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords),docIdsArray=[];
				   
				   SMUser = cacheRecordsStore.headers.SM_USER;
					createCmntReq.crtdByUsrId = SM_USER;				  
					createCmntReq.comments = recordCmntsReqArray;
					docIdsArray.push(recordNumber);
				    createCmntReq.docIds = docIdsArray;
					console.debug("save Comments::"+JSON.stringify(createCmntReq));
					
					var requestURL=cacheRecordsStore.target + recordNumber+"/comments";
					var jsonParsedRequest = JSON.stringify(createCmntReq);
					xhrArgs = {
					url : requestURL,
					postData: jsonParsedRequest,
					handleAs: "json",
					headers: lang.mixin({
						"Content-Type": "application/json",
						Accept: "application/javascript, application/json",
								"SM_USER": SMUser
					})
					};
					dojo.xhrPost(xhrArgs);
					console.debug("passing back record number to hisotry page"+recordNumber)	
					transitionParms = {
                            target : "recordsHistory",
							 params : {
                                    "id": recordNumber,
                                    "crtdDtTm":createTime,
                                    "crtdByUsrId": createdUserId,
                                    "recordTitle":recTitle
                                }
                        };
					this.app.transitionToView(e.target, transitionParms);

                }));
				on(dijit.byId("cancelBtn_recordComments"), "click",  lang.hitch(this, function (e) {
                    var comments = null, yes = null;
                    comments = textAreaComp.get('value');
                    if (comments) {
                        yes = confirm('you have unsaved changes.Do you wish to discard your unsaved changes.');
                        if (yes) {
                            dijit.byId("newCmntDialog_recordComments").hide();
                        }
                    } else {
                        dijit.byId("newCmntDialog_recordComments").hide();
                    }
                }));
				 //Form comment save
                on(dijit.byId("saveBtnCmnt_recordComments"), "click", lang.hitch(this, function (e) {
					
					var gridDisplayReq = {},cmntTxt = {}, crtdDtTm = {}, crtdByUsrId,singleCmntReq={};
					if(textAreaComp.get('value')){
						
						singleCmntReq.cmntTxt = textAreaComp.get('value');
						singleCmntReq.crtdDtTm = new Date();
						recordCmntsReqArray.push(singleCmntReq);
						
							gridDisplayReq.cmntTxt = textAreaComp.get('value');
							gridDisplayReq.crtByLName = currentUserMemStore.data.userLastName;
							gridDisplayReq.crtByFName = currentUserMemStore.data.userFirstName;
							gridDisplayReq.crtdByUsrId = SM_USER;
							gridDisplayReq.crtdDtTm = new Date();
							recordCommentArray.push(gridDisplayReq);
						}
						 console.debug("grid data::"+JSON.stringify(recordCommentArray));
						 recordCmntMemStore = new ObjectStore({
							objectStore : new Memory({
								data : recordCommentArray,
								idProperty : "recordCmntId"
							})
						});
						 var cgrid;
						if(dijit.byId("commentsGrid")!=null){
							cgrid=dijit.byId('commentsGrid');
							cgrid.setStore(null);
							cgrid.setStore(recordCmntMemStore);
        			    } else{
						 cgrid = new dojox.grid.EnhancedGrid({
        			        id: 'commentsGrid',
        			        store: recordCmntMemStore,
        			        structure: recordCommentsLayout,
        			        autoHeight: true,
        			      });	
						}
						
                        cgrid.placeAt("recordCommentGrid");	
                        cgrid.startup();
						console.debug("after save record number"+recordNumber)	
						dijit.byId("newCmntDialog_recordComments").hide();
					//
                }));
            },
            beforeActivate: function (previousView, data) {
			recordCommentArray = [];
			recordCmntsReqArray = [];
            },
            afterActivate: function (previousView, data) {
				
				recordNumber=data.recordId;
				recTitle=data.recordTitle;
				createTime=data.createdTime;
				createdUserId=data.crtdByUsrId;
				
				 console.debug(JSON.stringify(data));
			 var  recordNumTxtComp, effDateTxtComp, recordTitleTxtComp,
				
				recordNumTxtComp = dijit.byId("recordnum_Comments");
                recordNumTxtComp.set('value', data.recordId);
                recordNumTxtComp.set('disabled', true);

                effDateTxtComp = dijit.byId("effDate_Comments");
                effDateTxtComp.set('value', data.createdTime);
                effDateTxtComp.set('disabled', true);

                recordTitleTxtComp = dijit.byId("recordTitle_Comments");
                recordTitleTxtComp.set('value', decodeURIComponent(data.recordTitle));
                recordTitleTxtComp.set('disabled', true);
				recordCommentArray=[];
				recordCmntsReqArray=[];
				if(data.initialComments!= null && data.initialComments.length >0){
					recordCommentArray=data.initialComments;
				
				var cmntMemStore = new ObjectStore({
							objectStore : new Memory({
								data : recordCommentArray,
								idProperty : "recordCmntId"
							})
						});
					var cgrid;
					if(dijit.byId("commentsGrid")!=null){
        			    	cgrid=dijit.byId('commentsGrid');
							cgrid.setStore(null);
							cgrid.setStore(cmntMemStore);
        			    } else{
						 cgrid = new dojox.grid.EnhancedGrid({
        			        id: 'commentsGrid',
        			        store: cmntMemStore,
        			        structure: recordCommentsLayout,
        			        autoHeight: true,
        			      });	
                     	}
						cgrid.placeAt("recordCommentGrid");	
                        cgrid.startup();
				}
				
            }
        };
	});