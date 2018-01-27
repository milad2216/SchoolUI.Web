define(['angularAMD'],function (control) {
    control.register.directive('pnAlert', [function factory() {
        return {
            restrict: 'AE',
            scope: { 
                alerts: '='
            },
            template: "<alert ng-repeat='alert in alerts' close='closeAlert($index)' type='{{alertStyle}}'> {{alert}} </alert>",
            link: function ($scope, $elem, $attrs) {
                $scope.alertStyle = $attrs.alertStyle ? $attrs.alertStyle : "warning";
                $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
                };
          }
        }

    }]);
});