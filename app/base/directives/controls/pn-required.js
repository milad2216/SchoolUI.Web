define(['angularAMD'], function (control) {

    control.directive("pnRequired", function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                if (!ctrl) return;
                attr.required = true; // force truthy in case we are on non input element
                ctrl.$validators.required = function (modelValue, viewValue) {
                    var isValid = !attr.required || !ctrl.$isEmpty(viewValue);
                    if (!isValid)
                        ctrl.$errorMessage =  _t(attr.requiredMessage);
                    return isValid;
                };
                attr.$observe('required', function () {
                    ctrl.$validate();
                });
            }
        };
    });
});
