define(['angularAMD'], function (control) {
    control.register.directive('pnRichTextEditor', function factory () {
        var directiveDefinitionObject = {
            templateUrl: "/app/base/partials/directives/pn-rich-text-editor.html",
            restrict: 'E',
            scope: {
                options: '=',
                value: '=ngModel',
                onDestory: '&',
                readHtml: '&',
                disabled:"=ngDisabled"
            },
            link: function (scope, elem, attrs) {

                scope.tools = scope.disabled? [] : [
                    {
                        name: "fontName",
                        items: [
                            { text: "Nazanin", value: "b nazanin" },
                            { text: "Titr", value: "B titr" },
                            { text: "Zar", value: "B zar" },
                            { text: "Mitra", value: "B Mitra" },
                            { text: "Yekan", value: "B Yekan" },
                            { text: "Tahoma", value: "tahoma" },
                            { text: "Times New Roman", value: "Times New Roman" },
                            { text: "Trebuchet MS", value: "Trebuchet MS" }
                        ]
                    },

                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "fontName",
                    "fontSize",
                    "foreColor",
                    "backColor",
                    "print"
                ];
                scope.options = scope.options || {};
                scope.options.kendoOptions = scope.options.kendoOptions || {};

                scope.$on('$destroy', function () {
                    scope.onDestory();
                    scope.options = null;
                });
            }
        };
        return directiveDefinitionObject;
    });
});