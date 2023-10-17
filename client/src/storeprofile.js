var StoreProfile = (function () {
    var datasetId = '';
    var artifactOutputUri = '';
    var storeName = '';

    var getStoreName = function () {
        return localStorage.getItem('storeName');
    };

    var getDatasetId = function () {
        return localStorage.getItem('datasetId'); // pull this from cookie/localStorage
    };

    var getArtifactOutputUri = function () {
        return localStorage.getItem('artifactOutputUri');
    };

    var setDatasetId = function (id) {
        datasetId = id;
        // Also set this in cookie/localStorage
        localStorage.setItem('datasetId', id);
    };

    var setStoreName = function (name) {
        storeName = name;
        localStorage.setItem('storeName', name);
    };

    var setArtifactOutputUri = function (uri) {
        artifactOutputUri = uri;
        localStorage.setItem('artifactOutputUri', uri);
    };

    var logout = function () {
        datasetId = ''; // reset dataset id
        localStorage.setItem('datasetId', '');
        localStorage.setItem('storeName', '');
        localStorage.setItem('artifactOutputUri', '');
    };

    return {
        getDatasetId: getDatasetId,
        getStoreName: getStoreName,
        getArtifactOutputUri: getArtifactOutputUri,
        setDatasetId: setDatasetId,
        setStoreName: setStoreName,
        setArtifactOutputUri: setArtifactOutputUri,

        logout: logout,
    };
})();

export default StoreProfile;
