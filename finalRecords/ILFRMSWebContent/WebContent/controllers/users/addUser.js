/*global define:true,confirm:true,dijit:true,alert:true,console:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/store/Cache", "dojo/dom-form",
    "controllers/widgets/functions.js", "dojo/promise/all"
    ], function (dom, on, lang, registry, Cache, domForm, Functions, all) {
   // 'use strict';
    var cacheUserStore,
        Function = new Functions(); // Functions.js helper Widget
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                params: null
            };
            this.app.transitionToView(e.target, transOpts);
        },
        afterActivate: function (previousView, data) {
            dijit.byId("addUserForm_addUser").reset();
        },
        init: function () {
            var date, formattedStartDate, endDate, userJson, userDetails, addUserDetails, isFormValid, somethingHasChanged = false,
                formattedEndDate,
                addUsrSave = dom.byId("addUsrSave_addUser"),
                addUsrCancel = dom.byId("addUsrCancel_addUser"),
                transOpts = {
                    target: "users",
                    params: null
                },
                localApp = this.app; 
            
            on(addUsrSave, "click", lang.hitch(this, function (e) {
                isFormValid = dijit.byId("addUserForm_addUser").validate();
                if (!isFormValid) {
                    return;
                }
                date = new Date();
                formattedStartDate = Function.formatUTCDate(date);
                registry.byId("effectiveDateTime_addUser").set("value", formattedStartDate);
                endDate = new Date(9999, 11, 31);
                formattedEndDate = Function.formatUTCDate(endDate);
                registry.byId("endDateTime_addUser").set("value", formattedEndDate);
                userJson = domForm.toObject("addUserForm_addUser");
                if (userJson.formsWriteIndicator === "on") {
                    userJson.formsWriteIndicator = "1";
                } else {
                    userJson.formsWriteIndicator = "0";
                }
                if (userJson.recordsWriteIndicator === "on") {
                    userJson.recordsWriteIndicator = "1";
                } else {
                    userJson.recordsWriteIndicator = "0";
                }
                if (userJson.packagesWriteIndicator === "on") {
                    userJson.packagesWriteIndicator = "1";
                } else {
                    userJson.packagesWriteIndicator = "0";
                }
                if (userJson.frmsPromoteIndicator === "on") {
                    userJson.frmsPromoteIndicator = "1";
                } else {
                    userJson.frmsPromoteIndicator = "0";
                }
                if (userJson.userAdministratorIndicator === "on") {
                    userJson.userAdministratorIndicator = "1";
                } else {
                    userJson.userAdministratorIndicator = "0";
                }
                var activeUserDetails = Function._getJsonRestEndpoint(this.app.loadedStores.activeUserDetails);
                var nNumber = registry.byId("addNid_addUser"), isValid = true, regExp = /^n[0-9]{7}/;

                if(!nNumber.value.match(regExp)) {
                    var confDialog = Notice.showDialog({text:"Only alpha-numeric characters are allowed.", type: "warning"});  
                    confDialog.on("execute", function (dialogEvent) {});
                    nNumber.focus();
                } else {
                    activeUserDetails.query().then(function (results) {
                        if(results && results.usersList) {
                            var userList = results.usersList;
                            for(var i =0; i<userList.length; i++) {
                                if(userList[i].userIdentifier.toUpperCase() === nNumber.get("value").toUpperCase()) {
                                    isValid = false;
                                    break;
                                } 
                            }
                        }
                        if(isValid) {
                            userDetails = localApp.loadedStores.userMemory;
                            addUserDetails = Function._getJsonRestEndpoint(localApp.loadedStores.jsonUserDetails);
                            cacheUserStore = new Cache(addUserDetails, userDetails);

                            addUserDetails.add(userJson).then(function (result) {
                            if (result.frmsSrvcStatusCd === "SUCCESSFUL_CREATION_OR_UPDATION") {
                                localApp.transitionToView(e.target, transOpts);
                            }
                            }, function (error) {
                                Function.handleError(error);
                            }); 
                            
                        } else {
                            var confDialog = Notice.showDialog({text:"A profile for this User already exists.", type: "warning"});  
                            confDialog.on("execute", function (dialogEvent) {});
                            nNumber.focus();
                        }
                    }); 
                }
            }));
            
            on(dijit.byId("addUserForm_addUser"), "input:change", function(evt){
                console.log("Clicked on node ", evt, " in form row ", this.value);
                somethingHasChanged = true;
            });
            
            on(addUsrCancel, "click", lang.hitch(this, function (e) { 
                if( somethingHasChanged ){ 
                    var confDialog = Notice.showConfirmDialog({text:"You have unsaved changes. <br>Do you wish to discard your unsaved changes?", type: "warning", okBtnText:"Discard"}); 
                    confDialog.on("execute", function (dialogEvent) {
                        localApp.transitionToView(e.target, transOpts);
                    });
                }else{
                    localApp.transitionToView(e.target, transOpts);
                }
                
            }));
        }
    };
});
