debugger
define(['app'], function (app) {
    app.register.controller('messageController', ['$scope', '$rootScope', '$stateParams', '$state', 'dataService', 'RESOURCES', '$timeout', 'variables', 'enumService',
        function ($scope, $rootScope, $stateParams, $state, dataService, RESOURCES, $timeout, variables, enumService) {
            debugger
            $scope.messages = [];
            dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Messages?$expand=UserSender').then(function (data) {
                debugger;
                $scope.messages = data.Items;
            })
            $rootScope.toBarActive = true;

            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
            });

            $scope.persionDate = function(georg){
                return moment(georg).format('YYYY-MM-DD');
            }

            $scope.showPupop = function () {
                $("#mailbox_new_message").show();
            }

            $scope.closePupop = function () {
                $("#mailbox_new_message").hide();
            }

            $scope.autoCompleteOptions = {
                source: RESOURCES.USERS_DOMAIN + '/api/Users'
            }
            

            $scope.userTypeOptions = [];
            var userTypeItems = [];
            debugger;
            angular.forEach(enumService.RoleEnum(), function (value, key) {
                userTypeItems.push({ text: value.Text, value: value.Value });
            });
            $scope.userTypeOptions = userTypeItems;
            $scope.userTypeOnClose = function (combo) {
                var userType = combo.dataSource._data[combo.selectedIndex].value;
                debugger;
                switch (userType) {
                    case "Student":
                        $("#divStudent").show();
                        $scope.userOptions = {
                            autoBind: false,
                            text: "LastName",
                            value: "UserId",
                            template: '<span style="color:black;background-color: rgba(121, 120, 120, 0.99) !important;" class="k-state-default"><h3>#: data.FirstName #</h3><p>#: data.LastName #</p></span>',
                            transport: {
                                read: {
                                    url: RESOURCES.USERS_DOMAIN + "/api/Students?inlinecount=allpages",
                                    beforeSend: function (request) {
                                        debugger;
                                        var aut = JSON.parse(localStorage.getItem("lt"));
                                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                                    },
                                    type: "GET"
                                }
                            }
                        };
                }
                $scope.userTypeSelected = userType;
            }


            var $mailbox = $('#mailbox');
            // select message
            $mailbox.on('click', '.select_message', function () {
                    $(this).is(':checked') ? $(this).closest('li').addClass('md-card-list-item-selected') : $(this).closest('li').removeClass('md-card-list-item-selected');
                });

            // select all messages
            $('#mailbox_select_all').on('ifChanged',function() {
                var $this = $(this);
                $mailbox.find('.select_message').each(function() {
                    $this.is(':checked') ? $(this).iCheck('check') : $(this).iCheck('uncheck');
                })
            });

            // show message details
            $mailbox.on('click', '.md-card-list ul > li', function(e) {
                debugger;
                if ( !$(e.target).closest('.md-card-list-item-menu').length && !$(e.target).closest('.md-card-list-item-select').length ) {

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
            $(document).on('click keydown', function(e) {
                if (
                    ( !$(e.target).closest('li.item-shown').length ) || e.which === 27
                ) {
                    $mailbox.find('.item-shown').velocity("reverse", {
                        begin: function(elements) {
                            $(elements).removeClass('item-shown').children('.md-card-list-item-content-wrapper').hide().velocity("reverse");
                        }
                    });
                }
            });


            // file upload (new message)
            $timeout(function() {
                var progressbar = $("#mail_progressbar"),
                    bar         = progressbar.find('.uk-progress-bar'),
                    settings    = {
                        action: './upload/', // upload url
                        single: false,
                        loadstart: function() {
                            bar.css("width", "0%").text("0%");
                            progressbar.removeClass("uk-hidden uk-progress-danger");
                        },
                        progress: function(percent) {
                            percent = Math.ceil(percent);
                            bar.css("width", percent+"%").text(percent+"%");
                            if(percent === '100') {
                                setTimeout(function(){
                                    progressbar.addClass("uk-hidden");
                                }, 1500);
                            }
                        },
                        error: function(event) {
                            progressbar.addClass("uk-progress-danger");
                            bar.css({'width':'100%'}).text('100%');
                        },
                        abort: function(event) {
                            console.log(event);
                        },
                        complete: function(response, xhr) {
                            console.log(response);
                        }
                    };

                //var select = UIkit.uploadSelect($("#mail_upload-select"), settings),
                //    drop   = UIkit.uploadDrop($("#mail_upload-drop"), settings);
            })
        }
    ]);
});