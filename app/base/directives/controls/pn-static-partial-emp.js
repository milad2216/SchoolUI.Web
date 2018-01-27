define(['angularAMD'], function (app) {
    app.directive('pnStaticPartialEmp', ["pn.errorHandler", function (errorHandler) {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: function(ele, attrs) {

                return '/app/areas/hr/emp/partials/emploee/EmployeeInfoPartialView.html' ;
                
            },
            link: function ($scope, elem) {


                $scope.nationalBlur = function (val)
                {
                    if (val) {
                        var erros = {
                            ValidationErrors: []
                        };
                        var validForm = true;
                        // Static Validation
                        if (val.length != 10) {
                            erros.ValidationErrors.push({ ErrorMessage: _t('MsgErrorEmp.InvalidNationalId') });
                            validForm = false;
                        }                      


                        if (erros.ValidationErrors.length > 0) {
                            errorHandler.ShowError(erros);
                        }
                    }
                }
            }
        };
    }]);
});