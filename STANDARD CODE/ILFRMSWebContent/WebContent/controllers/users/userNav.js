/*global define:true,confirm:true,dijit:true,alert:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang"], function (dom, on, lang) {
    'use strict';
    return {
        transitionTo: function (e, targetView) {
            var transOpts = {
                target: targetView,
                params: null
            };
            this.app.transitionToView(e.target, transOpts);
        },
        init: function () {
            var usrHome = dom.byId("usrHome_usersNav");
            on(usrHome, "click", lang.hitch(this, function (e) {
                this.transitionTo(e, "users");
            }));
        }
    };
});
