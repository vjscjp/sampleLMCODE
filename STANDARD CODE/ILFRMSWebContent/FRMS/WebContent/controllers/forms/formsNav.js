//Predefined tokens
/*global define : true*/
/*global console : true*/
/*global setTimeout : true*/


/*global currentUserMemStore : true*/

//Variables which are global across the application
/*global hasUserFormRWAccess : true*/
/*global FORM_CREATE : true*/
/*global NAVIGATION_LINK_PATH : true*/
/*global FORM_VIEW_OR_EDIT : true*/
/*global deferredUserAccessDtls : true*/
/*global SM_USER : true*/

define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dojo/dom-style", "controllers/widgets/functions.js", "dojo/promise/all",
        "dojo/Deferred"],
        function (dom, on, lang, domStyle, Functions, all, Deferred) {
        "use strict";
        // Functions.js helper Widget
        var Function = new Functions(), userDetails  = null, count = 0, localApp, create, search;
        return {
            init: function () {
                var currentUserJsonRestObj;
                localApp = this.app;
                create = dom.byId("btn_Form_CreateNav");
                search = dom.byId("btn_Form_SearchNav");
               //Current user memory (logged in user) store
               /* currentUserMemStore = localApp.loadedStores.currentUserMemory;
                currentUserJsonRestObj = localApp.loadedStores.jsonUserDetails;
                Function._setJsonRestEndpoint(currentUserJsonRestObj);

                currentUserJsonRestObj.query('currentuser', {}).then(function (userResponse) {
                    userDetails = userResponse.user;
                    currentUserMemStore.setData(userDetails);
                    if (userDetails.formsWriteIndicator !== '1') {
                        domStyle.set(create, 'display', 'none');
                    }
                }, function (error) {
                    if (error.status === 500 || error.status === 404) {
                        console.error('Error in retreving the user details data..');
                    }
                });
                console.debug('Tryin to get the user details..');*/
                
                if (deferredUserAccessDtls) {
                	all({deferredUserAccessDtls : deferredUserAccessDtls}).then(function (results) {
                		currentUserMemStore = results.deferredUserAccessDtls;
                		SM_USER = currentUserMemStore.data.userIdentifier;
                		console.debug('SM_USER-->', SM_USER);
                		hasUserFormRWAccess = currentUserMemStore.data.formsWriteIndicator === "1";
                        hasUserRecordWriteAccess=currentUserMemStore.data.recordsWriteIndicator === "1";
                        hasUserPkgWriteAccess=currentUserMemStore.data.packagesWriteIndicator === "1";                        
                        hasUserPromoteAccess = currentUserMemStore.data.frmsPromoteIndicator === "1";
                        hasUserAdminstrationAccess=currentUserMemStore.data.userAdministratorIndicator === "1";
                		if (!hasUserFormRWAccess) {
                            domStyle.set(create, 'display', 'none');
                        }
                        hasUserPromoteAccess = currentUserMemStore.data.frmsPromoteIndicator === "1";
                		console.debug('Received Current User Details..');
                	});
                }
                
            },
            beforeActivate: function (previousView, data) {
                
            },
            afterActivate: function (previousView, data) {

                on(create, "click", lang.hitch(this, function (e) {
                    var data = {}, type = {}, path = {}, transOpts;
                    data.type = FORM_CREATE;
                    data.path = NAVIGATION_LINK_PATH;
                    data.hasUserFormRWAccess = hasUserFormRWAccess;
                    transOpts = {
                        target : "formsCreate",
                        data : data
                    };
                    localApp.transitionToView(e.target, transOpts);
                    data = {};
                }));


                on(search, "click", lang.hitch(this, function (e) {
                    var data = {}, type = {}, path = {}, transOpts;
                    data.type = FORM_VIEW_OR_EDIT;
                    data.path = NAVIGATION_LINK_PATH;
                    data.hasUserFormRWAccess = hasUserFormRWAccess;
                    transOpts = {
                        target : "formsSearch",
                        data : data
                    };
                    localApp.transitionToView(e.target, transOpts);
                    data = {};
                }));
            }

        };
    }
    );