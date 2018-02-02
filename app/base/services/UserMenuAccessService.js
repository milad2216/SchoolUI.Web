define(['angularAMD'], function (app) {
    app.service('userMenuAccessService', [function () {

        return {

            ManagerMenus: function () {
                var menus = [
                    {
                        SystemTitle: "اطلاعات پایه", SystemKey: '05e77746-d179-e711-966b-000c29eedd59',
                        Childs: [{ Title: "کلاس", Action: "schoolClasses" }, { Title: "دانش آموز", Action: "studentSearch" },
                            { Title: "کارمند", Action: "employeeSearch" }, { Title: "معلم", Action: "teacherSearch" },
                            { Title: "راننده", Action: "driverSearch" }, { Title: "شهریه", Action: "gradeAcademicYear" },
                        { Title: "معلم کلاس", Action: "schoolCourse" }, { Title: "بایگانی", Action: "property" }]
                    },
                {
                    SystemTitle: "مالی", SystemKey: '30f8678d-dffb-e611-ac4f-38d54778b1eb',
                    Childs: [{ Title: "ثبت چک", Action: "adminSearch" }, { Title: "پرداخت های غیر شهریه", Action: "admin" },
                    { Title: "ثبت پرداخت", Action: "payItemSearch" }]
                },
                {
                    SystemTitle: "موارد انظباطی", SystemKey: '30f8678d-dffb-e611-ac4f-38d54778b1eb',
                    Childs: [{ Title: " ثبت موارد انظباطی", Action: "disciplineItemSearch" }]
                }, {
                    SystemTitle: "ارتباطات", SystemKey: '1f65a61c-ce79-e711-966b-000c29eedd59',
                    Childs: [{ Title: "پیام ها", Action: "message" }]
                }
                ];
                return menus;
            },

            StudentMenus: function () {
                var menus = [
                    {
                        SystemTitle: "ارتباطات", SystemKey: '1f65a61c-ce79-e711-966b-000c29eedd59',
                        Childs: [{ Title: "ثبت درخواست", Action: "studentRequestSearch" }]
                    }
                ];
                return menus;
            },
            TeacherMenus: function () {
                var menus = [
                ];
                return menus;
            },
            ParentMenus: function () {
                var menus = [
                ];
                return menus;
            },
            EmployeeMenus: function () {
                var menus = [
                ];
                return menus;
            }
        }
    }])
});

