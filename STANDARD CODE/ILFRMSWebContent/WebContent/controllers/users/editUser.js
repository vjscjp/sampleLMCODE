/*global define:true,confirm:true,dijit:true,alert:true,dojo:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dijit/registry", "dojo/store/Cache", "dojo/dom-form",
        "controllers/widgets/functions.js", "dojo/promise/all", "dijit/ConfirmDialog"], function (dom,
    on, lang, registry, Cache, domForm, Functions, all, ConfirmDialog) {
    'use strict';
    var userIdentifier, originalIdentifer, cacheActiveUserStore, cacheUserStore, isUserAdmin, isTwoAdminUsers, somethingHasChanged = false,
        Function = new Functions();

    function formatLocalDate(date) {
        var now = date,
            tzo = -now.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now
            .getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + dif + pad(tzo /
            60) + ':' + pad(tzo % 60);
    }
    return {
        afterActivate: function (previousView, data) {
            var formsWrite, recordWrite, packagesWrite, frmsPromote, userAdmin, evt;
            //evt = data.editUser.userDetails;
            //isTwoAdminUsers = data.editUser.isTwoAdminUsers;
            isTwoAdminUsers = this.params.isTwoAdminUsers;
            
            cacheUsersStore.query(this.params.id).then(function(results) {
                evt = results.user;
                originalIdentifer = evt.identifier;
                registry.byId("nid_editUser").set("value", evt.userIdentifier);
                registry.byId("lastName_editUser").set("value", evt.userLastName);
                registry.byId("firstName_editUser").set("value", evt.userFirstName);
                formsWrite = evt.formsWriteIndicator;
                if (formsWrite === '1') {
                    registry.byId("editFrmWrite_editUser").set("checked", true);
                } else {
                    registry.byId("editFrmWrite_editUser").set("checked", false);
                }
                recordWrite = evt.recordsWriteIndicator;
                if (recordWrite === '1') {
                    registry.byId("editRecWrite_editUser").set("checked", true);
                } else {
                    registry.byId("editRecWrite_editUser").set("checked", false);
                }
                packagesWrite = evt.packagesWriteIndicator;
                if (packagesWrite === '1') {
                    registry.byId("editPackWrite_editUser").set("checked", true);
                } else {
                    registry.byId("editPackWrite_editUser").set("checked", false);
                }
                frmsPromote = evt.frmsPromoteIndicator;
                if (frmsPromote === '1') {
                    registry.byId("editFrmsPrmo_editUser").set("checked", true);
                } else {
                    registry.byId("editFrmsPrmo_editUser").set("checked", false);
                }
                userAdmin = evt.userAdministratorIndicator;
                if (userAdmin === '1') {
                    registry.byId("editUserAdmin_editUser").set("checked", true);
                    isUserAdmin = 1;
                } else {
                    registry.byId("editUserAdmin_editUser").set("checked", false);
                }
            }, function(error){
				Function.handleError(error);
			});
            
        },
        init: function () {
            var save = registry.byId("save_editUser"),
                cancel = dom.byId("cancel_editUser"),
                archive = registry.byId("archive_editUser"),
                transOpts = {
                    target: "users",
                    params: null
                },
                localApp = this.app;
            
               if(!hasUserAdminstrationAccess) {
                    save.set("disabled", true); 
                    archive.set("disabled", true); 
                } else {
                    save.set("disabled", false);
                    archive.set("disabled", false); 
                } 

            on(save, "click", lang.hitch(this, function (e) {
                var isFormValid, date, formattedStartDate, endDate, formattedEndDate, userJson, currentAdminStatus,
                    userDetails;
 
                var nNumber = registry.byId("nid_editUser"),  regExp = /^n[0-9]{7}/;
                currentAdminStatus = registry.byId("editUserAdmin_editUser").checked;
                
                isFormValid = dijit.byId("editUserForm_editUser").validate(); 
                if (!isFormValid) {
                    return;
                } else if(!nNumber.value.match(regExp)) {
                    var confDialog = Notice.showDialog({text:"Only alpha-numeric characters are allowed.", type: "warning"});  
                    confDialog.on("execute", function (dialogEvent) {});
                    nNumber.focus(); 
                    return;
                } else if (isTwoAdminUsers === false && currentAdminStatus === false) {
                     var confDialog = Notice.showDialog({text:"Two active users must have User Administrator permission.  <p> Add User Administrator permission to another user prior to removing the permission from this user.</p> ", type: "warning"});  
                     confDialog.on("execute", function (dialogEvent) {});
                    return;
                }
                
               
                date = new Date();
                //formattedStartDate = formatLocalDate(date);
                formattedStartDate = Function.formatUTCDate(date);                
                registry.byId("editEffectiveDateTime_editUser").set("value", formattedStartDate);
                endDate = new Date(9999, 11, 31);
                //formattedEndDate = formatLocalDate(endDate);
                formattedEndDate = Function.formatUTCDate(endDate);                
                registry.byId("editEndDateTime_editUser").set("value", formattedEndDate);
                userJson = domForm.toObject("editUserForm_editUser");
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
                userDetails = this.app.loadedStores.userMemory;
                var editUserDetails = Function._getJsonRestEndpoint(this.app.loadedStores.activeUserDetails);                
                var deffereObj = editUserDetails.put(userJson, {
                    id: originalIdentifer
                }) 
                all({deffereObj:deffereObj}).then(function (results) {
                        var tempResults = results.deffereObj;                      
                        if (tempResults && tempResults.frmsSrvcStatusCd === "SUCCESSFUL_CREATION_OR_UPDATION") {
                            localApp.transitionToView(e.target, transOpts);
                        }
                    
                    }, function (err) {
                        switch (err.response.status) {
                            case 409:
                            var confDialog = Notice.showDialog({text:"This is a duplicate entry.  Please modify your request.", type: "warning"});                             confDialog.on("execute", function (dialogEvent) {});
                            break; 
                        }

                    }); 
 
            }));
            on(dijit.byId("editUserForm_editUser"), "input:change", function(evt){
                somethingHasChanged = true;
            });
            
            on(cancel, "click", lang.hitch(this, function (e) { 
                if( somethingHasChanged ){ 
                    var confDialog = Notice.showConfirmDialog({text:"You have unsaved changes. <br>Do you wish to discard your unsaved changes?", type: "warning", okBtnText:"Discard"}); 
                    confDialog.on("execute", function (dialogEvent) {
                        localApp.transitionToView(e.target, transOpts);
                    });
                }else{
                    localApp.transitionToView(e.target, transOpts);
                }
                
            }));
            on(archive, "click", lang.hitch(this, function (e) {
                var retval, archiveUserDetails, userDetails;
                if (isTwoAdminUsers === false && isUserAdmin === 1) {
                    var confDialog = Notice.showDialog({text:"Two Administrators must be active in the system. <p> First add User Administrator permission to another user prior to Archiving this user.</p> ", type: "warning"});       
                    confDialog.on("execute", function (dialogEvent) {});
                    return;
                }
                
                var confDialog = Notice.showConfirmDialog({text:"This will archive this user. Please confirm this user should be archived.", type: "warning", okBtnText:"Confirm"});       
                confDialog.on("execute", function (dialogEvent) {
                    userDetails = localApp.loadedStores.userMemory;
                    archiveUserDetails = Function._getJsonRestEndpoint(localApp.loadedStores.activeUserDetails);
                    cacheUserStore = new Cache(archiveUserDetails, userDetails);
                    cacheUserStore.remove(originalIdentifer).then(function () {
                        localApp.transitionToView(e.target, transOpts);
                    });
                  });
 
            }));
        }
    };
});
