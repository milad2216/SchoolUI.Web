define(['angularAMD'], function (control) {
    control.directive("pnScheduler", ["$window", "$parse", "localStorageService", "AuthToken", "blockUI", "cache", "$state", e]);
    function e($window, $parse, localStorageService, tokenKey, blockUI, cache, $state) {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                schedulerConfig: "=config",
                schedulerSchema: "=schema",
                selectedCalendarType: "=calendarType",
                addingEventPermission: "=addPermission",
                editingEventPermission: "=editPermission",
                deletingEventPermission: "=deletePermission",
                resource: "&",
                cancel: "&",
                apply: "&",
                toolbars: "=",
                selecteditems: "=",
                parameters: "=",
                api: "=",
                onKendoReady: '&',
                onDblClick: '&',
                onKendoDataBound: '&',
                onSelectCell: "&",
                afterCreate: "&",
            },
            template: function (element, attrs) {
                return '<div kendo-jalali-scheduler="kendoScheduler" class="k-rtl mousetrap" k-options="schedulerOptions"></div>';
            },
            link: function (scope, element, attrs) {
                scope.resourceDataSource = new kendo.data.DataSource({});
                scope.schedulerOptions = {
                    selectable: true,
                    date: scope.schedulerConfig.date,
                    tag: scope.schedulerConfig.tag,
                    height: 660,
                    views: [
                        { type: "month", selected: true },
                    ],
                   timezone: "Asia/Tehran",
                   //timezone: "Etc/UTC",
                    dataSource: {
                        batch: false,
                        transport: {
                            read:
                            {
                                url: scope.schedulerConfig.inlineOperationalUrl.read.url,
                                data: scope.schedulerConfig.inlineOperationalUrl.read.data,
                                type: "POST",
                                contentType: "application/json",
                                beforeSend: function (req) {
                                    //
                                }
                            },
                            update: {
                                url: scope.schedulerConfig.inlineOperationalUrl.update.url,
                                type: "POST",
                                contentType: "application/json"
                            },
                            create: {
                                url: scope.schedulerConfig.inlineOperationalUrl.create.url,
                                //data: scope.schedulerConfig.inlineOperationalUrl.read.data,
                                type: "POST",
                                contentType: "application/json"
                            },
                            destroy: {
                                url: scope.schedulerConfig.inlineOperationalUrl.destroy.url,
                                type: "POST",
                                contentType: "application/json"
                            },
                            parameterMap: function (options, operation) {
                                if (operation !== "read" && options) {
                                    options.CalendarTypeId = scope.selectedCalendarType;
                                    //var s = options.Start.gregoriandate;
                                    //var d = options.End.gregoriandate;
                                    //var startDate = new Date(s.getFullYear(), s.getMonth(),s.getDate(), 12, 0, 0);
                                    //var endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
                                    //startDate.setDate(startDate.getDate() + 1);
                                    //endDate.setDate(endDate.getDate() + 1);
                                    //options.Start = startDate;
                                    //options.End = endDate;
                                    options.Start = options.Start.gregoriandate || options.Start;
                                    options.End = options.End.gregoriandate || options.End;
                                    return angular.toJson(options);
                                }
                            },
                            data: function (d) {
                                console.log(d);
                                return d;
                            }
                        },
                        error: function (e) {
                        },
                        sync: function () {
                            this.read();
                        },
                        requestStart: function (e) {
                            var type = e.type;
                            if (type === "read") {
                                return;
                            }

                            var key = $state.current.name + "______scheduler";
                            if (cache[key] === "yesterday")
                                return;
                            cache[key] = "yesterday";
                            blockUI.start();
                        },
                        requestEnd: function(e) {
                            var type = e.type;
                            if (type === "create" || type === "destroy") {
                                scope.afterCreate();
                            }

                            if (type === "read") {
                                return;
                            }

                            var key = $state.current.name + "______scheduler";
                            if (cache[key] === "yesterday") {
                                delete cache[key];
                                blockUI.stop();
                            }
                            
                        },
                        schema: scope.schedulerConfig.schema,
                        
                    },
                    editable: {
                        move: false
                    },
                    resources: [
                        {
                            field: "ownerId",
                            title: "Owner",
                            dataSource: scope.resourceDataSource
                        }
                    ],
                    change: scheduler_change,
                    add: function (e) {
                        debugger;
                        if (!scope.addingEventPermission)
                            e.preventDefault();
                        scope.addingEventPermission = false;
                    },
                    edit: function (e) {
                        if (!scope.editingEventPermission) {
                            e.preventDefault();
                        }
                        var container = e.container;
                        //var selectedCalendarTypeId = scope.selectedCalendarType;
                        container.find("[data-container-for=title]").find("[name='title']").prop('readonly', true);
                        container.find("[data-container-for=title]")
                            .find("[name='title']")
                                .val(container.find("[data-container-for=ownerId]")
                                    .find("[data-role=dropdownlist]").children("option").filter(":selected").text())

                        container.find("[data-container-for=ownerId]")
                            .find("[data-role=dropdownlist]").change(function () {
                                container.find("[data-container-for=title]")
                                    .find("[name='title']")
                                        .val(container.find("[data-container-for=ownerId]")
                                            .find("[data-role=dropdownlist]").children("option").filter(":selected").text())
                            });

                        var radioButton = container.find(".k-recur-end-until").attr('checked', 'checked');

                        var uid = e.container.attr('data-uid');
                        var element = e.sender.element.find('div.k-event[data-uid="' + uid + '"]');

                        scope.editingEventPermission = false;
                    },
                    cancel: function (e) {
                        scope.cancel();
                    },
                    save: function (e) {
                        scope.cancel();
                    },
                    dataBound: function (arg) {
                        if (!scope.alreadyCalled) {
                            scope.alreadyCalled = true;
                            scope.onKendoReady({ kendo: scope.kendoScheduler });
                            scope.kendoScheduler.view("month");

                        }
                    }
                };

                scope.api = {
                    refresh: function () {
                        return scope.schedulerOptions
                    },
                    setActive: function () { }
                };
                scope.resource({ dataSource: scope.resourceDataSource });

                $(".k-edit-form-container .k-dropdown-wrap").change(function (e) {
                    alert("");
                });


                function scheduler_change(e) {
                    setTimeout(function () {
                        var parent = $(e.sender.element);
                        $('[data-role="jalalischeduler"]')
                            .not(parent)
                            .each(function () {
                                $(this).data('kendoJalaliScheduler').select(null);
                            });
                        if (e.events.length > 1) {
                            console.log("cooooooooooooooooooooooooo");
                        }
                            
                    }, 0);
                }
            }

        }
    }
});