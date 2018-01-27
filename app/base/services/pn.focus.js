define(['angularAMD'], function (app) {
    app.factory('pn.focus', function ($timeout, $window, $interval) {
        function setFocus(popertyName) {
            var element = $window.document.querySelectorAll('[ng-model=\'' + popertyName + '\']');

            $timeout(function () {

                if (element) {
                    var tagName = $(element).prop("tagName").toLowerCase();

                    switch (tagName) {

						case "pn-combo-box": $(element).find("input").focus();
							break;

						case "pn-lookup":
                            var i = 0;
                            var interval = $interval(function () {
                                i++
                                element = $('[ng-model=\'' + popertyName + '\']')
                                tagName = $(element).prop("tagName");
                                if (tagName) {
                                    tagName = tagName.toLowerCase();
                                }      
                                if (tagName === "fieldset" || tagName === "div") {
                                    $(element).find("button").focus();
                                    $interval.cancel(interval);
                                }
                                if (i>5) {
                                    $interval.cancel(interval);
                                }
							}, 500);
							break;

						case "fieldset": $(element).find("button").focus();
							break;

                        default:
                            $(element).focus();
                            $(element).select();
                    }
                }
            });
        };

        return {
            setFocus
        }
    });
});