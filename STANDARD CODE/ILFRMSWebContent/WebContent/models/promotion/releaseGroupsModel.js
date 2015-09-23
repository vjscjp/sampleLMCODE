/**
 * This model will store data for the Release Group screen
 */
define(["dojo/store/Memory", "dojo/store/Observable"], function (Memory, Observable) {
    "use strict";

    var releaseGroupId,   
        versions = new Observable(new Memory({labelAttr: "name", data: [{id: "All", name: "All", statusName: "N/A"}]})),
        versionDocs = [],
        arrayToSave = [],
        invalidIds = [],
        nameChanged =false;

    return {
        setPassedData: function (data) {
            if (data) {
                if (data.id) {
                    // check for equality?
                    if (releaseGroupId === data.id) {
                        if (data.addedDocs) { 
                            this.addVersionDocs(releaseGroupId, data.versionId, data.addedDocs);
                        }
                    } else {
                        releaseGroupId = data.id;
                        // TODO need to reset everything
                    }
                }

            }
        },

        getReleaseGroupId: function () {
            return releaseGroupId;
        },

        addVersions: function (newVersions) {
            var i, currentVersion;
            for (i = 0; i < newVersions.length; i++) {
                currentVersion = {};
                currentVersion.name = "Version " + newVersions[i].groupVersionNum;
                currentVersion.id = newVersions[i].id;
                currentVersion.statusName = newVersions[i].statusName;
                currentVersion.createLastName = newVersions[i].createLastName;
                currentVersion.createFirstName = newVersions[i].createFirstName;
                this.addVersion(currentVersion);
            }
        },

        setVersions: function (newVersions) {
            versions = new Observable(new Memory({labelAttr: "name", data: [{id: "All", name: "All", statusName: "N/A"}]}));
            if (newVersions) {
                this.addVersions(newVersions);
            }
            return versions;
        },

        addVersion: function (currentVersion) {
            versions.add(currentVersion);
        },

        getVersions: function () {
            return versions;
        },

        getVersion: function (id) {
            return versions.get(id);
        },

        getVersionStatusName: function (id) {
            return versions.get(id).statusName;
        },

        getVersionLastModifiedBy: function (id) {
            var currentVersion, result = "";

            if ("All" !== id) {
                currentVersion = versions.get(id);
            } else {
                currentVersion = versions.data[versions.data.length - 1];
            }

            result = currentVersion.createLastName + ", " + currentVersion.createFirstName;
            return result;
        },

        setVersionDocs: function (groupId, versionId, docs) {
            if (releaseGroupId === groupId) {
                // TODO verify version already exists in versions
                versionDocs[versionId] = new Observable(new Memory({data: docs}));
                return versionDocs[versionId];
            } else {
                alert("Group Ids do not match!");
            }
        },

        getVersionDocs: function (groupId, versionId) {
            return versionDocs[versionId];
        },
        
        resetVersionDocs:function() {
            versionDocs = [];
        },
        
        getArrayToSave: function() {
        	return arrayToSave;
        },

        resetArrayToSave: function() {
        	 arrayToSave = [];
        },
 
        addVersionDocs: function (groupId, versionId, docs) {
            var i, recentVersion;

            if (releaseGroupId === groupId) {
                //recentVersion = versionDocs[versionDocs.length - 1];
                recentVersion = versionDocs[versionId];
                // TODO if recent version is not in pending status, need to create new version
                if (recentVersion) {
                    for (i = 0; i < docs.length; i++) {
                        recentVersion.add(docs[i]);
                        arrayToSave.push({id:docs[i].id,
						     orgnlDocId: docs[i].orgnlDocId });
                    }
                }
            } else {
                alert("Group Ids do not match!");
            }
        },
        
        removeVersionDocs: function (id, orgnlDocId, versionId) {
            var recentVersion, removeIndex; 
            if(versionId == null) {
               recentVersion = versionDocs[versionDocs.length - 1]; 
            } else {
               recentVersion = versionDocs[versionId]; 
            }
	           if (recentVersion) {
	                for (var i = 0; i < recentVersion.data.length; i++) {
	                	if(recentVersion.data[i].id === id &&  recentVersion.data[i].orgnlDocId === orgnlDocId) {	     
	                		removeIndex = i;                             
	                		break;
	                	} 
	                }
	                 if(removeIndex > -1) {
	                	 recentVersion.data.splice(removeIndex, 1);  
                         delete recentVersion.index[id];
                         //versionDocs[versionId] = recentVersion;
	                 }
	           } 
        },
        
        replaceVersionDocs: function (id, orgnlDocId, newId, versionId) {
            var recentVersion;
            recentVersion = versionDocs[versionId]; 
             if (recentVersion) {
	                for (var i = 0; i < recentVersion.data.length; i++) {
	                	if(recentVersion.data[i].id === id &&  recentVersion.data[i].orgnlDocId === orgnlDocId) {
                            recentVersion.data[i].id = newId;
	                		break;
	                	} 
	                }

                arrayToSave.push({id:newId,
						     orgnlDocId: orgnlDocId });
             }
            
        },
        
        setInvalidIds: function (invalIds) {
           invalidIds = invalIds;
            if(invalidIds.length == 0) {
                for(var i =0; i< invalIds.length; i++) {
                    invalidIds[i].add(invalIds[i]);
                }
            }
        },
    
        getInvalidIds: function() {
           return invalidIds;
        },
        
        resetInvalidIds: function() {
           invalidIds = [];
        },
        
        setNameChanged: function(value) {
           nameChanged = value;
        },
        
        getNameChanged: function() {
           return nameChanged;
        }
    };
});
