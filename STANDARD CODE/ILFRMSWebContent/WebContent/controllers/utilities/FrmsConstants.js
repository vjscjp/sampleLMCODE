define(["dojo/_base/declare", "dojo/_base/lang", "dojo/data/ObjectStore", "dojo/store/Memory"], function(declare, lang, ObjectStore, Memory){
	return declare(null, {
		
		name : "FrmsConstants",
		
		constructor: function(){
			
			console.debug("Frms Constants constructor "); 
		},
		
		constants : {
			
			//Global custom objects
			
			EMPTY_STORE : new ObjectStore({objectStore : new Memory({ data : []})}),
			SORT_OBJECT : { sort: [{attribute:"targetDescription",descending: false}]},
			ERROR_STYLE_CLASS : {color: "red", fontWeight: "bold", fontStyle: "italic"},
            ERROR_BTN_STYLE_CLASS : {color: "red", fontWeight: "bold"},
			
			//Routing constants
			
			FROM_CRT_OR_UPDT_FORM_TO_SEARCH : "FROM_CRTUPT_FORM_TO_SEARCH", 
            NAVIGATION_LINK_PATH : "FROM_NAV_LINK", 
            FORM_CREATE : "FORM_CREATE", 
			FORM_VIEW_OR_EDIT : "FORM_VIEW_OR_EDIT",
            PATH_FROM_PROD_TO_CRTORUPDTFORM : "FROM_PRODUCT_SCREEN", 
            PATH_FROM_CMNT_TO_CRTORUPDTFORM : "FROM_COMMENT_SCREEN",
            FROM_HISTSCRN_TO_FORMCRTORUPD : "FROM_HISTSCRN_TO_FORMCRTORUPD",
			FROM_SEARCH_ROW_TO_FORM_CRT_EDT : 'FROM_SEARCH_ROW_TO_FORM_CRT_EDT',
			FROM_TEMPLATE_TO_FORM_CRT_EDT : 'FROM_TEMPLATE_TO_FORM_CRT_EDT',
			RECORD_VIEW_MODIFY_TO_HISTORY : "RECORD_VIEW_MODIFY_TO_HISTORY",
			NOT_APPLICABLE : "N/A",
            
			//Document form type codes
			
            FILED_CD : "1043400001", 
            NON_FILED_CD : "1043400002", 
            ADMIN_CD : "1043400003", 
            CORRESPONDENCE_CD : "1043400004",
            
            //This may be commented out
            
            HAS_USER_FORM_W_ACCESS : true,
            HAS_USER_PROMOTE_ACCESS : false,
            HAS_USER_RECORD_W_ACCESS : false,    
            HAS_USER_PKG_W_ACCESS : false, 
            HAS_USER_ADMIN_ACCESS : false,
            TIMEOUT : 30000,
			
			//Display messages
            
			REQUIRED_FIELDS_MISSING : "Required fields are missing.",
			SUCCESS_FORM_CMNT_SAVE : "Form comments are successfully saved.",
			EXCEPTION_IN_CMNT_SAVE : "Problem while saving  form comments.",
			NO_CMNTS_CRTD : "No Comments for the created form.",
			SUCCESS : 'success', 
			FAILURE : 'failure', 
			SUCCESS_FORM_DTLS_CRT : "Form created successfully.", 
			EXCEPTION_IN_FORM_DTLS_CRT : "Problem in Form create.", 
			SUCCESSFUL_FORM_UPDT : "Form updated successfully.",
			EXCEPTION_IN_FORM_UPDT : "Problem in Form update.",
			//NO_DETLS_FOR_CORM_CRT_OR_UPDT : "No details for form create or update. ",
			CONTACT_SYS_ADMIN : "Please contact the system administrator.",
			SUCCESS_IN_FETCHING_FORM_DTLS : "Successfully retrieved form details.",
			EXCEPTION_IN_FETCHING_FORM_DTLS : "Problem while fetching the form details.",
			MINIMUM_DATA_REQUIRED  : "The minimum data required to save this  form has not been entered.",
			REQUIRED_DATA_NOT_ENTERED : "Required data has not been entered.",
			ALERT_FOR_UNSAVED_CHANGES : "You have unsaved changes. <br>Do you wish to discard your unsaved changes?",
			FORM_SEARCH_SUCCESS_RESULTS : "Successful retrieval of forms for given search criteria.",
			SUCCESS_IN_DELETE_FORM_TEMPLATE : "Success in deleting the selected form template.",
			FAILURE_IN_DELETE_FORM_TEMPLATE : "Error in deleting the selected form template.",
			SUCCESS_UPLOAD_TEMPLATE : "Success in saving uploaded templates..",
			FAILURE_UPLOAD_TEMPLATE : "Error in saving uploaded templates.",
			OVERLAP_ALERT : "Multiple versions of the same Form would be in effect at the same time, please review.",
			OVERLAP_FORM_SAVE_SUCCESS : "Overlapped forms are created successfully.",
			OVERLAP_FORM_SAVE_FAILURE : "Error while saving Overlapped forms.",
			RECORD_SAVE_SUCCESS : "Record got successfully saved ",
			RECORD_SAVE_FAILURE : "Error while saving record.",
			RECORD_UPDATE_SUCCESS_SAVE_COMMENTS : "Comments are saved successfully.",
			RECORD_UPDATE_FAILURE_SAVE_COMMENTS : "Comments are saved successfully.",
			RECORD_SUCCESS_SAVE_COMMENTS : "with comments.",
			RECORD_FAILURE_SAVE_COMMENTS : "with out comments.",
			RECORD_MODIFY_SUCCES : "Successfully saved the modified record details.",
			RECORD_MODIFY_FAILURE : "Error in saving modified record details.",
			RECORD_FETCH_FAILURE : "Exception while fetching the record details.",
			RECORD_FETCH_SUCCESS : "Successfully retrieved the record details.",
			RECORD_SEARCH_SUCCESS : "Successfully retrieved the records based on the search criteria.",
			RECORD_SEARCH_FAILURE : "Error in retrieving the records based on the search criteria.",
			DUPLICATE_REC_FETCH_FAILURE : "Exception while fetching the duplicate record results.",
			PREVIOUS_HISTORY_RETRIEVAL_FAILURE : "Problem while fetching form history details.",
			PREVIOUS_HISTORY_RETRIEVAL_SUCCESS  : "Retrieved previous history successfully",
			NO_PREVIOUS_HISTORY : "Request completed.No Previous history found",
			FORM_ASSOCIATION_TO_PACKAGE_ALERT : "The new form has been added to the selected package(s). <br>The form order can be modified in the Create/Modify Package screen.",
			FORM_ASSOCIATION_OUTSIDE_RANGE_ALERT : "Association Effective Date or Association Expiration Date entered falls outside of the range of the Package Effective Date or Package Expiration Date",
			FORM_TEMPLATE_DELETE_ALERT : "Are you sure you want to delete this form template?",
			
			//Common Screen Labels
			DISMISS : "Dismiss",
			SAVE : "Save",
			DISCARD : "Discard",
			CANCEL : "Cancel",
			MODIFY_EXISTING : "Modify Existing",
			CREATE_RECORD_DISPLAY_MSG : "Create Record",
			VIEW_MODIFY_RECORD_DISPLAY_MSG : "View/Modify Record",
			CREATE_FORM_DISPLAY_MSG : "Create Forms Rule",
			VIEW_MODIFY_FORM_DISPLAY_MSG : "View/Modify Forms Rule",
            
            SORTOBJECT : { sort: [{attribute:"targetDescription",descending: false}], },
			//Forms - PUGA Begin
			CREATE_FORM_TITLE:'Create Form',
			MODIFY_FORM_TITLE:'View/Modify Form',
			DT_FMT_LONG:'mm/dd/yyyy',
			DT_FMT_SHORT:'mm/yy',
			
			//Forms - PUGA End
		},
		getConstantValue : function(cname){
			if(typeof cname == "undefined"){
				console.debug("Invoking the constants...");
				// Copy of our protected object
				return lang.clone(this.constants);
			}else{
				// Value of a particular thing            
				if(this.constants.hasOwnProperty(cname)){
					return this.constants[cname];
				}else{
					throw "Constant '" + cname + "' does not exist.";
				}
			}
		}
				
	});
});
