define(['angularAMD'], function (app) {
    app.service("pn.toolbar.service", ['hotkeys', '$state', 'infWebAccess', '$rootScope', "pn.remote.service", "localStorageService", "pn.errorHandler","pn.focus",
        function (hotkeys, $state, WebAccess, $rootScope, remoteService, localStorageService, errorHandler, pnFocus) {
            getActiveFormScope = function () {
                var form = $('.acitveForm:visible');
                return angular.element(form).scope();
            };

            formInfo = function () {
                var formDetails = [$rootScope.currentForm.title,
                $rootScope.currentForm.action,
                $rootScope.currentForm.systemTotalCode,
                $rootScope.currentForm.featureId].join(',');
            };

            Command = function () {
                var mode = $rootScope.currentTab.mode;
                return !(mode && (mode == "DoInsert" || mode == "DoEdit" || mode == "DoDelete"));
            };

            CommandReply = function () {
                var mode = $rootScope.currentTab.mode;
                return (mode &&
                    (mode == "DoInsert" || mode == "DoEdit" || mode == "DoDelete"));
            };

            DoInsert = function () {

                if (Command()) {
                    var formScope = getActiveFormScope();
                    formScope.doInsert().then(function (result) {
                        if (result) { $rootScope.currentTab.mode = "DoInsert"; }
                        setEnableButton(!result);
                    });
                }
            };

            DoEdit = function () {
                if (Command()) {
                    var formScope = getActiveFormScope();
                    formScope.doEdit().then(function (result) {
                        if (result) { $rootScope.currentTab.mode = "DoEdit"; }
                        setEnableButton(!result);
                    });
                }
            };

            DoDelete = function () {
                if (Command()) {
                    var formScope = getActiveFormScope();
                    formScope.doDelete().then(function (result) {
                        if (result) {
                            $rootScope.currentTab.mode = "DoDelete";
                        }
                        setEnableButton(!result);
                    });
                }
            };

            DoApplay = function () {
                if (CommandReply()) {
                    if (checkValidation()) {
                        var formScope = getActiveFormScope();
                        formScope.doApplay().then(function (result) {
                            if (result) {
                                $rootScope.currentTab.mode = "DoApplay";
                            }
                            setEnableButton(result);
                        });
                    }
                }
            };

            DoCancel = function () {
                if (CommandReply()) {
                    var formScope = getActiveFormScope();
                    formScope.doCancel().then(function (result) {
                        if (result) {
                            $(".validate,.validate3,.validate-datepicker").remove();

                            $rootScope.currentTab.mode = "DoCancel";
                        }
                        setEnableButton(result);
                    });
                }
            };

            DoReport = function () {

                formInfo();
            };

            DoArchive = function () {

            };

            DoWorkflow = function () {
                var formScope = getActiveFormScope();
                formScope.doWorkflow().then(function (eng) {
                    if (eng) {
                        dialog.show(workflowDialog.view, workflowDialog.controller, workflowDialog.title, null, null, null, eng);
                    }
                })
            };

            DoRefresh = function () {
                formInfo();
            };

            DoLoadlog = function () {
                formInfo();
            };

            DoLog = function () {
                formInfo();
            };

            DoBtnUser1 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser1();
            };

            DoBtnUser2 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser2();
            };

            DoBtnUser3 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser3();
            };

            DoBtnUser4 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser4();
            };

            DoBtnUser5 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser5();
            };

            DoBtnUser6 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser6();
            };

            DoBtnUser7 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser7();
            };

            DoBtnUser8 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser8();
            };

            DoBtnUser9 = function () {
                var formScope = getActiveFormScope();
                formScope.doBtnUser9();
            };

            setEnableApplyAndCancelButton = function (stausButton) {
                angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                    if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                        item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {

                        if (stausButton) {
                            item.Disabled = '';
                        }
                        else {
                            item.Disabled = 'disabled';
                        }
                    }
                });
            };

            setEnableButton = function (stausButton) {
                for (var i = 0; i < $rootScope.currentTab.toolbar.length; i++) {
                    $rootScope.currentTab.toolbar[i].Disabled = "";
                    if (!stausButton && $rootScope.currentTab.toolbar[i].Order < 1004) {
                        $rootScope.currentTab.toolbar[i].Disabled = "disabled";
                    }
                    else if (stausButton && $rootScope.currentTab.toolbar[i].Order > 1003 && $rootScope.currentTab.toolbar[i].Order < 1006) {
                        $rootScope.currentTab.toolbar[i].Disabled = "disabled";
                    }
                }
            };

            SetEnableButton = function (stausButton) {

                angular.forEach($rootScope.currentTab.toolbar, function (item, index) {

                    if (item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {
                        if (stausButton == true) {
                            item.Disabled = '';
                        }
                        else {
                            item.Disabled = 'disabled';
                        }
                    }
                    else if (item.LatinName == 'Cancel' || item.LatinName == 'Apply') {
                        if (stausButton == true) {
                            item.Disabled = 'disabled';
                        }
                        else {
                            item.Disabled = '';
                        }
                    }
                });

            };

            SetEnableAddAndDeleteButton = function (stausButton) {
                angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                    if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                        item.LatinName == 'Delete' || item.LatinName == 'Add') {

                        if (stausButton) {
                            item.Disabled = '';
                        }
                        else {
                            item.Disabled = 'disabled';
                        }
                    }
                });

            };

            SetEnableApplyAndCancelButton = function (stausButton) {
                angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                    if (item.LatinName == 'Cancel' || item.LatinName == 'Apply' ||
                        item.LatinName == 'Delete' || item.LatinName == 'Add' || item.LatinName == 'Edit') {

                        if (stausButton) {
                            item.Disabled = '';
                        }
                        else {
                            item.Disabled = 'disabled';
                        }
                    }
                });

            };

            SetEnableExtraButton = function (stausButton) {
                angular.forEach($rootScope.currentTab.toolbar, function (item, index) {
                    if (item.LatinName == 'User1' || item.LatinName == 'User2' || item.LatinName == 'User3' || item.LatinName == 'User4') {
                        if (stausButton) {
                            item.Disabled = '';
                        }
                        else {
                            item.Disabled = 'disabled';
                        }
                    }
                });

            };

            CreateHotKey = function (toolbar) {
                var num = 1;
                toolbar.forEach(function (item) {

                    if (item.Order <= 1007) {
                        num = 1;
                    } else if (item.Order <= 3000 && item.Order >= 2001) {
                        num = 2;
                    } else if (item.Order <= 4000 && item.Order >= 3001) {
                        num = 3;
                    }
                    hotkeys.add({
                        combo: item.ShorcutKey,
                        description: item.Hint,
                        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                        callback: function (e, item) {
                            var obj = item.item;
                            if ($rootScope.currentTab && $rootScope.currentTab.toolbar) {
                                $rootScope.currentTab.toolbar.forEach(function (value) {
                                    if (value.LatinName == obj.LatinName) {
                                        var actionviewurl = obj.ActionViewUrl.replace("()", "");
                                        var func = actionviewurl + "()";
                                        eval(func);
                                        return;
                                    }
                                })
                            }
                        },
                        item: item,
                        type: num,

                    });

                })
            };

            checkValidation = function () {
              
             
                var elements = $('.acitveForm:visible').find('[required-message]');
                $('.acitveForm:visible').find(".validate,.validate3,.validate-datepicker").remove();
                var messages = [];

                elements.each(function (index, value) {
                    
                    var disabled = $(value).attr("disabled");
                    if (!$(value).attr("nonrequired") && (!disabled || disabled !== "disabled")) {
                        var element = $(value).css('position', 'relative');
                        status = getValueComponnet(value);
                        if ((status == "true" || status == true) && $(value).attr("text-length")) {
                         
                            var textLength = $(value).attr("text-length");
                            var lenghtvalue = $(value).val().length;
                            if (parseInt(textLength) < parseInt(lenghtvalue) || parseInt(textLength) > parseInt(lenghtvalue)) {
                                var textValue = parseInt(textLength);
                                var msg = _t("validation.Msg").replace("#", textValue)
                                messages.push({ ErrorMessage: msg, element: element });
                            }


                        }
                        else if (status == "false" || !status) {
                            var msg = _t($(this).attr('required-message'))
                            messages.push({ ErrorMessage: msg, element: element });

                        }
                    }
                });
                if (messages.length > 0) {
                    var result = {
                        ErrorMessage: null,
                        ValidationErrors: messages
                    };

                    messages.forEach(function (item) {
                        $(item.element).off("change");
                        $(item.element).on("change", function () {
                           $(this).closest("div").find(".validate,.validate3,.validate-datepicker").remove();
                        });
                     
                        switch (item.element[0].tagName.toLowerCase()) {

                            case "input":
                                result.ValidationErrors.push(item.ErrorMessage);
                                $('<i/>', {
                                    class: 'fa fa-info validate',
                                    title: item.ErrorMessage,
                                    'data-toggle': 'tooltip',
                                }).appendTo(item.element.closest("div"));

                                $('<span/>', {
                                    class: 'validate2',
                                }).appendTo(item.element.parent());
                                break;

                            case "pn-combo-box":
                                result.ValidationErrors.push(item.ErrorMessage);
                                $('<i/>', {
                                    class: 'fa fa-info validate3',
                                    title: item.ErrorMessage,
                                    'data-toggle': 'tooltip',
                                }).appendTo(item.element.closest("div"));

                                $('<span/>', {
                                    class: 'validate2',
                                }).appendTo(item.element.parent());
                                break;



                            case "pn-date-picker":
                                result.ValidationErrors.push(item.ErrorMessage);
                                $('<i/>', {
                                    class: 'fa fa-info validate-datepicker',
                                    title: item.ErrorMessage,
                                    'data-toggle': 'tooltip',
                                }).appendTo(item.element.closest("div"));

                                $('<span/>', {
                                    class: 'validate-datepicker',
                                }).appendTo(item.element.parent());
                                break;


                            case "pn-lookup":
                                result.ValidationErrors.push(item.ErrorMessage);
                                $('<i/>', {
                                    class: 'fa fa-info validate3',
                                    title: item.ErrorMessage,
                                    'data-toggle': 'tooltip',
                                }).appendTo(item.element.closest("div"));

                                $('<span/>', {
                                    class: 'validate2',
                                }).appendTo(item.element.parent());
                                break;
                        }
                    });
                   
                    errorHandler.ShowError(result);
                    $('[data-toggle="tooltip"]').tooltip();
                    return false
                }

                return true;
            }

            getValueComponnet = function (elm) {
               
                var status = false;
                var tagName = $(elm).prop("tagName").toLowerCase();
                switch (tagName) {
                    case "input":
                        if ($(elm).val()) {
                            status = true;
                        }
                        break;
                    case "pn-combo-box":
                        var combobox = $(elm).find("option:selected");
                        if (combobox.val() && combobox.text()) {
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

            function setStarLabel() {
                var elements = $('[required-message]');
                if (elements) {
                    elements.each(function (i, item) {
                        $(item).addClass('requiredstar');

                    });
                }
            };

          
            return {
                CreateHotKey: CreateHotKey,
                SetEnableExtraButton: SetEnableExtraButton,
                SetEnableApplyAndCancelButton: SetEnableApplyAndCancelButton,
                SetEnableAddAndDeleteButton: SetEnableAddAndDeleteButton,
                SetEnableButton: SetEnableButton,
                setEnableApplyAndCancelButton: setEnableApplyAndCancelButton,
                DoBtnUser9: DoBtnUser9,
                DoBtnUser8: DoBtnUser8,
                DoBtnUser7: DoBtnUser7,
                DoBtnUser6: DoBtnUser6,
                DoBtnUser5: DoBtnUser5,
                DoBtnUser4: DoBtnUser4,
                DoBtnUser3: DoBtnUser3,
                DoBtnUser2: DoBtnUser2,
                DoBtnUser1: DoBtnUser1,
                DoLog: DoLog,
                DoLoadlog: DoLoadlog,
                DoRefresh: DoRefresh,
                DoWorkflow: DoWorkflow,
                DoArchive: DoArchive,
                DoReport: DoReport,
                DoCancel: DoCancel,
                DoApplay: DoApplay,
                DoDelete: DoDelete,
                DoEdit: DoEdit,
                DoInsert: DoInsert,
                CommandReply: CommandReply,
                Command: Command,
            }
        }

    ]);
});
