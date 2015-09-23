define([
	"dojo/dom","dojo/dom-construct","dojo/dom-style", "dojo/query",
	"dojo/on",
	
		
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!/common/widgets/templates/footer.html",
    
    "dojo/domReady!"
], function(
	dom, domConstruct, domStyle, query,
	on,
	
	declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin, template
) {

    return declare('app.Footer', [_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
	
        postCreate: 
		/**
		 * initialize footer
		 */
		function(e)
		{
        	// just load the footer
            var curYear = new Date().getFullYear();
            //this.cur_year.("test");
		}
		
	
		
    });
    
   
});