define(['base/directives/controls/pnControls'], function (control) {
    control.directive('pnTextBoxFiltering', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: '<input type="text"  class="form-control mousetrap"/> ',
            scope: {
            },
            require: '?ngModel',
            link: function ($scope, $element, $attrs, $ngModelCtrl) {
                if (!$ngModelCtrl) {
                    return;
                }
                $ngModelCtrl.$parsers.push(function (value) {
                    //return
                    return checkValid(value);
                })

                $ngModelCtrl.$render = function () {
                    
                    if ($ngModelCtrl.$viewValue) {
                        $($element).val(checkValid($ngModelCtrl.$viewValue));

                    }
                    else if (!$ngModelCtrl.$viewValue){
                        $($element).val("");    
                    }

                }

                var checkValid = function (value) {
                    if (value) {
                        var numbers = "";
                        if ($attrs.lan == "persian") {
                            numbers = value.replace(/[^آ-ی]/g, '');
                        }
                        if ($attrs.lan == "english") {
                            numbers = value.replace(/[^A-Z,a-z, ,_,@,.,-]/g, '');
                        }
                        else if ($attrs.lan == "num") {
                            numbers = value.replace(/[^0-9,_, - , ,+,=]/g, '');
                        } else if ($attrs.lan == "persiannum") {
                            numbers = value.replace(/[^آ-ی,0-9]/g, '');
                        }

                        if (numbers !== value) {
                            $element.val(numbers);

                        }
                        return numbers;
                    }
                }
            }
        }

    });
});