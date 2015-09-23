define([ "dijit/registry", "dojo/on", "dojo/_base/lang", "controllers/widgets/functions.js", "dijit/form/ValidationTextBox"],
        function (registry, on, lang, Functions) {
        "use strict";
        Function = new Functions();
    
        return {
            init: function () {
                var releaseTxt = registry.byId("txtReleaseGrpName_promotionCreate"),
                    saveBtn = registry.byId("btnSave_promotionCreate"),
                    cancelBtn = registry.byId("btnCancel_rpromotionCreate"),
                    releaseGroupsJsonRest = this.app.loadedStores.jsonRestRecords;

                releaseTxt.required = true;

                on(saveBtn, "click", lang.hitch(this, function (e) {this.saveReleaseGroup(e, "promotionInProgress"); }));
                on(cancelBtn, "click", lang.hitch(this, function (e) {this.transitionTo(e, "promotionCreate"); }));
            },

            beforeActivate: function () {
                var resetTxt = registry.byId("txtReleaseGrpName_promotionCreate");
                resetTxt.reset();
                resetTxt.focus();

                var saveBtn = registry.byId("btnSave_promotionCreate");
                if(!hasUserPromoteAccess) {
                    saveBtn.set("disabled", true); 
                } else {
                    saveBtn.set("disabled", false);
                }                 
            },

            transitionTo: function (e, targetView) { 
                this.app.transitionToView(e.target, {target: targetView});
            },

            saveReleaseGroup: function (e, targetView) {
                var validationTxt = registry.byId("txtReleaseGrpName_promotionCreate"),
                    saveBtnFocus = registry.byId("btnSave_promotionCreate"),
                    releaseGrpTxt = registry.byId("txtReleaseGrpName_promotionCreate"),
                    releaseGroupsJsonRest = this.app.loadedStores.releaseGroupsJsonRest, 
                    localApp = this.app,
                    obj = {};

                validationTxt.focus();
                validationTxt.validate();
                if (validationTxt.isValid()) {
                    var isValid = true;
                    obj.releaseGroupName = releaseGrpTxt.get("value"); 
                    
                    releaseGroupsJsonRest.target = "/frmsadminservice/api/v1/releasegroups";
                    Function._setJsonRestEndpoint(releaseGroupsJsonRest);
                    
                    releaseGroupsJsonRest.query().then(function (results) {
                        if(results && results.releaseGroups) {
                            var releaseGroups = results.releaseGroups;
                            for(var i =0; i<releaseGroups.length; i++) {
                                if(releaseGroups[i].groupName.toUpperCase() === releaseGrpTxt.get("value").toUpperCase()) {
                                    isValid = false;
                                    break;
                                } 
                            }
                        }
                        if(isValid) {
                            releaseGroupsJsonRest.add(obj).then(function (results) {
                                validationTxt.set("value", null);
                                validationTxt.reset();
                                localApp.transitionToView(e.target, {target: targetView});
                            }); 
                        } else {
                            var confDialog = Notice.showDialog({text:"The Release Group Name entered is already in use. Please select a different Release Group Name.", type: "warning"});  
                            confDialog.on("execute", function (dialogEvent) {});
                            validationTxt.focus();
                        }
                    }); 
                } else {
                    validationTxt.focus();       
                }
            }
        };
    });