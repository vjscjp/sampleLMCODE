//Predefined tokens
/*global define : true*/
/*global console : true*/
/*global setTimeout : true*/


/*global currentUserMemStore : true*/

//Variables which are global across the application
/*global hasUserFormRWAccess : true*/
/*global FORM_CREATE : true*/
/*global NAVIGATION_LINK_PATH : true*/
/*global FORM_VIEW_OR_EDIT : true*/
/*global deferredUserAccessDtls : true*/
/*global SM_USER : true*/

define(["dojo/on"],
        function (on) {
        "use strict";
        return {
            init: function () {

                on(this.btn_Form_CreateNav, "click", function (e) {
                    var transOpts = {
                        target : "formsCreate",
                        data : {
							type:'',
							path:'',
							hasUserFormRWAccess:''
						}
                    };
                    FRMS.transitionToView(e.target, transOpts);
                });
				
				on(this.btn_Form_ModifyNav, "click", function (e) {
                    var transOpts = {
                        target : "formsCreate",
                        data : {
							displaySearch:true,
							type:'',
							path:'',
							hasUserFormRWAccess:''
						}
                    };
                    FRMS.transitionToView(e.target, transOpts);
                });
            }

        };
    }
    );