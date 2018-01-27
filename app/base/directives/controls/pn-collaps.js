define(['directives/controls/pnControls'], function (control) {
    control.directive('pnCollaps', function () {
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