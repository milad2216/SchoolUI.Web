define(['app'], function (app) {
    app.register.controller('questionSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES', 'enumService',
    function ($scope, $rootScope, dataService, $state, RESOURCES, enumService) {

        $scope.editQuestion = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("questionCrud", { question: myItem, mode: "edit" });
        }
        dataService.getData(RESOURCES.USERS_DOMAIN + '/api/Courses').then(function (data) {

            var courseItems = [];
            angular.forEach(data.Items, function (value, key) {
                courseItems.push({ text: value.Name, value: value.Id });
            });
            var DifficultyLevel = enumService.DifficultyLevel();
            var DifficultyLevelItems = [];
            angular.forEach(DifficultyLevel, function (value, key) {
                DifficultyLevelItems.push({ text: value.Text, value: value.Id });
            });
            var Grade = enumService.GradeEnum();
            var GradeItems = [];
            angular.forEach(Grade, function (value, key) {
                GradeItems.push({ text: value.Text, value: value.Id });
            });

            loadGrid(DifficultyLevelItems, GradeItems, courseItems);
        });
        $scope.addQuestion = function (e) {
            $state.go("questionCrud", { question: {} });
        }
        $scope.dataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    type: "GET",
                    url: RESOURCES.USERS_DOMAIN + "/api/Questions",
                    beforeSend: function (request) {
                        var aut = JSON.parse(localStorage.getItem("lt"));
                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                    },
                    withCredentials: true,
                    dataType: "json",
                },
                destroy: {
                    type: "DELETE",
                    url: function (options) {
                        return RESOURCES.USERS_DOMAIN + "/api/Quesions/" + options.Id;
                    },
                    beforeSend: function (request) {
                        var aut = JSON.parse(localStorage.getItem("lt"));
                        request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                    },
                    dataType: "json",
                    withCredentials: true,
                    complete: function (jqXhr, textStatus) {
                        $scope.mainGridOptions.dataSource.read();

                    }
                }
            },
            schema: {
                data: function (result) {
                    return result.Items;
                },
                total: function (data) {
                    return data.Count;
                },
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", editable: false, nullable: true },
                        QuestionText: { type: "string", defaultValue: null },
                        AttachmentAddress: { type: "string", defaultValue: null },
                        Subject: { type: "string", editable: false },
                        DifficultyLevel: { type: "number", editable: false, nullable: true },
                        Grade: { type: "number", defaultValue: null },
                        CourseId: { type: "number", defaultValue: null },
                        QuestionOptionIdCorrect: { type: "number", editable: false }
                    }
                }
            },
            autoSync: false,
            pageSize: 10,
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
        });



        var loadGrid = function (DifficultyLevelItems, GradeItems, CourseItems) {
            $scope.mainGridOptions = {
                dataSource: $scope.dataSource,
                filterable: {
                    extra: false
                },
                height: 500,
                groupable: false,
                resizable: true,
                scrollable: true,
                pageSize: 10,
                selectable: "row",
                sortable: {
                    mode: "single",
                    allowUnsort: true
                },
                pageable: {
                    buttonCount: 3,
                    previousNext: true,
                    numeric: true,
                    refresh: true,
                    info: true,
                    pageSizes: [10, 20, 50, 100]
                },
                dataBound: function () {
                    $(".k-grid").find('a').removeAttr('href');
                },
                toolbar: [{ name: "addQuestion", template: '<button data-ng-click=\'addQuestion()\' class=\'k-button\'>جدید</button>' }],
                editable: "inline",

                columns: [
                    {
                        field: "Subject",
                        title: "مبحث",
                        filterable:
                        {
                            cell:
                            {
                                dataSource: {},
                            }
                        }

                    }, {
                        field: 'DifficultyLevel',
                        title: 'وضعیت',
                        width: '300px',
                        values: DifficultyLevelItems
                    }, {
                        field: 'Grade',
                        title: 'مقطع تحصیلی',
                        width: '300px',
                        values: GradeItems
                    },
                    {
                        field: 'CourseId',
                        title: 'درس',
                        width: '300px',
                        values: CourseItems
                    },
                    {
                        command: [{
                            text: "حذف", name: "delete"
                        }, {
                            text: "ویرایش", click: $scope.editQuestion
                        }],
                        title: "&nbsp;",
                        width: 200
                    }
                ]
            };
        }
    }


    ]);
});