define(['angularAMD'], function(control) {
    control.directive('pnTimepicker', function factory() {
        var directiveDefinitionObject = {
            
            restrict: 'E',
            scope: {
                model: "=ngModel",
                options: "=",
                disabled: "=ngDisabled"
            },
            template: '<input type="input" ' +
                      ' kendo-time-picker ' +
                      ' ng-model="model" ' +
                      ' k-interval="15" ' +
                      //' k-format= "HH:mm" ' +
                      ' ng-disabled="options.disabled ||disabled" />',
            link: function (scope, elem, attrs) {

                elem.bind('keypress', function (e) {
                    if (!(e.shiftKey && e.which == 58) && e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        return false;
                    }
                });
            }
        };
        return directiveDefinitionObject;
    });
});

