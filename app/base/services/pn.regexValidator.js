
define(['angularAMD'], function (app) {
    app.service("pn.regexValidator", function () {

        var regex = {
            Mobile: /^(\+91-|\+91|0)?\d{10}$/,
            Phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            Email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            Farsi: '',
            Latin: /^[A-Za-z][A-Za-z0-9]*$/,
            Url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        };

        function validate(text, regexp) {
            return text.match(regexp);
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
            regex: regex,
            validate: validate,
            validitionNationalCode: validitionNationalCode
        };
    });
});