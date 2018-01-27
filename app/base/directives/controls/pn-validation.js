define(['base/directives/controls/pnControls'], function (control) {
    control.directive('pnValidation', ["pn.errorHandler", function (errorHandler) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
            },
            template: '<button >Validation</button>',
            link: function ($scope, $elem, $attrs) {
                var elements = $($elem).closest("form").find('[text-message]');
                $elem.on('click', function () {
                    $("i[data-toggle]").remove();
                    var messages = [];
                    elements.each(function (index, value) {
                        var element = $(value).css('position', 'relative');
                        var status = getValueComponnet(value);
                        if (status == true && $(value).attr("text-length")) {
                            var textLength = $(value).attr('text-length');
                            var lenghtvalue = $(value).val().length;
                            if (parseInt(textLength) < parseInt(lenghtvalue) || parseInt(textLength) > parseInt(lenghtvalue)) {
                                var textValue = parseInt(textLength);
                                var msg = _t("validation.Msg").replace("#", textValue)
                                messages.push({ ErrorMessage: msg, element: element });
                            }
                        }
                        else if (status == false) {
                            messages.push({ ErrorMessage: $(this).attr('text-message'), element: element });
                        }

                    });
                    if (messages.length > 0) {
                        var result = {
                            ErrorMessage: null,
                            ValidationErrors: messages
                        };
                        messages.forEach(function (item) {
                            result.ValidationErrors.push(item.ErrorMessage);
                            $('<i/>', {
                                class: 'fa fa-info validat',
                                id: 'foo',
                                title: item.ErrorMessage,
                                'data-toggle': 'tooltip',
                            }).appendTo(item.element.parent());
                        });
                        errorHandler.ShowError(result);
                        $('[data-toggle="tooltip"]').tooltip();
                    }
                })

                var getValueComponnet = function (elm) {
                    var status = false;
                    var tagName = $(elm).prop("tagName").toLowerCase();
                    switch (tagName) {
                        case "input":
                            if ($(elm).val()) {
                                status = true;
                            }
                            break;
                        case "pn-combo-box":
                            if ($(elm).val()) {
                                status = true;
                            }
                            break;
                        case "pn-date-picker":
                            var input = $(elm).find("input").val();
                            if (input) {
                                status = true;
                            }
                            break;
                        case "pn-lookup":
                            var lookup = $(elm).find("input[type='text']").val();
                            if (lookup) {
                                status = true;
                            }
                            break;
                    }
                    return status;
                }
                    elements.each(function (i, item) {
                      //  var panel = $(item);
                        $(item).addClass('requiredstar');
                    });

            },
        };

    }]);
});