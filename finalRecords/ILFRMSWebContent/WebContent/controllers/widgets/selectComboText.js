/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens
/*global define:true, dijit:true, alert:true,console:true, FRMS*/
define(["dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid", "dojo/_base/lang", "dojo/_base/array", "dojo/data/ObjectStore", "dojo/promise/all",
    "dojo/store/Memory", "dojo/store/Cache", 
        
    "dijit/registry", "dijit/form/Form", "dijit/form/Button", "dijit/Dialog", "dojox/form/CheckedMultiSelect",
        
    "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", 
    "dojo/text!/frmsadmin/controllers/widgets/templates/selectComboText.html",
    ], function (
        on, dom, EnhancedGrid, lang, array, ObjectStore, all, Memory, Cache, 
         registry, Form, Button, Dialog,  CheckedMultiSelect,
        declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin, template
    ){

        /* 
        //Widget requires reference data in order to set combo box select
        Creation Example: //
                var formStatesWidget = new selectComboText();
                formStatesWidget.placeAt(formStatesDiv);
                all({
                    stateMemStore: FRMS.deferredStateMemStore,
                }).then(function(results){
                    formStatesWidget.selCheckedMulti_ComboWidget.setStore(FRMS.loadedStores.stateMemStore);
                });
        // To use data you can use
            formStatesArray = formStatesWidget.selCheckedMulti_ComboWidget.get("value");
            stateList = formStatesArray.join(",");
        */
    
        return declare('app.selectComboText', [_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
	       
            postCreate: function(e) {
                var self = this;
                
                self.selCheckedMulti_ComboWidget.set("searchAttr", "targetDescription");
                self.selCheckedMulti_ComboWidget.set("labelAttr", "targetDescription");
                self.selCheckedMulti_ComboWidget.set("placeHolder", "--Select--");
                self.selCheckedMulti_ComboWidget.set("fetchProperties", FRMS.FrmsConstants.SORTOBJECT);
                
                // Loop over all options, find selected and add to the select list
                self.selCheckedMulti_ComboWidget.on("change", function () {
                    var listSet = '',sep = '';
 
                    array.forEach(this.options, function (option) {
                        if(option.selected === true){
                            if(option.item.sourceShortDescription){
                                console.log("Adding:", option.item.sourceShortDescription , "to", listSet);
                                listSet = listSet + option.item.sourceShortDescription + sep;
                            }else{
                                listSet = listSet + option.item.sourceDescription + sep;
                            }
                        }
                        sep = ", ";
                        self.textArea_ComboWidget.value = listSet;
                    });
                });
                
                

            }
            
            
            
        });

});