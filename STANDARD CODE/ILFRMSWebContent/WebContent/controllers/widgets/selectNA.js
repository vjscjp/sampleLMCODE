/* jshint undef: true, unused: vars, strict: false, eqeqeq:false, browser:true, devel:true, dojo:true, jquery:true, eqnull:true, white:false */
//Predefined tokens

define(["dojo/on", "dojo/dom", "dojox/grid/EnhancedGrid", "dojo/_base/lang", "dojo/_base/array", "dojo/data/ObjectStore", "dojo/promise/all",
    "dojo/store/Memory", "dojo/store/Cache", 
        
    "dijit/registry", "dijit/form/Form", "dijit/form/Button", "dijit/Dialog", "dojox/form/CheckedMultiSelect",
        
    "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_OnDijitClickMixin", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", 
    "dojo/text!/frmsadmin/controllers/widgets/templates/selectNA.html",
    ], function (
        on, dom, EnhancedGrid, lang, array, ObjectStore, all, Memory, Cache, 
         registry, Form, Button, Dialog,  CheckedMultiSelect,
        declare, _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin, template
    ){

        /* 
        //Widget requires reference data in order to set combo box select
        Creation Example: //
                nppiPCI = new selectNA();
                nppiPCI.placeAt(nppiPciWidgetDiv);
                
                all({
                    deferredsecLvlCdJsonStore: FRMS.deferredsecLvlCdJsonStore // deferredsecLvlCdJsonStore used to create NPPI
                }).then(function(results){
                    nppiPCI.combo_selectNA.setStore(FRMS.loadedStores.nppiPciDesnMemStore);
                });
        // To use data you can use
            nppiArray = nppiPCI.combo_selectNA.get("value");
            nppiList = nppiArray.join(",");
        */
    
        return declare('app.selectComboText', [_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
	           
            postCreate: function(e) {
                var self = this, prevSelected = [], nppiPciDesnComp;
                nppiPciDesnComp = self.combo_selectNA;
                
                nppiPciDesnComp.set("labelAttr", "label");
                nppiPciDesnComp.set("required", true); 
//                
                
                

            
                on(nppiPciDesnComp, "change", function(selectedOptionValues){ 

                        var nppiOptions = nppiPciDesnComp.getOptions();
                        if (nppiPciDesnComp.store && nppiPciDesnComp.store.data){

                            // now it has n/a newly selected
                            if (selectedOptionValues.indexOf('N/A') != -1 && prevSelected.indexOf('N/A') == -1) {
                                array.forEach(nppiOptions,function(option, index){
                                    if(option.value != 'N/A') {
                                        nppiPciDesnComp.set('_onChangeActive', false);
                                        option.selected = false;
                                        nppiPciDesnComp._updateSelection();
                                        nppiPciDesnComp.set('_onChangeActive', true);
                                    }

                                });

                            }
                            // now it  n/a diselected
                            if (prevSelected.indexOf('N/A') != -1 && selectedOptionValues.indexOf('N/A') != -1){ // if (prevSelected.indexOf('N/A') != -1 && selectedOptionValues.indexOf('N/A') != -1) {
                                array.forEach(nppiOptions,function(option){
                                    if(option.value == 'N/A') {


                                        nppiPciDesnComp.set('_onChangeActive', false);
                                        option.selected = false;
                                        nppiPciDesnComp._updateSelection();
                                        nppiPciDesnComp.set('_onChangeActive', true);

                                        prevSelected = [];
                                    }
                                });
                            }

                            prevSelected = selectedOptionValues;   
                        }
                });
            }
            
            
        });

});