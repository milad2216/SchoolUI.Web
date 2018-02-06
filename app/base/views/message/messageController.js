debugger
define(['app'], function (app) {
    app.register.controller('messageController', ['$scope', '$rootScope', '$stateParams', '$state', 'dataService', 'RESOURCES', '$timeout', 'variables', 'enumService', 'Notification',
        function ($scope, $rootScope, $stateParams, $state, dataService, RESOURCES, $timeout, variables, enumService, Notification) {
            debugger
            $scope.newMessage = { UserIdSender: JSON.parse(localStorage.getItem("lt")).user_id, Seen: false };
            $scope.reloadInbox = function () {
                dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Messages?$filter=UserIdReceiver eq ' + $scope.newMessage.UserIdSender + '&$expand=UserSender/Teachers,UserSender/Students,UserSender/Employees,UserSender/Parents&$orderby=Id desc').then(function (data) {
                    debugger;
                    $scope.messages = data.Items;
                })
            }
            $scope.userDomain = RESOURCES.USERS_DOMAIN;
            $scope.reloadInbox();
            $scope.selectReceiverShow = false;
            $scope.messages = [];

            $rootScope.toBarActive = true;

            $scope.GetSenderData = function (message) {
                switch (message.UserSender.Role) {
                    case enumService.RoleEnum().first(function (x) {
                            return x.Value === "Manager"
                    }).Id:
                        return { FirstName: "مدیر", LastName: "مدرسه" };
                        break;
                    case enumService.RoleEnum().first(function (x) {
                            return x.Value === "Employee"
                    }).Id:
                        return message.UserSender.Employees[0];
                        break;
                    case enumService.RoleEnum().first(function (x) {
                            return x.Value === "Teacher"
                    }).Id:
                        return message.UserSender.Teachers[0];
                        break;
                    case enumService.RoleEnum().first(function (x) {
                            return x.Value === "Student"
                    }).Id:
                        return message.UserSender.Students[0];
                        break;
                    case enumService.RoleEnum().first(function (x) {
                            return x.Value === "Parent"
                    }).Id:
                        return message.UserSender.Parents[0];
                        break;
                    default:
                        return {};
                }
            }

            $scope.reply = function (message) {
                debugger;
                if (message.ReplyText) {
                    var replyMessage = {
                        Message: {
                            Title: "پاسخ به " + (message.Title?message.Title:""),
                            MessageText: message.ReplyText,
                            UserIdSender: $scope.newMessage.UserIdSender
                        },
                        UserId: message.UserIdSender
                    }
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Messages', replyMessage).then(function (id) {
                        if (id) {
                            Notification.success("با موفقیت ارسال شد.");
                            $scope.closePupop();
                        }
                    }, function (err) {
                        Notification.error("اشکال در ارسال.");
                    });
                }
            }

            $scope.$on('$destroy', function () {
                $rootScope.toBarActive = false;
            });

            $scope.base64FileOptions = {
                multiple: false,
                allowedExtensions: [],
                preview: false,

            }
            $scope.base64FileOnSelect = function (fileStream, fileInfo) {
                $scope.fileName = fileInfo.files[0].name;
                $scope.base64File = fileStream.split(',')[1];
            }
            $scope.base64FileOnRemove = function (e) {
                $scope.base64File = "";
                $scope.fileName = "";
            }

            $scope.persionDate = function (georg) {
                return moment(georg).format('YYYY-MM-DD');
            }

            $scope.showPupop = function () {
                $("#mailbox_new_message").show();
            }

            $scope.closePupop = function () {
                $("#mailbox_new_message").hide();
            }
            $scope.sendMessage = function () {
                if ($scope.sendMessageForm.$valid) {
                    debugger;
                    dataService.addEntity(RESOURCES.USERS_DOMAIN + '/api/Messages', { Message: $scope.newMessage, Base64File: $scope.base64File, FileName: $scope.fileName, UserId: $scope.newMessage.UserIdReceiver }).then(function (id) {
                        if (id) {
                            Notification.success("با موفقیت ارسال شد.");
                            $scope.closePupop();
                        }
                    }, function (err) {
                        Notification.error("اشکال در ارسال.");
                    });
                }
            }

            $scope.userTypeOptions = [];
            var userTypeItems = [];
            debugger;
            angular.forEach(enumService.RoleEnum().where(function (x) { return x.Id > 1 }), function (value, key) {
                userTypeItems.push({ text: value.Text, value: value.Value });
            });
            $scope.userTypeOptions = userTypeItems;
            $scope.userTypeOnClose = function (combo) {
                $scope.userOptions = [];
                var userType = combo.dataSource._data[combo.selectedIndex].value;
                debugger;
                var url = "";
                switch (userType) {
                    case "Student":
                        url = RESOURCES.USERS_DOMAIN + "/api/Students?inlinecount=allpages"
                        break;
                    case "Teacher":
                        url = RESOURCES.USERS_DOMAIN + "/api/Teachers?inlinecount=allpages"
                        break;
                    case "Employee":
                        url = RESOURCES.USERS_DOMAIN + "/api/Employees?inlinecount=allpages"
                        break;
                    case "Parent":
                        url = RESOURCES.USERS_DOMAIN + "/api/Parents?inlinecount=allpages"
                        break;

                }
                dataService.getData(url).then(function (data) {
                    debugger;
                    var items = [];
                    angular.forEach(data.Items, function (value, key) {
                        items.push({ text: value.FirstName + ' ' + value.LastName, value: String(value.UserId) });
                    });
                    $scope.userOptions = items;
                    $scope.selectReceiverShow = true;
                });
            }
            //$scope.userIdReceiverOnClose = function (combo) {
            //    $scope.newMessage.UserIdReceiver = combo.dataSource._data[combo.selectedIndex].value;
            //}


            var $mailbox = $('#mailbox');
            // select message
            $mailbox.on('click', '.select_message', function () {
                $(this).is(':checked') ? $(this).closest('li').addClass('md-card-list-item-selected') : $(this).closest('li').removeClass('md-card-list-item-selected');
            });

            // select all messages
            $('#mailbox_select_all').on('ifChanged', function () {
                var $this = $(this);
                $mailbox.find('.select_message').each(function () {
                    $this.is(':checked') ? $(this).iCheck('check') : $(this).iCheck('uncheck');
                })
            });

            // show message details
            $mailbox.on('click', '.md-card-list ul > li', function (e) {
                debugger;
                if (!$(e.target).closest('.md-card-list-item-menu').length && !$(e.target).closest('.md-card-list-item-select').length) {

                    var $this = $(this);

                    if (!$this.hasClass('item-shown')) {
                        // get height of clicked message
                        var el_min_height = $this.height() + $this.children('.md-card-list-item-content-wrapper').actual("height");

                        // hide opened message
                        $mailbox.find('.item-shown').velocity("reverse", {
                            begin: function (elements) {
                                $(elements).removeClass('item-shown').children('.md-card-list-item-content-wrapper').hide().velocity("reverse");
                            }
                        });

                        // show message
                        $this.velocity({
                            marginTop: 40,
                            marginBottom: 40,
                            marginLeft: -20,
                            marginRight: -20,
                            minHeight: el_min_height
                        }, {
                            duration: 300,
                            easing: variables.easing_swiftOut,
                            begin: function (elements) {
                                $(elements).addClass('item-shown');
                            },
                            complete: function (elements) {
                                // show: message content, reply form
                                $(elements).children('.md-card-list-item-content-wrapper').show().velocity({
                                    opacity: 1
                                });

                                // scroll to message
                                var container = $('body'),
                                    scrollTo = $(elements);
                                container.animate({
                                    scrollTop: scrollTo.offset().top - $('#page_content').offset().top - 8
                                }, 1000, variables.bez_easing_swiftOut);

                            }
                        });
                    }
                }

            });
            // hide message on: outside click, esc button
            $(document).on('click keydown', function (e) {
                if (
                    (!$(e.target).closest('li.item-shown').length) || e.which === 27
                ) {
                    $mailbox.find('.item-shown').velocity("reverse", {
                        begin: function (elements) {
                            $(elements).removeClass('item-shown').children('.md-card-list-item-content-wrapper').hide().velocity("reverse");
                        }
                    });
                }
            });


            // file upload (new message)
            $timeout(function () {
                var progressbar = $("#mail_progressbar"),
                    bar = progressbar.find('.uk-progress-bar'),
                    settings = {
                        action: './upload/', // upload url
                        single: false,
                        loadstart: function () {
                            bar.css("width", "0%").text("0%");
                            progressbar.removeClass("uk-hidden uk-progress-danger");
                        },
                        progress: function (percent) {
                            percent = Math.ceil(percent);
                            bar.css("width", percent + "%").text(percent + "%");
                            if (percent === '100') {
                                setTimeout(function () {
                                    progressbar.addClass("uk-hidden");
                                }, 1500);
                            }
                        },
                        error: function (event) {
                            progressbar.addClass("uk-progress-danger");
                            bar.css({ 'width': '100%' }).text('100%');
                        },
                        abort: function (event) {
                            console.log(event);
                        },
                        complete: function (response, xhr) {
                            console.log(response);
                        }
                    };

                //var select = UIkit.uploadSelect($("#mail_upload-select"), settings),
                //    drop   = UIkit.uploadDrop($("#mail_upload-drop"), settings);
            })
        }
    ]);
});