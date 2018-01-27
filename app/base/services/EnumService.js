define(['angularAMD'], function (app) {
    app.service('enumService', [function () {

        return {

            AcademicDegreeEnum: function () {
                return [{ Id: 0, Value: 'Baccalaureate', Text: 'کارشناسی' }, { Id: 1, Value: 'Licence', Text: 'نمیدونم چیه' }, { Id: 2, Value: 'Master', Text: 'کارشناسی ارشد' }, { Id: 3, Value: 'Doctorate', Text: 'دکتری' }];
            },

            DifficultyLevel: function () {

                return [{ Id: 0, Value: 'Easy', Text: 'ساده' }, { Id: 1, Value: 'Normal', Text: 'معمولی' }, { Id: 2, Value: 'Hard', Text: 'سخت' }];
            },
            MajorEnum: function (id) {
                var majors = [{ Id: 0, Value: 'Undetermined', Text: 'نامشخص' }, { Id: 1, Value: 'MathematicsAndPhysics', Text: 'ریاضی و فیزیک' }, { Id: 2, Value: 'ExperimentalSciences', Text: 'علوم تجربی' }
                    , { Id: 3, Value: 'HumanSciences', Text: 'علوم انسانی' }, { Id: 4, Value: 'TechnicalAndVocational', Text: 'فنی و حرفه ای' }, { Id: 5, Value: 'WorkAndKnowledge', Text: 'کار و دانش' }];
                if (id !== undefined && id !== null && id >= 0) {
                    var res = undefined;
                    angular.forEach(majors, function (value, key) {
                        if (value.Id === id) {
                            res = value;
                        }
                    });
                    if (res) {
                        return res;
                    }
                }
                return majors;
            },
            PayStateEnum: function () {
                return [{ Id: 0, Value: 'Payed', Text: 'پرداخت شده' }, { Id: 1, Value: 'NotPayed', Text: 'پرداخت نشده' }, { Id: 2, Value: 'Waiting', Text: 'در انتظار' }];
            },
            RequestState: function () {
                return [{ Id: 0, Value: 'Sent', Text: 'ارسال شده' }, { Id: 1, Value: 'Pending', Text: 'در حال بررسی' }, { Id: 2, Value: 'Approved', Text: 'تایید درخواست' }, { Id: 3, Value: 'Denied', Text: 'رد درخواست' }];
            },
            RoleEnum: function () {
                return [{ Id: 0, Value: 'Admin', Text: 'مدیر سیستم' }, { Id: 1, Value: 'Manager', Text: 'مدیر مدرسه' }, { Id: 2, Value: 'Employee', Text: 'کارمند' }
                    , { Id: 3, Value: 'Teacher', Text: 'معلم' }, { Id: 4, Value: 'Student', Text: 'دانش آموز' }, { Id: 5, Value: 'Parent', Text: 'والدین' }];
            },
            RollCallType: function () {
                return [{ Id: 0, Value: 'Present', Text: 'حاضر' }, { Id: 1, Value: 'Absent', Text: 'غایب' }, { Id: 2, Value: 'PresentWithDelay', Text: 'حضور با تاخیر' }];
            },
            GradeEnum: function (id) {
                var grade = [{ Id: 1, Value: '1', Text: 'اول ابتدایی' }, { Id: 2, Value: '2', Text: 'دوم ابتدایی' }, { Id: 3, Value: '3', Text: 'سوم ابتدایی' }
                    , { Id: 4, Value: '4', Text: 'چهارم ابتدایی' }, { Id: 5, Value: '5', Text: 'پنجم ابتدایی' }, { Id: 6, Value: '6', Text: 'ششم ابتدایی' },
                { Id: 7, Value: '7', Text: 'اول متوسطه' }, { Id: 8, Value: '8', Text: 'دوم متوسطه' }, { Id: 9, Value: '9', Text: 'سوم متوسطه' }
                    , { Id: 10, Value: '10', Text: 'چهارم متوسطه' }, { Id: 11, Value: '11', Text: 'پنجم متوسطه' }, { Id: 12, Value: '12', Text: 'ششم متوسطه' }];
                if (id) {
                    var res = undefined;
                    angular.forEach(grade, function (value, key) {
                        if (value.Id === id) {
                            res = value;
                        }
                    });
                    if (res) {
                        return res;
                    }
                }
                return grade;
            }
        }
    }])
});

