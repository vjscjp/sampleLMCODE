//Predefined tokens
/*global define, console, dijit, dojox, dojo, alert : true*/

/**
 * This model will have all the operations related to form association to package.
 */
define(["dojo/Stateful","dojo/domReady!"],
    function (Stateful) {
        "use strict";
			
		var DocumentInstance =function(){
			this.frmRecNum='';
			this.frmRvnDt='';
			this.recIdxNum='';
			this.docTitl='';
			this.docDesc='';
			this.classtnCd='';
			this.subclasstnCd='';
			this.busFncCd='';
			this.frmTypeCd='';
			this.cntntTypeCd='';
			this.secLvlCd='';
			this.timingReqrmntCd='';
			this.dtTypeCd='';
			this.lunarDocTypeCd='';
			this.docUsageInu='';
			this.pgCntNum='';
			this.rtrnToHomeOffcInd='0';
			this.trnslInd='1';
			this.logoInd='0';
			this.ofeSigInd='1';
			this.docTypeCd='';
			this.extlRecInd='';
			this.promoInd='0';
			this.docGntImplnDt=null;
			this.promoImplnDt=null;
			this.docFrmUseDt=null;
		};
		
        return {
			
			createDocumentInsance:function(){
				return new DocumentInstance();
			},
			
			createFormModel:function(document){
				if(!document){
					//if null create new
					document = this.createDocumentInsance();
				}
				//console.log(form);
				return new Stateful({
					document:new Stateful(document),
					comment:'',
					documentValues:{}
				});
			},		
			// modal validation
			isDocValidForSave:function(document){
				var validFlag=false;
				var fldConfig = this.getFormFieldConfig();
				return validFlag;
			},			
			getFormFieldConfig:function(){
				var frmsConstants =FRMS.FrmsConstants.constants;
				var alphaNumericPattern =FRMS.SharedUtils.getAlphaNumericPattern();
				//TODO Move to constants
				var numericPattern = '^[0-9]*$';
				
				//custom validation logic goes here
				var validateFn=function(){
					console.log(this);
					return false;
				};
				return {
					// forms Search fields				
					frmRecNumSrch:{
						properties:{
							required:true,
							pattern:alphaNumericPattern,
							maxLength:100,
						}
					},
					frmRvnDtSrch:{
						properties:{
							required:false,
							placeholder:frmsConstants.DT_FMT_SHORT,
							maxLength:5
						}
					},
					// form view fields
					frmRecNum:{
						reqForShell:true,
						reqForPromotion:true,
						properties:{
							pattern:alphaNumericPattern,
							maxLength:100,
						}
					},
					classtnCd:{
						reqForShell:true,
						reqForPromotion:true
					},
					docTitl:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							pattern:alphaNumericPattern,
							maxLength:100
						}
					},
					frmRvnDt:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							placeholder:frmsConstants.DT_FMT_SHORT,
							maxLength:5
						}
					},
					subclasstnCd:{
						reqForShell:true,
						reqForPromotion:true,
					},
					docUsageInu:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							pattern:alphaNumericPattern,
							maxLength:100,
							style:'height:30px;width:242px;',
							rows:4,
							cols:34,
							isValid:validateFn
						}
					},
					docDesc:{
						reqForShell:false,
						reqForPromotion:true,
						properties:{
							pattern:alphaNumericPattern,
							maxLength:30,
							style:'height:30px;width:242px;',
							rows:2,
							cols:34,
						}
					},
					frmTypeCd:{
						reqForShell:true,
						reqForPromotion:true
					},
					lunarDocTypeCd:{
						reqForShell:false,
						reqForPromotion:false
					},
					busFncCd:{
						reqForShell:false,
						reqForPromotion:false
					},
					pgCntNum:{
						reqForShell:false,
						reqForPromotion:true,
						properties:{
							pattern:numericPattern,
							maxLength:4
						}
					},
					secLvlCd:{
						reqForShell:false,
						reqForPromotion:true
					},
					logoInd:{
						reqForShell:false,
						reqForPromotion:true,
						customMapping:{
							converter:FRMS.FrmsUtils.ZeroOneConverter,
							mappingAttr:'checked'
						},
						properties:{
							isValid:validateFn
						}
					},
					trnslInd:{
						reqForShell:false,
						reqForPromotion:true,
						customMapping:{
							converter:FRMS.FrmsUtils.ZeroOneConverter,
							mappingAttr:'checked'
						},
						properties:{
							isValid:validateFn
						}
					},
					timingReqrmntCd:{
						reqForShell:false,
						reqForPromotion:true
					},
					cntntTypeCd:{
						reqForShell:false,
						reqForPromotion:true
					},
					ofeSigInd:{
						reqForShell:false,
						reqForPromotion:true,
						customMapping:{
							converter:FRMS.FrmsUtils.ZeroOneConverter,
							mappingAttr:'checked'
						},
						properties:{
							isValid:validateFn
						}
					},
					rtrnToHomeOffcInd:{
						reqForShell:false,
						reqForPromotion:true,
						customMapping:{
							converter:FRMS.FrmsUtils.ZeroOneConverter,
							mappingAttr:'checked'
						},
						properties:{
							isValid:validateFn
						}
					},
					formTimCd:{
						reqForShell:false,
						reqForPromotion:true
					},
					promoImplnDt:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							placeholder:frmsConstants.DT_FMT_LONG
						}
					},
					docGntImplnDt:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							placeholder:frmsConstants.DT_FMT_LONG
						}
					},
					cmntTxt:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							pattern:alphaNumericPattern,
							maxLength:1000,
							style:'height:30px;width:242px;',
							rows:2,
							cols:34,
							isValid:validateFn
						}

					},
					docFrmUseDt:{
						reqForShell:false,
						reqForPromotion:false,
						properties:{
							placeholder:frmsConstants.DT_FMT_LONG
						}
					},
					promoInd:{
						reqForShell:false,
						reqForPromotion:false,
						customMapping:{
							converter:FRMS.FrmsUtils.ZeroOneConverter,
							mappingAttr:'checked'
						},
						properties:{
							isValid:validateFn
						}
					},
					extlRecInd:{
						reqForShell:false,
						reqForPromotion:true,
						properties:{
							disabled:true,
							maxLength:10
						}
					}					
					
				};
			}
        };
    });