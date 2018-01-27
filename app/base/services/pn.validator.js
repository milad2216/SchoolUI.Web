define(['angularAMD'], function (app) {
    app.service("pn.validator", function () {
        function validate(form) {
            var result = {
                ErrorMessage: null,
                ValidationErrors: []
            };
            console.log(form);
            angular.forEach(form.$error, function (error, index) {
                angular.forEach(error, function (item, index) {
                    result.ValidationErrors.push({ ErrorMessage: item.$errorMessage });
                })
            });
            return result;
        }

        function validitionNationalCode(nationalCode) {
            if (nationalCode == null)
                return false;

            if (nationalCode.length == 10) {
                if (nationalCode == '1111111111' ||
                    nationalCode == '0000000000' ||
                    nationalCode == '2222222222' ||
                    nationalCode == '3333333333' ||
                    nationalCode == '4444444444' ||
                    nationalCode == '5555555555' ||
                    nationalCode == '6666666666' ||
                    nationalCode == '7777777777' ||
                    nationalCode == '8888888888' ||
                    nationalCode == '9999999999') {
                    return false;
                }
                c = parseInt(nationalCode.charAt(9));
                n = parseInt(nationalCode.charAt(0)) * 10 +
                    parseInt(nationalCode.charAt(1)) * 9 +
                    parseInt(nationalCode.charAt(2)) * 8 +
                    parseInt(nationalCode.charAt(3)) * 7 +
                    parseInt(nationalCode.charAt(4)) * 6 +
                    parseInt(nationalCode.charAt(5)) * 5 +
                    parseInt(nationalCode.charAt(6)) * 4 +
                    parseInt(nationalCode.charAt(7)) * 3 +
                    parseInt(nationalCode.charAt(8)) * 2;
                r = n - parseInt(n / 11) * 11;
                if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return {
            Validate: validate,
            ValiditionNationalCode: validitionNationalCode
        };
    });
}); 
 