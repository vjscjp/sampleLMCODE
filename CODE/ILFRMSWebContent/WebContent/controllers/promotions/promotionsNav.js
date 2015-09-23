define([ "dojo/dom", "dojo/on", "dojo/_base/lang"],
    function (dom, on, lang) {
        "use strict";
        return {
            init: function () {
                var create = dom.byId("btnCreateRelease"),
                    inProgress = dom.byId("btnInProgressReleases"),
                    production = dom.byId("btnProductionReleases"),
                    canceled = dom.byId("btnCanceledReleases");

                on(create, "click", lang.hitch(this, function (e) {this.transitionTo(e, "promotionCreate"); }));
                on(inProgress, "click", lang.hitch(this, function (e) {this.transitionTo(e, "promotionInProgress"); }));
                on(production, "click", lang.hitch(this, function (e) {this.transitionTo(e, "promotionProduction"); }));
                on(canceled, "click", lang.hitch(this, function (e) {this.transitionTo(e, "promotionCanceled"); }));
            },
            transitionTo: function (e, targetView) {
                var transOpts = {
                        target : targetView,
                        params : null,
                        data : "from trasnOpts"
                    };
                this.app.transitionToView(e.target, transOpts);
            }
        };
    });