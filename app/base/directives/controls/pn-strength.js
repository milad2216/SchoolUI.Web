define(['angularAMD'], function (control) {

    control.register.directive('pnStrength', function () {
        return {
            replace: false,
            restrict: 'EA',
            scope:true ,
            require: '?ngModel',
            template: '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li></li>',
            link: function ($scope, $elem, $attrs, ngModelCtrl) {
                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    cheker: [_t("strength.Weak"), _t("strength.medium"), _t("strength.good"), _t("strength.Strong") ],
                    getColor: function (s) { 
                        var idx = 0;
                        if (s <= 10) { idx = 0;}
                        else if (s <= 20) { idx = 1;}
                        else if (s <= 30) { idx = 2;}
                        else if (s <= 40) { idx = 3;}
                        else { idx = 4; }
                        return { idx: idx + 1, col: this.colors[idx], cheker: this.cheker[idx] };
                    }
                };
                //
                ngModelCtrl.$render = function () {
                    init();
                }
               
                function init() {
                    
                    if (!ngModelCtrl.$viewValue) {
                        $elem.css({ "display": "none" });
                    }
                    var c = 0;
                    switch (ngModelCtrl.$viewValue) {
                        case 1: c = strength.getColor(10); break;
                        case 2: c = strength.getColor(20); break;
                        case 3: c = strength.getColor(30); break;
                        case 4: c = strength.getColor(40); break;
                        case 5: c = strength.getColor(50); break;
                    }
                    $elem.css({ "display": "inline" });
                    $elem.children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                    $elem.children('li').last().text(!ngModelCtrl.$viewValue ||isNaN(ngModelCtrl.$viewValue) ?"": c.cheker)
                            .css({ "display": "inline", "background": "#fff", 'margin-right': '20px' })
                }
            },
        };

    });

});