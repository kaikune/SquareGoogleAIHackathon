var StoreProfile = (function() {
    var datasetId = "";

    var getDatasetId = function() {
        return localStorage.getItem("datasetId");   // pull this from cookie/localStorage
    };

    var setDatasetId = function(id) {
        datasetId = id;     
        // Also set this in cookie/localStorage
        localStorage.setItem("datasetId", id);
    };

    var logout = function() {
        datasetId = "" // reset dataset id
        localStorage.setItem("datasetId", "");
    };

    return {
        getDatasetId: getDatasetId,
        setDatasetId: setDatasetId,
        logout: logout
    }
})();

export default StoreProfile;