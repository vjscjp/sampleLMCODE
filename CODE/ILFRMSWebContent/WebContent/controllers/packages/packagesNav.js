define([ "dojo/dom", "dojo/on",	"dojo/_base/lang"], 
		function(dom, on, lang) {

	return {
		init: function() {

			var btnSearch = dom.byId("btnSearchPackages");
			on(btnSearch, "click", lang.hitch(this, function(e) {this.transitionTo(e, "packagesSearch");}));
			
			var btnSelect = dom.byId("btnSelectPackages");
			on(btnSelect, "click", lang.hitch(this, function(e) {this.transitionTo(e, "packagesSelect");}));
		},
		transitionTo: function(e, targetView) {
			var transOpts = {
					target : targetView,
					params : null
				};
			this.app.transitionToView(e.target, transOpts);		
		}		
	};
});