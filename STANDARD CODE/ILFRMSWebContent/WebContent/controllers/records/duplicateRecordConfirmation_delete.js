/*global define:true,dijit:true,dojo:true,alert:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang", "dojo/store/Cache"
    ], function (dom, on, lang, Cache) {
    "use strict";
    var recordToedit, fromJson, memRecords, cacheRecordsStore;
    return {
        beforeActivate: function (previousView, data) {
            dojo.byId("clas_duplicateRecordConfirmation").innerHTML = data.duplicateRec.classification;
            dojo.byId("sClas_duplicateRecordConfirmation").innerHTML = data.duplicateRec.subClassfication;
            dojo.byId("recId_duplicateRecordConfirmation").innerHTML = data.duplicateRec.recordNum;
            dojo.byId("recTit_duplicateRecordConfirmation").innerHTML = data.duplicateRec.recordTitle;
            recordToedit = data.duplicateRec.recordId;
            fromJson = data.duplicateRec.inputJson;
        },
        init: function () {
            memRecords = this.app.loadedStores.recordsMemory;
            cacheRecordsStore = new Cache(this.app.loadedStores.jsonRestRecords, memRecords);
            var locationHeader, xhrInput, result1,
                modify = dom.byId("modi_duplicateRecordConfirmation"),
                cancel = dom.byId("canc_duplicateRecordConfirmation"),
                SMUser = cacheRecordsStore.headers.SM_USER;
            on(modify, "click", lang.hitch(this, function (e) {
                xhrInput = {
                    url: cacheRecordsStore.target + recordToedit,
                    postData: JSON.stringify(fromJson),
                    handleAs: "json",
                    sync: true,
                    headers: lang.mixin({
                        "Content-Type": "application/json",
                        Accept: "application/javascript, application/json",
                        "SM_USER": SMUser
                        
                    })
                };
                result1 = dojo.xhrPut(xhrInput);
                if (result1.ioArgs.xhr.status === 201) {
                    locationHeader = result1.ioArgs.xhr.getResponseHeader("Location");
                    recordToedit = locationHeader.substring(locationHeader.lastIndexOf("/") + 1,
                        locationHeader.length);
                    this.transitionTo(e, "recordsViewModify");
                }
                //this.transitionTo(e, "recordsViewModify");
            }));
            on(cancel, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, "recordsViewModify");
            }));
        },
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                data: recordToedit
            };
            this.app.transitionToView(e.target, transOpts);
        }
    };
});
