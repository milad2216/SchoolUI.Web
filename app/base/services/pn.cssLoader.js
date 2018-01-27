define(['angularAMD'], function (app) {
    app.factory("pn.cssLoader", function () {
        function load(cssArray) {
            for (var i = 0; i < cssArray.length; i++) {
                $('<link href="' + cssArray[i] + '.css"  rel="stylesheet" />').appendTo("head");
            }
        }
        return {
            load: load
        }
    });
});