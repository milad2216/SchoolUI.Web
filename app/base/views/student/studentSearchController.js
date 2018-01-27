define(['app'], function (app) {
    app.register.controller('studentSearchController', ['$scope', '$rootScope', 'dataService', '$state', 'RESOURCES',
    function ($scope, $rootScope, dataService, $state, RESOURCES) {

        $scope.addStudent = function (e) {
            //var myItem = $scope.mainGrid.dataItem($(e.target).closest("tr"));
            $state.go("studentCrud", { student: {} });
            //$scope.$apply();
        }

        $scope.editEditStudent = function (e) {
            var myItem = $scope.kendoGrid.dataItem($(e.target).closest("tr"));
            $state.go("studentCrud", { student: myItem, mode: "edit" });
        }

        $scope.dataSource = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    type: "GET",
                    url: RESOURCES.USERS_DOMAIN + "/api/Students",
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
                        return RESOURCES.USERS_DOMAIN + "/api/Students/" + options.Id;
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
                        FirstName: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن نام الزامی است." } } },
                        LastName: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن نام خانوادگی الزامی است." } } },
                        BirthPlace: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن محل تولد الزامی است." } } },
                        BirthCertificateIssuancePlace: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن محل صدور الزامی است." } } },
                        BirthDate: { type: "date", defaultValue: null, validation: { required: { message: "وارد نمودن تاریخ تولد الزامی است." } } },
                        NationalCode: { type: "string", defaultValue: null, validation: { minlengh: { message: "طول کد ملی 10 کاراکتر است." } } },
                        Address: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن آدرس الزامی است." } } },
                        LandLinePhoneNumber: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن محل تولد الزامی است." } } },
                        MobilePhoneNumber: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن محل تولد الزامی است." } } },
                        EmergencyPhoneNumber: { type: "string", defaultValue: null, validation: { required: { message: "وارد نمودن محل تولد الزامی است." } } },
                        Email: { type: "string", editable: false, nullable: true, validation: { required: { message: "وارد نمودن محل تولد الزامی است." } } },
                        ParentIdFather: { type: "number", editable: false, nullable: true },
                        ParentIdMother: { type: "number", defaultValue: null, validation: { required: { message: "وارد نمودن پایه الزامی است." } } },
                        LastYearGPA: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        Major: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        UserId: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        GradeAcademicYearId: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        PictureAddress: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        SchoolClassId: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        DriverId: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } },
                        UserIdCreator: { type: "string", validation: { required: { message: "انتخاب مدرسه الزامی است." } } }
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
            dataSource: $scope.dataSource,
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
            toolbar: [{ name: "addStudent", template: '<button data-ng-click=\'addStudent()\' class=\'k-button\'>اضافه کردن دانش آموز</button>' }],
            editable: "inline",

            columns: [
                {
                    field: "FirstName",
                    title: "نام",
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }

                }, {
                    field: "LastName",
                    title: "نام خانوادگی",
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }

                }, {
                    field: "BirthDate",
                    title: "تاریخ تولد",
                    template: "#= moment(BirthDate).format('jYYYY/jMM/jDD')#",
                    filterable:
                    {
                        extra: true,
                        ui: 'datepicker',
                        operators: {
                            date: {
                                gt: "بزرگتر",
                                lt: "کوچکتر"
                            }
                        }
                    }
                },
                {
                    field: "NationalCode",
                    title: "کد ملی",
                    filterable:
                    {
                        cell:
                        {
                            dataSource: {},
                        }
                    }
                },
                {
                    command: [{
                        text: "ویرایش", click: $scope.editEditStudent
                    }, "delete"],
                    title: "&nbsp;",
                    width: 200
                },
            ]
        };
    }


    ]);
});