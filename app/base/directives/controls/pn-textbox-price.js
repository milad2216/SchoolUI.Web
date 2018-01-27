define(['angularAMD'], function (control) {
    control.register.directive('pnTextboxPrice', function ($browser) {
        return {
            restrict: 'EA',
            replace: 'true',
            require: '?ngModel',
            template: '<input type="text"  class="form-control mousetrap LeftToRightTextBox"/> ',
            link: function ($scope, $elem, $attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) return '';
                    var tf = null;

                    if (angular.isDefined($attrs.decimal)) {
                        tf = val.replace(/-/g, '')
                        tf = tf.replace(/[^-0-9\.]/g, '');
                        var decimalCheck = tf.split('.');
                        var len = $attrs.length ? parseInt($attrs.length) : 8;
                        if (angular.isDefined(decimalCheck[1])) {
                            decimalCheck[1] = decimalCheck[1].slice(0, 2);
                            tf = decimalCheck[0].length > len ? decimalCheck[0].slice(0, len) + '.' + decimalCheck[1] : decimalCheck[0] + '.' + decimalCheck[1];
                        }
                        else {
                            tf = decimalCheck[0].slice(0, len)
                        }
                    }
                    else if (angular.isDefined($attrs.separate)) {
                        val = val.replace(/,/g, '');
                        var len = $attrs.length ? parseInt($attrs.length) : 8;
                        tf = val.slice(0, len);
                        tf = tf.replace(/[^0-9]/g, '');
                        tf = tf.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }
                    else {
                        if (angular.isDefined($attrs.negative)) {
                            var negativeCheck = val.split('-');
                            if (angular.isDefined(negativeCheck[1])) {
                                tf = val.replace(/-/g, '');
                                tf= tf.replace(/[^0-9]/g, '');
                                tf = '-' + tf;
                            }
                        } else {
                            tf = val.replace(/-/g, '')
                            tf = tf.replace(/[^0-9]/g, '');
                        }
                    }
                    if (val !== tf || angular.isDefined($attrs.separate)) {
                        ngModelCtrl.$setViewValue(tf);
                        ngModelCtrl.$render();
                    }
                    return tf;
                });

                ngModelCtrl.$render = function () {
                    var tf = ngModelCtrl.$viewValue;
                    if (angular.isDefined($attrs.separate)) {
                        var tf = tf.replace(/,/g, '');
                        tf = tf.replace(/[^0-9]/g, '');
                        tf = tf.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }
                    $elem.val(tf);
                };
            }
        };
    });
});