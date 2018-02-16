define(['app'], function (app) {
    app.register.controller('assignmentAnswerController', ['$scope', '$rootScope', 'dataService', '$stateParams', 'enumService', '$state', 'RESOURCES', 'Notification',
        function ($scope, $rootScope, dataService, $stateParams, enumService, $state, RESOURCES, Notification) {
            $scope.assignment = $stateParams.assignment;
            click: $scope.showAnswer = function (e) {
                var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
                $state.go("assignmentAnswer", { assignment: myItem, mode: "edit" });
            }
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: {
                    read: {
                        type: "GET",
                        url: RESOURCES.USERS_DOMAIN + "/api/AssignmentAnswerds?$filter=AssignmentId eq " + $scope.assignment.Id,
                        beforeSend: function (request) {
                            var aut = JSON.parse(localStorage.getItem("lt"));
                            request.setRequestHeader('Authorization', aut.token_type + ' ' + aut.access_token);
                        },
                        withCredentials: true,
                        dataType: "json",
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
                            Id: { type: "number", editable: false, nullable: false },
                            StudentId: { type: "number", nullable: false },
                            Description: { type: "string", nullable: false },
                            AssignmentFileAddress: { type: "string", nullable: false },
                            Student: { defaultValue: {} },
                            StudentFirstName: { from: "Student.FirstName", type: "string", editable: false, nullable: true },
                            StudentLastName: { from: "Student.LastName", type: "string", editable: false, nullable: true }
                        }
                    }
                },
                autoSync: false,
                pageSize: 9,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            });

            $scope.mainGridOptions = {
                dataSource: dataSource,
                filterable: {
                    extra: false
                },
                height: 490,
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
                editable: "inline",

                columns: [
                    {
                        field: "StudentFirstName",
                        title: "نام دانش‌آموز",
                        width: 200
                    }, {
                        field: 'StudentLastName',
                        title: 'نام‌خانوادگی دانش‌آموز',
                        width: 200
                    }, {
                        field: "Description",
                        title: "توضیحات"
                    }, {
                        command: [{
                            text: "نمایش", click: $scope.showAnswer
                        }],
                        title: "&nbsp;",
                        width: 300
                    }
                ]
            };
        }


    ]);
});