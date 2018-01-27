define(['angularAMD'], function (app) {
    app.factory('pn.dateTime', function () {

        // if date1 greater than date2 then return 1
        // if date1 less than date2 then return -1
        // if date1 equal date2 then return 0
        function compareDate(date1, date2) {
            var d1 = parseInt(date1.replace(/\//g, ''));
            var d2 = parseInt(date2.replace(/\//g, ''));
            if (d1 < d2)
                return -1;
            else if (d1 > d2)
                return 1;
            else
                return 0;
        };

        function addMonth (date, num) {

            var day = parseInt(date.split('/')[2]);
            var month = parseInt(date.split('/')[1]);
            var year = parseInt(date.split('/')[0]);

            var newMonth = month + num;
            month = newMonth % 12;
            year += Math.floor(newMonth / 12);
            if (month == 0) {
                month = 12;
                year--;
            }
            return (10000 + year).toString().substr(1, 4) +
                "/" +
                (100 + month).toString().substr(1, 2) +
                "/" +
                (100 + day).toString().substr(1, 2);

        };

        function diffrenceDateInDay(date1, date2) {
             
           
        };
        return {
            compareDate,
            addMonth,
            diffrenceDateInDay
        }
    });
});