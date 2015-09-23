//Predefined tokens
/*global define, console, dijit, dojox, dojo, alert : true*/
//Custom Stores
/*global  cachePackagesStore: true*/
/**
 * This model will have all the operations related to form association to package.
 */
define(["dojo/store/Memory",  "controllers/widgets/functions.js", "dojo/promise/all",
    "dojo/_base/array", "dojo/date", "dojo/Deferred", "dojo/data/ObjectStore", "dojo/dom"],
    function (Memory, Functions, all, array, dojoDate, Deferred, ObjectStore, dom) {
        "use strict";
        var Function = new Functions();

        return {
            populateCmntDtlsInGrid : function (jsonRestCommentEndPoint, formId, formCmntGrid) {
				var tempCmntEndPointTarget = JSON.parse(JSON.stringify(jsonRestCommentEndPoint.target));
				Function._setJsonRestEndpointTable(jsonRestCommentEndPoint);
				formCmntGrid.setStore(null);
				console.debug('jsonRestCommentEndPoint.target::', jsonRestCommentEndPoint + "/" + formId + "/comments");
				var defferedObj = jsonRestCommentEndPoint
					.query("/" + formId + "/comments", {}).then(function (results) {
						if (results !== null) {
							var formCommentArray, formCmntMemStore;
							formCommentArray = results.comments;
							formCmntMemStore = new ObjectStore({
								objectStore : new Memory({
									data : formCommentArray,
									idProperty : "cmntId"
								})
							});
							formCmntGrid.setStore(formCmntMemStore);
							console.debug('Successful retrieval of form comments data..');
						} else {
							dom.byId("formCommentGridMsg_formComments").innerHTML = '<div style="color: green;"><b>' +
								'Request completed.No Previous comments found</b> </div>';
							formCmntGrid.setStore(null);
						}
					}, function (error) {
						console.error('Problem occured while fetching the comments.', error);
						switch (error.status) {
						case 404:
						case 406:
						case 415:
						case 500:
							formCmntGrid.setStore();
							dom.byId("formCommentGridMsg_formComments").innerHTML = '<div style="color: red;"><b>' +
								'Problem occured while fetching the comments.'
									+ '</b> </div>';
							break;
						default:
							formCmntGrid.setStore();
							dom.byId("formCommentGridMsg_formComments").innerHTML = '<div style="color: red;"><b>' +
								'Problem occured while fetching the comments.'
									+ '</b> </div>';
						}
					});
					jsonRestCommentEndPoint.target = tempCmntEndPointTarget;
			}
		};
	});
