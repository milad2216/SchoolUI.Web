define(['angularAMD'], function (control) {
    control.directive('pnDisable', function ($timeout) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var disabledElement = (attrs.disableElementId) ? document.getElementById(attrs.disableElementId) : element[0];
                var childNodeLength = element[0].childNodes.length;

                // Watch on DOM changement
                scope.$watch(function () {
                    return element[0].childNodes.length;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        toggleDisableAll(disabledElement, attrs.pnDisable);
                    }
                });

                // Watch on DisableAll attribute value
                scope.$watch(attrs.pnDisable, function (isDisabled) {
                    toggleDisableAll(disabledElement, isDisabled);
                });

                scope.$on('$destroy', function () {
                    enableAll(disabledElement);
                });


                var toggleDisableAll = function (element, isDisabled) {
                    if (isDisabled) {
                        pnDisable(element);
                    }
                    else {
                        enableAll(element);
                    }
                }

                var pnDisable = function (element) {
                    angular.element(element).addClass('disable-all');
                    element.style.color = 'gray';
                    disableElements(element.getElementsByTagName('input'));
                    disableElements(element.getElementsByTagName('button'));
                    disableElements(element.getElementsByTagName('textarea'));
                    disableElements(element.getElementsByTagName('select'));
                    element.addEventListener('click', preventDefault, true);
                };


                var enableAll = function (element) {
                    angular.element(element).removeClass('disable-all');
                    element.style.color = 'inherit';
                    enableElements(element.getElementsByTagName('input'));
                    enableElements(element.getElementsByTagName('button'));
                    enableElements(element.getElementsByTagName('textarea'));
                    enableElements(element.getElementsByTagName('select'));
                    element.removeEventListener('click', preventDefault, true);
                };


                var preventDefault = function (event) {
                    for (var i = 0; i < event.target.attributes.length; i++) {
                        var atts = event.target.attributes[i];
                        if (atts.name === "pn-skip-disable") {
                            return true;
                        }
                    }
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                };


                var disableElements = function (elements) {
                    $timeout(function () {
                        var len = elements.length;
                        for (var i = 0; i < len; i++) {
                            var shouldDisable = true;
                            for (var j = 0; j < elements[i].attributes.length; j++) {
                                var atts = elements[i].attributes[j];
                                if (atts.name === "pn-skip-disable") {
                                    shouldDisable = false;
                                    continue;
                                }
                            }
                            if (shouldDisable && elements[i].disabled === false) {
                                elements[i].disabled = true;
                                elements[i].disabledIf = true;
                            }
                        }
                    }, 0)
                };


                var enableElements = function (elements) {
                    var len = elements.length;
                    for (var i = 0; i < len; i++) {
                        if (elements[i].disabled === true && elements[i].disabledIf === true) {
                            elements[i].disabled = false;
                            elements[i].disabledIf = null;
                        }
                    }
                };

            }
        }

    });
    control.directive('pnSkipDisable', function () {

        return {
            restrict: 'A'
        };

    })
    control.directive('colaps', function () {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {

                $(element).click(function () {

                    var $this = $(this);
                    var parent = $this.parent();
                    var contents = parent.contents().not(this);
                    if (contents.length > 0) {
                        $this.data("contents", contents.remove());
                    } else {
                        $this.data("contents").appendTo(parent);
                    }
                    return false;
                })

            }
        }
    })


});