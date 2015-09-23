define([
	"dojo/dom","dojo/dom-construct","dojo/dom-style", "dojo/query", "dojo/promise/all", "dojo/store/Memory",
	"dojo/on", "dojo/_base/declare", "dojo/_base/array",  "dojo/_base/lang",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin" , "controllers/widgets/functions.js"

    
], function(
	dom, domConstruct, domStyle, query, all, Memory,
	on, declare, array, lang,
    _WidgetBase, _TemplatedMixin, Functions
) {
	
	/**
	 * This is a list of helper functions
	 */
    var Function = new Functions(); // Functions.js helper Widget

	
	return declare('app.classSubClass',null,{
			createClassSubClass: function(inputs){
                var classID = inputs.classDom;
                var subclassID = inputs.subClassDom;
                
//                var classificationAdd = new , "dijit/form/FilteringSelect"({
//                    id: "classificationAdd",
//                    name: "classificationAdd",
//                    value: "",
//                    multiple:false, 
//                }, "selClassification_packageSearch"); 
                classftnObj = dijit.byId(classID);
                classftnObj.set("searchAttr", "name");
				classftnObj.set("placeHolder", "--Select--");
				classftnObj.set("required", true);
                var classMemoryStoreList = Function._getJsonRefDataMemoryStore({ memoryStore:clasftnMemStore});
                
//                var classificationAdd = new ComboBox({
//                    id: "classificationAdd",
//                    name: "classificationAdd",
//                    value: "",
//                    multiple:false, 
//                }, subclassID);
                subClassftnObj = dijit.byId(subclassID);
                subClassftnObj.set("searchAttr", "name");
				subClassftnObj.set("placeHolder", "--Select--");
                var subClassMemStoreList = Function._getJsonRefDataMemoryStore({ memoryStore:subClassMemStore});
                
                
                all({
                    classMemoryStoreList: classMemoryStoreList,
                    subClassMemStoreList: subClassMemStoreList
                }).then(function(results){
                    classftnObj.store.data = Function._createRefDataList(results.classMemoryStoreList);
                    subClassftnObj.store.data = Function._createRefDataList(results.subClassMemStoreList);
                });
                
                
                classftnObj.on("change",lang.hitch(this,function(selectedVal) {	
					if(selectedVal != null && selectedVal != ""  && typeof(selectedVal) !=="undefined"){
						
						subclassiftnResults = subClassMemStore.query({parentCode:selectedVal}); //.then(function(subclassiftnResults){
                        if (subclassiftnResults != null && typeof(subclassiftnResults) !== "undefined") {
                            subClsWRTClsStore = new Memory({
                                data:Function._createRefDataList(subclassiftnResults),
                                idProperty : 'targetCode'
                            });

                            subClassftnObj.store = subClsWRTClsStore;
                            subClassftnObj.set("searchAttr", "name");
                            subClassftnObj.set("value", "");
                            subClassftnObj.set("placeHolder", "--Select--");
                            //subClassftnObj.set("required", true); 
                        }else{
                            console.debug('There are no subclassifications for the selected classification..');
                        }
           
					}
				
				}));
                
                subClassftnObj.on("change",lang.hitch(this,function(selectedVal) {	
					if(selectedVal != null && selectedVal != ""  && typeof(selectedVal) !=="undefined"){
						classiftnResults = clasftnMemStore.query({sourceCode:selectedVal});
                         if (classiftnResults != null && typeof(classiftnResults) !== "undefined") {
                             dojo.forEach(classiftnResults, function(classiftnResult){
                                classftnObj.set("value", classiftnResult.sourceCode);
                             });
                         }
           
					}
				
				}));
                
            }
	});	
});