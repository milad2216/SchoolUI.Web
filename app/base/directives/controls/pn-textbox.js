define(['angularAMD'], function (control) {
    control.directive('pnTextbox', function () {
        debugger;
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                title: '@',
                name: '@',
                charaterOnly: "=",
                onblur: '&'
            },
            template: '<input type="text"   class="form-control mousetrap"  name="{{ name }}"/>',
            link: function (scope,elem) {
                elem.bind('keypress', function (e) {                   
                    if (scope.charaterOnly && e.which >= 41 && e.which <= 100)
                             return false;
                    else
                   return true;
                });

                elem.bind('keyup', function (e) {
                    this.value = this.value.replace("ي", "ی").replace("ك", "ک");
                });               
            }
        }
    });
});