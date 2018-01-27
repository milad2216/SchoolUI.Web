/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.recurrence', [
        'kendo.dropdownlist',
        'kendo.datepicker',
        'kendo.numerictextbox'
    ], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.recurrence',
        name: 'Recurrence',
        category: 'web',
        depends: [
            'dropdownlist',
            'datepicker',
            'numerictextbox'
        ],
        hidden: true
    };
    (function ($, undefined) {
        var kendo = window.kendo, DATE = JalaliDate, timezone = kendo.timezone, Class = kendo.Class, ui = kendo.ui, Widget = ui.Widget, DropDownList = ui.DropDownList, kendoDate = JalaliKendoDate, setTime = kendoDate.setTime, setDayOfWeek = kendoDate.setDayOfWeek, adjustDST = kendoDate.adjustDST, firstDayOfMonth = kendoDate.firstDayOfMonth, getMilliseconds = kendoDate.getMilliseconds, DAYS_IN_LEAPYEAR = [
                0,
                31,
                62,
                93,
                124,
                155,
                186,
                216,
                246,
                276,
                306,
                336,
                366
            ], DAYS_IN_YEAR = [
                 0,
                31,
                62,
                93,
                124,
                155,
                186,
                216,
                246,
                276,
                306,
                336,
                365
            ], MONTHS = [
                31,
                31,
                31,
                31,
                31,
                31,
                30,
                30,
                30,
                30,
                30,
                29
            ], WEEK_DAYS = {
                0: 'SU',
                1: 'MO',
                2: 'TU',
                3: 'WE',
                4: 'TH',
                5: 'FR',
                6: 'SA'
            }, WEEK_DAYS_IDX = {
                'SU': 0,
                'MO': 1,
                'TU': 2,
                'WE': 3,
                'TH': 4,
                'FR': 5,
                'SA': 6
            }, DATE_FORMATS = [
                'yyyy-MM-ddTHH:mm:ss.fffzzz',
                'yyyy-MM-ddTHH:mm:sszzz',
                'yyyy-MM-ddTHH:mm:ss',
                'yyyy-MM-ddTHH:mm',
                'yyyy-MM-ddTHH',
                'yyyy-MM-dd',
                'yyyyMMddTHHmmssfffzzz',
                'yyyyMMddTHHmmsszzz',
                'yyyyMMddTHHmmss',
                'yyyyMMddTHHmm',
                'yyyyMMddTHH',
                'yyyyMMdd'
            ], RULE_NAMES = [
                'months',
                'weeks',
                'yearDays',
                'monthDays',
                'weekDays',
                'hours',
                'minutes',
                'seconds'
            ], RULE_NAMES_LENGTH = RULE_NAMES.length, RECURRENCE_DATE_FORMAT = 'yyyyMMddTHHmmssZ', limitation = {
                months: function (date, end, rule) {
                    var monthRules = rule.months, months = ruleValues(monthRules, date.getMonth() + 1), changed = false;
                    if (months !== null) {
                        if (months.length) {
                            date.setMonth(months[0] - 1, 1);
                        } else {
                            date.setFullYear(date.getFullYear() + 1, monthRules[0] - 1, 1);
                        }
                        changed = true;
                    }
                    return changed;
                },
                monthDays: function (date, end, rule) {
                    var monthLength, month, days, changed = false, hours = date.getHours(), normalize = function (monthDay) {
                            if (monthDay < 0) {
                                monthDay = monthLength + monthDay;
                            }
                            return monthDay;
                        };
                    while (date <= end) {
                        month = date.getMonth();
                        monthLength = getMonthLength(date);
                        days = ruleValues(rule.monthDays, date.getDate(), normalize);
                        if (days === null) {
                            return changed;
                        }
                        changed = true;
                        if (days.length) {
                            date.setMonth(month, days.sort(numberSortPredicate)[0]);
                            adjustDST(date, hours);
                            if (month === date.getMonth()) {
                                break;
                            }
                        } else {
                            date.setMonth(month + 1, 1);
                        }
                    }
                    return changed;
                },
                yearDays: function (date, end, rule) {
                    var year, yearDays, changed = false, hours = date.getHours(), normalize = function (yearDay) {
                            if (yearDay < 0) {
                                yearDay = year + yearDay;
                            }
                            return yearDay;
                        };
                    while (date < end) {
                        year = leapYear(date) ? 366 : 365;
                        yearDays = ruleValues(rule.yearDays, dayInYear(date), normalize);
                        if (yearDays === null) {
                            return changed;
                        }
                        changed = true;
                        year = date.getFullYear();
                        if (yearDays.length) {
                            date.setFullYear(year, 0, yearDays.sort(numberSortPredicate)[0]);
                            adjustDST(date, hours);
                            break;
                        } else {
                            date.setFullYear(year + 1, 0, 1);
                        }
                    }
                    return changed;
                },
                weeks: function (date, end, rule) {
                    var weekStart = rule.weekStart, year, weeks, day, changed = false, hours = date.getHours(), normalize = function (week) {
                            if (week < 0) {
                                week = 53 + week;
                            }
                            return week;
                        };
                    while (date < end) {
                        weeks = ruleValues(rule.weeks, weekInYear(date, weekStart), normalize);
                        if (weeks === null) {
                            return changed;
                        }
                        changed = true;
                        year = date.getFullYear();
                        if (weeks.length) {
                            day = weeks.sort(numberSortPredicate)[0] * 7 - 1;
                            date.setFullYear(year, 0, day);
                            setDayOfWeek(date, weekStart, -1);
                            adjustDST(date, hours);
                            break;
                        } else {
                            date.setFullYear(year + 1, 0, 1);
                        }
                    }
                    return changed;
                },
                weekDays: function (date, end, rule) {
                    var weekDays = rule.weekDays;
                    var weekStart = rule.weekStart;
                    var weekDayRules = ruleWeekValues(weekDays, date, weekStart);
                    var hours = date.getHours();
                    var weekDayRule, day;
                    if (weekDayRules === null) {
                        return false;
                    }
                    weekDayRule = weekDayRules[0];
                    if (!weekDayRule) {
                        weekDayRule = weekDays[0];
                        setDayOfWeek(date, weekStart);
                    }
                    day = weekDayRule.day;
                    if (weekDayRule.offset) {
                        while (date <= end && !isInWeek(date, weekDayRule, weekStart)) {
                            if (weekInMonth(date, weekStart) === numberOfWeeks(date, weekStart)) {
                                date.setMonth(date.getMonth() + 1, 1);
                                adjustDST(date, hours);
                            } else {
                                date.setDate(date.getDate() + 7);
                                adjustDST(date, hours);
                                setDayOfWeek(date, weekStart, -1);
                            }
                        }
                    }
                    if (date.getDay() !== day) {
                        setDayOfWeek(date, day);
                    }
                    return true;
                },
                hours: function (date, end, rule) {
                    var hourRules = rule.hours, startTime = rule._startTime, startHours = startTime.getHours(), hours = ruleValues(hourRules, startHours), changed = false;
                    if (hours !== null) {
                        changed = true;
                        date.setHours(startHours);
                        adjustDST(date, startHours);
                        if (hours.length) {
                            hours = hours[0];
                            date.setHours(hours);
                        } else {
                            hours = date.getHours();
                            date.setDate(date.getDate() + 1);
                            adjustDST(date, hours);
                            hours = hourRules[0];
                            date.setHours(hours);
                            adjustDST(date, hours);
                        }
                        if (rule.minutes) {
                            date.setMinutes(0);
                        }
                        startTime.setHours(hours, date.getMinutes());
                    }
                    return changed;
                },
                minutes: function (date, end, rule) {
                    var minuteRules = rule.minutes, currentMinutes = date.getMinutes(), minutes = ruleValues(minuteRules, currentMinutes), hours = rule._startTime.getHours(), changed = false;
                    if (minutes !== null) {
                        changed = true;
                        if (minutes.length) {
                            minutes = minutes[0];
                        } else {
                            hours += 1;
                            minutes = minuteRules[0];
                        }
                        if (rule.seconds) {
                            date.setSeconds(0);
                        }
                        date.setHours(hours, minutes);
                        hours = hours % 24;
                        adjustDST(date, hours);
                        rule._startTime.setHours(hours, minutes, date.getSeconds());
                    }
                    return changed;
                },
                seconds: function (date, end, rule) {
                    var secondRules = rule.seconds, hours = rule._startTime.getHours(), seconds = ruleValues(secondRules, date.getSeconds()), minutes = date.getMinutes(), changed = false;
                    if (seconds !== null) {
                        changed = true;
                        if (seconds.length) {
                            date.setSeconds(seconds[0]);
                        } else {
                            minutes += 1;
                            date.setMinutes(minutes, secondRules[0]);
                            if (minutes > 59) {
                                minutes = minutes % 60;
                                hours = (hours + 1) % 24;
                            }
                        }
                        rule._startTime.setHours(hours, minutes, date.getSeconds());
                    }
                    return changed;
                }
            }, BaseFrequency = Class.extend({
                next: function (date, rule) {
                    var startTime = rule._startTime, day = startTime.getDate(), minutes, seconds;
                    if (rule.seconds) {
                        seconds = date.getSeconds() + 1;
                        date.setSeconds(seconds);
                        startTime.setSeconds(seconds);
                        startTime.setDate(day);
                    } else if (rule.minutes) {
                        minutes = date.getMinutes() + 1;
                        date.setMinutes(minutes);
                        startTime.setMinutes(minutes);
                        startTime.setDate(day);
                    } else {
                        return false;
                    }
                    return true;
                },
                normalize: function (options) {
                    var rule = options.rule;
                    if (options.idx === 4 && rule.hours) {
                        rule._startTime.setHours(0);
                        this._hour(options.date, rule);
                    }
                },
                limit: function (date, end, rule) {
                    var interval = rule.interval, ruleName, firstRule, modified, idx, day;
                    while (date <= end) {
                        modified = firstRule = undefined;
                        day = date.getDate();
                        for (idx = 0; idx < RULE_NAMES_LENGTH; idx++) {
                            ruleName = RULE_NAMES[idx];
                            if (rule[ruleName]) {
                                modified = limitation[ruleName](date, end, rule);
                                if (firstRule !== undefined && modified) {
                                    break;
                                } else {
                                    firstRule = modified;
                                }
                            }
                            if (modified) {
                                this.normalize({
                                    date: date,
                                    rule: rule,
                                    day: day,
                                    idx: idx
                                });
                            }
                        }
                        if ((interval === 1 || !this.interval(rule, date)) && idx === RULE_NAMES_LENGTH) {
                            break;
                        }
                    }
                },
                interval: function (rule, current) {
                    var start = new DATE(rule._startPeriod);
                    var date = new DATE(current);
                    var hours = current.getHours();
                    var weekStart = rule.weekStart;
                    var interval = rule.interval;
                    var frequency = rule.freq;
                    var modified = false;
                    var excess = 0;
                    var month = 0;
                    var day = 1;
                    var diff;
                    var startTimeHours;
                    if (frequency === 'hourly') {
                        diff = date.getTimezoneOffset() - start.getTimezoneOffset();
                        startTimeHours = rule._startTime.getHours();
                        date = date.getTime();
                        if (hours !== startTimeHours) {
                            date += (startTimeHours - hours) * kendoDate.MS_PER_HOUR;
                        }
                        date -= start;
                        if (diff) {
                            date -= diff * kendoDate.MS_PER_MINUTE;
                        }
                        diff = Math.floor(date / kendoDate.MS_PER_HOUR);
                        excess = intervalExcess(diff, interval);
                        if (excess !== 0) {
                            this._hour(current, rule, excess);
                            modified = true;
                        }
                    } else if (frequency === 'daily') {
                        kendoDate.setTime(date, -start, true);
                        diff = Math.ceil(date / kendoDate.MS_PER_DAY);
                        excess = intervalExcess(diff, interval);
                        if (excess !== 0) {
                            this._date(current, rule, excess);
                            modified = true;
                        }
                    } else if (frequency === 'weekly') {
                        diff = (current.getFullYear() - start.getFullYear()) * 52;
                        excess = weekInYear(current, weekStart) - weekInYear(start, weekStart) + diff;
                        excess = intervalExcess(excess, interval);
                        if (excess !== 0) {
                            kendoDate.setDayOfWeek(current, rule.weekStart, -1);
                            current.setDate(current.getDate() + excess * 7);
                            adjustDST(current, hours);
                            modified = true;
                        }
                    } else if (frequency === 'monthly') {
                        diff = current.getFullYear() - start.getFullYear();
                        diff = current.getMonth() - start.getMonth() + diff * 12;
                        excess = intervalExcess(diff, interval);
                        if (excess !== 0) {
                            day = rule._hasRuleValue ? 1 : current.getDate();
                            current.setFullYear(current.getFullYear(), current.getMonth() + excess, day);
                            adjustDST(current, hours);
                            modified = true;
                        }
                    } else if (frequency === 'yearly') {
                        diff = current.getFullYear() - start.getFullYear();
                        excess = intervalExcess(diff, interval);
                        if (!rule.months) {
                            month = current.getMonth();
                        }
                        if (!rule.yearDays && !rule.monthDays && !rule.weekDays) {
                            day = current.getDate();
                        }
                        if (excess !== 0) {
                            current.setFullYear(current.getFullYear() + excess, month, day);
                            adjustDST(current, hours);
                            modified = true;
                        }
                    }
                    return modified;
                },
                _hour: function (date, rule, interval) {
                    var startTime = rule._startTime, hours = startTime.getHours();
                    if (interval) {
                        hours += interval;
                    }
                    date.setHours(hours);
                    hours = hours % 24;
                    startTime.setHours(hours);
                    adjustDST(date, hours);
                },
                _date: function (date, rule, interval) {
                    var hours = date.getHours();
                    date.setDate(date.getDate() + interval);
                    if (!adjustDST(date, hours)) {
                        this._hour(date, rule);
                    }
                }
            }), HourlyFrequency = BaseFrequency.extend({
                next: function (date, rule) {
                    if (!BaseFrequency.fn.next(date, rule)) {
                        this._hour(date, rule, 1);
                    }
                },
                normalize: function (options) {
                    var rule = options.rule;
                    if (options.idx === 4) {
                        rule._startTime.setHours(0);
                        this._hour(options.date, rule);
                    }
                }
            }), DailyFrequency = BaseFrequency.extend({
                next: function (date, rule) {
                    if (!BaseFrequency.fn.next(date, rule)) {
                        this[rule.hours ? '_hour' : '_date'](date, rule, 1);
                    }
                }
            }), WeeklyFrequency = DailyFrequency.extend({
                setup: function (rule, eventStartDate) {
                    if (!rule.weekDays) {
                        rule.weekDays = [{
                                day: eventStartDate.getDay(),
                                offset: 0
                            }];
                    }
                }
            }), MonthlyFrequency = BaseFrequency.extend({
                next: function (date, rule) {
                    var day, hours;
                    if (!BaseFrequency.fn.next(date, rule)) {
                        if (rule.hours) {
                            this._hour(date, rule, 1);
                        } else if (rule.monthDays || rule.weekDays || rule.yearDays || rule.weeks) {
                            this._date(date, rule, 1);
                        } else {
                            day = date.getDate();
                            hours = date.getHours();
                            date.setMonth(date.getMonth() + 1);
                            adjustDST(date, hours);
                            while (date.getDate() !== day) {
                                date.setDate(day);
                                adjustDST(date, hours);
                            }
                            this._hour(date, rule);
                        }
                    }
                },
                normalize: function (options) {
                    var rule = options.rule, date = options.date, hours = date.getHours();
                    if (options.idx === 0 && !rule.monthDays && !rule.weekDays) {
                        date.setDate(options.day);
                        adjustDST(date, hours);
                    } else {
                        BaseFrequency.fn.normalize(options);
                    }
                },
                setup: function (rule, eventStartDate, date) {
                    if (!rule.monthDays && !rule.weekDays) {
                        date.setDate(eventStartDate.getDate());
                    }
                }
            }), YearlyFrequency = MonthlyFrequency.extend({
                next: function (date, rule) {
                    var day, hours = date.getHours();
                    if (!BaseFrequency.fn.next(date, rule)) {
                        if (rule.hours) {
                            this._hour(date, rule, 1);
                        } else if (rule.monthDays || rule.weekDays || rule.yearDays || rule.weeks) {
                            this._date(date, rule, 1);
                        } else if (rule.months) {
                            day = date.getDate();
                            date.setMonth(date.getMonth() + 1);
                            adjustDST(date, hours);
                            while (date.getDate() !== day) {
                                date.setDate(day);
                                adjustDST(date, hours);
                            }
                            this._hour(date, rule);
                        } else {
                            date.setFullYear(date.getFullYear() + 1);
                            adjustDST(date, hours);
                            this._hour(date, rule);
                        }
                    }
                },
                setup: function () {
                }
            }), frequencies = {
                'hourly': new HourlyFrequency(),
                'daily': new DailyFrequency(),
                'weekly': new WeeklyFrequency(),
                'monthly': new MonthlyFrequency(),
                'yearly': new YearlyFrequency()
            }, CLICK = 'click';
        function intervalExcess(diff, interval) {
            var excess;
            if (diff !== 0 && diff < interval) {
                excess = interval - diff;
            } else {
                excess = diff % interval;
                if (excess) {
                    excess = interval - excess;
                }
            }
            return excess;
        }
        function dayInYear(date) {
            var month = date.getMonth();
            var days = leapYear(date) ? DAYS_IN_LEAPYEAR[month] : DAYS_IN_YEAR[month];
            return days + date.getDate();
        }
        function weekInYear(date, weekStart) {
            var year, days;
            date = new DATE(date.getFullYear(), date.getMonth(), date.getDate());
            adjustDST(date, 0);
            year = date.getFullYear();
            if (weekStart !== undefined) {
                setDayOfWeek(date, weekStart, -1);
                date.setDate(date.getDate() + 4);
            } else {
                date.setDate(date.getDate() + (4 - (date.getDay() || 7)));
            }
            adjustDST(date, 0);
            days = Math.floor((date.getTime() - new DATE(year, 0, 1, -6)) / 86400000);
            return 1 + Math.floor(days / 7);
        }
        function weekInMonth(date, weekStart) {
            var firstWeekDay = firstDayOfMonth(date).getDay();
            var firstWeekLength = 7 - (firstWeekDay + 7 - (weekStart || 7)) || 7;
            if (firstWeekLength < 0) {
                firstWeekLength += 7;
            }
            return Math.ceil((date.getDate() - firstWeekLength) / 7) + 1;
        }
        function normalizeDayIndex(weekDay, weekStart) {
            return weekDay + (weekDay < weekStart ? 7 : 0);
        }
        function normalizeOffset(date, rule, weekStart) {
            var offset = rule.offset;
            if (!offset) {
                return weekInMonth(date, weekStart);
            }
            var lastDate = new DATE(date.getFullYear(), date.getMonth() + 1, 0);
            var weeksInMonth = weekInMonth(lastDate, weekStart);
            var day = normalizeDayIndex(rule.day, weekStart);
            var skipFirst = day < normalizeDayIndex(new DATE(date.getFullYear(), date.getMonth(), 1).getDay(), weekStart);
            var skipLast = day > normalizeDayIndex(lastDate.getDay(), weekStart);
            if (offset < 0) {
                offset = weeksInMonth + (offset + 1 - (skipLast ? 1 : 0));
            } else if (skipFirst) {
                offset += 1;
            }
            weeksInMonth -= skipLast ? 1 : 0;
            if (offset < (skipFirst ? 1 : 0) || offset > weeksInMonth) {
                return null;
            }
            return offset;
        }
        function numberOfWeeks(date, weekStart) {
            return weekInMonth(new DATE(date.getFullYear(), date.getMonth() + 1, 0), weekStart);
        }
        function isInWeek(date, rule, weekStart) {
            return weekInMonth(date, weekStart) === normalizeOffset(date, rule, weekStart);
        }
        function ruleWeekValues(weekDays, date, weekStart) {
            var currentDay = normalizeDayIndex(date.getDay(), weekStart);
            var length = weekDays.length;
            var ruleWeekOffset;
            var weekDay, day;
            var weekNumber;
            var result = [];
            var idx = 0;
            for (; idx < length; idx++) {
                weekDay = weekDays[idx];
                weekNumber = weekInMonth(date, weekStart);
                ruleWeekOffset = normalizeOffset(date, weekDay, weekStart);
                if (ruleWeekOffset === null) {
                    continue;
                }
                if (weekNumber < ruleWeekOffset) {
                    result.push(weekDay);
                } else if (weekNumber === ruleWeekOffset) {
                    day = normalizeDayIndex(weekDay.day, weekStart);
                    if (currentDay < day) {
                        result.push(weekDay);
                    } else if (currentDay === day) {
                        return null;
                    }
                }
            }
            return result;
        }
        function ruleValues(rules, value, normalize) {
            var idx = 0, length = rules.length, availableRules = [], ruleValue;
            for (; idx < length; idx++) {
                ruleValue = rules[idx];
                if (normalize) {
                    ruleValue = normalize(ruleValue);
                }
                if (value === ruleValue) {
                    return null;
                } else if (value < ruleValue) {
                    availableRules.push(ruleValue);
                }
            }
            return availableRules;
        }
        function parseArray(list, range) {
            var idx = 0, length = list.length, value;
            for (; idx < length; idx++) {
                value = parseInt(list[idx], 10);
                if (isNaN(value) || value < range.start || value > range.end || value === 0 && range.start < 0) {
                    return null;
                }
                list[idx] = value;
            }
            return list.sort(numberSortPredicate);
        }
        function parseWeekDayList(list) {
            var idx = 0, length = list.length, value, valueLength, day;
            for (; idx < length; idx++) {
                value = list[idx];
                valueLength = value.length;
                day = value.substring(valueLength - 2).toUpperCase();
                day = WEEK_DAYS_IDX[day];
                if (day === undefined) {
                    return null;
                }
                list[idx] = {
                    offset: parseInt(value.substring(0, valueLength - 2), 10) || 0,
                    day: day
                };
            }
            return list;
        }
        function serializeWeekDayList(list) {
            var idx = 0, length = list.length, value, valueString, result = [];
            for (; idx < length; idx++) {
                value = list[idx];
                if (typeof value === 'string') {
                    valueString = value;
                } else {
                    valueString = '' + WEEK_DAYS[value.day];
                    if (value.offset) {
                        valueString = value.offset + valueString;
                    }
                }
                result.push(valueString);
            }
            return result.toString();
        }
        function getMonthLength(date) {
            var month = date.getMonth();
            if (month === 1) {
                if (new DATE(date.getFullYear(), 1, 29).getMonth() === 1) {
                    return 29;
                }
                return 28;
            }
            return MONTHS[month];
        }
        function leapYear(year) {
            year = year.getFullYear();
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        }
        function numberSortPredicate(a, b) {
            return a - b;
        }
        function parseExceptions(exceptions, zone) {
            var idx = 0, length, date, dates = [];
            if (exceptions) {
                exceptions = exceptions.split(exceptions.indexOf(';') !== -1 ? ';' : ',');
                length = exceptions.length;
                for (; idx < length; idx++) {
                    date = parseUTCDate(exceptions[idx], zone);
                    if (date) {
                        dates.push(date);
                    }
                }
            }
            return dates;
        }
        function isException(exceptions, date, zone) {
            var dates = $.isArray(exceptions) ? exceptions : parseExceptions(exceptions, zone), dateTime = date.getTime() - date.getMilliseconds(), idx = 0, length = dates.length;
            for (; idx < length; idx++) {
                if (dates[idx].getTime() === dateTime) {
                    return true;
                }
            }
            return false;
        }
        function toExceptionString(dates, zone) {
            var idx = 0;
            var length;
            var date;
            var result = [].concat(dates);
            for (length = result.length; idx < length; idx++) {
                date = result[idx];
                date = kendo.timezone.convert(date, zone || date.getTimezoneOffset(), 'Etc/UTC');
                result[idx] = kendo.toString(date, RECURRENCE_DATE_FORMAT);
            }
            return result.join(',');
        }
        function startPeriodByFreq(start, rule) {
            var date = new DATE(start);
            switch (rule.freq) {
            case 'yearly':
                date.setFullYear(date.getFullYear(), 0, 1);
                break;
            case 'monthly':
                date.setFullYear(date.getFullYear(), date.getMonth(), 1);
                break;
            case 'weekly':
                setDayOfWeek(date, rule.weekStart, -1);
                break;
            default:
                break;
            }
            if (rule.hours) {
                date.setHours(0);
            }
            if (rule.minutes) {
                date.setMinutes(0);
            }
            if (rule.seconds) {
                date.setSeconds(0);
            }
            return date;
        }
        function endPeriodByFreq(start, rule) {
            var date = new DATE(start);
            switch (rule.freq) {
            case 'yearly':
                date.setFullYear(date.getFullYear(), 11, 31);
                break;
            case 'monthly':
                date.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
                break;
            case 'weekly':
                setDayOfWeek(date, rule.weekStart, -1);
                date.setDate(date.getDate() + 6);
                break;
            default:
                break;
            }
            if (rule.hours) {
                date.setHours(23);
            }
            if (rule.minutes) {
                date.setMinutes(59);
            }
            if (rule.seconds) {
                date.setSeconds(59);
            }
            return date;
        }
        function eventsByPosition(periodEvents, start, positions) {
            var periodEventsLength = periodEvents.length;
            var events = [];
            var position;
            var event;
            for (var idx = 0, length = positions.length; idx < length; idx++) {
                position = positions[idx];
                if (position < 0) {
                    position = periodEventsLength + position;
                } else {
                    position -= 1;
                }
                event = periodEvents[position];
                if (event && event.start >= start) {
                    events.push(event);
                }
            }
            return events;
        }
        function removeExceptionDates(periodEvents, exceptionDates, zone) {
            var events = [];
            var event;
            for (var idx = 0; idx < periodEvents.length; idx++) {
                event = periodEvents[idx];
                if (!isException(exceptionDates, event.start, zone)) {
                    events.push(event);
                }
            }
            return events;
        }
        function expand(event, start, end, zone) {
            var rule = parseRule(event.recurrenceRule, zone), startTime, endTime, endDate, hours, minutes, seconds, durationMS, startPeriod, inPeriod, ruleStart, ruleEnd, useEventStart, freqName, exceptionDates, eventStartTime, eventStartMS, eventStart, count, freq, positions, currentIdx, periodEvents, events = [];
            if (!rule) {
                return [event];
            }
            positions = rule.positions;
            currentIdx = positions ? 0 : 1;
            ruleStart = rule.start;
            ruleEnd = rule.end;
            if (ruleStart || ruleEnd) {
                event = event.clone({
                    start: ruleStart ? new DATE(ruleStart.value[0]) : undefined,
                    end: ruleEnd ? new DATE(ruleEnd.value[0]) : undefined
                });
            }
            eventStart = event.start;
            eventStartMS = eventStart.getTime();
            eventStartTime = getMilliseconds(eventStart);
            exceptionDates = parseExceptions(event.recurrenceException, zone);
            if (!exceptionDates[0] && rule.exdates) {
                exceptionDates = rule.exdates.value;
                event.set('recurrenceException', toExceptionString(exceptionDates, zone));
            }
            startPeriod = start = new DATE(start);
            end = new DATE(end);
            freqName = rule.freq;
            freq = frequencies[freqName];
            count = rule.count;
            if (rule.until && rule.until < end) {
                end = new DATE(rule.until);
            }
            useEventStart = freqName === 'yearly' || freqName === 'monthly' || freqName === 'weekly';
            if (start < eventStartMS || count || rule.interval > 1 || useEventStart) {
                start = new DATE(eventStartMS);
            } else {
                hours = start.getHours();
                minutes = start.getMinutes();
                seconds = start.getSeconds();
                if (!rule.hours) {
                    hours = eventStart.getHours();
                }
                if (!rule.minutes) {
                    minutes = eventStart.getMinutes();
                }
                if (!rule.seconds) {
                    seconds = eventStart.getSeconds();
                }
                start.setHours(hours, minutes, seconds, eventStart.getMilliseconds());
            }
            rule._startPeriod = new DATE(start);
            if (positions) {
                start = startPeriodByFreq(start, rule);
                end = endPeriodByFreq(end, rule);
                var diff = getMilliseconds(end) - getMilliseconds(start);
                if (diff < 0) {
                    hours = start.getHours();
                    end.setHours(hours, start.getMinutes(), start.getSeconds(), start.getMilliseconds());
                    kendoDate.adjustDST(end, hours);
                }
                rule._startPeriod = new DATE(start);
                rule._endPeriod = endPeriodByFreq(start, rule);
            }
            durationMS = event.duration();
            rule._startTime = startTime = kendoDate.toInvariantTime(start);
            if (freq.setup) {
                freq.setup(rule, eventStart, start);
            }
            freq.limit(start, end, rule);
            
            while (start <= end) {                
                endDate = new DATE(start);
                setTime(endDate, durationMS);              
                inPeriod = start >= startPeriod || endDate > startPeriod;
                if (inPeriod && !isException(exceptionDates, start, zone) || positions) {
                    startTime = kendoDate.toUtcTime(kendoDate.getDate(start)) + getMilliseconds(rule._startTime);
                    endTime = startTime + durationMS;
                    if (eventStartMS !== start.getTime() || eventStartTime !== getMilliseconds(rule._startTime)) {
                        events.push(event.toOccurrence({
                            start: new DATE(start),
                            end: endDate,
                            _startTime: startTime,
                            _endTime: endTime
                        }));
                    } else {
                        event._startTime = startTime;
                        event._endTime = endTime;
                        events.push(event);
                    }
                }
                if (positions) {
                    freq.next(start, rule);
                    freq.limit(start, end, rule);
                    if (start > rule._endPeriod) {
                        periodEvents = eventsByPosition(events.slice(currentIdx), eventStart, positions);
                        periodEvents = removeExceptionDates(periodEvents, exceptionDates, zone);
                        events = events.slice(0, currentIdx).concat(periodEvents);
                        rule._endPeriod = endPeriodByFreq(start, rule);
                        currentIdx = events.length;
                    }
                    if (count && count === currentIdx) {
                        break;
                    }
                } else {
                    if (count && count === currentIdx) {
                        break;
                    }
                    currentIdx += 1;
                    freq.next(start, rule);
                    freq.limit(start, end, rule);
                }
            }
            return events;
        }
        function parseUTCDate(value, zone) {
            value = kendo.parseDate(value, DATE_FORMATS);
            if (value && zone) {
                value = timezone.convert(value, value.getTimezoneOffset(), zone);
            }
            return value;
        }
        function parseDateRule(dateRule, zone) {
            var pairs = dateRule.split(';');
            var pair;
            var property;
            var value;
            var tzid;
            var valueIdx, valueLength;
            for (var idx = 0, length = pairs.length; idx < length; idx++) {
                pair = pairs[idx].split(':');
                property = pair[0];
                value = pair[1];
                if (property.indexOf('TZID') !== -1) {
                    tzid = property.substring(property.indexOf('TZID')).split('=')[1];
                }
                if (value) {
                    value = value.split(',');
                    for (valueIdx = 0, valueLength = value.length; valueIdx < valueLength; valueIdx++) {
                        value[valueIdx] = parseUTCDate(value[valueIdx], tzid || zone);
                    }
                }
            }
            if (value) {
                return {
                    value: value,
                    tzid: tzid
                };
            }
        }
        function parseRule(recur, zone) {
            var instance = {};
            var splits, value;
            var idx = 0, length;
            var ruleValue = false;
            var rule, part, parts;
            var property, weekStart, weekDays;
            var predicate = function (a, b) {
                var day1 = a.day, day2 = b.day;
                if (day1 < weekStart) {
                    day1 += 7;
                }
                if (day2 < weekStart) {
                    day2 += 7;
                }
                return day1 - day2;
            };
            if (!recur) {
                return null;
            }
            parts = recur.split('\n');
            if (!parts[1] && (recur.indexOf('DTSTART') !== -1 || recur.indexOf('DTEND') !== -1 || recur.indexOf('EXDATE') !== -1)) {
                parts = recur.split(' ');
            }
            for (idx = 0, length = parts.length; idx < length; idx++) {
                part = $.trim(parts[idx]);
                if (part.indexOf('DTSTART') !== -1) {
                    instance.start = parseDateRule(part, zone);
                } else if (part.indexOf('DTEND') !== -1) {
                    instance.end = parseDateRule(part, zone);
                } else if (part.indexOf('EXDATE') !== -1) {
                    instance.exdates = parseDateRule(part, zone);
                } else if (part.indexOf('RRULE') !== -1) {
                    rule = part.substring(6);
                } else if ($.trim(part)) {
                    rule = part;
                }
            }
            rule = rule.split(';');
            for (idx = 0, length = rule.length; idx < length; idx++) {
                property = rule[idx];
                splits = property.split('=');
                value = $.trim(splits[1]).split(',');
                switch ($.trim(splits[0]).toUpperCase()) {
                case 'FREQ':
                    instance.freq = value[0].toLowerCase();
                    break;
                case 'UNTIL':
                    instance.until = parseUTCDate(value[0], zone);
                    break;
                case 'COUNT':
                    instance.count = parseInt(value[0], 10);
                    break;
                case 'INTERVAL':
                    instance.interval = parseInt(value[0], 10);
                    break;
                case 'BYSECOND':
                    instance.seconds = parseArray(value, {
                        start: 0,
                        end: 60
                    });
                    ruleValue = true;
                    break;
                case 'BYMINUTE':
                    instance.minutes = parseArray(value, {
                        start: 0,
                        end: 59
                    });
                    ruleValue = true;
                    break;
                case 'BYHOUR':
                    instance.hours = parseArray(value, {
                        start: 0,
                        end: 23
                    });
                    ruleValue = true;
                    break;
                case 'BYMONTHDAY':
                    instance.monthDays = parseArray(value, {
                        start: -31,
                        end: 31
                    });
                    ruleValue = true;
                    break;
                case 'BYYEARDAY':
                    instance.yearDays = parseArray(value, {
                        start: -366,
                        end: 366
                    });
                    ruleValue = true;
                    break;
                case 'BYMONTH':
                    instance.months = parseArray(value, {
                        start: 1,
                        end: 12
                    });
                    ruleValue = true;
                    break;
                case 'BYDAY':
                    instance.weekDays = weekDays = parseWeekDayList(value);
                    ruleValue = true;
                    break;
                case 'BYWEEKNO':
                    instance.weeks = parseArray(value, {
                        start: -53,
                        end: 53
                    });
                    ruleValue = true;
                    break;
                case 'BYSETPOS':
                    instance.positions = parseArray(value, {
                        start: -366,
                        end: 366
                    });
                    break;
                case 'WKST':
                    instance.weekStart = weekStart = WEEK_DAYS_IDX[value[0]];
                    break;
                }
            }
            if (instance.freq === undefined || instance.count !== undefined && instance.until) {
                return null;
            }
            if (!instance.interval) {
                instance.interval = 1;
            }
            if (weekStart === undefined) {
                instance.weekStart = weekStart = kendo.culture().calendar.firstDay;
            }
            if (weekDays) {
                instance.weekDays = weekDays.sort(predicate);
            }
            if (instance.positions && !ruleValue) {
                instance.positions = null;
            }
            instance._hasRuleValue = ruleValue;
            return instance;
        }
        function serializeDateRule(dateRule, zone) {
            var value = dateRule.value;
            var tzid = dateRule.tzid || '';
            var length = value.length;
            var idx = 0;
            var val;
            for (; idx < length; idx++) {
                val = value[idx];
                val = timezone.convert(val, tzid || zone || val.getTimezoneOffset(), 'Etc/UTC');
                value[idx] = kendo.toString(val, 'yyyyMMddTHHmmssZ');
            }
            if (tzid) {
                tzid = ';TZID=' + tzid;
            }
            return tzid + ':' + value.join(',') + ' ';
        }
        function serialize(rule, zone) {
            var weekStart = rule.weekStart;
            var ruleString = 'FREQ=' + rule.freq.toUpperCase();
            var exdates = rule.exdates || '';
            var start = rule.start || '';
            var end = rule.end || '';
            var until = rule.until;
            if (rule.interval > 1) {
                ruleString += ';INTERVAL=' + rule.interval;
            }
            if (rule.count) {
                ruleString += ';COUNT=' + rule.count;
            }
            if (until) {
                until = timezone.convert(until, zone || until.getTimezoneOffset(), 'Etc/UTC');
                ruleString += ';UNTIL=' + kendo.toString(until, 'yyyyMMddTHHmmssZ');
            }
            if (rule.months) {
                ruleString += ';BYMONTH=' + rule.months;
            }
            if (rule.weeks) {
                ruleString += ';BYWEEKNO=' + rule.weeks;
            }
            if (rule.yearDays) {
                ruleString += ';BYYEARDAY=' + rule.yearDays;
            }
            if (rule.monthDays) {
                ruleString += ';BYMONTHDAY=' + rule.monthDays;
            }
            if (rule.weekDays) {
                ruleString += ';BYDAY=' + serializeWeekDayList(rule.weekDays);
            }
            if (rule.hours) {
                ruleString += ';BYHOUR=' + rule.hours;
            }
            if (rule.minutes) {
                ruleString += ';BYMINUTE=' + rule.minutes;
            }
            if (rule.seconds) {
                ruleString += ';BYSECOND=' + rule.seconds;
            }
            if (rule.positions) {
                ruleString += ';BYSETPOS=' + rule.positions;
            }
            if (weekStart !== undefined) {
                ruleString += ';WKST=' + WEEK_DAYS[weekStart];
            }
            if (start) {
                start = 'DTSTART' + serializeDateRule(start, zone);
            }
            if (end) {
                end = 'DTEND' + serializeDateRule(end, zone);
            }
            if (exdates) {
                exdates = 'EXDATE' + serializeDateRule(exdates, zone);
            }
            if (start || end || exdates) {
                ruleString = start + end + exdates + 'RRULE:' + ruleString;
            }
            return ruleString;
        }
        kendo.recurrence = {
            rule: {
                parse: parseRule,
                serialize: serialize
            },
            expand: expand,
            dayInYear: dayInYear,
            weekInYear: weekInYear,
            weekInMonth: weekInMonth,
            numberOfWeeks: numberOfWeeks,
            isException: isException,
            toExceptionString: toExceptionString
        };
        var weekDayCheckBoxes = function (firstDay) {
            var shortNames = kendo.culture().calendar.days.namesShort, length = shortNames.length, result = '', idx = 0, values = [];
            for (; idx < length; idx++) {
                values.push(idx);
            }
            shortNames = shortNames.slice(firstDay).concat(shortNames.slice(0, firstDay));
            values = values.slice(firstDay).concat(values.slice(0, firstDay));
            for (idx = 0; idx < length; idx++) {
                result += '<label class="k-check"><input class="k-recur-weekday-checkbox" type="checkbox" value="' + values[idx] + '" /> ' + shortNames[idx] + '</label>';
            }
            return result;
        };
        var RECURRENCE_VIEW_TEMPLATE = kendo.template('# if (frequency !== "never") { #' + '<div class="k-edit-label"><label>#:messages.repeatEvery#</label></div>' + '<div class="k-edit-field"><input class="k-recur-interval"/>#:messages.interval#</div>' + '# } #' + '# if (frequency === "weekly") { #' + '<div class="k-edit-label"><label>#:messages.repeatOn#</label></div>' + '<div class="k-edit-field">#=weekDayCheckBoxes(firstWeekDay)#</div>' + '# } else if (frequency === "monthly") { #' + '<div class="k-edit-label"><label>#:messages.repeatOn#</label></div>' + '<div class="k-edit-field">' + '<ul class="k-reset">' + '<li>' + '<label><input class="k-recur-month-radio" type="radio" name="month" value="monthday" />#:messages.day#</label>' + '<input class="k-recur-monthday" />' + '</li>' + '<li>' + '<input class="k-recur-month-radio" type="radio" name="month" value="weekday" />' + '<input class="k-recur-weekday-offset" /><input class="k-recur-weekday" />' + '</li>' + '</ul>' + '</div>' + '# } else if (frequency === "yearly") { #' + '<div class="k-edit-label"><label>#:messages.repeatOn#</label></div>' + '<div class="k-edit-field">' + '<ul class="k-reset">' + '<li>' + '<input class="k-recur-year-radio" type="radio" name="year" value="monthday" />' + '<input class="k-recur-month" /><input class="k-recur-monthday" />' + '</li>' + '<li>' + '<input class="k-recur-year-radio" type="radio" name="year" value="weekday" />' + '<input class="k-recur-weekday-offset" /><input class="k-recur-weekday" />#:messages.of#<input class="k-recur-month" />' + '</li>' + '</ul>' + '</div>' + '# } #' + '# if (frequency !== "never") { #' + '<div class="k-edit-label"><label>#:end.label#</label></div>' + '<div class="k-edit-field">' + '<ul class="k-reset">' +'<li>' + '<label><input class="k-recur-end-until" type="radio" name="end" value="until" />#:end.on#</label>' + '<input class="k-recur-until" />' + '</li>' + '<li>' + '<label><input class="k-recur-end-never" type="radio" name="end" value="never" />#:end.never#</label>' + '</li>' + '<li>' + '<label><input class="k-recur-end-count" type="radio" name="end" value="count" />#:end.after#</label>' + '<input class="k-recur-count" />#:end.occurrence#' + '</li>' + '</ul>' + '</div>' + '# } #');
        var DAY_RULE = [
            {
                day: 0,
                offset: 0
            },
            {
                day: 1,
                offset: 0
            },
            {
                day: 2,
                offset: 0
            },
            {
                day: 3,
                offset: 0
            },
            {
                day: 4,
                offset: 0
            },
            {
                day: 5,
                offset: 0
            },
            {
                day: 6,
                offset: 0
            }
        ];
        var WEEKDAY_RULE = [
            {
                day: 1,
                offset: 0
            },
            {
                day: 2,
                offset: 0
            },
            {
                day: 3,
                offset: 0
            },
            {
                day: 4,
                offset: 0
            },
            {
                day: 5,
                offset: 0
            }
        ];
        var WEEKEND_RULE = [
            {
                day: 0,
                offset: 0
            },
            {
                day: 6,
                offset: 0
            }
        ];
        var BaseRecurrenceEditor = Widget.extend({
            init: function (element, options) {
                var start;
                var that = this;
                var frequencies = options && options.frequencies;
                Widget.fn.init.call(that, element, options);
                that.wrapper = that.element;
                options = that.options;
                options.start = start = options.start || kendoDate.today();
                if (frequencies) {
                    options.frequencies = frequencies;
                }
                if (typeof start === 'string') {
                    options.start = kendo.parseDate(start, 'yyyyMMddTHHmmss');
                }
                if (options.firstWeekDay === null) {
                    options.firstWeekDay = kendo.culture().calendar.firstDay;
                }
                that._namespace = '.' + options.name;
            },
            options: {
                value: '',
                start: '',
                timezone: '',
                spinners: true,
                firstWeekDay: null,
                frequencies: [
                    'never',
                    'daily',
                    'weekly',
                    //'monthly',
                    //'yearly'
                ],
                mobile: false,
                messages: {
                    frequencies: {
                        never: 'ندارد',
                        hourly: 'ساعتی',
                        daily: 'روزانه',
                        weekly: 'هفتگی',
                        monthly: 'ماهانه',
                        yearly: 'سالانه'
                    },
                    hourly: {
                        repeatEvery: 'مرتبه تکرار : ',
                        interval: ' ساعت'
                    },
                    daily: {
                        repeatEvery: 'مرتبه تکرار : ',
                        interval: ' روز'
                    },
                    weekly: {
                        interval: ' هفته',
                        repeatEvery: 'مرتبه تکرار : ',
                        repeatOn: 'روز هفته : '
                    },
                    monthly: {
                        repeatEvery: 'مرتبه تکرار : ',
                        repeatOn: 'تکرار شود در : ',
                        interval: ' ماه',
                        day: 'روز '
                    },
                    yearly: {
                        repeatEvery: 'مرتبه تکرار : ',
                        repeatOn: 'تکرار شود در : ',
                        interval: ' سال',
                        of: ' از '
                    },
                    end: {
                        label: ' پایان رویداد:',
                        mobileLabel: 'Ends',
                        never: 'بدون پایان',
                        after: 'بعد از ',
                        occurrence: ' مرتبه رخ دادن',
                        on: 'در تاریخ '
                    },
                    offsetPositions: {
                        first: 'اولین',
                        second: 'دومین',
                        third: 'سومین',
                        fourth: 'چهارمین',
                        last: 'آخرین'
                    },
                    weekdays: {
                        day: 'day',
                        weekday: 'weekday',
                        weekend: 'weekend day'
                    }
                }
            },
            events: ['change'],
            _initInterval: function () {
                var that = this;
                var rule = that._value;
                that._container.find('.k-recur-interval').kendoNumericTextBox({
                    spinners: that.options.spinners,
                    value: rule.interval || 1,
                    decimals: 0,
                    format: '#',
                    min: 1,
                    change: function () {
                        rule.interval = this.value();
                        that._trigger();
                    }
                });
            },
            _weekDayRule: function (clear) {
                var that = this;
                var weekday = (that._weekDay.element || that._weekDay).val();
                var offset = Number((that._weekDayOffset.element || that._weekDayOffset).val());
                var weekDays = null;
                var positions = null;
                if (!clear) {
                    if (weekday === 'day') {
                        weekDays = DAY_RULE;
                        positions = offset;
                    } else if (weekday === 'weekday') {
                        weekDays = WEEKDAY_RULE;
                        positions = offset;
                    } else if (weekday === 'weekend') {
                        weekDays = WEEKEND_RULE;
                        positions = offset;
                    } else {
                        weekDays = [{
                                offset: offset,
                                day: Number(weekday)
                            }];
                    }
                }
                that._value.weekDays = weekDays;
                that._value.positions = positions;
            },
            _weekDayView: function () {
                var that = this;
                var weekDays = that._value.weekDays;
                var positions = that._value.positions;
                var weekDayOffsetWidget = that._weekDayOffset;
                var weekDayOffset;
                var weekDayValue;
                var length;
                var method;
                if (weekDays) {
                    length = weekDays.length;
                    if (positions) {
                        if (length === 7) {
                            weekDayValue = 'day';
                            weekDayOffset = positions;
                        } else if (length === 5) {
                            weekDayValue = 'weekday';
                            weekDayOffset = positions;
                        } else if (length === 2) {
                            weekDayValue = 'weekend';
                            weekDayOffset = positions;
                        }
                    }
                    if (!weekDayValue) {
                        weekDays = weekDays[0];
                        weekDayValue = weekDays.day;
                        weekDayOffset = weekDays.offset || '';
                    }
                    method = weekDayOffsetWidget.value ? 'value' : 'val';
                    weekDayOffsetWidget[method](weekDayOffset);
                    that._weekDay[method](weekDayValue);
                }
            },
            _initWeekDay: function () {
                var that = this, data;
                var weekdayMessage = that.options.messages.weekdays;
                var offsetMessage = that.options.messages.offsetPositions;
                var weekDayInput = that._container.find('.k-recur-weekday');
                var change = function () {
                    that._weekDayRule();
                    that._trigger();
                };
                if (weekDayInput[0]) {
                    that._weekDayOffset = new DropDownList(that._container.find('.k-recur-weekday-offset'), {
                        change: change,
                        dataTextField: 'text',
                        dataValueField: 'value',
                        dataSource: [
                            {
                                text: offsetMessage.first,
                                value: '1'
                            },
                            {
                                text: offsetMessage.second,
                                value: '2'
                            },
                            {
                                text: offsetMessage.third,
                                value: '3'
                            },
                            {
                                text: offsetMessage.fourth,
                                value: '4'
                            },
                            {
                                text: offsetMessage.last,
                                value: '-1'
                            }
                        ]
                    });
                    data = [
                        {
                            text: weekdayMessage.day,
                            value: 'day'
                        },
                        {
                            text: weekdayMessage.weekday,
                            value: 'weekday'
                        },
                        {
                            text: weekdayMessage.weekend,
                            value: 'weekend'
                        }
                    ];
                    that._weekDay = new DropDownList(weekDayInput, {
                        value: that.options.start.getDay(),
                        change: change,
                        dataTextField: 'text',
                        dataValueField: 'value',
                        dataSource: data.concat($.map(kendo.culture().calendar.days.names, function (dayName, idx) {
                            return {
                                text: dayName,
                                value: idx
                            };
                        }))
                    });
                    that._weekDayView();
                }
            },
            _initWeekDays: function () {
                var that = this;
                var rule = that._value;
                var weekDays = that._container.find('.k-recur-weekday-checkbox');
                if (weekDays[0]) {
                    weekDays.on(CLICK + that._namespace, function () {
                        rule.weekDays = $.map(weekDays.filter(':checked'), function (checkbox) {
                            return {
                                day: Number(checkbox.value),
                                offset: 0
                            };
                        });
                        if (!that.options.mobile) {
                            that._trigger();
                        }
                    });
                    if (rule.weekDays) {
                        var idx, weekDay;
                        var i = 0, l = weekDays.length;
                        var length = rule.weekDays.length;
                        for (; i < l; i++) {
                            weekDay = weekDays[i];
                            for (idx = 0; idx < length; idx++) {
                                if (weekDay.value == rule.weekDays[idx].day) {
                                    weekDay.checked = true;
                                }
                            }
                        }
                    }
                }
            },
            _initMonthDay: function () {
                var that = this;
                var rule = that._value;
                var monthDayInput = that._container.find('.k-recur-monthday');
                if (monthDayInput[0]) {
                    that._monthDay = new kendo.ui.NumericTextBox(monthDayInput, {
                        spinners: that.options.spinners,
                        min: 1,
                        max: 31,
                        decimals: 0,
                        format: '#',
                        value: rule.monthDays ? rule.monthDays[0] : that.options.start.getDate(),
                        change: function () {
                            var value = this.value();
                            rule.monthDays = value ? [value] : value;
                            that._trigger();
                        }
                    });
                }
            },
            _initCount: function () {
                var that = this, input = that._container.find('.k-recur-count'), rule = that._value;
                that._count = input.kendoNumericTextBox({
                    spinners: that.options.spinners,
                    value: rule.count || 1,
                    decimals: 0,
                    format: '#',
                    min: 1,
                    change: function () {
                        rule.count = this.value();
                        that._trigger();
                    }
                }).data('kendoNumericTextBox');
            },
            _initUntil: function () {
                var that = this, input = that._container.find('.k-recur-until'), start = that.options.start, rule = that._value, until = rule.until;
                that._until = input.kendoJalaliDatePicker({
                    min: until && until < start ? until : start,
                    value: until || new DATE(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59),
                    change: function () {
                        var date = this.value();
                        rule.until = new DATE(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                        that._trigger();
                    }
                }).data('kendoJalaliDatePicker');
            },
            _trigger: function () {
                if (!this.options.mobile) {
                    this.trigger('change');
                }
            }
        });
        var RecurrenceEditor = BaseRecurrenceEditor.extend({
            init: function (element, options) {
                var that = this;
                BaseRecurrenceEditor.fn.init.call(that, element, options);
                that._initFrequency();
                that._initContainer();
                that.value(that.options.value);
            },
            options: { name: 'RecurrenceEditor' },
            events: ['change'],
            destroy: function () {
                var that = this;
                that._frequency.destroy();
                that._container.find('input[type=radio],input[type=checkbox]').off(CLICK + that._namespace);
                kendo.destroy(that._container);
                BaseRecurrenceEditor.fn.destroy.call(that);
            },
            value: function (value) {
                var that = this;
                var timezone = that.options.timezone;
                var freq;
                if (value === undefined) {
                    if (!that._value.freq) {
                        return '';
                    }
                    return serialize(that._value, timezone);
                }
                that._value = parseRule(value, timezone) || {};
                freq = that._value.freq;
                if (freq) {
                    that._frequency.value(freq);
                } else {
                    that._frequency.select(0);
                }
                that._initView(that._frequency.value());
            },
            _initContainer: function () {
                var element = this.element, container = $('<div class="k-recur-view" />'), editContainer = element.parent('.k-edit-field');
                if (editContainer[0]) {
                    container.insertAfter(editContainer);
                } else {
                    element.append(container);
                }
                this._container = container;
            },
            _initFrequency: function () {
                var that = this, options = that.options, frequencies = options.frequencies, messages = options.messages.frequencies, ddl = $('<input />'), frequency;
                frequencies = $.map(frequencies, function (frequency) {
                    return {
                        text: messages[frequency],
                        value: frequency
                    };
                });
                frequency = frequencies[0];
                if (frequency && frequency.value === 'never') {
                    frequency.value = '';
                }
                that.element.append(ddl);
                that._frequency = new DropDownList(ddl, {
                    dataTextField: 'text',
                    dataValueField: 'value',
                    dataSource: frequencies,
                    change: function () {
                        that._value = {};
                        that._initView(that._frequency.value());
                        that.trigger('change');
                    }
                });
            },
            _initView: function (frequency) {
                var that = this;
                var rule = that._value;
                var options = that.options;
                var data = {
                    frequency: frequency || 'never',
                    weekDayCheckBoxes: weekDayCheckBoxes,
                    firstWeekDay: options.firstWeekDay,
                    messages: options.messages[frequency],
                    end: options.messages.end
                };
                kendo.destroy(that._container);
                that._container.html(RECURRENCE_VIEW_TEMPLATE(data));
                if (!frequency) {
                    that._value = {};
                    return;
                }
                rule.freq = frequency;
                if (frequency === 'weekly' && !rule.weekDays) {
                    rule.weekDays = [{
                            day: options.start.getDay(),
                            offset: 0
                        }];
                }
                that._initInterval();
                that._initWeekDays();
                that._initMonthDay();
                that._initWeekDay();
                that._initMonth();
                that._initCount();
                that._initUntil();
                that._period();
                that._end();
            },
            _initMonth: function () {
                var that = this;
                var rule = that._value;
                var month = rule.months || [that.options.start.getMonth() + 1];
                var monthInputs = that._container.find('.k-recur-month');
                var options;
                if (monthInputs[0]) {
                    options = {
                        change: function () {
                            rule.months = [Number(this.value())];
                            that.trigger('change');
                        },
                        dataTextField: 'text',
                        dataValueField: 'value',
                        dataSource: $.map(kendo.culture().calendar.months.names, function (monthName, idx) {
                            return {
                                text: monthName,
                                value: idx + 1
                            };
                        })
                    };
                    that._month1 = new DropDownList(monthInputs[0], options);
                    that._month2 = new DropDownList(monthInputs[1], options);
                    if (month) {
                        month = month[0];
                        that._month1.value(month);
                        that._month2.value(month);
                    }
                }
            },
            _end: function () {
                var that = this;
                var rule = that._value;
                var container = that._container;
                var namespace = that._namespace;
                var click = function (e) {
                    that._toggleEnd(e.currentTarget.value);
                    that.trigger('change');
                };
                var endRule;
                that._buttonNever = container.find('.k-recur-end-never').on(CLICK + namespace, click);
                that._buttonCount = container.find('.k-recur-end-count').on(CLICK + namespace, click);
                that._buttonUntil = container.find('.k-recur-end-until').on(CLICK + namespace, click);
                if (rule.count) {
                    endRule = 'count';
                } else if (rule.until) {
                    endRule = 'until';
                }
                that._toggleEnd(endRule);
            },
            _period: function () {
                var that = this;
                var rule = that._value;
                var monthly = rule.freq === 'monthly';
                var toggleRule = monthly ? that._toggleMonthDay : that._toggleYear;
                var selector = '.k-recur-' + (monthly ? 'month' : 'year') + '-radio';
                var radioButtons = that._container.find(selector);
                if (!monthly && rule.freq !== 'yearly') {
                    return;
                }
                radioButtons.on(CLICK + that._namespace, function (e) {
                    toggleRule.call(that, e.currentTarget.value);
                    that.trigger('change');
                });
                that._buttonMonthDay = radioButtons.eq(0);
                that._buttonWeekDay = radioButtons.eq(1);
                toggleRule.call(that, rule.weekDays ? 'weekday' : 'monthday');
            },
            _toggleEnd: function (endRule) {
                var that = this;
                var count, until;
                var enableCount, enableUntil;
                if (endRule === 'count') {
                    that._buttonCount.prop('checked', true);
                    enableCount = true;
                    enableUntil = false;
                    count = that._count.value();
                    until = null;
                } else if (endRule === 'until') {
                    that._buttonUntil.prop('checked', true);
                    enableCount = false;
                    enableUntil = true;
                    count = null;
                    until = that._until.value();
                } else {
                    that._buttonUntil.prop('checked', true);
                    enableCount = enableUntil = true;
                    count = until = null;
                }
                that._count.enable(enableCount);
                that._until.enable(enableUntil);
                that._value.count = count;
                that._value.until = until;
            },
            _toggleMonthDay: function (monthRule) {
                var that = this;
                var enableMonthDay = false;
                var enableWeekDay = true;
                var clear = false;
                var monthDays;
                if (monthRule === 'monthday') {
                    that._buttonMonthDay.prop('checked', true);
                    monthDays = [that._monthDay.value()];
                    enableMonthDay = true;
                    enableWeekDay = false;
                    clear = true;
                } else {
                    that._buttonWeekDay.prop('checked', true);
                    monthDays = null;
                }
                that._weekDay.enable(enableWeekDay);
                that._weekDayOffset.enable(enableWeekDay);
                that._monthDay.enable(enableMonthDay);
                that._value.monthDays = monthDays;
                that._weekDayRule(clear);
            },
            _toggleYear: function (yearRule) {
                var that = this;
                var enableMonth1 = false;
                var enableMonth2 = true;
                var month;
                if (yearRule === 'monthday') {
                    enableMonth1 = true;
                    enableMonth2 = false;
                    month = that._month1.value();
                } else {
                    month = that._month2.value();
                }
                that._month1.enable(enableMonth1);
                that._month2.enable(enableMonth2);
                that._value.months = [month];
                that._toggleMonthDay(yearRule);
            }
        });
        ui.plugin(RecurrenceEditor);
        var RECURRENCE_HEADER_TEMPLATE = kendo.template('<div class="k-edit-label"><label>#:headerTitle#</label></div>' + '<div class="k-edit-field k-recur-pattern k-scheduler-toolbar"></div>' + '<div class="k-recur-view"></div>');
        var RECURRENCE_REPEAT_PATTERN_TEMPLATE = kendo.template('# if (frequency !== "never") { #' + '<div class="k-edit-label"><label>#:messages.repeatEvery#</label></div>' + '<div class="k-edit-field"><input class="k-recur-interval" pattern="\\\\d*"/>#:messages.interval#</div>' + '# } #' + '# if (frequency === "weekly") { #' + '<div class="k-edit-label"><label>#:messages.repeatOn#</label></div>' + '<div class="k-edit-field">#=weekDayCheckBoxes(firstWeekDay)#</div>' + '# } else if (frequency === "monthly") { #' + '<div class="k-edit-label"><label>#:messages.repeatBy#</label></div>' + '<div class="k-edit-field k-scheduler-toolbar k-repeat-rule"></div>' + '<div class="k-monthday-view" style="display:none">' + '<div class="k-edit-label"><label>#:messages.day#</label></div>' + '<div class="k-edit-field"><input class="k-recur-monthday" pattern="\\\\d*"/></div>' + '</div>' + '<div class="k-weekday-view" style="display:none">' + '<div class="k-edit-label"><label>#:messages.every#</label></div>' + '<div class="k-edit-field"><select class="k-recur-weekday-offset"></select></div>' + '<div class="k-edit-label"><label>#:messages.day#</label></div>' + '<div class="k-edit-field"><select class="k-recur-weekday"></select></div>' + '</div>' + '# } else if (frequency === "yearly") { #' + '<div class="k-edit-label"><label>#:messages.repeatBy#</label></div>' + '<div class="k-edit-field k-scheduler-toolbar k-repeat-rule"></div>' + '<div class="k-monthday-view" style="display:none">' + '<div class="k-edit-label"><label>#:messages.day#</label></div>' + '<div class="k-edit-field"><input class="k-recur-monthday" pattern="\\\\d*"/></div>' + '</div>' + '<div class="k-weekday-view" style="display:none">' + '<div class="k-edit-label"><label>#:messages.every#</label></div>' + '<div class="k-edit-field"><select class="k-recur-weekday-offset"></select></div>' + '<div class="k-edit-label"><label>#:messages.day#</label></div>' + '<div class="k-edit-field"><select class="k-recur-weekday"></select></div>' + '</div>' + '<div class="k-edit-label"><label>#:messages.month#</label></div>' + '<div class="k-edit-field"><select class="k-recur-month"></select></div>' + '# } #');
        var RECURRENCE_END_PATTERN_TEMPLATE = kendo.template('# if (endPattern === "count") { #' + '<div class="k-edit-label"><label>#:messages.after#</label></div>' + '<div class="k-edit-field"><input class="k-recur-count" pattern="\\\\d*" /></div>' + '# } else if (endPattern === "until") { #' + '<div class="k-edit-label"><label>#:messages.on#</label></div>' + '<div class="k-edit-field"><input type="date" class="k-recur-until" /></div>' + '# } #');
        var RECURRENCE_GROUP_BUTTON_TEMPLATE = kendo.template('<ul class="k-reset k-header k-scheduler-navigation">' + '#for (var i = 0, length = dataSource.length; i < length; i++) {#' + '<li class="k-state-default #= value === dataSource[i].value ? "k-state-selected" : "" #">' + '<a role="button" href="\\#" class="k-link" data-#=ns#value="#=dataSource[i].value#">#:dataSource[i].text#</a>' + '</li>' + '#}#' + '</ul>');
        var MobileRecurrenceEditor = BaseRecurrenceEditor.extend({
            init: function (element, options) {
                var that = this;
                BaseRecurrenceEditor.fn.init.call(that, element, options);
                options = that.options;
                that._optionTemplate = kendo.template('<option value="#:value#">#:text#</option>');
                that.value(options.value);
                that._pane = options.pane;
                that._initRepeatButton();
                that._initRepeatEnd();
                that._defaultValue = that._value;
            },
            options: {
                name: 'MobileRecurrenceEditor',
                animations: {
                    left: 'slide',
                    right: 'slide:right'
                },
                mobile: true,
                messages: {
                    cancel: 'Cancel',
                    update: 'Save',
                    endTitle: 'Repeat ends',
                    repeatTitle: 'Repeat pattern',
                    headerTitle: 'Repeat event',
                    end: {
                        patterns: {
                            never: 'Never',
                            after: 'After...',
                            on: 'On...'
                        },
                        never: 'Never',
                        after: 'End repeat after',
                        on: 'End repeat on'
                    },
                    daily: { interval: '' },
                    hourly: { interval: '' },
                    weekly: { interval: '' },
                    monthly: {
                        interval: '',
                        repeatBy: 'Repeat by: ',
                        dayOfMonth: 'Day of the month',
                        dayOfWeek: 'Day of the week',
                        repeatEvery: 'Repeat every',
                        every: 'Every',
                        day: 'Day '
                    },
                    yearly: {
                        interval: '',
                        repeatBy: 'Repeat by: ',
                        dayOfMonth: 'Day of the month',
                        dayOfWeek: 'Day of the week',
                        repeatEvery: 'Repeat every: ',
                        every: 'Every',
                        month: 'Month',
                        day: 'Day'
                    }
                }
            },
            events: ['change'],
            value: function (value) {
                var that = this;
                var timezone = that.options.timezone;
                if (value === undefined) {
                    if (!that._value.freq) {
                        return '';
                    }
                    return serialize(that._value, timezone);
                }
                that._value = parseRule(value, timezone) || {};
            },
            destroy: function () {
                this._destroyView();
                kendo.destroy(this._endFields);
                this._repeatButton.off(CLICK + this._namespace);
                BaseRecurrenceEditor.fn.destroy.call(this);
            },
            _initRepeatButton: function () {
                var that = this;
                var freq = that.options.messages.frequencies[this._value.freq || 'never'];
                that._repeatButton = $('<a href="#" class="k-button k-scheduler-recur">' + freq + '</a>').on(CLICK + that._namespace, function (e) {
                    e.preventDefault();
                    that._createView('repeat');
                    that._pane.navigate('recurrence', that.options.animations.left);
                });
                that.element.append(that._repeatButton);
            },
            _initRepeatEnd: function () {
                var that = this;
                var endLabelField = $('<div class="k-edit-label"><label>' + that.options.messages.end.mobileLabel + '</label></div>').insertAfter(that.element.parent('.k-edit-field'));
                var endEditField = $('<div class="k-edit-field"><a href="#" class="k-button k-scheduler-recur-end"></a></div>').on(CLICK + that._namespace, function (e) {
                    e.preventDefault();
                    if (!that._value.freq) {
                        return;
                    }
                    that._createView('end');
                    that._pane.navigate('recurrence', that.options.animations.left);
                }).insertAfter(endLabelField);
                that._endFields = endLabelField.add(endEditField).toggleClass('k-state-disabled', !that._value.freq);
                that._endButton = endEditField.find('.k-scheduler-recur-end').text(that._endText());
            },
            _endText: function () {
                var rule = this._value;
                var messages = this.options.messages.end;
                var text = messages.never;
                if (rule.count) {
                    text = kendo.format('{0} {1}', messages.after, rule.count);
                } else if (rule.until) {
                    text = kendo.format('{0} {1:d}', messages.on, rule.until);
                }
                return text;
            },
            _initFrequency: function () {
                var that = this;
                var frequencyMessages = that.options.messages.frequencies;
                var html = RECURRENCE_GROUP_BUTTON_TEMPLATE({
                    dataSource: $.map(this.options.frequencies, function (frequency) {
                        return {
                            text: frequencyMessages[frequency],
                            value: frequency !== 'never' ? frequency : ''
                        };
                    }),
                    value: that._value.freq || '',
                    ns: kendo.ns
                });
                that._view.element.find('.k-recur-pattern').append(html).on(CLICK + that._namespace, '.k-scheduler-navigation li', function (e) {
                    var li = $(this);
                    e.preventDefault();
                    li.addClass('k-state-selected').siblings().removeClass('k-state-selected');
                    that._value = { freq: li.children('a').attr(kendo.attr('value')) };
                    that._initRepeatView();
                });
            },
            _initEndNavigation: function () {
                var that = this;
                var endMessages = that.options.messages.end.patterns;
                var rule = that._value;
                var value = '';
                if (rule.count) {
                    value = 'count';
                } else if (rule.until) {
                    value = 'until';
                }
                var html = RECURRENCE_GROUP_BUTTON_TEMPLATE({
                    dataSource: [
                        {
                            text: endMessages.never,
                            value: ''
                        },
                        {
                            text: endMessages.after,
                            value: 'count'
                        },
                        {
                            text: endMessages.on,
                            value: 'until'
                        }
                    ],
                    value: value,
                    ns: kendo.ns
                });
                that._view.element.find('.k-recur-pattern').append(html).on(CLICK + that._namespace, '.k-scheduler-navigation li', function (e) {
                    var li = $(this);
                    var count = null;
                    var until = null;
                    e.preventDefault();
                    li.addClass('k-state-selected').siblings().removeClass('k-state-selected');
                    that._initEndView(li.children('a').attr(kendo.attr('value')));
                    if (that._count) {
                        count = that._count.value();
                        until = null;
                    } else if (that._until) {
                        count = null;
                        until = that._until.val ? kendo.parseDate(that._until.val(), 'yyyy-MM-dd') : that._until.value();
                    }
                    rule.count = count;
                    rule.until = until;
                });
            },
            _createView: function (viewType) {
                var that = this;
                var options = that.options;
                var messages = options.messages;
                var headerTitle = messages[viewType === 'repeat' ? 'repeatTitle' : 'endTitle'];
                var html = '<div data-role="view" class="k-popup-edit-form k-scheduler-edit-form k-mobile-list" id="recurrence">' + '<div data-role="header" class="k-header">' + '<a href="#" class="k-button k-scheduler-cancel">' + messages.cancel + '</a>' + messages.headerTitle + '<a href="#" class="k-button k-scheduler-update">' + messages.update + '</a>' + '</div>';
                var returnViewId = that._pane.view().id;
                that._view = that._pane.append(html + RECURRENCE_HEADER_TEMPLATE({ headerTitle: headerTitle }));
                that._view.element.on(CLICK + that._namespace, 'a.k-scheduler-cancel, a.k-scheduler-update', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($(this).hasClass('k-scheduler-update')) {
                        that.trigger('change');
                        that._defaultValue = $.extend({}, that._value);
                    } else {
                        that._value = that._defaultValue;
                    }
                    var frequency = that._value.freq;
                    that._endButton.text(that._endText());
                    that._endFields.toggleClass('k-state-disabled', !frequency);
                    that._repeatButton.text(messages.frequencies[frequency || 'never']);
                    that._pane.one('viewShow', function () {
                        that._destroyView();
                    });
                    that._pane.navigate(returnViewId, that.options.animations.right);
                });
                that._container = that._view.element.find('.k-recur-view');
                if (viewType === 'repeat') {
                    that._initFrequency();
                    that._initRepeatView();
                } else {
                    that._initEndNavigation();
                    that._initEndView();
                }
            },
            _destroyView: function () {
                if (this._view) {
                    this._view.destroy();
                    this._view.element.remove();
                }
                this._view = null;
            },
            _initRepeatView: function () {
                var that = this;
                var frequency = that._value.freq || 'never';
                var data = {
                    frequency: frequency,
                    weekDayCheckBoxes: weekDayCheckBoxes,
                    firstWeekDay: that.options.firstWeekDay,
                    messages: that.options.messages[frequency]
                };
                var html = RECURRENCE_REPEAT_PATTERN_TEMPLATE(data);
                var container = that._container;
                var rule = that._value;
                kendo.destroy(container);
                container.html(html);
                if (!html) {
                    that._value = {};
                    return;
                }
                if (frequency === 'weekly' && !rule.weekDays) {
                    rule.weekDays = [{
                            day: that.options.start.getDay(),
                            offset: 0
                        }];
                }
                that._initInterval();
                that._initMonthDay();
                that._initWeekDays();
                that._initWeekDay();
                that._initMonth();
                that._period();
            },
            _initEndView: function (endPattern) {
                var that = this;
                var rule = that._value;
                if (endPattern === undefined) {
                    if (rule.count) {
                        endPattern = 'count';
                    } else if (rule.until) {
                        endPattern = 'until';
                    }
                }
                var data = {
                    endPattern: endPattern,
                    messages: that.options.messages.end
                };
                kendo.destroy(that._container);
                that._container.html(RECURRENCE_END_PATTERN_TEMPLATE(data));
                that._initCount();
                that._initUntil();
            },
            _initWeekDay: function () {
                var that = this, data;
                var weekdayMessage = that.options.messages.weekdays;
                var offsetMessage = that.options.messages.offsetPositions;
                var weekDaySelect = that._container.find('.k-recur-weekday');
                var change = function () {
                    that._weekDayRule();
                    that.trigger('change');
                };
                if (weekDaySelect[0]) {
                    that._weekDayOffset = that._container.find('.k-recur-weekday-offset').html(that._options([
                        {
                            text: offsetMessage.first,
                            value: '1'
                        },
                        {
                            text: offsetMessage.second,
                            value: '2'
                        },
                        {
                            text: offsetMessage.third,
                            value: '3'
                        },
                        {
                            text: offsetMessage.fourth,
                            value: '4'
                        },
                        {
                            text: offsetMessage.last,
                            value: '-1'
                        }
                    ])).change(change);
                    data = [
                        {
                            text: weekdayMessage.day,
                            value: 'day'
                        },
                        {
                            text: weekdayMessage.weekday,
                            value: 'weekday'
                        },
                        {
                            text: weekdayMessage.weekend,
                            value: 'weekend'
                        }
                    ];
                    data = data.concat($.map(kendo.culture().calendar.days.names, function (dayName, idx) {
                        return {
                            text: dayName,
                            value: idx
                        };
                    }));
                    that._weekDay = weekDaySelect.html(that._options(data)).change(change).val(that.options.start.getDay());
                    that._weekDayView();
                }
            },
            _initMonth: function () {
                var that = this;
                var rule = that._value;
                var start = that.options.start;
                var month = rule.months || [start.getMonth() + 1];
                var monthSelect = that._container.find('.k-recur-month');
                var monthNames = kendo.culture().calendar.months.names;
                if (monthSelect[0]) {
                    var data = $.map(monthNames, function (monthName, idx) {
                        return {
                            text: monthName,
                            value: idx + 1
                        };
                    });
                    monthSelect.html(that._options(data)).change(function () {
                        rule.months = [Number(this.value)];
                    });
                    that._monthSelect = monthSelect;
                    if (month) {
                        monthSelect.val(month[0]);
                    }
                }
            },
            _period: function () {
                var that = this;
                var rule = that._value;
                var container = that._container;
                var messages = that.options.messages[rule.freq];
                var repeatRuleGroupButton = container.find('.k-repeat-rule');
                var weekDayView = container.find('.k-weekday-view');
                var monthDayView = container.find('.k-monthday-view');
                if (repeatRuleGroupButton[0]) {
                    var currentValue = rule.weekDays ? 'weekday' : 'monthday';
                    var html = RECURRENCE_GROUP_BUTTON_TEMPLATE({
                        value: currentValue,
                        dataSource: [
                            {
                                text: messages.dayOfMonth,
                                value: 'monthday'
                            },
                            {
                                text: messages.dayOfWeek,
                                value: 'weekday'
                            }
                        ],
                        ns: kendo.ns
                    });
                    var init = function (val) {
                        var weekDayName = that._weekDay.val();
                        var weekDayOffset = that._weekDayOffset.val();
                        var monthDay = that._monthDay.value();
                        var month = that._monthSelect ? that._monthSelect.val() : null;
                        if (val === 'monthday') {
                            rule.weekDays = null;
                            rule.monthDays = monthDay ? [monthDay] : monthDay;
                            rule.months = month ? [Number(month)] : month;
                            weekDayView.hide();
                            monthDayView.show();
                        } else {
                            rule.monthDays = null;
                            rule.months = month ? [Number(month)] : month;
                            rule.weekDays = [{
                                    offset: Number(weekDayOffset),
                                    day: Number(weekDayName)
                                }];
                            weekDayView.show();
                            monthDayView.hide();
                        }
                    };
                    repeatRuleGroupButton.append(html).on(CLICK + that._namespace, '.k-scheduler-navigation li', function (e) {
                        var li = $(this).addClass('k-state-selected');
                        e.preventDefault();
                        li.siblings().removeClass('k-state-selected');
                        var value = li.children('a').attr(kendo.attr('value'));
                        init(value);
                    });
                    init(currentValue);
                }
            },
            _initUntil: function () {
                var that = this;
                var input = that._container.find('.k-recur-until');
                var start = that.options.start;
                var rule = that._value;
                var until = rule.until;
                var min = until && until < start ? until : start;
                if (kendo.support.input.date) {
                    that._until = input.attr('min', kendo.toString(min, 'yyyy-MM-dd')).val(kendo.toString(until || start, 'yyyy-MM-dd')).on('change', function () {
                        rule.until = kendo.parseDate(this.value, 'yyyy-MM-dd');
                    });
                } else {
                    that._until = input.kendoJalaliDatePicker({
                        min: min,
                        value: until || start,
                        change: function () {
                            rule.until = this.value();
                        }
                    }).data('kendoJalaliDatePicker');
                }
            },
            _options: function (data, optionLabel) {
                var idx = 0;
                var html = '';
                var length = data.length;
                var template = this._optionTemplate;
                if (optionLabel) {
                    html += template({
                        value: '',
                        text: optionLabel
                    });
                }
                for (; idx < length; idx++) {
                    html += template(data[idx]);
                }
                return html;
            }
        });
        ui.plugin(MobileRecurrenceEditor);
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));





/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('util/main', ['kendo.core'], f);
}(function () {
    (function () {
        var math = Math, kendo = window.kendo, deepExtend = kendo.deepExtend;
        var DEG_TO_RAD = math.PI / 180, MAX_NUM = Number.MAX_VALUE, MIN_NUM = -Number.MAX_VALUE, UNDEFINED = 'undefined';
        function defined(value) {
            return typeof value !== UNDEFINED;
        }
        function round(value, precision) {
            var power = pow(precision);
            return math.round(value * power) / power;
        }
        function pow(p) {
            if (p) {
                return math.pow(10, p);
            } else {
                return 1;
            }
        }
        function limitValue(value, min, max) {
            return math.max(math.min(value, max), min);
        }
        function rad(degrees) {
            return degrees * DEG_TO_RAD;
        }
        function deg(radians) {
            return radians / DEG_TO_RAD;
        }
        function isNumber(val) {
            return typeof val === 'number' && !isNaN(val);
        }
        function valueOrDefault(value, defaultValue) {
            return defined(value) ? value : defaultValue;
        }
        function sqr(value) {
            return value * value;
        }
        function objectKey(object) {
            var parts = [];
            for (var key in object) {
                parts.push(key + object[key]);
            }
            return parts.sort().join('');
        }
        function hashKey(str) {
            var hash = 2166136261;
            for (var i = 0; i < str.length; ++i) {
                hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
                hash ^= str.charCodeAt(i);
            }
            return hash >>> 0;
        }
        function hashObject(object) {
            return hashKey(objectKey(object));
        }
        var now = Date.now;
        if (!now) {
            now = function () {
                return new DATE().getTime();
            };
        }
        function arrayLimits(arr) {
            var length = arr.length, i, min = MAX_NUM, max = MIN_NUM;
            for (i = 0; i < length; i++) {
                max = math.max(max, arr[i]);
                min = math.min(min, arr[i]);
            }
            return {
                min: min,
                max: max
            };
        }
        function arrayMin(arr) {
            return arrayLimits(arr).min;
        }
        function arrayMax(arr) {
            return arrayLimits(arr).max;
        }
        function sparseArrayMin(arr) {
            return sparseArrayLimits(arr).min;
        }
        function sparseArrayMax(arr) {
            return sparseArrayLimits(arr).max;
        }
        function sparseArrayLimits(arr) {
            var min = MAX_NUM, max = MIN_NUM;
            for (var i = 0, length = arr.length; i < length; i++) {
                var n = arr[i];
                if (n !== null && isFinite(n)) {
                    min = math.min(min, n);
                    max = math.max(max, n);
                }
            }
            return {
                min: min === MAX_NUM ? undefined : min,
                max: max === MIN_NUM ? undefined : max
            };
        }
        function last(array) {
            if (array) {
                return array[array.length - 1];
            }
        }
        function append(first, second) {
            first.push.apply(first, second);
            return first;
        }
        function renderTemplate(text) {
            return kendo.template(text, {
                useWithBlock: false,
                paramName: 'd'
            });
        }
        function renderAttr(name, value) {
            return defined(value) && value !== null ? ' ' + name + '=\'' + value + '\' ' : '';
        }
        function renderAllAttr(attrs) {
            var output = '';
            for (var i = 0; i < attrs.length; i++) {
                output += renderAttr(attrs[i][0], attrs[i][1]);
            }
            return output;
        }
        function renderStyle(attrs) {
            var output = '';
            for (var i = 0; i < attrs.length; i++) {
                var value = attrs[i][1];
                if (defined(value)) {
                    output += attrs[i][0] + ':' + value + ';';
                }
            }
            if (output !== '') {
                return output;
            }
        }
        function renderSize(size) {
            if (typeof size !== 'string') {
                size += 'px';
            }
            return size;
        }
        function renderPos(pos) {
            var result = [];
            if (pos) {
                var parts = kendo.toHyphens(pos).split('-');
                for (var i = 0; i < parts.length; i++) {
                    result.push('k-pos-' + parts[i]);
                }
            }
            return result.join(' ');
        }
        function isTransparent(color) {
            return color === '' || color === null || color === 'none' || color === 'transparent' || !defined(color);
        }
        function arabicToRoman(n) {
            var literals = {
                1: 'i',
                10: 'x',
                100: 'c',
                2: 'ii',
                20: 'xx',
                200: 'cc',
                3: 'iii',
                30: 'xxx',
                300: 'ccc',
                4: 'iv',
                40: 'xl',
                400: 'cd',
                5: 'v',
                50: 'l',
                500: 'd',
                6: 'vi',
                60: 'lx',
                600: 'dc',
                7: 'vii',
                70: 'lxx',
                700: 'dcc',
                8: 'viii',
                80: 'lxxx',
                800: 'dccc',
                9: 'ix',
                90: 'xc',
                900: 'cm',
                1000: 'm'
            };
            var values = [
                1000,
                900,
                800,
                700,
                600,
                500,
                400,
                300,
                200,
                100,
                90,
                80,
                70,
                60,
                50,
                40,
                30,
                20,
                10,
                9,
                8,
                7,
                6,
                5,
                4,
                3,
                2,
                1
            ];
            var roman = '';
            while (n > 0) {
                if (n < values[0]) {
                    values.shift();
                } else {
                    roman += literals[values[0]];
                    n -= values[0];
                }
            }
            return roman;
        }
        function romanToArabic(r) {
            r = r.toLowerCase();
            var digits = {
                i: 1,
                v: 5,
                x: 10,
                l: 50,
                c: 100,
                d: 500,
                m: 1000
            };
            var value = 0, prev = 0;
            for (var i = 0; i < r.length; ++i) {
                var v = digits[r.charAt(i)];
                if (!v) {
                    return null;
                }
                value += v;
                if (v > prev) {
                    value -= 2 * prev;
                }
                prev = v;
            }
            return value;
        }
        function memoize(f) {
            var cache = Object.create(null);
            return function () {
                var id = '';
                for (var i = arguments.length; --i >= 0;) {
                    id += ':' + arguments[i];
                }
                if (id in cache) {
                    return cache[id];
                }
                return f.apply(this, arguments);
            };
        }
        function ucs2decode(string) {
            var output = [], counter = 0, length = string.length, value, extra;
            while (counter < length) {
                value = string.charCodeAt(counter++);
                if (value >= 55296 && value <= 56319 && counter < length) {
                    extra = string.charCodeAt(counter++);
                    if ((extra & 64512) == 56320) {
                        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
                    } else {
                        output.push(value);
                        counter--;
                    }
                } else {
                    output.push(value);
                }
            }
            return output;
        }
        function ucs2encode(array) {
            return array.map(function (value) {
                var output = '';
                if (value > 65535) {
                    value -= 65536;
                    output += String.fromCharCode(value >>> 10 & 1023 | 55296);
                    value = 56320 | value & 1023;
                }
                output += String.fromCharCode(value);
                return output;
            }).join('');
        }
        deepExtend(kendo, {
            util: {
                MAX_NUM: MAX_NUM,
                MIN_NUM: MIN_NUM,
                append: append,
                arrayLimits: arrayLimits,
                arrayMin: arrayMin,
                arrayMax: arrayMax,
                defined: defined,
                deg: deg,
                hashKey: hashKey,
                hashObject: hashObject,
                isNumber: isNumber,
                isTransparent: isTransparent,
                last: last,
                limitValue: limitValue,
                now: now,
                objectKey: objectKey,
                round: round,
                rad: rad,
                renderAttr: renderAttr,
                renderAllAttr: renderAllAttr,
                renderPos: renderPos,
                renderSize: renderSize,
                renderStyle: renderStyle,
                renderTemplate: renderTemplate,
                sparseArrayLimits: sparseArrayLimits,
                sparseArrayMin: sparseArrayMin,
                sparseArrayMax: sparseArrayMax,
                sqr: sqr,
                valueOrDefault: valueOrDefault,
                romanToArabic: romanToArabic,
                arabicToRoman: arabicToRoman,
                memoize: memoize,
                ucs2encode: ucs2encode,
                ucs2decode: ucs2decode
            }
        });
        kendo.drawing.util = kendo.util;
        kendo.dataviz.util = kendo.util;
    }());
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));
(function (f, define) {
    define('util/text-metrics', [
        'kendo.core',
        'util/main'
    ], f);
}(function () {
    (function ($) {
        var doc = document, kendo = window.kendo, Class = kendo.Class, util = kendo.util, defined = util.defined;
        var LRUCache = Class.extend({
            init: function (size) {
                this._size = size;
                this._length = 0;
                this._map = {};
            },
            put: function (key, value) {
                var lru = this, map = lru._map, entry = {
                        key: key,
                        value: value
                    };
                map[key] = entry;
                if (!lru._head) {
                    lru._head = lru._tail = entry;
                } else {
                    lru._tail.newer = entry;
                    entry.older = lru._tail;
                    lru._tail = entry;
                }
                if (lru._length >= lru._size) {
                    map[lru._head.key] = null;
                    lru._head = lru._head.newer;
                    lru._head.older = null;
                } else {
                    lru._length++;
                }
            },
            get: function (key) {
                var lru = this, entry = lru._map[key];
                if (entry) {
                    if (entry === lru._head && entry !== lru._tail) {
                        lru._head = entry.newer;
                        lru._head.older = null;
                    }
                    if (entry !== lru._tail) {
                        if (entry.older) {
                            entry.older.newer = entry.newer;
                            entry.newer.older = entry.older;
                        }
                        entry.older = lru._tail;
                        entry.newer = null;
                        lru._tail.newer = entry;
                        lru._tail = entry;
                    }
                    return entry.value;
                }
            }
        });
        var defaultMeasureBox = $('<div style=\'position: absolute !important; top: -4000px !important; width: auto !important; height: auto !important;' + 'padding: 0 !important; margin: 0 !important; border: 0 !important;' + 'line-height: normal !important; visibility: hidden !important; white-space: nowrap!important;\' />')[0];
        function zeroSize() {
            return {
                width: 0,
                height: 0,
                baseline: 0
            };
        }
        var TextMetrics = Class.extend({
            init: function (options) {
                this._cache = new LRUCache(1000);
                this._initOptions(options);
            },
            options: { baselineMarkerSize: 1 },
            measure: function (text, style, box) {
                if (!text) {
                    return zeroSize();
                }
                var styleKey = util.objectKey(style), cacheKey = util.hashKey(text + styleKey), cachedResult = this._cache.get(cacheKey);
                if (cachedResult) {
                    return cachedResult;
                }
                var size = zeroSize();
                var measureBox = box ? box : defaultMeasureBox;
                var baselineMarker = this._baselineMarker().cloneNode(false);
                for (var key in style) {
                    var value = style[key];
                    if (defined(value)) {
                        measureBox.style[key] = value;
                    }
                }
                $(measureBox).text(text);
                measureBox.appendChild(baselineMarker);
                doc.body.appendChild(measureBox);
                if ((text + '').length) {
                    size.width = measureBox.offsetWidth - this.options.baselineMarkerSize;
                    size.height = measureBox.offsetHeight;
                    size.baseline = baselineMarker.offsetTop + this.options.baselineMarkerSize;
                }
                if (size.width > 0 && size.height > 0) {
                    this._cache.put(cacheKey, size);
                }
                measureBox.parentNode.removeChild(measureBox);
                return size;
            },
            _baselineMarker: function () {
                return $('<div class=\'k-baseline-marker\' ' + 'style=\'display: inline-block; vertical-align: baseline;' + 'width: ' + this.options.baselineMarkerSize + 'px; height: ' + this.options.baselineMarkerSize + 'px;' + 'overflow: hidden;\' />')[0];
            }
        });
        TextMetrics.current = new TextMetrics();
        function measureText(text, style, measureBox) {
            return TextMetrics.current.measure(text, style, measureBox);
        }
        function loadFonts(fonts, callback) {
            var promises = [];
            if (fonts.length > 0 && document.fonts) {
                try {
                    promises = fonts.map(function (font) {
                        return document.fonts.load(font);
                    });
                } catch (e) {
                    kendo.logToConsole(e);
                }
                Promise.all(promises).then(callback, callback);
            } else {
                callback();
            }
        }
        kendo.util.TextMetrics = TextMetrics;
        kendo.util.LRUCache = LRUCache;
        kendo.util.loadFonts = loadFonts;
        kendo.util.measureText = measureText;
    }(window.kendo.jQuery));
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));
(function (f, define) {
    define('util/base64', ['util/main'], f);
}(function () {
    (function () {
        var kendo = window.kendo, deepExtend = kendo.deepExtend, fromCharCode = String.fromCharCode;
        var KEY_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        function encodeBase64(input) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = encodeUTF8(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + KEY_STR.charAt(enc1) + KEY_STR.charAt(enc2) + KEY_STR.charAt(enc3) + KEY_STR.charAt(enc4);
            }
            return output;
        }
        function encodeUTF8(input) {
            var output = '';
            for (var i = 0; i < input.length; i++) {
                var c = input.charCodeAt(i);
                if (c < 128) {
                    output += fromCharCode(c);
                } else if (c < 2048) {
                    output += fromCharCode(192 | c >>> 6);
                    output += fromCharCode(128 | c & 63);
                } else if (c < 65536) {
                    output += fromCharCode(224 | c >>> 12);
                    output += fromCharCode(128 | c >>> 6 & 63);
                    output += fromCharCode(128 | c & 63);
                }
            }
            return output;
        }
        deepExtend(kendo.util, {
            encodeBase64: encodeBase64,
            encodeUTF8: encodeUTF8
        });
    }());
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));
(function (f, define) {
    define('mixins/observers', ['kendo.core'], f);
}(function () {
    (function ($) {
        var math = Math, kendo = window.kendo, deepExtend = kendo.deepExtend, inArray = $.inArray;
        var ObserversMixin = {
            observers: function () {
                this._observers = this._observers || [];
                return this._observers;
            },
            addObserver: function (element) {
                if (!this._observers) {
                    this._observers = [element];
                } else {
                    this._observers.push(element);
                }
                return this;
            },
            removeObserver: function (element) {
                var observers = this.observers();
                var index = inArray(element, observers);
                if (index != -1) {
                    observers.splice(index, 1);
                }
                return this;
            },
            trigger: function (methodName, event) {
                var observers = this._observers;
                var observer;
                var idx;
                if (observers && !this._suspended) {
                    for (idx = 0; idx < observers.length; idx++) {
                        observer = observers[idx];
                        if (observer[methodName]) {
                            observer[methodName](event);
                        }
                    }
                }
                return this;
            },
            optionsChange: function (e) {
                e = e || {};
                e.element = this;
                this.trigger('optionsChange', e);
            },
            geometryChange: function () {
                this.trigger('geometryChange', { element: this });
            },
            suspend: function () {
                this._suspended = (this._suspended || 0) + 1;
                return this;
            },
            resume: function () {
                this._suspended = math.max((this._suspended || 0) - 1, 0);
                return this;
            },
            _observerField: function (field, value) {
                if (this[field]) {
                    this[field].removeObserver(this);
                }
                this[field] = value;
                value.addObserver(this);
            }
        };
        deepExtend(kendo, { mixins: { ObserversMixin: ObserversMixin } });
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));
(function (f, define) {
    define('kendo.scheduler', [
        'kendo.dropdownlist',
        'kendo.editable',
        'kendo.multiselect',
        'kendo.window',
        'kendo.datetimepicker',
        'kendo.scheduler.recurrence',
        'kendo.scheduler.view',
        'kendo.scheduler.dayview',
        'kendo.scheduler.agendaview',
        'kendo.scheduler.monthview',
        'kendo.scheduler.timelineview',
        'kendo.mobile.actionsheet',
        'kendo.mobile.pane',
        'kendo.pdf'
    ], f);
}(function () {
    var __meta__ = {
        id: 'scheduler',
        name: 'JalaliScheduler',
        category: 'web',
        description: 'The Scheduler is an event calendar.',
        depends: [
            'dropdownlist',
            'editable',
            'multiselect',
            'window',
            'jalaidatepicker',
            'datetimepicker',
            'scheduler.recurrence',
            'scheduler.view'
        ],
        features: [
            {
                id: 'scheduler-dayview',
                name: 'Scheduler Day View',
                description: 'Scheduler Day View',
                depends: ['scheduler.dayview']
            },
            {
                id: 'scheduler-agendaview',
                name: 'Scheduler Agenda View',
                description: 'Scheduler Agenda View',
                depends: ['scheduler.agendaview']
            },
            {
                id: 'scheduler-monthview',
                name: 'Scheduler Month View',
                description: 'Scheduler Month View',
                depends: ['scheduler.monthview']
            },
            {
                id: 'scheduler-timelineview',
                name: 'Scheduler Timeline View',
                description: 'Scheduler Timeline View',
                depends: ['scheduler.timelineview']
            },
            {
                id: 'scheduler-mobile',
                name: 'Scheduler adaptive rendering',
                description: 'Support for adaptive rendering',
                depends: [
                    'mobile.actionsheet',
                    'mobile.pane'
                ]
            },
            {
                id: 'scheduler-pdf-export',
                name: 'PDF export',
                description: 'Export the scheduler events as PDF',
                depends: [
                    'pdf',
                    'drawing'
                ]
            },
            {
                id: 'scheduler-timezones',
                name: 'Timezones',
                description: 'Allow selecting timezones different than Etc/UTC',
                depends: ['timezones']
            }
        ]
    };
    (function ($, undefined) {
        var kendo = window.kendo, date = JalaliKendoDate, DATE = JalaliDate, input_support = kendo.support.input, MS_PER_DAY = date.MS_PER_DAY, getDate = date.getDate, getMilliseconds = JalaliKendoDate.getMilliseconds, recurrence = kendo.recurrence, keys = kendo.keys, ui = kendo.ui, Widget = ui.Widget, DataBoundWidget = ui.DataBoundWidget, STRING = 'string', Popup = ui.Popup, Calendar = ui.JalaliCalendar, DataSource = kendo.data.DataSource, isPlainObject = $.isPlainObject, extend = $.extend, proxy = $.proxy, toString = Object.prototype.toString, isArray = $.isArray, NS = '.kendoJalaliScheduler', CLICK = 'click', CHANGE = 'change', CANCEL = 'cancel', REMOVE = 'remove', SAVE = 'save', ADD = 'add', EDIT = 'edit', valueStartEndBoundRegex = /(?:value:start|value:end)(?:,|$)/, TODAY = getDate(new DATE()), EXCEPTION_SEPARATOR = ',', RECURRENCE_EXCEPTION = 'recurrenceException',
                DELETECONFIRM = 'آیا از پاک کردن این رویداد اطمینان دارید',
                DELETERECURRING = 'آیا میخواهید تنها این رویداد حذف شود یا تمام رویدادهای تکرار شونده حذف شوند ؟',
                EDITRECURRING = 'آیا میخواهید تنها این رویداد ویرایش شود یا تمام رویدادهای تکرار شونده ویرایش شوند ؟',
                DELETERECURRINGCONFIRM = 'آیا از پاک کردن سلسله رویدادها اطمینان دارید',
                DELETESERIESCONFIRM = 'آیا از پاک کردن این سری رویدادها اطمینان دارید',
                COMMANDBUTTONTMPL = '<a class="k-button #=className#" #=attr# href="\\#">#=text#</a>',
                VIEWBUTTONTEMPLATE = kendo.template('<li class="k-current-view" data-#=ns#name="#=view#"><a role="button" href="\\#" class="k-link">${views[view].title}</a></li>'),
                //TOOLBARTEMPLATE = kendo.template('<div class="k-floatwrap k-header k-scheduler-toolbar">' + '# if (pdf) { #' + '<ul class="k-reset k-scheduler-tools">' + '<li><a role="button" href="\\#" class="k-button k-pdf"><span class="k-icon k-i-pdf"></span>${messages.pdf}</a></li>' + '</ul>' + '# } #' + '<ul class="k-reset k-scheduler-navigation">' + '<li class="k-state-default k-header k-nav-today"><a role="button" href="\\#" class="k-link">${messages.today}</a></li>' + '<li class="k-state-default k-header k-nav-prev"><a role="button" href="\\#" class="k-link"><span class="k-icon k-i-arrow-w"></span></a></li>' + '<li class="k-state-default k-header k-nav-next"><a role="button" href="\\#" class="k-link"><span class="k-icon k-i-arrow-e"></span></a></li>' + '<li class="k-state-default k-nav-current">' + '<a role="button" href="\\#" class="k-link">' + '<span class="k-icon k-i-calendar"></span>' + '<span class="k-sm-date-format" data-#=ns#bind="text: formattedShortDate"></span>' + '<span class="k-lg-date-format" data-#=ns#bind="text: formattedDate"></span>' + '</a>' + '</li>' + '</ul>' + '#if(viewsCount === 1){#' + '<a role="button" data-#=ns#name="#=view#" href="\\#" class="k-link k-scheduler-refresh">' + '<span class="k-icon k-i-refresh"></span>' + '</a>' + '#}else{#' + '<ul class="k-reset k-header k-scheduler-views">' + '#for(var view in views){#' + '<li class="k-state-default k-view-#= view.toLowerCase() #" data-#=ns#name="#=view#"><a role="button" href="\\#" class="k-link">${views[view].title}</a></li>' + '#}#' + '</ul>' + '#}#' + '</div>'), MOBILETOOLBARTEMPLATE = kendo.template('<div class="k-floatwrap k-header k-scheduler-toolbar">' + '<ul class="k-reset k-header k-scheduler-navigation">' + '<li class="k-state-default k-nav-today"><a role="button" href="\\#" class="k-link">${messages.today}</a></li>' + '</ul>' + '#if(viewsCount === 1){#' + '<a role="button" data-#=ns#name="#=view#" href="\\#" class="k-link k-scheduler-refresh">' + '<span class="k-icon k-i-refresh"></span>' + '</a>' + '#}else{#' + '<ul class="k-reset k-header k-scheduler-views">' + '#for(var view in views){#' + '<li class="k-state-default k-view-#= view.toLowerCase() #" data-#=ns#name="#=view#"><a role="button" href="\\#" class="k-link">${views[view].title}</a></li>' + '#}#' + '</ul>' + '#}#' + '</div>' + '<div class="k-floatwrap k-header k-scheduler-toolbar">' + '<ul class="k-reset k-header k-scheduler-navigation">' + '<li class="k-state-default k-nav-prev"><a role="button" href="\\#" class="k-link"><span class="k-icon k-i-arrow-w"></span></a></li>' + '<li class="k-state-default k-nav-current">' + '<span class="k-sm-date-format" data-#=ns#bind="text: formattedShortDate"></span>' + '<span class="k-lg-date-format" data-#=ns#bind="text: formattedDate"></span>' + '</li>' + '<li class="k-state-default k-nav-next"><a role="button" href="\\#" class="k-link"><span class="k-icon k-i-arrow-e"></span></a></li>' + '</ul>' + '</div>'),
                TOOLBARTEMPLATE = kendo.template('<div class="k-floatwrap k-header k-scheduler-toolbar">'+ '<span class="k-lg-date-format" data-#=ns#bind="text: formattedDate"></span>' + '</div>'),
                MOBILEDATERANGEEDITOR = function (container, options) {
                var attr = { name: options.field };
                var datepicker_role = !input_support.date ? kendo.attr('role') + '="jalalidatepicker" ' : '';
                var datetimepicker_role = kendo.attr('role') + '="datetimepicker" ';
                var isAllDay = options.model.isAllDay;
                var dateTimeValidate = kendo.attr('validate') + '=\'' + !isAllDay + '\'';
                var dateValidate = kendo.attr('validate') + '=\'' + isAllDay + '\'';
                appendTimezoneAttr(attr, options);
                appendDateCompareValidator(attr, options);
                $('<input type="datetime-local" required ' + kendo.attr('type') + '="date" ' + datetimepicker_role + kendo.attr('bind') + '="value:' + options.field + ',invisible:isAllDay" ' + dateTimeValidate + '/>').attr(attr).appendTo(container);
                $('<input type="date" required ' + kendo.attr('type') + '="date" ' + datepicker_role + kendo.attr('bind') + '="value:' + options.field + ',visible:isAllDay" ' + dateValidate + '/>').attr(attr).appendTo(container);
                $('<span ' + kendo.attr('for') + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
            }, DATERANGEEDITOR = function (container, options) {
                var attr = { name: options.field }, isAllDay = options.model.isAllDay, dateTimeValidate = kendo.attr('validate') + '=\'' + !isAllDay + '\' ', dateValidate = kendo.attr('validate') + '=\'' + isAllDay + '\' ';
                appendTimezoneAttr(attr, options);
                appendDateCompareValidator(attr, options);
                $('<input type="text" required ' + kendo.attr('type') + '="date"' + ' ' + kendo.attr('role') + '="datetimepicker" ' + kendo.attr('bind') + '="value:' + options.field + ',invisible:isAllDay" ' + dateTimeValidate + '/>').attr(attr).appendTo(container);
                $('<input type="text" required ' + kendo.attr('type') + '="date"' + ' ' + kendo.attr('role') + '="jalalidatepicker" ' + kendo.attr('bind') + '="value:' + options.field + ',visible:isAllDay" ' + dateValidate + '/>').attr(attr).appendTo(container);
                $('<span ' + kendo.attr('bind') + '="text: ' + options.field + 'Timezone"></span>').appendTo(container);
                if (options.field === 'end') {
                    $('<span ' + kendo.attr('bind') + '="text: startTimezone, invisible: endTimezone"></span>').appendTo(container);
                }
                $('<span ' + kendo.attr('for') + '="' + options.field + '" class="k-invalid-msg"/>').hide().appendTo(container);
            }, RECURRENCEEDITOR = function (container, options) {
                $('<div ' + kendo.attr('bind') + '="value:' + options.field + '" />').attr({ name: options.field }).appendTo(container).kendoRecurrenceEditor({
                    start: options.model.start,
                    timezone: options.timezone,
                    messages: options.messages
                });
            }, MOBILERECURRENCEEDITOR = function (container, options) {
                $('<div ' + kendo.attr('bind') + '="value:' + options.field + '" />').attr({ name: options.field }).appendTo(container).kendoMobileRecurrenceEditor({
                    start: options.model.start,
                    timezone: options.timezone,
                    messages: options.messages,
                    pane: options.pane,
                    value: options.model[options.field]
                });
            }, MOBILETIMEZONEPOPUP = function (container, options) {
                var text = timezoneButtonText(options.model, options.messages.noTimezone);
                $('<a href="#" class="k-button k-timezone-button" data-bind="invisible:isAllDay">' + text + '</a>').click(options.click).appendTo(container);
            }, TIMEZONEPOPUP = function (container, options) {
                $('<a href="#" class="k-button" data-bind="invisible:isAllDay">' + options.messages.timezoneEditorButton + '</a>').click(options.click).appendTo(container);
            }, MOBILETIMEZONEEDITOR = function (container, options) {
                $('<div ' + kendo.attr('bind') + '="value:' + options.field + '" />').attr({ name: options.field }).toggle(options.visible).appendTo(container).kendoMobileTimezoneEditor({ optionLabel: options.noTimezone });
            }, TIMEZONEEDITOR = function (container, options) {
                $('<div ' + kendo.attr('bind') + '="value:' + options.field + '" />').attr({ name: options.field }).toggle(options.visible).appendTo(container).kendoTimezoneEditor({ optionLabel: options.noTimezone });
            };
        function timezoneButtonText(model, message) {
            message = message || '';
            if (model.startTimezone) {
                message = model.startTimezone;
                if (model.endTimezone) {
                    message += ' | ' + model.endTimezone;
                }
            }
            return message;
        }
        function appendTimezoneAttr(attrs, options) {
            var timezone = options.timezone;
            if (timezone) {
                attrs[kendo.attr('timezone')] = timezone;
            }
        }
        function appendDateCompareValidator(attrs, options) {
            var validationRules = options.model.fields[options.field].validation;
            if (validationRules) {
                var dateCompareRule = validationRules.dateCompare;
                if (dateCompareRule && isPlainObject(dateCompareRule) && dateCompareRule.message) {
                    attrs[kendo.attr('dateCompare-msg')] = dateCompareRule.message;
                }
            }
        }
        function wrapDataAccess(originalFunction, timezone) {
            return function (data) {
                data = originalFunction(data);
                convertData(data, 'apply', timezone);
                return data || [];
            };
        }
        function wrapDataSerialization(originalFunction, timezone) {
            return function (data) {
                if (data) {
                    if (toString.call(data) !== '[object Array]' && !(data instanceof kendo.data.ObservableArray)) {
                        data = [data];
                    }
                }
                convertData(data, 'remove', timezone, true);
                data = originalFunction(data);
                return data || [];
            };
        }
        function convertData(data, method, timezone, removeUid) {
            var event, idx, length;
            data = data || [];
            for (idx = 0, length = data.length; idx < length; idx++) {
                event = data[idx];
                if (removeUid) {
                    if (event.startTimezone || event.endTimezone) {
                        if (timezone) {
                            event.start = kendo.timezone.convert(event.start, event.startTimezone || event.endTimezone, timezone);
                            event.end = kendo.timezone.convert(event.end, event.endTimezone || event.startTimezone, timezone);
                            event.start = kendo.timezone[method](event.start, timezone);
                            event.end = kendo.timezone[method](event.end, timezone);
                        } else {
                            event.start = kendo.timezone[method](event.start, event.startTimezone || event.endTimezone);
                            event.end = kendo.timezone[method](event.end, event.endTimezone || event.startTimezone);
                        }
                    } else if (timezone) {
                        event.start = kendo.timezone[method](event.start, timezone);
                        event.end = kendo.timezone[method](event.end, timezone);
                    }
                } else {
                    if (event.startTimezone || event.endTimezone) {
                        event.start = kendo.timezone[method](event.start, event.startTimezone || event.endTimezone);
                        event.end = kendo.timezone[method](event.end, event.endTimezone || event.startTimezone);
                        if (timezone) {
                            event.start = kendo.timezone.convert(event.start, event.startTimezone || event.endTimezone, timezone);
                            event.end = kendo.timezone.convert(event.end, event.endTimezone || event.startTimezone, timezone);
                        }
                    } else if (timezone) {
                        event.start = kendo.timezone[method](event.start, timezone);
                        event.end = kendo.timezone[method](event.end, timezone);
                    }
                }
                if (removeUid) {
                    delete event.uid;
                }
            }
            return data;
        }
        function getOccurrenceByUid(data, uid) {
            var length = data.length, idx = 0, event;
            for (; idx < length; idx++) {
                event = data[idx];
                if (event.uid === uid) {
                    return event;
                }
            }
        }
        var SchedulerDataReader = kendo.Class.extend({
            init: function (schema, reader) {
                var timezone = schema.timezone;
                this.reader = reader;
                if (reader.model) {
                    this.model = reader.model;
                }
                this.timezone = timezone;
                this.data = wrapDataAccess($.proxy(this.data, this), timezone);
                this.serialize = wrapDataSerialization($.proxy(this.serialize, this), timezone);
            },
            errors: function (data) {
                return this.reader.errors(data);
            },
            parse: function (data) {
                return this.reader.parse(data);
            },
            data: function (data) {
                return this.reader.data(data);
            },
            total: function (data) {
                return this.reader.total(data);
            },
            groups: function (data) {
                return this.reader.groups(data);
            },
            aggregates: function (data) {
                return this.reader.aggregates(data);
            },
            serialize: function (data) {
                return this.reader.serialize(data);
            }
        });
        function applyZone(date, fromZone, toZone) {
            if (toZone) {
                date = kendo.timezone.convert(date, fromZone, toZone);
            } else {
                date = kendo.timezone.remove(date, fromZone);
            }
            return date;
        }
        function dateCompareValidator(input) {
            if (input.filter('[name=end]').length) {
                var container = input.closest('.k-scheduler-edit-form');
                var startInput = container.find('[name=start]:visible');
                var endInput = container.find('[name=end]:visible');
                if (endInput[0] && startInput[0]) {
                    var start, end;
                    var startPicker = kendo.widgetInstance(startInput, kendo.ui);
                    var endPicker = kendo.widgetInstance(endInput, kendo.ui);
                    var editable = container.data('kendoEditable');
                    var model = editable ? editable.options.model : null;
                    if (startPicker && endPicker) {
                        start = startPicker.value();
                        end = endPicker.value();
                    } else {
                        start = kendo.parseDate(startInput.val());
                        end = kendo.parseDate(endInput.val());
                    }
                    if (start && end) {
                        if (model) {
                            var timezone = startInput.attr(kendo.attr('timezone'));
                            var startTimezone = model.startTimezone;
                            var endTimezone = model.endTimezone;
                            startTimezone = startTimezone || endTimezone;
                            endTimezone = endTimezone || startTimezone;
                            if (startTimezone) {
                                start = applyZone(start, startTimezone, timezone);
                                end = applyZone(end, endTimezone, timezone);
                            }
                        }
                        return start <= end;
                    }
                }
            }
            return true;
        }
        var SchedulerEvent = kendo.data.Model.define({
            init: function (value) {
                var that = this;
                kendo.data.Model.fn.init.call(that, value);
                that._defaultId = that.defaults[that.idField];
            },
            _time: function (field) {
                var date = this[field];
                var fieldTime = '_' + field + 'Time';
                if (this[fieldTime]) {
                    return this[fieldTime] - JalaliKendoDate.toUtcTime(JalaliKendoDate.getDate(date));
                }
                return getMilliseconds(date);
            },
            _date: function (field) {
                var fieldTime = '_' + field + 'Time';
                if (this[fieldTime]) {
                    return this[fieldTime] - this._time(field);
                }
                return JalaliKendoDate.getDate(this[field]);
            },
            clone: function (options, updateUid) {
                var uid = this.uid, event = new this.constructor($.extend({}, this.toJSON(), options));
                if (!updateUid) {
                    event.uid = uid;
                }
                return event;
            },
            duration: function () {
                var end = this.end;
                var start = this.start;
                var offset = (end.getTimezoneOffset() - start.getTimezoneOffset()) * JalaliKendoDate.MS_PER_MINUTE;
                return end - start - offset;
            },
            expand: function (start, end, zone) {
                return recurrence ? recurrence.expand(this, start, end, zone) : [this];
            },
            update: function (eventInfo) {
                for (var field in eventInfo) {
                    this.set(field, eventInfo[field]);
                }
                if (this._startTime) {
                    this.set('_startTime', JalaliKendoDate.toUtcTime(this.start));
                }
                if (this._endTime) {
                    this.set('_endTime', JalaliKendoDate.toUtcTime(this.end));
                }
            },
            isMultiDay: function () {
                return this.isAllDay || this.duration() >= JalaliKendoDate.MS_PER_DAY;
            },
            isException: function () {
                return !this.isNew() && this.recurrenceId;
            },
            isOccurrence: function () {
                return this.isNew() && this.recurrenceId;
            },
            isRecurring: function () {
                return !!(this.recurrence);
            },
            isRecurrenceHead: function () {
                return !!(this.id && this.recurrenceRule);
            },
            toOccurrence: function (options) {
                options = $.extend(options, {
                    recurrenceException: null,
                    recurrenceRule: null,
                    recurrenceId: this.id || this.recurrenceId
                });
                options[this.idField] = this.defaults[this.idField];
                return this.clone(options, true);
            },
            toJSON: function () {
                var obj = kendo.data.Model.fn.toJSON.call(this);
                obj.uid = this.uid;
                delete obj._startTime;
                delete obj._endTime;
                return obj;
            },
            shouldSerialize: function (field) {
                return kendo.data.Model.fn.shouldSerialize.call(this, field) && field !== '_defaultId';
            },
            set: function (key, value) {
                var isAllDay = this.isAllDay || false;
                kendo.data.Model.fn.set.call(this, key, value);
                if (key == 'isAllDay' && value != isAllDay) {
                    var start = JalaliKendoDate.getDate(this.start);
                    var end = new DATE(this.end);
                    var milliseconds = JalaliKendoDate.getMilliseconds(end);
                    if (milliseconds === 0 && value) {
                        milliseconds = MS_PER_DAY;
                    }
                    this.set('start', start);
                    if (value === true) {
                        JalaliKendoDate.setTime(end, -milliseconds);
                        if (end < start) {
                            end = start;
                        }
                    } else {
                        JalaliKendoDate.setTime(end, MS_PER_DAY - milliseconds);
                    }
                    this.set('end', end);
                }
            },
            id: 'id',
            fields: {
                id: { type: 'number' },
                title: {
                    defaultValue: '',
                    type: 'string'
                },
                start: {
                    type: 'date',
                    validation: { required: true }
                },
                startTimezone: { type: 'string' },
                end: {
                    type: 'date',
                    validation: {
                        required: true,
                        dateCompare: { value: dateCompareValidator }
                    }
                },
                endTimezone: { type: 'string' },
                recurrenceRule: {
                    defaultValue: '',
                    type: 'string'
                },
                recurrenceException: {
                    defaultValue: '',
                    type: 'string'
                },
                isAllDay: {
                    type: 'boolean',
                    defaultValue: false
                },
                description: { type: 'string' }
            }
        });
        var SchedulerDataSource = DataSource.extend({
            init: function (options) {
                DataSource.fn.init.call(this, extend(true, {}, {
                    schema: {
                        modelBase: SchedulerEvent,
                        model: SchedulerEvent
                    }
                }, options));
                this.reader = new SchedulerDataReader(this.options.schema, this.reader);
            },
            expand: function (start, end, wrapper) {
                var data = this.view(), filter = {};
                data.forEach(function (d) {
                    d.start = (new JalaliDate((new Date(d.start)).getTime()));
                    d.end = (new JalaliDate((new Date(d.end)).getTime()));
                });
                //data.forEach(function (d) {
                //    if (!(d.start instanceof JalaliDate)) {
                //        d.start = (new JalaliDate((new Date(d.start)).getTime()));
                //        d.end = (new JalaliDate((new Date(d.end)).getTime()));
                //    }
                //});
                // TODO FIX THIS
                var startOfMonth = wrapper.data("kendoJalaliScheduler").options.date;
                var endOfMonth = JalaliKendoDate.lastDayOfMonth(startOfMonth);
                data = data.filter(function(x) {
                    return x.end.getTime() <= endOfMonth.getTime() && x.start.getTime() >= startOfMonth.getTime();
                });
                if (start && end) {
                    end = new DATE(end.getTime() + MS_PER_DAY - 1);
                    filter = {
                        logic: 'or',
                        filters: [
                            {
                                logic: 'and',
                                filters: [
                                    {
                                        field: 'start',
                                        operator: 'gte',
                                        value: start
                                    },
                                    {
                                        field: 'end',
                                        operator: 'gte',
                                        value: start
                                    },
                                    {
                                        field: 'start',
                                        operator: 'lte',
                                        value: end
                                    }
                                ]
                            },
                            {
                                logic: 'and',
                                filters: [
                                    {
                                        field: 'start',
                                        operator: 'lte',
                                        value: new DATE(start.getTime() + MS_PER_DAY - 1)
                                    },
                                    {
                                        field: 'end',
                                        operator: 'gte',
                                        value: start
                                    }
                                ]
                            }
                        ]
                    };
                    data = new kendo.data.Query(expandAll(data, start, end, this.reader.timezone)).filter(filter).toArray();
                }
                return data;
            },
            cancelChanges: function (model) {
                if (model && model.isOccurrence()) {
                    this._removeExceptionDate(model);
                }
                DataSource.fn.cancelChanges.call(this, model);
            },
            insert: function (index, model) {
                if (!model) {
                    return;
                }
                if (!(model instanceof SchedulerEvent)) {
                    var eventInfo = model;
                    model = this._createNewModel();
                    model.accept(eventInfo);
                }
                if (!this._pushCreated && model.isRecurrenceHead() || model.recurrenceId) {
                    model = model.recurrenceId ? model : model.toOccurrence();
                    this._addExceptionDate(model);
                }
                return DataSource.fn.insert.call(this, index, model);
            },
            pushCreate: function (items) {
                this._pushCreated = true;
                DataSource.fn.pushCreate.call(this, items);
                this._pushCreated = false;
            },
            remove: function (model) {
                //if (model.isRecurrenceHead()) {
                //    this._removeExceptions(model);
                //} else if (model.isRecurring()) {
                //    this._addExceptionDate(model);
                //}
                return DataSource.fn.remove.call(this, model);
            },
            _removeExceptions: function (model) {
                var data = this.data().slice(0), item = data.shift(), id = model.id;
                while (item) {
                    if (item.recurrenceId === id) {
                        DataSource.fn.remove.call(this, item);
                    }
                    item = data.shift();
                }
                model.set(RECURRENCE_EXCEPTION, '');
            },
            _removeExceptionDate: function (model) {
                if (model.recurrenceId) {
                    var head = this.get(model.recurrenceId);
                    if (head) {
                        var start = model.start;
                        var replaceRegExp = new RegExp('(\\' + EXCEPTION_SEPARATOR + '?)' + recurrence.toExceptionString(start, this.reader.timezone));
                        head.set(RECURRENCE_EXCEPTION, head.recurrenceException.replace(replaceRegExp, ''));
                    }
                }
            },
            _addExceptionDate: function (model) {
                var start = model.start;
                var zone = this.reader.timezone;
                var head = this.get(model.recurrenceId);
                var recurrenceException = head.recurrenceException || '';
                var newException;
                if (!recurrence.isException(recurrenceException, start, zone)) {
                    newException = recurrence.toExceptionString(start, zone);
                    head.set(RECURRENCE_EXCEPTION, recurrenceException + (recurrenceException && newException ? EXCEPTION_SEPARATOR : '') + newException);
                }
            }
        });
        function expandAll(events, start, end, zone) {
            var length = events.length, data = [], idx = 0;
            for (; idx < length; idx++) {
                data = data.concat(events[idx].expand(start, end, zone));
            }
            //data.forEach(function (item) {
            //    item.start = (new JalaliDate((new Date(item.start)).getTime()));
            //    item.end = (new JalaliDate((new Date(item.end)).getTime()));
            //});
            return data;
        }
        SchedulerDataSource.create = function (options) {
            if (isArray(options) || options instanceof kendo.data.ObservableArray) {
                options = { data: options };
            }
            var dataSource = options || {}, data = dataSource.data;
            dataSource.data = data;
            if (!(dataSource instanceof SchedulerDataSource) && dataSource instanceof kendo.data.DataSource) {
                throw new Error('Incorrect DataSource type. Only SchedulerDataSource instances are supported');
            }
            return dataSource instanceof SchedulerDataSource ? dataSource : new SchedulerDataSource(dataSource);
        };
        extend(true, kendo.data, {
            SchedulerDataSource: SchedulerDataSource,
            SchedulerDataReader: SchedulerDataReader,
            SchedulerEvent: SchedulerEvent
        });
        var defaultCommands = {
            update: {
                text: 'Save',
                className: 'k-primary k-scheduler-update'
            },
            canceledit: {
                text: 'Cancel',
                className: 'k-scheduler-cancel'
            },
            destroy: {
                text: 'Delete',
                imageClass: 'k-delete',
                className: 'k-primary k-scheduler-delete',
                iconClass: 'k-icon'
            }
        };
        function trimOptions(options) {
            delete options.name;
            delete options.prefix;
            delete options.remove;
            delete options.edit;
            delete options.add;
            delete options.navigate;
            return options;
        }
        function createValidationAttributes(model, field) {
            var modelField = (model.fields || model)[field];
            var specialRules = [
                'url',
                'email',
                'number',
                'date',
                'boolean'
            ];
            var validation = modelField ? modelField.validation : {};
            var datatype = kendo.attr('type');
            var inArray = $.inArray;
            var ruleName;
            var rule;
            var attr = {};
            for (ruleName in validation) {
                rule = validation[ruleName];
                if (inArray(ruleName, specialRules) >= 0) {
                    attr[datatype] = ruleName;
                } else if (!kendo.isFunction(rule)) {
                    attr[ruleName] = isPlainObject(rule) ? rule.value || ruleName : rule;
                }
                attr[kendo.attr(ruleName + '-msg')] = rule.message;
            }
            return attr;
        }
        function dropDownResourceEditor(resource, model) {
            var attr = createValidationAttributes(model, resource.field);
            return function (container) {
                $(kendo.format('<select data-{0}bind="value:{1}">', kendo.ns, resource.field)).appendTo(container).attr(attr).kendoDropDownList({
                    dataTextField: resource.dataTextField,
                    dataValueField: resource.dataValueField,
                    dataSource: resource.dataSource,
                    valuePrimitive: resource.valuePrimitive,
                    optionLabel: 'None',
                    template: kendo.format('<span class="k-scheduler-mark" style="background-color:#= data.{0}?{0}:"none" #"></span>#={1}#', resource.dataColorField, resource.dataTextField)
                });
            };
        }
        function descriptionEditor(options) {
            var attr = createValidationAttributes(options.model, options.field);
            return function (container) {
                $('<textarea name="description" class="k-textbox"/>').attr(attr).appendTo(container);
            };
        }
        function multiSelectResourceEditor(resource, model) {
            var attr = createValidationAttributes(model, resource.field);
            return function (container) {
                $(kendo.format('<select data-{0}bind="value:{1}">', kendo.ns, resource.field)).appendTo(container).attr(attr).kendoMultiSelect({
                    dataTextField: resource.dataTextField,
                    dataValueField: resource.dataValueField,
                    dataSource: resource.dataSource,
                    valuePrimitive: resource.valuePrimitive,
                    itemTemplate: kendo.format('<span class="k-scheduler-mark" style="background-color:#= data.{0}?{0}:"none" #"></span>#={1}#', resource.dataColorField, resource.dataTextField),
                    tagTemplate: kendo.format('<span class="k-scheduler-mark" style="background-color:#= data.{0}?{0}:"none" #"></span>#={1}#', resource.dataColorField, resource.dataTextField)
                });
            };
        }
        function multiSelectResourceEditorMobile(resource, model) {
            var attr = createValidationAttributes(model, resource.field);
            return function (container) {
                var options = '';
                var view = resource.dataSource.view();
                for (var idx = 0, length = view.length; idx < length; idx++) {
                    options += kendo.format('<option value="{0}">{1}</option>', kendo.getter(resource.dataValueField)(view[idx]), kendo.getter(resource.dataTextField)(view[idx]));
                }
                $(kendo.format('<select data-{0}bind="value:{1}" multiple="multiple" data-{0}value-primitive="{3}">{2}</select>', kendo.ns, resource.field, options, resource.valuePrimitive)).appendTo(container).attr(attr);
            };
        }
        function moveEventRange(event, distance) {
            var duration = event.end.getTime() - event.start.getTime();
            var start = new DATE(event.start.getTime());
            JalaliKendoDate.setTime(start, distance);
            var end = new DATE(start.getTime());
            JalaliKendoDate.setTime(end, duration, true);
            return {
                start: start,
                end: end
            };
        }
        var editors = {
            mobile: {
                dateRange: MOBILEDATERANGEEDITOR,
                timezonePopUp: MOBILETIMEZONEPOPUP,
                timezone: MOBILETIMEZONEEDITOR,
                recurrence: MOBILERECURRENCEEDITOR,
                description: descriptionEditor,
                multipleResources: multiSelectResourceEditorMobile,
                resources: dropDownResourceEditor
            },
            desktop: {
                dateRange: DATERANGEEDITOR,
                timezonePopUp: TIMEZONEPOPUP,
                timezone: TIMEZONEEDITOR,
                recurrence: RECURRENCEEDITOR,
                description: descriptionEditor,
                multipleResources: multiSelectResourceEditor,
                resources: dropDownResourceEditor
            }
        };
        var Editor = kendo.Observable.extend({
            init: function (element, options) {
                kendo.Observable.fn.init.call(this);
                this.element = element;
                this.options = extend(true, {}, this.options, options);
                this.createButton = this.options.createButton;
                this.toggleDateValidationHandler = proxy(this._toggleDateValidation, this);
            },
            _toggleDateValidation: function (e) {
                if (e.field == 'isAllDay') {
                    var container = this.container, isAllDay = this.editable.options.model.isAllDay, bindAttribute = kendo.attr('bind'), element, isDateTimeInput, shouldValidate;
                    container.find('[' + bindAttribute + '*=end],[' + bindAttribute + '*=start]').each(function () {
                        element = $(this);
                        if (valueStartEndBoundRegex.test(element.attr(bindAttribute))) {
                            isDateTimeInput = element.is('[' + kendo.attr('role') + '=datetimepicker],[type*=datetime]');
                            shouldValidate = isAllDay !== isDateTimeInput;
                            element.attr(kendo.attr('validate'), shouldValidate);
                        }
                    });
                }
            },
            fields: function (editors, model) {
                var that = this;
                var messages = that.options.messages;
                var timezone = that.options.timezone;
                var click = function (e) {
                    e.preventDefault();
                    that._initTimezoneEditor(model, this);
                };
                var fields = [
                    {
                        field: 'title',
                        title: messages.editor.title
                    },
                    {
                        field: 'start',
                        title: messages.editor.start,
                        editor: editors.dateRange,
                        timezone: timezone
                    },
                    {
                        field: 'end',
                        title: messages.editor.end,
                        editor: editors.dateRange,
                        timezone: timezone
                    },
                    {
                        field: 'isAllDay',
                        title: messages.editor.allDayEvent
                    }
                ];
                if (kendo.timezone.windows_zones) {
                    fields.push({
                        field: 'timezone',
                        title: messages.editor.timezone,
                        editor: editors.timezonePopUp,
                        click: click,
                        messages: messages.editor,
                        model: model
                    });
                    fields.push({
                        field: 'startTimezone',
                        title: messages.editor.startTimezone,
                        editor: editors.timezone,
                        noTimezone: messages.editor.noTimezone
                    });
                    fields.push({
                        field: 'endTimezone',
                        title: messages.editor.endTimezone,
                        editor: editors.timezone,
                        noTimezone: messages.editor.noTimezone
                    });
                }
                if (!model.recurrenceId) {
                    fields.push({
                        field: 'recurrenceRule',
                        title: messages.editor.repeat,
                        editor: editors.recurrence,
                        timezone: timezone,
                        messages: messages.recurrenceEditor,
                        pane: this.pane
                    });
                }
                if ('description' in model) {
                    fields.push({
                        field: 'description',
                        title: messages.editor.description,
                        editor: editors.description({
                            model: model,
                            field: 'description'
                        })
                    });
                }
                for (var resourceIndex = 0; resourceIndex < this.options.resources.length; resourceIndex++) {
                    var resource = this.options.resources[resourceIndex];
                    fields.push({
                        field: resource.field,
                        title: resource.title,
                        editor: resource.multiple ? editors.multipleResources(resource, model) : editors.resources(resource, model)
                    });
                }
                return fields;
            },
            end: function () {
                return this.editable.end();
            },
            _buildEditTemplate: function (model, fields, editableFields) {
                var messages = this.options.messages;
                var settings = extend({}, kendo.Template, this.options.templateSettings);
                var paramName = settings.paramName;
                var template = this.options.editable.template;
                var html = '';
                if (template) {
                    if (typeof template === STRING) {
                        template = window.unescape(template);
                    }
                    html += kendo.template(template, settings)(model);
                } else {
                    for (var idx = 0, length = fields.length; idx < length; idx++) {
                        var field = fields[idx];
                        if (field.field === 'startTimezone') {
                            html += '<div class="k-popup-edit-form k-scheduler-edit-form k-scheduler-timezones" style="display:none">';
                            html += '<div class="k-edit-form-container">';
                            html += '<div class="k-edit-label"></div>';
                            html += '<div class="k-edit-field"><label class="k-check"><input class="k-timezone-toggle" type="checkbox" />' + messages.editor.separateTimezones + '</label></div>';
                        }
                        html += '<div class="k-edit-label"><label for="' + field.field + '">' + (field.title || field.field || '') + '</label></div>';
                        if (!model.editable || model.editable(field.field)) {
                            editableFields.push(field);
                            html += '<div ' + kendo.attr('container-for') + '="' + field.field + '" class="k-edit-field"></div>';
                        } else {
                            var tmpl = '#:';
                            if (field.field) {
                                field = kendo.expr(field.field, paramName);
                                tmpl += field + '==null?\'\':' + field;
                            } else {
                                tmpl += '\'\'';
                            }
                            tmpl += '#';
                            tmpl = kendo.template(tmpl, settings);
                            html += '<div class="k-edit-field">' + tmpl(model) + '</div>';
                        }
                        if (field.field === 'endTimezone') {
                            html += this._createEndTimezoneButton();
                        }
                    }
                }
                return html;
            },
            _createEndTimezoneButton: function () {
                return '</div></div>';
            },
            _revertTimezones: function (model) {
                model.set('startTimezone', this._startTimezone);
                model.set('endTimezone', this._endTimezone);
                delete this._startTimezone;
                delete this._endTimezone;
            }
        });
        var MobileEditor = Editor.extend({
            init: function () {
                Editor.fn.init.apply(this, arguments);
                this.pane = kendo.mobile.ui.Pane.wrap(this.element);
                this.pane.element.parent().css('height', this.options.height);
                this.view = this.pane.view();
                this._actionSheetButtonTemplate = kendo.template('<li><a #=attr# class="k-button #=className#" href="\\#">#:text#</a></li>');
                this._actionSheetPopupOptions = $(document.documentElement).hasClass('km-root') ? { modal: false } : {
                    align: 'bottom center',
                    position: 'bottom center',
                    effect: 'slideIn:up'
                };
            },
            options: {
                animations: {
                    left: 'slide',
                    right: 'slide:right'
                }
            },
            destroy: function () {
                this.close();
                this.unbind();
                this.pane.destroy();
            },
            _initTimezoneEditor: function (model) {
                var that = this;
                var pane = that.pane;
                var messages = that.options.messages;
                var timezoneView = that.timezoneView;
                var container = that.container.find('.k-scheduler-timezones');
                var checkbox = container.find('.k-timezone-toggle');
                var endTimezoneRow = container.find('.k-edit-label:last').add(container.find('.k-edit-field:last'));
                var startTimezoneChange = function (e) {
                    if (e.field === 'startTimezone') {
                        var value = model.startTimezone;
                        checkbox.prop('disabled', !value);
                        if (!value) {
                            endTimezoneRow.hide();
                            model.set('endTimezone', '');
                            checkbox.prop('checked', false);
                        }
                    }
                };
                that._startTimezone = model.startTimezone || '';
                that._endTimezone = model.endTimezone || '';
                if (!timezoneView) {
                    var html = '<div data-role="view" class="k-popup-edit-form k-scheduler-edit-form k-mobile-list">' + '<div data-role="header" class="k-header"><a href="#" class="k-button k-scheduler-cancel">' + messages.cancel + '</a>' + messages.editor.timezoneTitle + '<a href="#" class="k-button k-scheduler-update">' + messages.save + '</a></div></div>';
                    this.timezoneView = timezoneView = pane.append(html);
                    timezoneView.contentElement().append(container.show());
                    timezoneView.element.on(CLICK + NS, '.k-scheduler-cancel, .k-scheduler-update', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($(this).hasClass('k-scheduler-cancel')) {
                            that._revertTimezones(model);
                        }
                        model.unbind('change', startTimezoneChange);
                        var editView = pane.element.find('#edit').data('kendoMobileView');
                        var text = timezoneButtonText(model, messages.editor.noTimezone);
                        editView.contentElement().find('.k-timezone-button').text(text);
                        pane.navigate(editView, that.options.animations.right);
                    });
                    checkbox.click(function () {
                        endTimezoneRow.toggle(checkbox.prop('checked'));
                        model.set('endTimezone', '');
                    });
                    model.bind('change', startTimezoneChange);
                }
                checkbox.prop('checked', model.endTimezone).prop('disabled', !model.startTimezone);
                if (model.endTimezone) {
                    endTimezoneRow.show();
                } else {
                    endTimezoneRow.hide();
                }
                pane.navigate(timezoneView, that.options.animations.left);
            },
            _createActionSheetButton: function (options) {
                options.template = this._actionSheetButtonTemplate;
                return this.createButton(options);
            },
            showDialog: function (options) {
                var type = '';
                var html = '<ul><li class="km-actionsheet-title">' + options.title + '</li>';
                var target = this.element.find('.k-event[' + kendo.attr('uid') + '=\'' + options.model.uid + '\']');
                if (this.container) {
                    target = this.container.find('.k-scheduler-delete');
                    if (target[0]) {
                        type = 'phone';
                    }
                }
                for (var buttonIndex = 0; buttonIndex < options.buttons.length; buttonIndex++) {
                    html += this._createActionSheetButton(options.buttons[buttonIndex]);
                }
                html += '</ul>';
                var actionSheet = $(html).appendTo(this.pane.view().element).kendoMobileActionSheet({
                    type: type,
                    cancel: this.options.messages.cancel,
                    cancelTemplate: '<li class="km-actionsheet-cancel"><a class="k-button" href="\\#">#:cancel#</a></li>',
                    close: function () {
                        this.destroy();
                    },
                    command: function (e) {
                        var buttonIndex = actionSheet.element.find('li:not(.km-actionsheet-cancel) > .k-button').index($(e.currentTarget));
                        if (buttonIndex > -1) {
                            actionSheet.close();
                            options.buttons[buttonIndex].click();
                        }
                    },
                    popup: this._actionSheetPopupOptions
                }).data('kendoMobileActionSheet');
                actionSheet.open(target);
            },
            editEvent: function (model) {
                var pane = this.pane;
                var html = '';
                var messages = this.options.messages;
                var updateText = messages.save;
                var removeText = messages.destroy;
                var cancelText = messages.cancel;
                var titleText = messages.editor.editorTitle;
                html += '<div data-role="view" class="k-popup-edit-form k-scheduler-edit-form k-mobile-list" id="edit" ' + kendo.attr('uid') + '="' + model.uid + '">' + '<div data-role="header" class="k-header"><a href="#" class="k-button k-scheduler-cancel">' + cancelText + '</a>' + titleText + '<a href="#" class="k-button k-scheduler-update">' + updateText + '</a></div>';
                var fields = this.fields(editors.mobile, model);
                var that = this;
                var editableFields = [];
                html += this._buildEditTemplate(model, fields, editableFields);
                if (!model.isNew() && this.options.editable && this.options.editable.destroy !== false) {
                    html += '<div class="k-edit-buttons"><a href="#" class="k-scheduler-delete k-button">' + removeText + '</a></div>';
                }
                html += '</div>';
                var view = pane.append(html);
                var container = this.container = view.element;
                this.editable = container.kendoEditable({
                    fields: editableFields,
                    model: model,
                    clearContainer: false,
                    target: that.options.target,
                    validateOnBlur: true
                }).data('kendoEditable');
                container.find('input[type=checkbox],input[type=radio]').parent('.k-edit-field').addClass('k-check').prev('.k-edit-label').addClass('k-check').click(function () {
                    $(this).next().children('input').click();
                });
                if (!this.trigger('edit', {
                        container: container,
                        model: model
                    })) {
                    container.on(CLICK + NS, 'a.k-scheduler-edit, a.k-scheduler-cancel, a.k-scheduler-update, a.k-scheduler-delete', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var button = $(this);
                        if (!button.hasClass('k-scheduler-edit')) {
                            var name = 'cancel';
                            if (button.hasClass('k-scheduler-update')) {
                                name = 'save';
                            } else if (button.hasClass('k-scheduler-delete')) {
                                name = 'remove';
                            }
                            that.trigger(name, {
                                container: container,
                                model: model
                            });
                        } else {
                            pane.navigate('#edit', that.options.animations.right);
                        }
                    });
                    pane.navigate(view, that.options.animations.left);
                    model.bind('change', that.toggleDateValidationHandler);
                } else {
                    this.trigger('cancel', {
                        container: container,
                        model: model
                    });
                }
                return this.editable;
            },
            _views: function () {
                return this.pane.element.find(kendo.roleSelector('view')).not(this.view.element);
            },
            close: function () {
                if (this.container) {
                    this.pane.navigate('', this.options.animations.right);
                    var views = this._views();
                    var view;
                    for (var idx = 0, length = views.length; idx < length; idx++) {
                        view = views.eq(idx).data('kendoMobileView');
                        if (view) {
                            view.purge();
                        }
                    }
                    views.remove();
                    this.container = null;
                    if (this.editable) {
                        this.editable.options.model.unbind('change', this.toggleDateValidationHandler);
                        this.editable.destroy();
                        this.editable = null;
                    }
                    this.timezoneView = null;
                }
            }
        });
        var PopupEditor = Editor.extend({
            destroy: function () {
                this.close();
                this.unbind();
            },
            editEvent: function (model) {
                var that = this;
                var editable = that.options.editable;
                var html = '<div ' + kendo.attr('uid') + '="' + model.uid + '" class="k-popup-edit-form k-scheduler-edit-form"><div class="k-edit-form-container">';
                var messages = that.options.messages;
                var updateText = messages.save;
                var cancelText = messages.cancel;
                var deleteText = messages.destroy;
                var fields = this.fields(editors.desktop, model);
                var editableFields = [];
                html += this._buildEditTemplate(model, fields, editableFields);
                var attr;
                var options = isPlainObject(editable) ? editable.window : {};
                html += '<div class="k-edit-buttons k-state-default">';
                html += this.createButton({
                    name: 'update',
                    text: updateText,
                    attr: attr
                }) + this.createButton({
                    name: 'canceledit',
                    text: cancelText,
                    attr: attr
                });
                if (!model.isNew() && editable.destroy !== false) {
                    html += this.createButton({
                        name: 'delete',
                        text: deleteText,
                        attr: attr
                    });
                }
                html += '</div></div></div>';
                var container = this.container = $(html).appendTo(that.element).eq(0).kendoWindow(extend({
                    modal: true,
                    resizable: false,
                    draggable: true,
                    title: messages.editor.editorTitle,
                    visible: false,
                    close: function (e) {
                        if (e.userTriggered) {
                            if (that.trigger(CANCEL, {
                                    container: container,
                                    model: model
                                })) {
                                e.preventDefault();
                            }
                        }
                    }
                }, options));
                that.editable = container.kendoEditable({
                    fields: editableFields,
                    model: model,
                    clearContainer: false,
                    validateOnBlur: true,
                    target: that.options.target
                }).data('kendoEditable');
                if (!that.trigger(EDIT, {
                        container: container,
                        model: model
                    })) {
                    container.data('kendoWindow').center().open();
                    container.on(CLICK + NS, 'a.k-scheduler-cancel', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.trigger(CANCEL, {
                            container: container,
                            model: model
                        });
                    });
                    container.on(CLICK + NS, 'a.k-scheduler-update', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.trigger('save', {
                            container: container,
                            model: model
                        });
                    });
                    container.on(CLICK + NS, 'a.k-scheduler-delete', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.trigger(REMOVE, {
                            container: container,
                            model: model
                        });
                    });
                    kendo.cycleForm(container);
                    model.bind('change', that.toggleDateValidationHandler);
                } else {
                    that.trigger(CANCEL, {
                        container: container,
                        model: model
                    });
                }
                return that.editable;
            },
            close: function () {
                var that = this;
                var destroy = function () {
                    if (that.editable) {
                        that.editable.options.model.unbind('change', that.toggleDateValidationHandler);
                        that.editable.destroy();
                        that.editable = null;
                        that.container = null;
                    }
                    if (that.popup) {
                        that.popup.destroy();
                        that.popup = null;
                    }
                };
                if (that.editable) {
                    if (that._timezonePopup && that._timezonePopup.data('kendoWindow')) {
                        that._timezonePopup.data('kendoWindow').destroy();
                        that._timezonePopup = null;
                    }
                    if (that.container.is(':visible')) {
                        that.container.data('kendoWindow').bind('deactivate', destroy).close();
                    } else {
                        destroy();
                    }
                } else {
                    destroy();
                }
            },
            _createEndTimezoneButton: function () {
                var messages = this.options.messages;
                var html = '';
                html += '<div class="k-edit-buttons k-state-default">';
                html += this.createButton({
                    name: 'savetimezone',
                    text: messages.save
                }) + this.createButton({
                    name: 'canceltimezone',
                    text: messages.cancel
                });
                html += '</div></div></div>';
                return html;
            },
            showDialog: function (options) {
                var html = kendo.format('<div class=\'k-popup-edit-form\'><div class=\'k-edit-form-container\'><p class=\'k-popup-message\'>{0}</p>', options.text);
                html += '<div class="k-edit-buttons k-state-default">';
                for (var buttonIndex = 0; buttonIndex < options.buttons.length; buttonIndex++) {
                    html += this.createButton(options.buttons[buttonIndex]);
                }
                html += '</div></div></div>';
                var wrapper = this.element;
                if (this.popup) {
                    this.popup.destroy();
                }
                var popup = this.popup = $(html).appendTo(wrapper).eq(0).on('click', '.k-button', function (e) {
                    e.preventDefault();
                    popup.close();
                    var buttonIndex = $(e.currentTarget).index();
                    options.buttons[buttonIndex].click();
                }).kendoWindow({
                    modal: true,
                    resizable: false,
                    draggable: false,
                    title: options.title,
                    visible: false,
                    close: function () {
                        this.destroy();
                        wrapper.focus();
                    }
                }).getKendoWindow();
                popup.center().open();
            },
            _initTimezoneEditor: function (model, activator) {
                var that = this;
                var container = that.container.find('.k-scheduler-timezones');
                var checkbox = container.find('.k-timezone-toggle');
                var endTimezoneRow = container.find('.k-edit-label:last').add(container.find('.k-edit-field:last'));
                var saveButton = container.find('.k-scheduler-savetimezone');
                var cancelButton = container.find('.k-scheduler-canceltimezone');
                var timezonePopup = that._timezonePopup;
                var startTimezoneChange = function (e) {
                    if (e.field === 'startTimezone') {
                        var value = model.startTimezone;
                        checkbox.prop('disabled', !value);
                        if (!value) {
                            endTimezoneRow.hide();
                            model.set('endTimezone', '');
                            checkbox.prop('checked', false);
                        }
                    }
                };
                var wnd;
                that._startTimezone = model.startTimezone;
                that._endTimezone = model.endTimezone;
                if (!timezonePopup) {
                    that._timezonePopup = timezonePopup = container.kendoWindow({
                        modal: true,
                        resizable: false,
                        draggable: true,
                        title: that.options.messages.editor.timezoneEditorTitle,
                        visible: false,
                        close: function (e) {
                            model.unbind('change', startTimezoneChange);
                            if (e.userTriggered) {
                                that._revertTimezones(model);
                            }
                            if (activator) {
                                activator.focus();
                            }
                        }
                    });
                    checkbox.click(function () {
                        endTimezoneRow.toggle(checkbox.prop('checked'));
                        model.set('endTimezone', '');
                    });
                    saveButton.click(function (e) {
                        e.preventDefault();
                        wnd.close();
                    });
                    cancelButton.click(function (e) {
                        e.preventDefault();
                        that._revertTimezones(model);
                        wnd.close();
                    });
                    model.bind('change', startTimezoneChange);
                }
                checkbox.prop('checked', model.endTimezone).prop('disabled', !model.startTimezone);
                if (model.endTimezone) {
                    endTimezoneRow.show();
                } else {
                    endTimezoneRow.hide();
                }
                wnd = timezonePopup.data('kendoWindow');
                wnd.center().open();
            }
        });
        var JalaliScheduler = DataBoundWidget.extend({
            init: function (element, options) {
                var that = this;
                Widget.fn.init.call(that, element, options);
                if (!that.options.views || !that.options.views.length) {
                    that.options.views = [
                        'day',
                        'week'
                    ];
                }
                that.resources = [];
                that._initModel();
                that._wrapper();
                that._views();
                that._toolbar();
                that._dataSource();
                that._resources();
                that._resizeHandler = function () {
                    that.resize();
                };
                that.wrapper.on('mousedown' + NS + ' selectstart' + NS, function (e) {
                    if (!$(e.target).is(':kendoFocusable')) {
                        e.preventDefault();
                    }
                });
                if (that.options.editable && that.options.editable.resize !== false) {
                    that._resizable();
                }
                that._movable();
                that._bindResize();
                if (that.options.messages && that.options.messages.recurrence) {
                    recurrence.options = that.options.messages.recurrence;
                }
                that._selectable();
                that._ariaId = kendo.guid();
                that._createEditor();
            },
            _bindResize: function () {
                $(window).on('resize' + NS, this._resizeHandler);
            },
            _unbindResize: function () {
                $(window).off('resize' + NS, this._resizeHandler);
            },
            dataItems: function () {
                var that = this;
                var items = that.items();
                var events = that._data;
                var eventsUids = $.map(items, function (item) {
                    return $(item).attr('data-uid');
                });
                var i;
                var key;
                var dict = {};
                var eventsUidsLength = eventsUids.length;
                for (i = 0; i < eventsUidsLength; i++) {
                    dict[eventsUids[i]] = null;
                }
                var eventsCount = events.length;
                for (i = 0; i < eventsCount; i++) {
                    var event = events[i];
                    if (dict[event.uid] !== undefined) {
                        dict[event.uid] = event;
                    }
                }
                var sortedData = [];
                for (key in dict) {
                    sortedData.push(dict[key]);
                }
                return sortedData;
            },
            _isMobile: function () {
                var options = this.options;
                return options.mobile === true && kendo.support.mobileOS || options.mobile === 'phone' || options.mobile === 'tablet';
            },
            _isMobilePhoneView: function () {
                var options = this.options;
                return options.mobile === true && kendo.support.mobileOS && !kendo.support.mobileOS.tablet || options.mobile === 'phone';
            },
            _groupsByResource: function (resources, groupIndex, groupsArray, parentFieldValue, parentField) {
                if (!groupsArray) {
                    groupsArray = [];
                }
                var resource = resources[0];
                if (resource) {
                    var group;
                    var data = resource.dataSource.view();
                    var prevIndex = 0;
                    for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                        var fieldValue = kendo.getter(resource.dataValueField)(data[dataIndex]);
                        var currentGroupIndex = groupIndex + prevIndex + dataIndex;
                        group = this._groupsByResource(resources.slice(1), currentGroupIndex, groupsArray, fieldValue, resource.field);
                        group[resource.field] = fieldValue;
                        prevIndex = group.groupIndex;
                        if (parentField && parentFieldValue) {
                            group[parentField] = parentFieldValue;
                        }
                        if (resources.length === 1) {
                            group.groupIndex = groupIndex + dataIndex;
                            groupsArray.push(group);
                        }
                    }
                    return group;
                } else {
                    return {};
                }
            },
            data: function () {
                return this._data;
            },
            select: function (options) {
                var that = this;
                var view = that.view();
                var selection = that._selection;
                var groups = view.groups;
                var selectedGroups;
                if (options === undefined) {
                    var selectedEvents;
                    var slots = view._selectedSlots;
                    if (!selection) {
                        return [];
                    }
                    if (selection && selection.events) {
                        selectedEvents = that._selectedEvents();
                    }
                    return {
                        start: selection.start,
                        end: selection.end,
                        events: selectedEvents,
                        slots: slots,
                        resources: view._resourceBySlot(selection)
                    };
                }
                if (!options) {
                    that._selection = null;
                    that._old = null;
                    view.clearSelection();
                    return;
                }
                if ($.isArray(options)) {
                    options = { events: options.splice(0) };
                }
                if (options.resources) {
                    var fieldName;
                    var filters = [];
                    var groupsByResource = [];
                    if (view.groupedResources) {
                        that._groupsByResource(view.groupedResources, 0, groupsByResource);
                    }
                    for (fieldName in options.resources) {
                        filters.push({
                            field: fieldName,
                            operator: 'eq',
                            value: options.resources[fieldName]
                        });
                    }
                    selectedGroups = new kendo.data.Query(groupsByResource).filter(filters).toArray();
                }
                if (options.events && options.events.length) {
                    that._selectEvents(options.events, selectedGroups);
                    that._select();
                    return;
                }
                if (groups && (options.start && options.end)) {
                    var rangeStart = getDate(view._startDate);
                    var rangeEnd = JalaliKendoDate.addDays(getDate(view._endDate), 1);
                    var group;
                    var ranges;
                    if (options.start < rangeEnd && rangeStart <= options.end) {
                        if (selectedGroups && selectedGroups.length) {
                            group = groups[selectedGroups[0].groupIndex];
                        } else {
                            group = groups[0];
                        }
                        ranges = group.ranges(options.start, options.end, options.isAllDay, false);
                        if (ranges.length) {
                            that._selection = {
                                start: kendo.timezone.toLocalDate(ranges[0].start.start),
                                end: kendo.timezone.toLocalDate(ranges[ranges.length - 1].end.end),
                                groupIndex: ranges[0].start.groupIndex,
                                index: ranges[0].start.index,
                                isAllDay: ranges[0].start.isDaySlot,
                                events: []
                            };
                            that._select();
                        }
                    }
                }
            },
            _selectEvents: function (eventsUids, selectedGroups) {
                var that = this;
                var idx;
                var view = that.view();
                var groups = view.groups;
                var eventsLength = eventsUids.length;
                var isGrouped = selectedGroups && selectedGroups.length;
                for (idx = 0; idx < eventsLength; idx++) {
                    if (groups && isGrouped) {
                        var currentGroup = groups[selectedGroups[0].groupIndex];
                        var events = [];
                        var timeSlotCollectionCount = currentGroup.timeSlotCollectionCount();
                        var daySlotCollectionCount = currentGroup.daySlotCollectionCount();
                        for (var collIdx = 0; collIdx < timeSlotCollectionCount; collIdx++) {
                            events = events.concat(currentGroup.getTimeSlotCollection(collIdx).events());
                        }
                        for (var dayCollIdx = 0; dayCollIdx < daySlotCollectionCount; dayCollIdx++) {
                            events = events.concat(currentGroup.getDaySlotCollection(dayCollIdx).events());
                        }
                        events = new kendo.data.Query(events).filter({
                            field: 'element[0].getAttribute(\'data-uid\')',
                            operator: 'eq',
                            value: eventsUids[idx]
                        }).toArray();
                        if (events[0]) {
                            that._createSelection(events[0].element);
                        }
                    } else {
                        var element = view.element.find(kendo.format('.k-event[data-uid={0}], .k-task[data-uid={0}]', eventsUids[idx]));
                        if (element.length) {
                            that._createSelection(element[0]);
                        }
                    }
                }
            },
            _selectable: function () {
                var that = this, wrapper = that.wrapper, selectEvent = kendo.support.mobileOS ? 'touchend' : 'mousedown';
                if (!that.options.selectable) {
                    return;
                }
                that._tabindex();
                wrapper.on(selectEvent + NS, '.k-scheduler-header-all-day td, .k-scheduler-content td, .k-event', function (e) {
                    var which = e.which;
                    var button = e.button;
                    var browser = kendo.support.browser;
                    var isRight = which && which === 3 || button && button == 2;
                    if (kendo.support.mobileOS && e.isDefaultPrevented()) {
                        return;
                    }
                    if (!isRight) {
                        that._createSelection(e.currentTarget);
                    }
                    wrapper.focus();
                    if (browser.msie && browser.version < 9) {
                        setTimeout(function () {
                            wrapper.focus();
                        });
                    }
                });
                var mouseMoveHandler = $.proxy(that._mouseMove, that);
                wrapper.on('mousedown' + NS, '.k-scheduler-header-all-day td, .k-scheduler-content td', function (e) {
                    var which = e.which;
                    var button = e.button;
                    var isRight = which && which === 3 || button && button == 2;
                    if (!isRight) {
                        wrapper.on('mousemove' + NS, '.k-scheduler-header-all-day td, .k-scheduler-content td', mouseMoveHandler);
                    }
                });
                wrapper.on('mouseup' + NS + ' mouseleave' + NS, function () {
                    wrapper.off('mousemove' + NS, '.k-scheduler-header-all-day td, .k-scheduler-content td', mouseMoveHandler);
                });
                wrapper.on('focus' + NS, function () {
                    if (!that._selection) {
                        that._createSelection(that.wrapper.find('.k-scheduler-content').find('td:first'));
                    }
                    that._select();
                });
                wrapper.on('focusout' + NS, function () {
                    that._ctrlKey = that._shiftKey = false;
                });
                wrapper.on('keydown' + NS, proxy(that._keydown, that));
                wrapper.on('keyup' + NS, function (e) {
                    that._ctrlKey = e.ctrlKey;
                    that._shiftKey = e.shiftKey;
                });
            },
            _select: function () {
                var that = this;
                var view = that.view();
                var wrapper = that.wrapper;
                var current = view.current();
                var selection = that._selection;
                if (current) {
                    current.removeAttribute('id');
                    current.removeAttribute('aria-label');
                    wrapper.removeAttr('aria-activedescendant');
                }
                view.select(selection);
                current = view.current();
                if (current && that._old !== current) {
                    var currentUid = $(current).data('uid');
                    if (that._old && currentUid && currentUid === $(that._old).data('uid')) {
                        return;
                    }
                    var labelFormat;
                    var data = selection;
                    var events = that._selectedEvents();
                    var slots = view._selectedSlots;
                    if (events[0]) {
                        data = events[0] || selection;
                        labelFormat = kendo.format(that.options.messages.ariaEventLabel || "ariaEventLabel", data.title, data.start, data.start);
                    } else {
                        labelFormat = kendo.format(that.options.messages.ariaSlotLabel || "ariaSlotLabel", data.start, data.end);
                    }
                    current.setAttribute('id', that._ariaId);
                    current.setAttribute('aria-label', labelFormat);
                    wrapper.attr('aria-activedescendant', that._ariaId);
                    that._old = current;
                    that.trigger('change', {
                        start: selection.start,
                        end: selection.end,
                        events: events,
                        slots: slots,
                        resources: view._resourceBySlot(selection)
                    });
                }
            },
            _selectedEvents: function () {
                var uids = this._selection.events;
                var length = uids.length;
                var idx = 0;
                var event;
                var events = [];
                for (; idx < length; idx++) {
                    event = this.occurrenceByUid(uids[idx]);
                    if (event) {
                        events.push(event);
                    }
                }
                return events;
            },
            _mouseMove: function (e) {
                var that = this;
                clearTimeout(that._moveTimer);
                that._moveTimer = setTimeout(function () {
                    var view = that.view();
                    var selection = that._selection;
                    if (selection) {
                        var slot = view.selectionByElement($(e.currentTarget));
                        if (slot && selection.groupIndex === slot.groupIndex) {
                            var startDate = slot.startDate();
                            var endDate = slot.endDate();
                            if (startDate >= selection.end) {
                                selection.backward = false;
                            } else if (endDate <= selection.start) {
                                selection.backward = true;
                            }
                            if (selection.backward) {
                                selection.start = startDate;
                            } else {
                                selection.end = endDate;
                            }
                            that._select();
                        }
                    }
                }, 5);
            },
            _viewByIndex: function (index) {
                var view, views = this.views;
                for (view in views) {
                    if (!index) {
                        return view;
                    }
                    index--;
                }
            },
            _keydown: function (e) {
                var that = this, key = e.keyCode, view = that.view(), editable = view.options.editable, selection = that._selection, shiftKey = e.shiftKey;
                that._ctrlKey = e.ctrlKey;
                that._shiftKey = e.shiftKey;
                if (key === keys.TAB) {
                    if (view.moveToEvent(selection, shiftKey)) {
                        that._select();
                        e.preventDefault();
                    }
                } else if (editable && key === keys.ENTER) {
                    if (selection.events.length) {
                        if (editable.update !== false) {
                            that.editEvent(selection.events[0]);
                        }
                    } else if (editable.create !== false) {
                        if (selection.isAllDay) {
                            selection = $.extend({}, selection, { end: JalaliKendoDate.addDays(selection.end, -1) });
                        }
                        that.addEvent(extend({}, selection, view._resourceBySlot(selection)));
                    }
                } else if (key === keys.DELETE && editable !== false && editable.destroy !== false) {
                    that.removeEvent(selection.events[0]);
                } else if (key >= 49 && key <= 57) {
                    that.view(that._viewByIndex(key - 49));
                } else if (view.move(selection, key, shiftKey)) {
                    if (view.inRange(selection)) {
                        that._select();
                    } else {
                        that.date(selection.start);
                    }
                    e.preventDefault();
                }
                that._adjustSelectedDate();
            },
            _createSelection: function (item) {
                var uid, slot, selection;
                if (!this._selection || !this._ctrlKey && !this._shiftKey) {
                    this._selection = {
                        events: [],
                        groupIndex: 0
                    };
                }
                item = $(item);
                selection = this._selection;
                if (item.is('.k-event')) {
                    uid = item.attr(kendo.attr('uid'));
                }
                slot = this.view().selectionByElement(item);
                if (slot) {
                    selection.groupIndex = slot.groupIndex || 0;
                }
                if (uid) {
                    slot = getOccurrenceByUid(this._data, uid);
                }
                if (slot && slot.uid) {
                    uid = [slot.uid];
                }
                this._updateSelection(slot, uid);
                this._selection.start = this._selection.end;
                this._adjustSelectedDate();
            },
            _updateSelection: function (dataItem, events) {
                var selection = this._selection;
                if (dataItem && selection) {
                    var view = this.view();
                    if (dataItem.uid) {
                        dataItem = view._updateEventForSelection(dataItem);
                    }
                    if (this._shiftKey && selection.start && selection.end) {
                        var backward = dataItem.end < selection.end;
                        selection.end = dataItem.endDate ? dataItem.endDate() : dataItem.end;
                        if (backward && view._timeSlotInterval) {
                            JalaliKendoDate.setTime(selection.end, -view._timeSlotInterval());
                        }
                    } else {
                        selection.start = dataItem.startDate ? dataItem.startDate() : dataItem.start;
                        selection.end = dataItem.endDate ? dataItem.endDate() : dataItem.end;
                    }
                    if ('isDaySlot' in dataItem) {
                        selection.isAllDay = dataItem.isDaySlot;
                    } else {
                        selection.isAllDay = dataItem.isAllDay;
                    }
                    selection.index = dataItem.index;
                    if (this._ctrlKey) {
                        selection.events = selection.events.concat(events || []);
                    } else {
                        selection.events = events || [];
                    }
                }
            },
            options: {
                name: 'JalaliScheduler',
                date: TODAY,
                editable: true,
                autoBind: true,
                snap: true,
                mobile: false,
                timezone: '',
                allDaySlot: true,
                min: new JalaliDate(1278, 11, 1),
				max: new JalaliDate(1478, 11, 1),
                // min: new DATE(1900, 0, 1),
                // max: new DATE(2099, 11, 31),
                toolbar: null,
                messages: {
                    today: 'Today',
                    pdf: 'Export to PDF',
                    save: 'Save',
                    cancel: 'Cancel',
                    destroy: 'Delete',
                    deleteWindowTitle: 'حذف رویداد',
                    ariaSlotLabel: 'Selected from {0:t} to {1:t}',
                    ariaEventLabel: '{0} on {1:D} at {2:t}',
                    views: {
                        day: 'Day',
                        week: 'Week',
                        workWeek: 'Work Week',
                        agenda: 'Agenda',
                        month: 'Month',
                        timeline: 'Timeline',
                        timelineWeek: 'Timeline Week',
                        timelineWorkWeek: 'Timeline Work Week',
                        timelineMonth: 'Timeline Month'
                    },
                    recurrenceMessages: {
                        deleteWindowTitle: 'Delete Recurring Item',
                        deleteWindowOccurrence: 'Delete current occurrence',
                        deleteWindowSeries: 'Delete the series',
                        editWindowTitle: 'Edit Recurring Item',
                        editWindowOccurrence: 'Edit current occurrence',
                        editWindowSeries: 'Edit the series'
                    },
                    editable: { confirmation: DELETECONFIRM },
                    editor: {
                        title: 'Title',
                        start: 'Start',
                        end: 'End',
                        allDayEvent: 'All day event',
                        description: 'Description',
                        repeat: 'Repeat',
                        timezone: ' ',
                        startTimezone: 'Start timezone',
                        endTimezone: 'End timezone',
                        separateTimezones: 'Use separate start and end time zones',
                        timezoneEditorTitle: 'Timezones',
                        timezoneEditorButton: 'Time zone',
                        timezoneTitle: 'Time zones',
                        noTimezone: 'No timezone',
                        editorTitle: 'Event'
                    }
                },
                height: null,
                width: null,
                resources: [],
                group: {
                    resources: [],
                    direction: 'horizontal'
                },
                views: [],
                selectable: false
            },
            events: [
                REMOVE,
                EDIT,
                CANCEL,
                SAVE,
                'add',
                'dataBinding',
                'dataBound',
                'moveStart',
                'move',
                'moveEnd',
                'resizeStart',
                'resize',
                'resizeEnd',
                'navigate',
                'change'
            ],
            destroy: function () {
                var that = this, element;
                Widget.fn.destroy.call(that);
                if (that.dataSource) {
                    that.dataSource.unbind(CHANGE, that._refreshHandler);
                    that.dataSource.unbind('progress', that._progressHandler);
                    that.dataSource.unbind('error', that._errorHandler);
                }
                if (that.calendar) {
                    that.calendar.destroy();
                    that.popup.destroy();
                }
                if (that.view()) {
                    that.view().destroy();
                }
                if (that._editor) {
                    that._editor.destroy();
                }
                if (this._moveDraggable) {
                    this._moveDraggable.destroy();
                }
                if (this._resizeDraggable) {
                    this._resizeDraggable.destroy();
                }
                element = that.element.add(that.wrapper).add(that.toolbar).add(that.popup);
                element.off(NS);
                clearTimeout(that._moveTimer);
                that._model = null;
                that.toolbar = null;
                that.element = null;
                $(window).off('resize' + NS, that._resizeHandler);
                kendo.destroy(that.wrapper);
            },
            setDataSource: function (dataSource) {
                this.options.dataSource = dataSource;
                this._dataSource();
                if (this.options.autoBind) {
                    dataSource.fetch();
                }
            },
            items: function () {
                return this.wrapper.find('.k-scheduler-content').children('.k-event, .k-task');
            },
            _movable: function () {
                var startSlot;
                var endSlot;
                var startTime;
                var endTime;
                var event;
                var clonedEvent;
                var that = this;
                var originSlot;
                var distance = 0;
                var isMobile = that._isMobile();
                var movable = that.options.editable && that.options.editable.move !== false;
                var resizable = that.options.editable && that.options.editable.resize !== false;
                if (movable || resizable && isMobile) {
                    if (isMobile && kendo.support.mobileOS.android) {
                        distance = 5;
                    }
                    that._moveDraggable = new kendo.ui.Draggable(that.element, {
                        distance: distance,
                        filter: '.k-event',
                        ignore: '.k-resize-handle',
                        holdToDrag: isMobile
                    });
                    if (movable) {
                        that._moveDraggable.bind('dragstart', function (e) {
                            var view = that.view();
                            var eventElement = e.currentTarget;
                            if (!view.options.editable || view.options.editable.move === false) {
                                e.preventDefault();
                                return;
                            }
                            if (isMobile && !eventElement.hasClass('k-event-active')) {
                                that.element.find('.k-event-active').removeClass('k-event-active');
                                e.preventDefault();
                                return;
                            }
                            event = that.occurrenceByUid(eventElement.attr(kendo.attr('uid')));
                            clonedEvent = event.clone();
                            clonedEvent.update(view._eventOptionsForMove(clonedEvent));
                            startSlot = view._slotByPosition(e.x.startLocation, e.y.startLocation);
                            startTime = startSlot.startOffset(e.x.startLocation, e.y.startLocation, that.options.snap);
                            endSlot = startSlot;
                            originSlot = startSlot;
                            if (!startSlot || that.trigger('moveStart', { event: event })) {
                                e.preventDefault();
                            }
                        }).bind('drag', function (e) {
                            var view = that.view();
                            var slot = view._slotByPosition(e.x.location, e.y.location);
                            var distance;
                            var range;
                            if (!slot) {
                                return;
                            }
                            endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            if (slot.isDaySlot !== startSlot.isDaySlot) {
                                startSlot = view._slotByPosition(e.x.location, e.y.location);
                                startTime = startSlot.startOffset(e.x.location, e.y.location, that.options.snap);
                                distance = endTime - startTime;
                                clonedEvent.isAllDay = slot.isDaySlot;
                                clonedEvent.start = kendo.timezone.toLocalDate(startTime);
                                clonedEvent.end = kendo.timezone.toLocalDate(endTime);
                                view._updateMoveHint(clonedEvent, slot.groupIndex, distance);
                                range = {
                                    start: clonedEvent.start,
                                    end: clonedEvent.end
                                };
                            } else {
                                distance = endTime - startTime;
                                view._updateMoveHint(clonedEvent, slot.groupIndex, distance);
                                range = moveEventRange(clonedEvent, distance);
                            }
                            if (!that.trigger('move', {
                                    event: event,
                                    slot: {
                                        element: slot.element,
                                        start: slot.startDate(),
                                        end: slot.endDate(),
                                        isDaySlot: slot.isDaySlot
                                    },
                                    resources: view._resourceBySlot(slot),
                                    start: range.start,
                                    end: range.end
                                })) {
                                endSlot = slot;
                            } else {
                                view._updateMoveHint(clonedEvent, slot.groupIndex, distance);
                            }
                        }).bind('dragend', function (e) {
                            that.view()._removeMoveHint();
                            var distance = endTime - startTime;
                            var range = moveEventRange(clonedEvent, distance);
                            var start = range.start;
                            var end = range.end;
                            var endResources = that.view()._resourceBySlot(endSlot);
                            var startResources = that.view()._resourceBySlot(startSlot);
                            var prevented = that.trigger('moveEnd', {
                                event: event,
                                slot: {
                                    element: endSlot.element,
                                    start: endSlot.startDate(),
                                    end: endSlot.endDate()
                                },
                                start: start,
                                end: end,
                                resources: endResources
                            });
                            if (!prevented && (event.start.getTime() !== start.getTime() || event.end.getTime() !== end.getTime() || originSlot.isDaySlot !== endSlot.isDaySlot || kendo.stringify(endResources) !== kendo.stringify(startResources))) {
                                var updatedEventOptions = that.view()._eventOptionsForMove(event);
                                var eventOptions;
                                if (originSlot.isDaySlot !== endSlot.isDaySlot) {
                                    if (endSlot.isDaySlot) {
                                        eventOptions = $.extend({
                                            start: endSlot.startDate(),
                                            end: endSlot.startDate(),
                                            isAllDay: endSlot.isDaySlot
                                        }, updatedEventOptions, endResources);
                                    } else {
                                        eventOptions = $.extend({
                                            isAllDay: endSlot.isDaySlot,
                                            start: start,
                                            end: end
                                        }, updatedEventOptions, endResources);
                                    }
                                } else {
                                    eventOptions = $.extend({
                                        isAllDay: event.isAllDay,
                                        start: start,
                                        end: end
                                    }, updatedEventOptions, endResources);
                                }
                                that._updateEvent(null, event, eventOptions);
                            }
                            e.currentTarget.removeClass('k-event-active');
                            this.cancelHold();
                        }).bind('dragcancel', function () {
                            that.view()._removeMoveHint();
                            this.cancelHold();
                        });
                    }
                    if (isMobile) {
                        that._moveDraggable.bind('hold', function (e) {
                            if (that.element.find('.k-scheduler-monthview').length) {
                                e.preventDefault();
                            }
                            that.element.find('.k-event-active').removeClass('k-event-active');
                            e.currentTarget.addClass('k-event-active');
                        });
                        if (!kendo.support.mobileOS.android) {
                            that._moveDraggable.userEvents.bind('press', function (e) {
                                e.preventDefault();
                            });
                        }
                    }
                }
            },
            _resizable: function () {
                var startTime;
                var endTime;
                var event;
                var clonedEvent;
                var slot;
                var that = this;
                var distance = 0;
                function direction(handle) {
                    var directions = {
                        'k-resize-e': 'east',
                        'k-resize-w': 'west',
                        'k-resize-n': 'north',
                        'k-resize-s': 'south'
                    };
                    for (var key in directions) {
                        if (handle.hasClass(key)) {
                            return directions[key];
                        }
                    }
                }
                if (that._isMobile() && kendo.support.mobileOS.android) {
                    distance = 5;
                }
                that._resizeDraggable = new kendo.ui.Draggable(that.element, {
                    distance: distance,
                    filter: '.k-resize-handle',
                    dragstart: function (e) {
                        var dragHandle = $(e.currentTarget);
                        var eventElement = dragHandle.closest('.k-event');
                        var uid = eventElement.attr(kendo.attr('uid'));
                        var view = that.view();
                        event = that.occurrenceByUid(uid);
                        clonedEvent = event.clone();
                        view._updateEventForResize(clonedEvent);
                        slot = view._slotByPosition(e.x.startLocation, e.y.startLocation);
                        if (that.trigger('resizeStart', { event: event })) {
                            e.preventDefault();
                        }
                        startTime = JalaliKendoDate.toUtcTime(clonedEvent.start);
                        endTime = JalaliKendoDate.toUtcTime(clonedEvent.end);
                    },
                    drag: function (e) {
                        if (!slot) {
                            return;
                        }
                        var dragHandle = $(e.currentTarget);
                        var dir = direction(dragHandle);
                        var view = that.view();
                        var currentSlot = view._slotByPosition(e.x.location, e.y.location);
                        if (!currentSlot || slot.groupIndex != currentSlot.groupIndex) {
                            return;
                        }
                        slot = currentSlot;
                        var originalStart = startTime;
                        var originalEnd = endTime;
                        if (dir == 'south') {
                            if (!slot.isDaySlot && slot.end - JalaliKendoDate.toUtcTime(clonedEvent.start) >= view._timeSlotInterval()) {
                                if (clonedEvent.isAllDay) {
                                    endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                                } else {
                                    endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                                }
                            }
                        } else if (dir == 'north') {
                            if (!slot.isDaySlot && JalaliKendoDate.toUtcTime(clonedEvent.end) - slot.start >= view._timeSlotInterval()) {
                                startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            }
                        } else if (dir == 'east') {
                            if (slot.isDaySlot && JalaliKendoDate.toUtcTime(JalaliKendoDate.getDate(slot.endDate())) >= JalaliKendoDate.toUtcTime(JalaliKendoDate.getDate(clonedEvent.start))) {
                                if (clonedEvent.isAllDay) {
                                    endTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                                } else {
                                    endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                                }
                            } else if (!slot.isDaySlot && slot.end - JalaliKendoDate.toUtcTime(clonedEvent.start) >= view._timeSlotInterval()) {
                                endTime = slot.endOffset(e.x.location, e.y.location, that.options.snap);
                            }
                        } else if (dir == 'west') {
                            if (slot.isDaySlot && JalaliKendoDate.toUtcTime(JalaliKendoDate.getDate(clonedEvent.end)) >= JalaliKendoDate.toUtcTime(JalaliKendoDate.getDate(slot.startDate()))) {
                                startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            } else if (!slot.isDaySlot && JalaliKendoDate.toUtcTime(clonedEvent.end) - slot.start >= view._timeSlotInterval()) {
                                startTime = slot.startOffset(e.x.location, e.y.location, that.options.snap);
                            }
                        }
                        if (!that.trigger('resize', {
                                event: event,
                                slot: {
                                    element: slot.element,
                                    start: slot.startDate(),
                                    end: slot.endDate()
                                },
                                start: kendo.timezone.toLocalDate(startTime),
                                end: kendo.timezone.toLocalDate(endTime),
                                resources: view._resourceBySlot(slot)
                            })) {
                            view._updateResizeHint(clonedEvent, slot.groupIndex, startTime, endTime);
                        } else {
                            startTime = originalStart;
                            endTime = originalEnd;
                        }
                    },
                    dragend: function (e) {
                        var dragHandle = $(e.currentTarget);
                        var start = new DATE(clonedEvent.start.getTime());
                        var end = new DATE(clonedEvent.end.getTime());
                        var dir = direction(dragHandle);
                        that.view()._removeResizeHint();
                        if (dir == 'south') {
                            end = kendo.timezone.toLocalDate(endTime);
                        } else if (dir == 'north') {
                            start = kendo.timezone.toLocalDate(startTime);
                        } else if (dir == 'east') {
                            if (slot.isDaySlot) {
                                end = JalaliKendoDate.getDate(kendo.timezone.toLocalDate(endTime));
                            } else {
                                end = kendo.timezone.toLocalDate(endTime);
                            }
                        } else if (dir == 'west') {
                            if (slot.isDaySlot) {
                                start = new DATE(kendo.timezone.toLocalDate(startTime));
                                start.setHours(0);
                                start.setMinutes(0);
                            } else {
                                start = kendo.timezone.toLocalDate(startTime);
                            }
                        }
                        var prevented = that.trigger('resizeEnd', {
                            event: event,
                            slot: {
                                element: slot.element,
                                start: slot.startDate(),
                                end: slot.endDate()
                            },
                            start: start,
                            end: end,
                            resources: that.view()._resourceBySlot(slot)
                        });
                        if (!prevented && end.getTime() >= start.getTime()) {
                            if (clonedEvent.start.getTime() != start.getTime() || clonedEvent.end.getTime() != end.getTime()) {
                                that.view()._updateEventForResize(event);
                                that._updateEvent(dir, event, {
                                    start: start,
                                    end: end
                                });
                            }
                        }
                        slot = null;
                        event = null;
                    },
                    dragcancel: function () {
                        that.view()._removeResizeHint();
                        slot = null;
                        event = null;
                    }
                });
            },
            _updateEvent: function (dir, event, eventInfo) {
                var that = this;
                var updateEvent = function (event, callback) {
                    try {
                        that._preventRefresh = true;
                        event.update(eventInfo);
                        that._convertDates(event);
                    } finally {
                        that._preventRefresh = false;
                    }
                    if (!that.trigger(SAVE, { event: event })) {
                        if (callback) {
                            callback();
                        }
                        that._updateSelection(event);
                        that.dataSource.sync();
                    }
                };
                var recurrenceHead = function (event) {
                    if (event.recurrenceRule) {
                        return that.dataSource.getByUid(event.uid);
                    } else {
                        return that.dataSource.get(event.recurrenceId);
                    }
                };
                var updateSeries = function () {
                    var head = recurrenceHead(event);
                    if (dir == 'south' || dir == 'north') {
                        if (eventInfo.start) {
                            var start = JalaliKendoDate.getDate(head.start);
                            JalaliKendoDate.setTime(start, getMilliseconds(eventInfo.start));
                            eventInfo.start = start;
                        }
                        if (eventInfo.end) {
                            var end = JalaliKendoDate.getDate(head.end);
                            JalaliKendoDate.setTime(end, getMilliseconds(eventInfo.end));
                            eventInfo.end = end;
                        }
                    }
                    that.dataSource._removeExceptions(head);
                    updateEvent(head);
                };
                var updateOccurrence = function () {
                    var head = recurrenceHead(event);
                    var callback = function () {
                        that._convertDates(head);
                    };
                    var exception = head.toOccurrence({
                        start: event.start,
                        end: event.end
                    });
                    updateEvent(that.dataSource.add(exception), callback);
                };
                if (event.recurrenceRule || event.isOccurrence()) {
                    var recurrenceMessages = that.options.messages.recurrenceMessages;
                    that._showRecurringDialog(event, updateOccurrence, updateSeries, {
                        title: recurrenceMessages.editWindowTitle,
                        text: recurrenceMessages.editRecurring ? recurrenceMessages.editRecurring : EDITRECURRING,
                        occurrenceText: recurrenceMessages.editWindowOccurrence,
                        seriesText: recurrenceMessages.editWindowSeries
                    });
                } else {
                    updateEvent(that.dataSource.getByUid(event.uid));
                }
            },
            _modelForContainer: function (container) {
                container = $(container).closest('[' + kendo.attr('uid') + ']');
                return this.dataSource.getByUid(container.attr(kendo.attr('uid')));
            },
            showDialog: function (options) {
                this._editor.showDialog(options);
            },
            focus: function () {
                this.wrapper.focus();
            },
            _confirmation: function (callback, model) {
                var editable = this.options.editable;
                if (editable === true || editable.confirmation !== false) {
                    var messages = this.options.messages;
                    var title = messages.deleteWindowTitle;
                    var text = typeof editable.confirmation === STRING ? editable.confirmation : messages.editable.confirmation;
                    if (this._isEditorOpened() && model.isRecurring()) {
                        var recurrenceMessages = this.options.messages.recurrenceMessages;
                        title = recurrenceMessages.deleteWindowTitle;
                        if (model.isException()) {
                            text = recurrenceMessages.deleteRecurringConfirmation ? recurrenceMessages.deleteRecurringConfirmation : DELETERECURRINGCONFIRM;
                        } else {
                            text = recurrenceMessages.deleteSeriesConfirmation ? recurrenceMessages.deleteSeriesConfirmation : DELETESERIESCONFIRM;
                        }
                    }
                    var buttons = [{
                            name: 'destroy',
                            text: messages.destroy,
                            click: function () {
                                callback();
                            }
                        }];
                    if (!(this._isMobile() && kendo.mobile.ui.Pane)) {
                        buttons.push({
                            name: 'canceledit',
                            text: messages.cancel,
                            click: function () {
                                callback(true);
                            }
                        });
                    }
                    this._unbindResize();
                    this.showDialog({
                        model: model,
                        text: text,
                        title: title,
                        buttons: buttons
                    });
                    this._bindResize();
                } else {
                    callback();
                }
            },
            addEvent: function (eventInfo) {
                var editable = this._editor.editable;
                var dataSource = this.dataSource;
                var event;
                eventInfo = eventInfo || {};
                var prevented = this.trigger('add', { event: eventInfo });
                if (!prevented && (editable && editable.end() || !editable)) {
                    this.cancelEvent();
                    if (eventInfo && eventInfo.toJSON) {
                        eventInfo = eventInfo.toJSON();
                    }
                    event = dataSource.add(eventInfo);
                    if (event) {
                        this.cancelEvent();
                        this._editEvent(event);
                    }
                }
            },
            saveEvent: function () {
                var editor = this._editor;
                if (!editor) {
                    return;
                }
                var editable = editor.editable;
                var container = editor.container;
                var model = this._modelForContainer(container);
                if (container && editable && editable.end() && !this.trigger(SAVE, {
                        container: container,
                        event: model
                    })) {
                    if (model.isRecurrenceHead()) {
                        this.dataSource._removeExceptions(model);
                    }
                    if (!model.dirty && !model.isOccurrence()) {
                        this._convertDates(model, 'remove');
                    }
                    this.dataSource.sync();
                }
            },
            cancelEvent: function () {
                var editor = this._editor;
                var container = editor.container;
                var model;
                if (container) {
                    model = this._modelForContainer(container);
                    if (model && model.isOccurrence()) {
                        this._convertDates(model, 'remove');
                        this._convertDates(this.dataSource.get(model.recurrenceId), 'remove');
                    }
                    this.dataSource.cancelChanges(model);
                    editor.close();
                }
            },
            editEvent: function (uid) {
                var model = typeof uid == 'string' ? this.occurrenceByUid(uid) : uid;
                if (!model) {
                    return;
                }
                this.cancelEvent();
                //if (model.isRecurring()) {
                //    this._editRecurringDialog(model);
                //} else {
                    this._editEvent(model);
                //}
            },
            _editEvent: function (model) {
                this._unbindResize();
                this._createPopupEditor(model);
                this._bindResize();
            },
            _editRecurringDialog: function (model) {
                var that = this;
                var editOccurrence = function () {
                    if (model.isException()) {
                        that._editEvent(model);
                    } else {
                        that.addEvent(model);
                    }
                };
                var editSeries = function () {
                    if (model.recurrenceId) {
                        model = that.dataSource.get(model.recurrenceId);
                    }
                    that._editEvent(model);
                };
                var recurrenceMessages = that.options.messages.recurrenceMessages;
                that._showRecurringDialog(model, editOccurrence, editSeries, {
                    title: recurrenceMessages.editWindowTitle,
                    text: recurrenceMessages.editRecurring ? recurrenceMessages.editRecurring : EDITRECURRING,
                    occurrenceText: recurrenceMessages.editWindowOccurrence,
                    seriesText: recurrenceMessages.editWindowSeries
                });
            },
            _showRecurringDialog: function (model, editOccurrence, editSeries, messages) {
                var that = this;
                var editable = that.options.editable;
                var editRecurringMode = isPlainObject(editable) ? editable.editRecurringMode : 'dialog';
                if (editRecurringMode === 'series') {
                    editSeries();
                } else if (editRecurringMode === 'occurrence') {
                    editOccurrence();
                } else {
                    this._unbindResize();
                    that.showDialog({
                        model: model,
                        title: messages.title,
                        text: messages.text,
                        buttons: [
                            {
                                text: messages.occurrenceText,
                                click: editOccurrence
                            },
                            {
                                text: messages.seriesText,
                                click: editSeries
                            }
                        ]
                    });
                    this._bindResize();
                }
            },
            _createButton: function (command) {
                var template = command.template || COMMANDBUTTONTMPL, commandName = typeof command === STRING ? command : command.name || command.text, options = {
                        className: 'k-scheduler-' + (commandName || '').replace(/\s/g, ''),
                        text: commandName,
                        attr: ''
                    };
                if (!commandName && !(isPlainObject(command) && command.template)) {
                    throw new Error('Custom commands should have name specified');
                }
                if (isPlainObject(command)) {
                    if (command.className) {
                        command.className += ' ' + options.className;
                    }
                    if (commandName === 'edit' && isPlainObject(command.text)) {
                        command = extend(true, {}, command);
                        command.text = command.text.edit;
                    }
                    options = extend(true, options, defaultCommands[commandName], command);
                } else {
                    options = extend(true, options, defaultCommands[commandName]);
                }
                return kendo.template(template)(options);
            },
            _convertDates: function (model, method) {
                var timezone = this.dataSource.reader.timezone;
                var startTimezone = model.startTimezone;
                var endTimezone = model.endTimezone;
                var start = model.start;
                var end = model.start;
                method = method || 'apply';
                startTimezone = startTimezone || endTimezone;
                endTimezone = endTimezone || startTimezone;
                if (startTimezone) {
                    if (timezone) {
                        if (method === 'apply') {
                            start = kendo.timezone.convert(model.start, timezone, startTimezone);
                            end = kendo.timezone.convert(model.end, timezone, endTimezone);
                        } else {
                            start = kendo.timezone.convert(model.start, startTimezone, timezone);
                            end = kendo.timezone.convert(model.end, endTimezone, timezone);
                        }
                    } else {
                        start = kendo.timezone[method](model.start, startTimezone);
                        end = kendo.timezone[method](model.end, endTimezone);
                    }
                    model._set('start', start);
                    model._set('end', end);
                }
            },
            _createEditor: function () {
                var that = this;
                var editor;
                if (this._isMobile() && kendo.mobile.ui.Pane) {
                    editor = that._editor = new MobileEditor(this.wrapper, extend({}, this.options, {
                        target: this,
                        timezone: that.dataSource.reader.timezone,
                        resources: that.resources,
                        createButton: proxy(this._createButton, this)
                    }));
                } else {
                    editor = that._editor = new PopupEditor(this.wrapper, extend({}, this.options, {
                        target: this,
                        createButton: proxy(this._createButton, this),
                        timezone: that.dataSource.reader.timezone,
                        resources: that.resources
                    }));
                }
                editor.bind('cancel', function (e) {
                    if (that.trigger('cancel', {
                            container: e.container,
                            event: e.model
                        })) {
                        e.preventDefault();
                        return;
                    }
                    that.cancelEvent();
                    that.focus();
                });
                editor.bind('edit', function (e) {
                    if (that.trigger(EDIT, {
                            container: e.container,
                            event: e.model
                        })) {
                        e.preventDefault();
                    }
                });
                editor.bind('save', function () {
                    that.saveEvent();
                });
                editor.bind('remove', function (e) {
                    that.removeEvent(e.model);
                });
            },
            _createPopupEditor: function (model) {
                var editor = this._editor;
                if (!model.isNew() || model.isOccurrence()) {
                    if (model.isOccurrence()) {
                        this._convertDates(model.recurrenceId ? this.dataSource.get(model.recurrenceId) : model);
                    }
                    this._convertDates(model);
                }
                this.editable = editor.editEvent(model);
            },
            removeEvent: function (uid) {
                var that = this, model = typeof uid == 'string' ? that.occurrenceByUid(uid) : uid;
                if (!model) {
                    return;
                }
                if (model.isRecurring()) {
                    that._deleteRecurringDialog(model);
                } else {
                    that._confirmation(function (cancel) {
                        if (!cancel) {
                            that._removeEvent(model);
                        }
                    }, model);
                }
            },
            occurrenceByUid: function (uid) {
                var occurrence = this.dataSource.getByUid(uid);
                if (!occurrence) {
                    occurrence = getOccurrenceByUid(this._data, uid);
                }
                return occurrence;
            },
            occurrencesInRange: function (start, end) {
                return new kendo.data.Query(this._data).filter({
                    logic: 'or',
                    filters: [
                        {
                            logic: 'and',
                            filters: [
                                {
                                    field: 'start',
                                    operator: 'gte',
                                    value: start
                                },
                                {
                                    field: 'end',
                                    operator: 'gte',
                                    value: start
                                },
                                {
                                    field: 'start',
                                    operator: 'lt',
                                    value: end
                                }
                            ]
                        },
                        {
                            logic: 'and',
                            filters: [
                                {
                                    field: 'start',
                                    operator: 'lte',
                                    value: start
                                },
                                {
                                    field: 'end',
                                    operator: 'gt',
                                    value: start
                                }
                            ]
                        }
                    ]
                }).toArray();
            },
            _removeEvent: function (model) {
                if (!this.trigger(REMOVE, { event: model })) {
                    if (this.dataSource.remove(model)) {
                        this.dataSource.sync();
                    }
                }
            },
            _deleteRecurringDialog: function (model) {
                var that = this;
                var currentModel = model;
                var editable = that.options.editable;
                var deleteOccurrence;
                var deleteSeries;
                var deleteOccurrenceConfirmation;
                var deleteSeriesConfirmation;
                var editRecurringMode = isPlainObject(editable) ? editable.editRecurringMode : 'dialog';
                deleteOccurrence = function () {
                    //var occurrence = currentModel.recurrenceId ? currentModel : currentModel.toOccurrence();
                    var occurrence = currentModel.recurrence ? currentModel : currentModel.toOccurrence();
                    //var head = that.dataSource.get(occurrence.recurrenceId);
                    var head = that.dataSource.get(occurrence.id);
                    that._convertDates(head);
                    occurrence.recurrenceRule = "deleteOccurrence"
                    that._removeEvent(occurrence);
                };
                deleteSeries = function () {
                    if (currentModel.recurrenceId) {
                        currentModel = that.dataSource.get(currentModel.recurrenceId);
                    }
                    currentModel.recurrenceRule = "deleteSeries"
                    that._removeEvent(currentModel);
                };
                if (editRecurringMode != 'dialog' || that._isEditorOpened()) {
                    deleteOccurrenceConfirmation = function () {
                        that._confirmation(function (cancel) {
                            if (!cancel) {
                                deleteOccurrence();
                            }
                        }, currentModel);
                    };
                    deleteSeriesConfirmation = function () {
                        that._confirmation(function (cancel) {
                            if (!cancel) {
                                deleteSeries();
                            }
                        }, currentModel);
                    };
                }
                var seriesCallback = deleteSeriesConfirmation || deleteSeries;
                var occurrenceCallback = deleteOccurrenceConfirmation || deleteOccurrence;
                if (that._isEditorOpened()) {
                    if (model.isException()) {
                        occurrenceCallback();
                    } else {
                        seriesCallback();
                    }
                } else {
                    var recurrenceMessages = that.options.messages.recurrenceMessages;
                    that._showRecurringDialog(model, occurrenceCallback, seriesCallback, {
                        title: recurrenceMessages.deleteWindowTitle,
                        text: recurrenceMessages.deleteRecurring ? recurrenceMessages.deleteRecurring : DELETERECURRING,
                        occurrenceText: recurrenceMessages.deleteWindowOccurrence,
                        seriesText: recurrenceMessages.deleteWindowSeries
                    });
                }
            },
            _isEditorOpened: function () {
                return !!this._editor.container;
            },
            _unbindView: function (view) {
                var that = this;
                that.angular('cleanup', function () {
                    return { elements: that.items() };
                });
                view.destroy();
            },
            _bindView: function (view) {
                var that = this;
                if (that.options.editable) {
                    if (that._viewRemoveHandler) {
                        view.unbind(REMOVE, that._viewRemoveHandler);
                    }
                    that._viewRemoveHandler = function (e) {
                        that.removeEvent(e.uid);
                    };
                    view.bind(REMOVE, that._viewRemoveHandler);
                    if (that._viewAddHandler) {
                        view.unbind(ADD, that._viewAddHandler);
                    }
                    that._viewAddHandler = function (e) {
                        that.addEvent(e.eventInfo);
                    };
                    view.bind(ADD, this._viewAddHandler);
                    if (that._viewEditHandler) {
                        view.unbind(EDIT, that._viewEditHandler);
                    }
                    that._viewEditHandler = function (e) {
                        that.editEvent(e.uid);
                    };
                    view.bind(EDIT, this._viewEditHandler);
                }
                if (that._viewNavigateHandler) {
                    view.unbind('navigate', that._viewNavigateHandler);
                }
                that._viewNavigateHandler = function (e) {
                    if (e.view) {
                        var switchWorkDay = 'isWorkDay' in e;
                        var action = switchWorkDay ? 'changeWorkDay' : 'changeView';
                        if (!that.trigger('navigate', {
                                view: e.view,
                                isWorkDay: e.isWorkDay,
                                action: action,
                                date: e.date
                            })) {
                            if (switchWorkDay) {
                                that._workDayMode = e.isWorkDay;
                            }
                            that._selectView(e.view);
                            that.date(e.date);
                        }
                    }
                };
                view.bind('navigate', that._viewNavigateHandler);
                if (that._viewActivateHandler) {
                    view.unbind('activate', that._viewActivateHandler);
                }
                that._viewActivateHandler = function () {
                    var view = this;
                    if (that._selection) {
                        view.constrainSelection(that._selection);
                        that._select();
                        that._adjustSelectedDate();
                    }
                };
                view.bind('activate', that._viewActivateHandler);
            },
            _selectView: function (name) {
                var that = this;
                if (name && that.views[name]) {
                    if (that._selectedView) {
                        that._unbindView(that._selectedView);
                    }
                    that._selectedView = that._renderView(name);
                    that._selectedViewName = name;
                    if (that._viewsCount > 1) {
                        var viewButton = VIEWBUTTONTEMPLATE({
                            views: that.views,
                            view: name,
                            ns: kendo.ns
                        });
                        var firstButton = that.toolbar.find('.k-scheduler-views li:first-child');
                        if (firstButton.is('.k-current-view')) {
                            firstButton.replaceWith(viewButton);
                        } else {
                            that.toolbar.find('.k-scheduler-views').prepend(viewButton);
                        }
                        var viewButtons = that.toolbar.find('.k-scheduler-views li').removeClass('k-state-selected');
                        viewButtons.end().find('.k-view-' + name.replace(/\./g, '\\.').toLowerCase()).addClass('k-state-selected');
                    }
                }
            },
            view: function (name) {
                var that = this;
                if (name) {
                    that._selectView(name);
                    that.rebind();
                    return;
                }
                return that._selectedView;
            },
            viewName: function () {
                return this.view().name;
            },
            _renderView: function (name) {
                var view = this._initializeView(name);
                this._bindView(view);
                this._model.set('formattedDate', view.dateForTitle());
                this._model.set('formattedShortDate', view.shortDateForTitle());
                return view;
            },
            resize: function (force) {
                var size = this.getSize();
                var currentSize = this._size;
                var view = this.view();
                if (!view || !view.groups) {
                    return;
                }
                if (force || !currentSize || size.width !== currentSize.width || size.height !== currentSize.height) {
                    this.refresh({ action: 'resize' });
                    this._size = size;
                }
            },
            _adjustSelectedDate: function () {
                var date = this._model.selectedDate, selection = this._selection, start = selection.start;
                if (start && !JalaliKendoDate.isInDateRange(date, getDate(start), getDate(selection.end))) {
                    date.setFullYear(start.getFullYear(), start.getMonth(), start.getDate());
                }
            },
            _initializeView: function (name) {
                var view = this.views[name];
                if (view) {
                    var isSettings = isPlainObject(view), type = view.type;
                    if (typeof type === STRING) {
                        type = kendo.getter(view.type)(window);
                    }
                    if (type) {
                        view = new type(this.wrapper, trimOptions(extend(true, {}, this.options, isSettings ? view : {}, {
                            resources: this.resources,
                            date: this.date(),
                            showWorkHours: this._workDayMode
                        })));
                    } else {
                        throw new Error('There is no such view');
                    }
                }
                return view;
            },
            _views: function () {
                var views = this.options.views;
                var view;
                var defaultView;
                var selected;
                var isSettings;
                var name;
                var type;
                var idx;
                var length;
                this.views = {};
                this._viewsCount = 0;
                for (idx = 0, length = views.length; idx < length; idx++) {
                    var hasType = false;
                    view = views[idx];
                    isSettings = isPlainObject(view);
                    if (isSettings) {
                        type = name = view.type ? view.type : view;
                        if (typeof type !== STRING) {
                            name = view.name || view.title;
                            hasType = true;
                        }
                    } else {
                        type = name = view;
                    }
                    defaultView = defaultViews[name];
                    if (defaultView && !hasType) {
                        view.type = defaultView.type;
                        defaultView.title = this.options.messages.views[name];
                        if (defaultView.type === 'day') {
                            defaultView.messages = { allDay: this.options.messages.allDay };
                        } else if (defaultView.type === 'agenda') {
                            defaultView.messages = {
                                event: this.options.messages.event,
                                date: this.options.messages.date,
                                time: this.options.messages.time
                            };
                        }
                    }
                    view = extend({ title: name }, defaultView, isSettings ? view : {});
                    if (name) {
                        this.views[name] = view;
                        this._viewsCount++;
                        if (!selected || view.selected) {
                            selected = name;
                        }
                    }
                }
                if (selected) {
                    this._selectedViewName = selected;
                }
            },
            rebind: function () {
                this.dataSource.fetch();
            },
            _dataSource: function () {
                var that = this, options = that.options, dataSource = options.dataSource;
                dataSource = isArray(dataSource) ? { data: dataSource } : dataSource;
                if (options.timezone && !(dataSource instanceof SchedulerDataSource)) {
                    dataSource = extend(true, dataSource, { schema: { timezone: options.timezone } });
                } else if (dataSource instanceof SchedulerDataSource) {
                    options.timezone = dataSource.options.schema ? dataSource.options.schema.timezone : '';
                }
                if (that.dataSource && that._refreshHandler) {
                    that.dataSource.unbind(CHANGE, that._refreshHandler).unbind('progress', that._progressHandler).unbind('error', that._errorHandler);
                } else {
                    that._refreshHandler = proxy(that.refresh, that);
                    that._progressHandler = proxy(that._requestStart, that);
                    that._errorHandler = proxy(that._error, that);
                }
                that.dataSource = kendo.data.SchedulerDataSource.create(dataSource).bind(CHANGE, that._refreshHandler).bind('progress', that._progressHandler).bind('error', that._errorHandler);
                that.options.dataSource = that.dataSource;
            },
            _error: function () {
                this._progress(false);
            },
            _requestStart: function () {
                this._progress(true);
            },
            _progress: function (toggle) {
                var element = this.element.find('.k-scheduler-content');
                kendo.ui.progress(element, toggle);
            },
            _resources: function () {
                var that = this;
                var resources = that.options.resources;
                for (var idx = 0; idx < resources.length; idx++) {
                    var resource = resources[idx];
                    var field = resource.field;
                    var dataSource = resource.dataSource;
                    if (!field || !dataSource) {
                        throw new Error('The "field" and "dataSource" options of the scheduler resource are mandatory.');
                    }
                    that.resources.push({
                        field: field,
                        name: resource.name || field,
                        title: resource.title || field,
                        dataTextField: resource.dataTextField || 'text',
                        dataValueField: resource.dataValueField || 'value',
                        dataColorField: resource.dataColorField || 'color',
                        valuePrimitive: resource.valuePrimitive != null ? resource.valuePrimitive : true,
                        multiple: resource.multiple || false,
                        dataSource: kendo.data.DataSource.create(dataSource)
                    });
                }
                var promises = $.map(that.resources, function (resource) {
                    return resource.dataSource.fetch();
                });
                $.when.apply(null, promises).then(function () {
                    if (that.options.autoBind) {
                        that.view(that._selectedViewName);
                    } else {
                        that._selectView(that._selectedViewName);
                    }
                });
            },
            _initModel: function () {
                var that = this;
                that._model = kendo.observable({
                    selectedDate: new DATE(this.options.date.getTime()),
                    formattedDate: '',
                    formattedShortDate: ''
                });
                that._model.bind('change', function (e) {
                    if (e.field === 'selectedDate') {
                        that.view(that._selectedViewName);
                    }
                });
            },
            _wrapper: function () {
                var that = this;
                var options = that.options;
                var height = options.height;
                var width = options.width;
                that.wrapper = that.element.addClass('k-widget k-scheduler k-floatwrap').attr('role', 'grid').attr('aria-multiselectable', true);
                if (that._isMobile()) {
                    that.wrapper.addClass('k-scheduler-mobile');
                }
                if (that._isMobilePhoneView()) {
                    that.wrapper.addClass('k-scheduler-phone');
                }
                if (height) {
                    that.wrapper.height(height);
                }
                if (width) {
                    that.wrapper.width(width);
                }
            },
            date: function (value) {
                if (value != null && getDate(value) >= getDate(this.options.min) && getDate(value) <= getDate(this.options.max)) {
                    this._model.set('selectedDate', value);
                }
                return getDate(this._model.get('selectedDate'));
            },
            _toolbar: function () {
                var that = this;
                var options = that.options;
                var commands = [];
                if (options.toolbar) {
                    commands = $.isArray(options.toolbar) ? options.toolbar : [options.toolbar];
                }
                var template = this._isMobilePhoneView() ? MOBILETOOLBARTEMPLATE : TOOLBARTEMPLATE;
                var toolbar = $(template({
                    messages: options.messages,
                    pdf: $.grep(commands, function (item) {
                        return item == 'pdf' || item.name == 'pdf';
                    }).length > 0,
                    ns: kendo.ns,
                    views: that.views,
                    viewsCount: that._viewsCount
                }));
                that.wrapper.append(toolbar);
                that.toolbar = toolbar;
                kendo.bind(that.toolbar, that._model);
                toolbar.on(CLICK + NS, '.k-pdf', function (e) {
                    e.preventDefault();
                    that.saveAsPDF();
                });
                toolbar.on(CLICK + NS, '.k-scheduler-navigation li', function (e) {
                    var li = $(this);
                    var date = new DATE(that.date());
                    var action = '';
                    e.preventDefault();
                    if (li.hasClass('k-nav-today')) {
                        action = 'today';
                        date = new DATE();
                    } else if (li.hasClass('k-nav-next')) {
                        action = 'next';
                        date = that.view().nextDate();
                    } else if (li.hasClass('k-nav-prev')) {
                        action = 'previous';
                        date = that.view().previousDate();
                    } else if (li.hasClass('k-nav-current') && !that._isMobilePhoneView()) {
                        that._showCalendar();
                        return;
                    }
                    if (!that.trigger('navigate', {
                            view: that._selectedViewName,
                            action: action,
                            date: date
                        })) {
                        that.date(date);
                    }
                });
                toolbar.on(CLICK + NS, '.k-scheduler-views li, .k-scheduler-refresh', function (e) {
                    e.preventDefault();
                    var name = $(this).attr(kendo.attr('name'));
                    if (!that.trigger('navigate', {
                            view: name,
                            action: 'changeView',
                            date: that.date()
                        })) {
                        that.view(name);
                        that.element.find('.k-state-expanded').removeClass('k-state-expanded');
                    }
                });
                toolbar.on(CLICK + NS, '.k-scheduler-views li.k-current-view', function () {
                    that.element.find('.k-scheduler-views').toggleClass('k-state-expanded');
                });
                toolbar.find('li').hover(function () {
                    $(this).addClass('k-state-hover');
                }, function () {
                    $(this).removeClass('k-state-hover');
                });
            },
            _showCalendar: function () {
                var that = this, target = that.toolbar.find('.k-nav-current'), html = $('<div class="k-calendar-container"><div class="k-scheduler-calendar"/></div>');
                if (!that.popup) {
                    that.popup = new Popup(html, {
                        anchor: target,
                        activate: function () {
                            if (!that.calendar) {
                                that.calendar = new Calendar(this.element.find('.k-scheduler-calendar'), {
                                    change: function () {
                                        var date = this.value();
                                        if (!that.trigger('navigate', {
                                                view: that._selectedViewName,
                                                action: 'changeDate',
                                                date: date
                                            })) {
                                            that.date(date);
                                            that.popup.close();
                                        }
                                    },
                                    min: that.options.min,
                                    max: that.options.max
                                });
                            }
                            that.calendar.value(that.date());
                        },
                        copyAnchorStyles: false
                    });
                }
                that.popup.open();
            },
            refresh: function (e) {
                var that = this;
                var view = this.view();
                this._progress(false);
                this.angular('cleanup', function () {
                    return { elements: that.items() };
                });
                e = e || {};
                if (!view) {
                    return;
                }
                if (e && e.action === 'itemchange' && (this._editor.editable || this._preventRefresh)) {
                    return;
                }
                if (this.trigger('dataBinding', {
                        action: e.action || 'rebind',
                        index: e.index,
                        items: e.items
                    })) {
                    return;
                }
                if (!(e && e.action === 'resize') && this._editor) {
                    this._editor.close();
                }
                this._data = this.dataSource.expand(view.startDate(), view.endDate(), this.wrapper);
                view.refreshLayout();
                view.render(this._data);
                this.trigger('dataBound');
            },
            slotByPosition: function (x, y) {
                var view = this.view();
                if (!view._slotByPosition) {
                    return null;
                }
                var slot = view._slotByPosition(x, y);
                if (!slot) {
                    return null;
                }
                return {
                    startDate: slot.startDate(),
                    endDate: slot.endDate(),
                    groupIndex: slot.groupIndex,
                    element: slot.element,
                    isDaySlot: slot.isDaySlot
                };
            },
            slotByElement: function (element) {
                var offset = $(element).offset();
                return this.slotByPosition(offset.left, offset.top);
            },
            resourcesBySlot: function (slot) {
                return this.view()._resourceBySlot(slot);
            }
        });
        var defaultViews = {
            day: { type: 'kendo.ui.DayView' },
            week: { type: 'kendo.ui.WeekView' },
            workWeek: { type: 'kendo.ui.WorkWeekView' },
            agenda: { type: 'kendo.ui.AgendaView' },
            month: { type: 'kendo.ui.MonthView' },
            timeline: { type: 'kendo.ui.TimelineView' },
            timelineWeek: { type: 'kendo.ui.TimelineWeekView' },
            timelineWorkWeek: { type: 'kendo.ui.TimelineWorkWeekView' },
            timelineMonth: { type: 'kendo.ui.TimelineMonthView' }
        };
        ui.plugin(JalaliScheduler);
        if (kendo.PDFMixin) {
            kendo.PDFMixin.extend(JalaliScheduler.prototype);
            var SCHEDULER_EXPORT = 'k-scheduler-pdf-export';
            JalaliScheduler.fn._drawPDF = function (progress) {
                var wrapper = this.wrapper;
                var styles = wrapper[0].style.cssText;
                wrapper.css({
                    width: wrapper.width(),
                    height: wrapper.height()
                });
                wrapper.addClass(SCHEDULER_EXPORT);
                var scheduler = this;
                var promise = new $.Deferred();
                var table = wrapper.find('.k-scheduler-content').find('table').css('table-layout', 'auto');
                setTimeout(function () {
                    table.css('table-layout', 'fixed');
                    scheduler.resize(true);
                    scheduler._drawPDFShadow({}, { avoidLinks: scheduler.options.pdf.avoidLinks }).done(function (group) {
                        var args = {
                            page: group,
                            pageNumber: 1,
                            progress: 1,
                            totalPages: 1
                        };
                        progress.notify(args);
                        promise.resolve(args.page);
                    }).fail(function (err) {
                        promise.reject(err);
                    }).always(function () {
                        wrapper[0].style.cssText = styles;
                        wrapper.removeClass(SCHEDULER_EXPORT);
                        scheduler.resize(true);
                        scheduler.resize(true);
                    });
                });
                return promise;
            };
        }
        var TimezoneEditor = Widget.extend({
            init: function (element, options) {
                var that = this, zones = kendo.timezone.windows_zones;
                if (!zones || !kendo.timezone.zones_titles) {
                    throw new Error('kendo.timezones.min.js is not included.');
                }
                Widget.fn.init.call(that, element, options);
                that.wrapper = that.element;
                that._zonesQuery = new kendo.data.Query(zones);
                that._zoneTitleId = kendo.guid();
                that._zoneTitlePicker();
                that._zonePicker();
                that._zoneTitle.bind('cascade', function () {
                    if (!this.value()) {
                        that._zone.wrapper.hide();
                    }
                });
                that._zone.bind('cascade', function () {
                    that._value = this.value();
                    that.trigger('change');
                });
                that.value(that.options.value);
            },
            options: {
                name: 'TimezoneEditor',
                value: '',
                optionLabel: 'No timezone'
            },
            events: ['change'],
            _zoneTitlePicker: function () {
                var that = this, zoneTitle = $('<input id="' + that._zoneTitleId + '"/>').appendTo(that.wrapper);
                that._zoneTitle = new kendo.ui.DropDownList(zoneTitle, {
                    dataSource: kendo.timezone.zones_titles,
                    dataValueField: 'other_zone',
                    dataTextField: 'name',
                    optionLabel: that.options.optionLabel
                });
            },
            _zonePicker: function () {
                var that = this, zone = $('<input />').appendTo(this.wrapper);
                that._zone = new kendo.ui.DropDownList(zone, {
                    dataValueField: 'zone',
                    dataTextField: 'territory',
                    dataSource: that._zonesQuery.data,
                    cascadeFrom: that._zoneTitleId,
                    dataBound: function () {
                        that._value = this.value();
                        this.wrapper.toggle(this.dataSource.view().length > 1);
                    }
                });
                that._zone.wrapper.hide();
            },
            destroy: function () {
                Widget.fn.destroy.call(this);
                kendo.destroy(this.wrapper);
            },
            value: function (value) {
                var that = this, zone;
                if (value === undefined) {
                    return that._value;
                }
                zone = that._zonesQuery.filter({
                    field: 'zone',
                    operator: 'eq',
                    value: value
                }).data[0];
                if (zone) {
                    that._zoneTitle.value(zone.other_zone);
                    that._zone.value(zone.zone);
                } else {
                    that._zoneTitle.select(0);
                }
            }
        });
        ui.plugin(TimezoneEditor);
        var ZONETITLEOPTIONTEMPLATE = kendo.template('<option value="#=other_zone#">#=name#</option>');
        var ZONEOPTIONTEMPLATE = kendo.template('<option value="#=zone#">#=territory#</option>');
        var MobileTimezoneEditor = Widget.extend({
            init: function (element, options) {
                var that = this, zones = kendo.timezone.windows_zones;
                if (!zones || !kendo.timezone.zones_titles) {
                    throw new Error('kendo.timezones.min.js is not included.');
                }
                Widget.fn.init.call(that, element, options);
                that.wrapper = that.element;
                that._zonesQuery = new kendo.data.Query(zones);
                that._zoneTitlePicker();
                that._zonePicker();
                that.value(that.options.value);
            },
            options: {
                name: 'MobileTimezoneEditor',
                optionLabel: 'No timezone',
                value: ''
            },
            events: ['change'],
            _bindZones: function (value) {
                var data = value ? this._filter(value) : [];
                this._zone.html(this._options(data, ZONEOPTIONTEMPLATE));
            },
            _filter: function (value) {
                return this._zonesQuery.filter({
                    field: 'other_zone',
                    operator: 'eq',
                    value: value
                }).data;
            },
            _options: function (data, template, optionLabel) {
                var idx = 0;
                var html = '';
                var length = data.length;
                if (optionLabel) {
                    html += template({
                        other_zone: '',
                        name: optionLabel
                    });
                }
                for (; idx < length; idx++) {
                    html += template(data[idx]);
                }
                return html;
            },
            _zoneTitlePicker: function () {
                var that = this;
                var options = that._options(kendo.timezone.zones_titles, ZONETITLEOPTIONTEMPLATE, that.options.optionLabel);
                that._zoneTitle = $('<select>' + options + '</select>').appendTo(that.wrapper).change(function () {
                    var value = this.value;
                    var zone = that._zone;
                    that._bindZones(value);
                    if (value && zone[0].children.length > 1) {
                        zone.show();
                    } else {
                        zone.hide();
                    }
                    that._value = zone[0].value;
                    that.trigger('change');
                });
            },
            _zonePicker: function () {
                var that = this;
                that._zone = $('<select style="display:none"></select>').appendTo(this.wrapper).change(function () {
                    that._value = this.value;
                    that.trigger('change');
                });
                that._bindZones(that._zoneTitle.val());
                that._value = that._zone[0].value;
            },
            destroy: function () {
                Widget.fn.destroy.call(this);
                kendo.destroy(this.wrapper);
            },
            value: function (value) {
                var that = this;
                var zonePicker = that._zone;
                var other_zone = '';
                var zone_value = '';
                var zone;
                if (value === undefined) {
                    return that._value;
                }
                zone = that._zonesQuery.filter({
                    field: 'zone',
                    operator: 'eq',
                    value: value
                }).data[0];
                if (zone) {
                    zone_value = zone.zone;
                    other_zone = zone.other_zone;
                }
                that._zoneTitle.val(other_zone);
                that._bindZones(other_zone);
                zonePicker.val(zone_value);
                zone_value = zonePicker[0].value;
                if (zone_value && zonePicker[0].children.length > 1) {
                    zonePicker.show();
                } else {
                    zonePicker.hide();
                }
                that._value = zone_value;
            }
        });
        ui.plugin(MobileTimezoneEditor);
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));



/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.agendaview', ['kendo.scheduler.view'], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.agendaview',
        name: 'Scheduler Agenda View',
        category: 'web',
        description: 'The Scheduler Agenda View',
        depends: ['scheduler.view'],
        hidden: true
    };
    (function ($) {
        var kendo = window.kendo, ui = kendo.ui, NS = '.kendoAgendaView';
        var EVENT_WRAPPER_FORMAT = '<div class="k-task" title="#:title.replace(/"/g,"\'")#" data-#=kendo.ns#uid="#=uid#">' + '# if (resources[0]) {#' + '<span class="k-scheduler-mark" style="background-color:#=resources[0].color#"></span>' + '# } #' + '# if (data.isException()) { #' + '<span class="k-icon k-i-exception"></span>' + '# } else if (data.isRecurring()) {#' + '<span class="k-icon k-i-refresh"></span>' + '# } #' + '{0}' + '#if (showDelete) {#' + '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' + '#}#' + '</div>';
        ui.AgendaView = ui.SchedulerView.extend({
            init: function (element, options) {
                ui.SchedulerView.fn.init.call(this, element, options);
                options = this.options;
                if (options.editable) {
                    options.editable = $.extend({ 'delete': true }, options.editable, {
                        create: false,
                        update: false
                    });
                }
                this.title = options.title;
                this._eventTemplate = this._eventTmpl(options.eventTemplate, EVENT_WRAPPER_FORMAT);
                this._dateTemplate = kendo.template(options.eventDateTemplate);
                this._groupTemplate = kendo.template(options.eventGroupTemplate);
                this._timeTemplate = kendo.template(options.eventTimeTemplate);
                this.element.on('mouseenter' + NS, '.k-scheduler-agenda .k-scheduler-content tr', '_mouseenter').on('mouseleave' + NS, '.k-scheduler-agenda .k-scheduler-content tr', '_mouseleave').on('click' + NS, '.k-scheduler-agenda .k-scheduler-content .k-link:has(.k-si-close)', '_remove');
                this._renderLayout(options.date);
            },
            name: 'agenda',
            _mouseenter: function (e) {
                $(e.currentTarget).addClass('k-state-hover');
            },
            _mouseleave: function (e) {
                $(e.currentTarget).removeClass('k-state-hover');
            },
            _remove: function (e) {
                e.preventDefault();
                this.trigger('remove', { uid: $(e.currentTarget).closest('.k-task').attr(kendo.attr('uid')) });
            },
            nextDate: function () {
                return kendo.date.nextDay(this.startDate());
            },
            startDate: function () {
                return this._startDate;
            },
            endDate: function () {
                return this._endDate;
            },
            previousDate: function () {
                return kendo.date.previousDay(this.startDate());
            },
            _renderLayout: function (date) {
                this._startDate = date;
                this._endDate = kendo.date.addDays(date, 7);
                this.createLayout(this._layout());
                this.table.addClass('k-scheduler-agenda');
            },
            _layout: function () {
                var columns = [
                    {
                        text: this.options.messages.time,
                        className: 'k-scheduler-timecolumn'
                    },
                    { text: this.options.messages.event }
                ];
                if (!this._isMobilePhoneView()) {
                    columns.splice(0, 0, {
                        text: this.options.messages.date,
                        className: 'k-scheduler-datecolumn'
                    });
                }
                var resources = this.groupedResources;
                if (resources.length) {
                    var groupHeaders = [];
                    for (var idx = 0; idx < resources.length; idx++) {
                        groupHeaders.push({
                            text: '',
                            className: 'k-scheduler-groupcolumn'
                        });
                    }
                    columns = groupHeaders.concat(columns);
                }
                return { columns: columns };
            },
            _tasks: function (events) {
                var tasks = [];
                for (var idx = 0; idx < events.length; idx++) {
                    var event = events[idx];
                    var start = event.start;
                    var end = event.end;
                    var eventDurationInDays = Math.ceil((end - kendo.date.getDate(start)) / kendo.date.MS_PER_DAY);
                    var task = event.clone();
                    task.startDate = kendo.date.getDate(start);
                    if (task.startDate >= this.startDate()) {
                        tasks.push(task);
                    }
                    if (eventDurationInDays > 1) {
                        task.end = kendo.date.nextDay(start);
                        task.head = true;
                        for (var day = 1; day < eventDurationInDays; day++) {
                            start = task.end;
                            task = event.clone();
                            task.start = start;
                            task.startDate = kendo.date.getDate(start);
                            task.end = kendo.date.nextDay(start);
                            if (day == eventDurationInDays - 1) {
                                task.end = new Date(task.start.getFullYear(), task.start.getMonth(), task.start.getDate(), end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds());
                                task.tail = true;
                            } else {
                                task.isAllDay = true;
                                task.middle = true;
                            }
                            if (kendo.date.getDate(task.end) <= this.endDate() && task.start >= this.startDate() || kendo.date.getDate(task.start).getTime() == this.endDate().getTime()) {
                                tasks.push(task);
                            }
                        }
                    }
                }
                return new kendo.data.Query(tasks).sort([
                    {
                        field: 'start',
                        dir: 'asc'
                    },
                    {
                        field: 'end',
                        dir: 'asc'
                    }
                ]).groupBy({ field: 'startDate' }).toArray();
            },
            _renderTaskGroups: function (tasksGroups, groups) {
                var tableRows = [];
                var editable = this.options.editable;
                var showDelete = editable && editable.destroy !== false && !this._isMobile();
                var isPhoneView = this._isMobilePhoneView();
                for (var taskGroupIndex = 0; taskGroupIndex < tasksGroups.length; taskGroupIndex++) {
                    var date = tasksGroups[taskGroupIndex].value;
                    var tasks = tasksGroups[taskGroupIndex].items;
                    var today = kendo.date.isToday(date);
                    for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
                        var task = tasks[taskIndex];
                        var tableRow = [];
                        var headerCells = !isPhoneView ? tableRow : [];
                        if (taskGroupIndex === 0 && taskIndex === 0 && groups.length) {
                            for (var idx = 0; idx < groups.length; idx++) {
                                headerCells.push(kendo.format('<td class="k-scheduler-groupcolumn{2}" rowspan="{0}">{1}</td>', groups[idx].rowSpan, this._groupTemplate({ value: groups[idx].text }), groups[idx].className));
                            }
                        }
                        if (taskIndex === 0) {
                            if (isPhoneView) {
                                headerCells.push(kendo.format('<td class="k-scheduler-datecolumn" colspan="2">{0}</td>', this._dateTemplate({ date: date })));
                                tableRows.push('<tr role="row" aria-selected="false"' + (today ? ' class="k-today">' : '>') + headerCells.join('') + '</tr>');
                            } else {
                                tableRow.push(kendo.format('<td class="k-scheduler-datecolumn{3}{2}" rowspan="{0}">{1}</td>', tasks.length, this._dateTemplate({ date: date }), taskGroupIndex == tasksGroups.length - 1 && !groups.length ? ' k-last' : '', !groups.length ? ' k-first' : ''));
                            }
                        }
                        if (task.head) {
                            task.format = '{0:t}';
                        } else if (task.tail) {
                            task.format = '{1:t}';
                        } else {
                            task.format = '{0:t}-{1:t}';
                        }
                        task.resources = this.eventResources(task);
                        tableRow.push(kendo.format('<td class="k-scheduler-timecolumn"><div>{0}{1}{2}</div></td><td>{3}</td>', task.tail || task.middle ? '<span class="k-icon k-i-arrow-w"></span>' : '', this._timeTemplate(task.clone({
                            start: task._startTime || task.start,
                            end: task.endTime || task.end
                        })), task.head || task.middle ? '<span class="k-icon k-i-arrow-e"></span>' : '', this._eventTemplate(task.clone({ showDelete: showDelete }))));
                        tableRows.push('<tr role="row" aria-selected="false"' + (today ? ' class="k-today">' : '>') + tableRow.join('') + '</tr>');
                    }
                }
                return tableRows.join('');
            },
            render: function (events) {
                var table = this.content.find('table').empty();
                var groups = [];
                if (events.length > 0) {
                    var resources = this.groupedResources;
                    if (resources.length) {
                        groups = this._createGroupConfiguration(events, resources, null);
                        this._renderGroups(groups, table, []);
                    } else {
                        groups = this._tasks(events);
                        table.append(this._renderTaskGroups(groups, []));
                    }
                }
                var items = this._eventsList = flattenTaskGroups(groups);
                this._angularItems(table, items);
                this.refreshLayout();
                this.trigger('activate');
            },
            _angularItems: function (table, items) {
                this.angular('compile', function () {
                    var data = [], elements = items.map(function (item) {
                            data.push({ dataItem: item });
                            return table.find('.k-task[' + kendo.attr('uid') + '=' + item.uid + ']');
                        });
                    return {
                        elements: elements,
                        data: data
                    };
                });
            },
            _renderGroups: function (groups, table, parentGroups) {
                for (var idx = 0, length = groups.length; idx < length; idx++) {
                    var parents = parentGroups.splice(0);
                    parents.push(groups[idx]);
                    if (groups[idx].groups) {
                        this._renderGroups(groups[idx].groups, table, parents);
                    } else {
                        table.append(this._renderTaskGroups(groups[idx].items, parents));
                    }
                }
            },
            _createGroupConfiguration: function (events, resources, parent) {
                var resource = resources[0];
                var configuration = [];
                var data = resource.dataSource.view();
                var isPhoneView = this._isMobilePhoneView();
                for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                    var value = resourceValue(resource, data[dataIndex]);
                    var tmp = new kendo.data.Query(events).filter({
                        field: resource.field,
                        operator: ui.SchedulerView.groupEqFilter(value)
                    }).toArray();
                    if (tmp.length) {
                        var tasks = this._tasks(tmp);
                        var className = parent ? '' : ' k-first';
                        if (dataIndex === data.length - 1 && (!parent || parent.className.indexOf('k-last') > -1)) {
                            className += ' k-last';
                        }
                        var obj = {
                            text: kendo.getter(resource.dataTextField)(data[dataIndex]),
                            value: value,
                            rowSpan: 0,
                            className: className
                        };
                        if (resources.length > 1) {
                            obj.groups = this._createGroupConfiguration(tmp, resources.slice(1), obj);
                            if (parent) {
                                parent.rowSpan += obj.rowSpan;
                            }
                        } else {
                            obj.items = tasks;
                            var span = rowSpan(obj.items);
                            if (isPhoneView) {
                                span += obj.items.length;
                            }
                            obj.rowSpan = span;
                            if (parent) {
                                parent.rowSpan += span;
                            }
                        }
                        configuration.push(obj);
                    }
                }
                return configuration;
            },
            selectionByElement: function (cell) {
                var index, event;
                cell = $(cell);
                if (cell.hasClass('k-scheduler-datecolumn') || !this._eventsList.length) {
                    return;
                }
                if (cell.is('.k-task')) {
                    cell = cell.closest('td');
                }
                if (this._isMobile()) {
                    var parent = cell.parent();
                    index = parent.parent().children().filter(function () {
                        return $(this).children(':not(.k-scheduler-datecolumn)').length;
                    }).index(parent);
                } else {
                    index = cell.parent().index();
                }
                event = this._eventsList[index];
                return {
                    index: index,
                    start: event.start,
                    end: event.end,
                    isAllDay: event.isAllDay,
                    uid: event.uid
                };
            },
            select: function (selection) {
                this.clearSelection();
                var row = this.table.find('.k-task').eq(selection.index).closest('tr').addClass('k-state-selected').attr('aria-selected', true)[0];
                this.current(row);
            },
            move: function (selection, key) {
                var handled = false;
                var index = selection.index;
                if (key == kendo.keys.UP) {
                    index--;
                    handled = true;
                } else if (key == kendo.keys.DOWN) {
                    index++;
                    handled = true;
                }
                if (handled) {
                    var event = this._eventsList[index];
                    if (event) {
                        selection.start = event.start;
                        selection.end = event.end;
                        selection.isAllDay = event.isAllDay;
                        selection.events = [event.uid];
                        selection.index = index;
                    }
                }
                return handled;
            },
            moveToEvent: function () {
                return false;
            },
            constrainSelection: function (selection) {
                var event = this._eventsList[0];
                if (event) {
                    selection.start = event.start;
                    selection.end = event.end;
                    selection.isAllDay = event.isAllDay;
                    selection.events = [event.uid];
                    selection.index = 0;
                }
            },
            isInRange: function () {
                return true;
            },
            destroy: function () {
                if (this.element) {
                    this.element.off(NS);
                }
                ui.SchedulerView.fn.destroy.call(this);
            },
            options: {
                title: 'Agenda',
                name: 'agenda',
                editable: true,
                selectedDateFormat: '{0:D}-{1:D}',
                selectedShortDateFormat: '{0:d} - {1:d}',
                eventTemplate: '#:title#',
                eventTimeTemplate: '#if(data.isAllDay) {#' + '#=this.options.messages.allDay#' + '#} else { #' + '#=kendo.format(format, start, end)#' + '# } #',
                eventDateTemplate: '<strong class="k-scheduler-agendaday">' + '#=kendo.toString(date, "dd")#' + '</strong>' + '<em class="k-scheduler-agendaweek">' + '#=kendo.toString(date,"dddd")#' + '</em>' + '<span class="k-scheduler-agendadate">' + '#=kendo.toString(date, "y")#' + '</span>',
                eventGroupTemplate: '<strong class="k-scheduler-adgendagroup">' + '#=value#' + '</strong>',
                messages: {
                    event: 'Event',
                    date: 'Date',
                    time: 'Time',
                    allDay: 'all day'
                }
            }
        });
        function rowSpan(tasks) {
            var result = 0;
            for (var idx = 0, length = tasks.length; idx < length; idx++) {
                result += tasks[idx].items.length;
            }
            return result;
        }
        function resourceValue(resource, item) {
            if (resource.valuePrimitive) {
                item = kendo.getter(resource.dataValueField)(item);
            }
            return item;
        }
        function flattenTaskGroups(groups) {
            var idx = 0, length = groups.length, item, result = [];
            for (; idx < length; idx++) {
                item = groups[idx];
                if (item.groups) {
                    item = flattenGroup(item.groups);
                    result = result.concat(item);
                } else {
                    result = result.concat(flattenGroup(item.items));
                }
            }
            return result;
        }
        function flattenGroup(groups) {
            var items = [].concat(groups), item = items.shift(), result = [], push = [].push;
            while (item) {
                if (item.groups) {
                    push.apply(items, item.groups);
                } else if (item.items) {
                    push.apply(items, item.items);
                } else {
                    push.call(result, item);
                }
                item = items.shift();
            }
            return result;
        }
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));





/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.view', ['kendo.core'], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.view',
        name: 'Scheduler View',
        category: 'web',
        description: 'The Scheduler Common View',
        depends: ['core'],
        hidden: true
    };
    (function ($) {
        var kendo = window.kendo, ui = kendo.ui, Widget = ui.Widget, keys = kendo.keys, NS = '.kendoSchedulerView', math = Math, DATE = JalaliDate;
        function levels(values, key) {
            var result = [];
            function collect(depth, values) {
                values = values[key];
                if (values) {
                    var level = result[depth] = result[depth] || [];
                    for (var idx = 0; idx < values.length; idx++) {
                        level.push(values[idx]);
                        collect(depth + 1, values[idx]);
                    }
                }
            }
            collect(0, values);
            return result;
        }
        function cellspacing() {
            if (kendo.support.cssBorderSpacing) {
                return '';
            }
            return 'cellspacing="0"';
        }
        function table(tableRows, className) {
            if (!tableRows.length) {
                return '';
            }
            return '<table ' + cellspacing() + ' class="' + $.trim('k-scheduler-table ' + (className || '')) + '">' + '<tr>' + tableRows.join('</tr><tr>') + '</tr>' + '</table>';
        }
        function allDayTable(tableRows, className) {
            if (!tableRows.length) {
                return '';
            }
            return '<div style=\'position:relative\'>' + table(tableRows, className) + '</div>';
        }
        function timesHeader(columnLevelCount, allDaySlot, rowCount) {
            var tableRows = [];
            if (rowCount > 0) {
                for (var idx = 0; idx < columnLevelCount; idx++) {
                    tableRows.push('<th>&nbsp;</th>');
                }
            }
            if (allDaySlot) {
                tableRows.push('<th class="k-scheduler-times-all-day">' + allDaySlot.text + '</th>');
            }
            if (rowCount < 1) {
                return $();
            }
            return $('<div class="k-scheduler-times">' + table(tableRows) + '</div>');
        }
        function datesHeader(columnLevels, columnCount, allDaySlot) {
            var dateTableRows = [];
            var columnIndex;
            for (var columnLevelIndex = 0; columnLevelIndex < columnLevels.length; columnLevelIndex++) {
                var level = columnLevels[columnLevelIndex];
                var th = [];
                var colspan = columnCount / level.length;
                for (columnIndex = 0; columnIndex < level.length; columnIndex++) {
                    var column = level[columnIndex];
                    th.push('<th colspan="' + (column.colspan || colspan) + '" class="' + (column.className || '') + '">' + column.text + '</th>');
                }
                dateTableRows.push(th.join(''));
            }
            var allDayTableRows = [];
            if (allDaySlot) {
                var lastLevel = columnLevels[columnLevels.length - 1];
                var td = [];
                var cellContent = allDaySlot.cellContent;
                for (columnIndex = 0; columnIndex < lastLevel.length; columnIndex++) {
                    td.push('<td class="' + (lastLevel[columnIndex].className || '') + '">' + (cellContent ? cellContent(columnIndex) : '&nbsp;') + '</th>');
                }
                allDayTableRows.push(td.join(''));
            }
            return $('<div class="k-scheduler-header k-state-default">' + '<div class="k-scheduler-header-wrap">' + table(dateTableRows) + allDayTable(allDayTableRows, 'k-scheduler-header-all-day') + '</div>' + '</div>');
        }
        function times(rowLevels, rowCount) {
            var rows = new Array(rowCount).join().split(',');
            var rowHeaderRows = [];
            var rowIndex;
            for (var rowLevelIndex = 0; rowLevelIndex < rowLevels.length; rowLevelIndex++) {
                var level = rowLevels[rowLevelIndex];
                var rowspan = rowCount / level.length;
                var className;
                for (rowIndex = 0; rowIndex < level.length; rowIndex++) {
                    className = level[rowIndex].className || '';
                    if (level[rowIndex].allDay) {
                        className = 'k-scheduler-times-all-day';
                    }
                    rows[rowspan * rowIndex] += '<th class="' + className + '" rowspan="' + rowspan + '">' + level[rowIndex].text + '</th>';
                }
            }
            for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                rowHeaderRows.push(rows[rowIndex]);
            }
            if (rowCount < 1) {
                return $();
            }
            return $('<div class="k-scheduler-times">' + table(rowHeaderRows) + '</div>');
        }
        function content() {
            return $('<div class="k-scheduler-content">' + '<table ' + cellspacing() + ' class="k-scheduler-table"/>' + '</div>');
        }
        var HINT = '<div class="k-marquee k-scheduler-marquee">' + '<div class="k-marquee-color"></div>' + '<div class="k-marquee-text">' + '<div class="k-label-top"></div>' + '<div class="k-label-bottom"></div>' + '</div>' + '</div>';
        kendo.ui.scheduler = {};
        var ResourceView = kendo.Class.extend({
            init: function (index, isRtl) {
                this._index = index;
                this._timeSlotCollections = [];
                this._daySlotCollections = [];
                this._isRtl = isRtl;
            },
            addTimeSlotCollection: function (startDate, endDate) {
                return this._addCollection(startDate, endDate, this._timeSlotCollections);
            },
            addDaySlotCollection: function (startDate, endDate) {
                return this._addCollection(startDate, endDate, this._daySlotCollections);
            },
            _addCollection: function (startDate, endDate, collections) {
                var collection = new SlotCollection(startDate, endDate, this._index, collections.length);
                collections.push(collection);
                return collection;
            },
            timeSlotCollectionCount: function () {
                return this._timeSlotCollections.length;
            },
            daySlotCollectionCount: function () {
                return this._daySlotCollections.length;
            },
            daySlotByPosition: function (x, y) {
                return this._slotByPosition(x, y, this._daySlotCollections);
            },
            timeSlotByPosition: function (x, y) {
                return this._slotByPosition(x, y, this._timeSlotCollections);
            },
            _slotByPosition: function (x, y, collections) {
                for (var collectionIndex = 0; collectionIndex < collections.length; collectionIndex++) {
                    var collection = collections[collectionIndex];
                    for (var slotIndex = 0; slotIndex < collection.count(); slotIndex++) {
                        var slot = collection.at(slotIndex);
                        var width = slot.offsetWidth;
                        var height = slot.offsetHeight;
                        var horizontalEnd = slot.offsetLeft + width;
                        var verticalEnd = slot.offsetTop + height;
                        var nextSlot = collection.at(slotIndex + 1);
                        if (nextSlot) {
                            if (nextSlot.offsetLeft != slot.offsetLeft) {
                                if (this._isRtl) {
                                    horizontalEnd = slot.offsetLeft + (slot.offsetLeft - nextSlot.offsetLeft);
                                } else {
                                    horizontalEnd = nextSlot.offsetLeft;
                                }
                            } else {
                                verticalEnd = nextSlot.offsetTop;
                            }
                        }
                        if (x >= slot.offsetLeft && x < horizontalEnd && y >= slot.offsetTop && y < verticalEnd) {
                            return slot;
                        }
                    }
                }
            },
            refresh: function () {
                var collectionIndex;
                for (collectionIndex = 0; collectionIndex < this._daySlotCollections.length; collectionIndex++) {
                    this._daySlotCollections[collectionIndex].refresh();
                }
                for (collectionIndex = 0; collectionIndex < this._timeSlotCollections.length; collectionIndex++) {
                    this._timeSlotCollections[collectionIndex].refresh();
                }
            },
            timeSlotRanges: function (startTime, endTime) {
                var collections = this._timeSlotCollections;
                var start = this._startSlot(startTime, collections);
                if (!start.inRange && startTime >= start.slot.end) {
                    start = null;
                }
                var end = start;
                if (startTime < endTime) {
                    end = this._endSlot(endTime, collections);
                }
                if (end && !end.inRange && endTime <= end.slot.start) {
                    end = null;
                }
                if (start === null && end === null) {
                    return [];
                }
                if (start === null) {
                    start = {
                        inRange: true,
                        slot: collections[end.slot.collectionIndex].first()
                    };
                }
                if (end === null) {
                    end = {
                        inRange: true,
                        slot: collections[start.slot.collectionIndex].last()
                    };
                }
                return this._continuousRange(TimeSlotRange, collections, start, end);
            },
            daySlotRanges: function (startTime, endTime, isAllDay) {
                var collections = this._daySlotCollections;
                var start = this._startSlot(startTime, collections, isAllDay);
                if (!start.inRange && startTime >= start.slot.end) {
                    start = null;
                }
                var end = start;
                if (startTime < endTime) {
                    end = this._endSlot(endTime, collections, isAllDay);
                }
                if (end && !end.inRange && endTime <= end.slot.start) {
                    end = null;
                }
                if (start === null && end === null) {
                    return [];
                }
                if (start === null) {
                    do {
                        startTime += JalaliKendoDate.MS_PER_DAY;
                        start = this._startSlot(startTime, collections, isAllDay);
                    } while (!start.inRange && startTime >= start.slot.end);
                }
                if (end === null) {
                    do {
                        endTime -= JalaliKendoDate.MS_PER_DAY;
                        end = this._endSlot(endTime, collections, isAllDay);
                    } while (!end.inRange && endTime <= end.slot.start);
                }
                return this._continuousRange(DaySlotRange, collections, start, end);
            },
            _continuousRange: function (range, collections, start, end) {
                var startSlot = start.slot;
                var endSlot = end.slot;
                var startIndex = startSlot.collectionIndex;
                var endIndex = endSlot.collectionIndex;
                var ranges = [];
                for (var collectionIndex = startIndex; collectionIndex <= endIndex; collectionIndex++) {
                    var collection = collections[collectionIndex];
                    var first = collection.first();
                    var last = collection.last();
                    var head = false;
                    var tail = false;
                    if (collectionIndex == startIndex) {
                        tail = !start.inRange;
                    }
                    if (collectionIndex == endIndex) {
                        head = !end.inRange;
                    }
                    if (first.start < startSlot.start) {
                        first = startSlot;
                    }
                    if (last.start > endSlot.start) {
                        last = endSlot;
                    }
                    if (startIndex < endIndex) {
                        if (collectionIndex == startIndex) {
                            head = true;
                        } else if (collectionIndex == endIndex) {
                            tail = true;
                        } else {
                            head = tail = true;
                        }
                    }
                    ranges.push(new range({
                        start: first,
                        end: last,
                        collection: collection,
                        head: head,
                        tail: tail
                    }));
                }
                return ranges;
            },
            slotRanges: function (event, isDay) {
                var startTime = event._startTime || JalaliKendoDate.toUtcTime(event.start);
                var endTime = event._endTime || JalaliKendoDate.toUtcTime(event.end);
                if (isDay === undefined) {
                    isDay = event.isMultiDay();
                }
                if (isDay) {
                    return this.daySlotRanges(startTime, endTime, event.isAllDay);
                }
                return this.timeSlotRanges(startTime, endTime);
            },
            ranges: function (startTime, endTime, isDay, isAllDay) {
                if (typeof startTime != 'number') {
                    startTime = JalaliKendoDate.toUtcTime(startTime);
                }
                if (typeof endTime != 'number') {
                    endTime = JalaliKendoDate.toUtcTime(endTime);
                }
                if (isDay) {
                    return this.daySlotRanges(startTime, endTime, isAllDay);
                }
                return this.timeSlotRanges(startTime, endTime);
            },
            _startCollection: function (date, collections) {
                for (var collectionIndex = 0; collectionIndex < collections.length; collectionIndex++) {
                    var collection = collections[collectionIndex];
                    if (collection.startInRange(date)) {
                        return collection;
                    }
                }
                return null;
            },
            _endCollection: function (date, collections, isAllDay) {
                for (var collectionIndex = 0; collectionIndex < collections.length; collectionIndex++) {
                    var collection = collections[collectionIndex];
                    if (collection.endInRange(date, isAllDay)) {
                        return collection;
                    }
                }
                return null;
            },
            _getCollections: function (isDay) {
                return isDay ? this._daySlotCollections : this._timeSlotCollections;
            },
            continuousSlot: function (slot, reverse) {
                var pad = reverse ? -1 : 1;
                var collections = this._getCollections(slot.isDaySlot);
                var collection = collections[slot.collectionIndex + pad];
                return collection ? collection[reverse ? 'last' : 'first']() : undefined;
            },
            firstSlot: function () {
                var collections = this._getCollections(this.daySlotCollectionCount());
                return collections[0].first();
            },
            lastSlot: function () {
                var collections = this._getCollections(this.daySlotCollectionCount());
                return collections[collections.length - 1].last();
            },
            upSlot: function (slot, keepCollection) {
                var that = this;
                var moveToDaySlot = function (isDaySlot, collectionIndex, index) {
                    var isFirstCell = index === 0;
                    if (!keepCollection && !isDaySlot && isFirstCell && that.daySlotCollectionCount()) {
                        return that._daySlotCollections[0].at(collectionIndex);
                    }
                };
                if (!this.timeSlotCollectionCount()) {
                    keepCollection = true;
                }
                return this._verticalSlot(slot, -1, moveToDaySlot);
            },
            downSlot: function (slot, keepCollection) {
                var that = this;
                var moveToTimeSlot = function (isDaySlot, collectionIndex, index) {
                    if (!keepCollection && isDaySlot && that.timeSlotCollectionCount()) {
                        return that._timeSlotCollections[index].at(0);
                    }
                };
                if (!this.timeSlotCollectionCount()) {
                    keepCollection = true;
                }
                return this._verticalSlot(slot, 1, moveToTimeSlot);
            },
            leftSlot: function (slot) {
                return this._horizontalSlot(slot, -1);
            },
            rightSlot: function (slot) {
                return this._horizontalSlot(slot, 1);
            },
            _horizontalSlot: function (slot, step) {
                var index = slot.index;
                var isDaySlot = slot.isDaySlot;
                var collectionIndex = slot.collectionIndex;
                var collections = this._getCollections(isDaySlot);
                if (isDaySlot) {
                    index += step;
                } else {
                    collectionIndex += step;
                }
                var collection = collections[collectionIndex];
                return collection ? collection.at(index) : undefined;
            },
            _verticalSlot: function (slot, step, swapCollection) {
                var index = slot.index;
                var isDaySlot = slot.isDaySlot;
                var collectionIndex = slot.collectionIndex;
                var collections = this._getCollections(isDaySlot);
                slot = swapCollection(isDaySlot, collectionIndex, index);
                if (slot) {
                    return slot;
                }
                if (isDaySlot) {
                    collectionIndex += step;
                } else {
                    index += step;
                }
                var collection = collections[collectionIndex];
                return collection ? collection.at(index) : undefined;
            },
            _collection: function (index, multiday) {
                var collections = multiday ? this._daySlotCollections : this._timeSlotCollections;
                return collections[index];
            },
            _startSlot: function (time, collections, isAllDay) {
                var collection = this._startCollection(time, collections);
                var inRange = true;
                if (!collection) {
                    collection = collections[0];
                    inRange = false;
                }
                var slot = collection.slotByStartDate(time, isAllDay);
                if (!slot) {
                    slot = collection.first();
                    inRange = false;
                }
                return {
                    slot: slot,
                    inRange: inRange
                };
            },
            _endSlot: function (time, collections, isAllDay) {
                var collection = this._endCollection(time, collections, isAllDay);
                var inRange = true;
                if (!collection) {
                    collection = collections[collections.length - 1];
                    inRange = false;
                }
                var slot = collection.slotByEndDate(time, isAllDay);
                if (!slot) {
                    slot = collection.last();
                    inRange = false;
                }
                return {
                    slot: slot,
                    inRange: inRange
                };
            },
            getSlotCollection: function (index, isDay) {
                return this[isDay ? 'getDaySlotCollection' : 'getTimeSlotCollection'](index);
            },
            getTimeSlotCollection: function (index) {
                return this._timeSlotCollections[index];
            },
            getDaySlotCollection: function (index) {
                return this._daySlotCollections[index];
            }
        });
        var SlotRange = kendo.Class.extend({
            init: function (options) {
                $.extend(this, options);
            },
            innerHeight: function () {
                var collection = this.collection;
                var startIndex = this.start.index;
                var endIndex = this.end.index;
                var result = 0;
                for (var slotIndex = startIndex; slotIndex <= endIndex; slotIndex++) {
                    result += collection.at(slotIndex).offsetHeight;
                }
                return result;
            },
            events: function () {
                return this.collection.events();
            },
            addEvent: function (event) {
                this.events().push(event);
            },
            startSlot: function () {
                if (this.start.offsetLeft > this.end.offsetLeft) {
                    return this.end;
                }
                return this.start;
            },
            endSlot: function () {
                if (this.start.offsetLeft > this.end.offsetLeft) {
                    return this.start;
                }
                return this.end;
            }
        });
        var TimeSlotRange = SlotRange.extend({
            innerHeight: function () {
                var collection = this.collection;
                var startIndex = this.start.index;
                var endIndex = this.end.index;
                var result = 0;
                for (var slotIndex = startIndex; slotIndex <= endIndex; slotIndex++) {
                    result += collection.at(slotIndex).offsetHeight;
                }
                return result;
            },
            outerRect: function (start, end, snap) {
                return this._rect('offset', start, end, snap);
            },
            _rect: function (property, start, end, snap) {
                var top;
                var bottom;
                var left;
                var right;
                var startSlot = this.start;
                var endSlot = this.end;
                var isRtl = kendo.support.isRtl(startSlot.element);
                if (typeof start != 'number') {
                    start = JalaliKendoDate.toUtcTime(start);
                }
                if (typeof end != 'number') {
                    end = JalaliKendoDate.toUtcTime(end);
                }
                if (snap) {
                    top = startSlot.offsetTop;
                    bottom = endSlot.offsetTop + endSlot[property + 'Height'];
                    if (isRtl) {
                        left = endSlot.offsetLeft;
                        right = startSlot.offsetLeft + startSlot[property + 'Width'];
                    } else {
                        left = startSlot.offsetLeft;
                        right = endSlot.offsetLeft + endSlot[property + 'Width'];
                    }
                } else {
                    var startOffset = start - startSlot.start;
                    if (startOffset < 0) {
                        startOffset = 0;
                    }
                    var startSlotDuration = startSlot.end - startSlot.start;
                    top = startSlot.offsetTop + startSlot[property + 'Height'] * startOffset / startSlotDuration;
                    var endOffset = endSlot.end - end;
                    if (endOffset < 0) {
                        endOffset = 0;
                    }
                    var endSlotDuration = endSlot.end - endSlot.start;
                    bottom = endSlot.offsetTop + endSlot[property + 'Height'] - endSlot[property + 'Height'] * endOffset / endSlotDuration;
                    if (isRtl) {
                        left = Math.round(endSlot.offsetLeft + endSlot[property + 'Width'] * endOffset / endSlotDuration);
                        right = Math.round(startSlot.offsetLeft + startSlot[property + 'Width'] - startSlot[property + 'Width'] * startOffset / startSlotDuration);
                    } else {
                        left = Math.round(startSlot.offsetLeft + startSlot[property + 'Width'] * startOffset / startSlotDuration);
                        right = Math.round(endSlot.offsetLeft + endSlot[property + 'Width'] - endSlot[property + 'Width'] * endOffset / endSlotDuration);
                    }
                }
                return {
                    top: top,
                    bottom: bottom,
                    left: left === 0 ? left : left + 1,
                    right: right
                };
            },
            innerRect: function (start, end, snap) {
                return this._rect('client', start, end, snap);
            }
        });
        var DaySlotRange = SlotRange.extend({
            innerWidth: function () {
                var collection = this.collection;
                var startIndex = this.start.index;
                var endIndex = this.end.index;
                var result = 0;
                var width = startIndex !== endIndex ? 'offsetWidth' : 'clientWidth';
                for (var slotIndex = startIndex; slotIndex <= endIndex; slotIndex++) {
                    result += collection.at(slotIndex)[width];
                }
                return result;
            }
        });
        var SlotCollection = kendo.Class.extend({
            init: function (startDate, endDate, groupIndex, collectionIndex) {
                this._slots = [];
                this._events = [];
                this._start = JalaliKendoDate.toUtcTime(startDate);
                this._end = JalaliKendoDate.toUtcTime(endDate);
                this._groupIndex = groupIndex;
                this._collectionIndex = collectionIndex;
            },
            refresh: function () {
                for (var slotIndex = 0; slotIndex < this._slots.length; slotIndex++) {
                    this._slots[slotIndex].refresh();
                }
            },
            startInRange: function (date) {
                return this._start <= date && date < this._end;
            },
            endInRange: function (date, isAllDay) {
                var end = isAllDay ? date < this._end : date <= this._end;
                return this._start <= date && end;
            },
            slotByStartDate: function (date) {
                var time = date;
                if (typeof time != 'number') {
                    time = JalaliKendoDate.toUtcTime(date);
                }
                for (var slotIndex = 0; slotIndex < this._slots.length; slotIndex++) {
                    var slot = this._slots[slotIndex];
                    if (slot.startInRange(time)) {
                        return slot;
                    }
                }
                return null;
            },
            slotByEndDate: function (date, allday) {
                var time = date;
                if (typeof time != 'number') {
                    time = JalaliKendoDate.toUtcTime(date);
                }
                if (allday) {
                    return this.slotByStartDate(date, false);
                }
                for (var slotIndex = 0; slotIndex < this._slots.length; slotIndex++) {
                    var slot = this._slots[slotIndex];
                    if (slot.endInRange(time)) {
                        return slot;
                    }
                }
                return null;
            },
            count: function () {
                return this._slots.length;
            },
            events: function () {
                return this._events;
            },
            addTimeSlot: function (element, start, end, isHorizontal) {
                var slot = new TimeSlot(element, start, end, this._groupIndex, this._collectionIndex, this._slots.length, isHorizontal);
                this._slots.push(slot);
            },
            addDaySlot: function (element, start, end, eventCount) {
                var slot = new DaySlot(element, start, end, this._groupIndex, this._collectionIndex, this._slots.length, eventCount);
                this._slots.push(slot);
            },
            first: function () {
                return this._slots[0];
            },
            last: function () {
                return this._slots[this._slots.length - 1];
            },
            at: function (index) {
                return this._slots[index];
            }
        });
        var Slot = kendo.Class.extend({
            init: function (element, start, end, groupIndex, collectionIndex, index) {
                this.element = element;
                this.clientWidth = element.clientWidth;
                this.clientHeight = element.clientHeight;
                this.offsetWidth = element.offsetWidth;
                this.offsetHeight = element.offsetHeight;
                this.offsetTop = element.offsetTop;
                this.offsetLeft = element.offsetLeft;
                this.start = start;
                this.end = end;
                this.element = element;
                this.groupIndex = groupIndex;
                this.collectionIndex = collectionIndex;
                this.index = index;
                this.isDaySlot = false;
            },
            startDate: function () {
                return kendo.timezone.toLocalDate(this.start);
            },
            endDate: function () {
                return kendo.timezone.toLocalDate(this.end);
            },
            startInRange: function (date) {
                return this.start <= date && date < this.end;
            },
            endInRange: function (date) {
                return this.start < date && date <= this.end;
            },
            startOffset: function () {
                return this.start;
            },
            endOffset: function () {
                return this.end;
            }
        });
        var TimeSlot = Slot.extend({
            init: function (element, start, end, groupIndex, collectionIndex, index, isHorizontal) {
                Slot.fn.init.apply(this, arguments);
                this.isHorizontal = isHorizontal ? true : false;
            },
            refresh: function () {
                var element = this.element;
                this.clientWidth = element.clientWidth;
                this.clientHeight = element.clientHeight;
                this.offsetWidth = element.offsetWidth;
                this.offsetHeight = element.offsetHeight;
                this.offsetTop = element.offsetTop;
                this.offsetLeft = element.offsetLeft;
            },
            offsetX: function (rtl, offset) {
                if (rtl) {
                    return this.offsetLeft + offset;
                } else {
                    return this.offsetLeft + offset;
                }
            },
            startInRange: function (date) {
                return this.start <= date && date < this.end;
            },
            endInRange: function (date) {
                return this.start < date && date <= this.end;
            },
            startOffset: function (x, y, snap) {
                if (snap) {
                    return this.start;
                }
                var offset = $(this.element).offset();
                var duration = this.end - this.start;
                var difference;
                var time;
                if (this.isHorizontal) {
                    var isRtl = kendo.support.isRtl(this.element);
                    difference = x - offset.left;
                    time = Math.floor(duration * (difference / this.offsetWidth));
                    if (isRtl) {
                        return this.start + duration - time;
                    }
                } else {
                    difference = y - offset.top;
                    time = Math.floor(duration * (difference / this.offsetHeight));
                }
                return this.start + time;
            },
            endOffset: function (x, y, snap) {
                if (snap) {
                    return this.end;
                }
                var offset = $(this.element).offset();
                var duration = this.end - this.start;
                var difference;
                var time;
                if (this.isHorizontal) {
                    var isRtl = kendo.support.isRtl(this.element);
                    difference = x - offset.left;
                    time = Math.floor(duration * (difference / this.offsetWidth));
                    if (isRtl) {
                        return this.start + duration - time;
                    }
                } else {
                    difference = y - offset.top;
                    time = Math.floor(duration * (difference / this.offsetHeight));
                }
                return this.start + time;
            }
        });
        var DaySlot = Slot.extend({
            init: function (element, start, end, groupIndex, collectionIndex, index, eventCount) {
                Slot.fn.init.apply(this, arguments);
                this.eventCount = eventCount;
                this.isDaySlot = true;
                if (this.element.children.length) {
                    this.firstChildHeight = this.element.children[0].offsetHeight + 3;
                    this.firstChildTop = this.element.children[0].offsetTop;
                } else {
                    this.firstChildHeight = 3;
                    this.firstChildTop = 0;
                }
            },
            refresh: function () {
                this.clientHeight = this.element.clientHeight;
                this.offsetTop = this.element.offsetTop;
            },
            startDate: function () {
                var date = new DATE(this.start);
                return kendo.timezone.apply(date, 'Etc/UTC');
            },
            endDate: function () {
                var date = new DATE(this.end);
                return kendo.timezone.apply(date, 'Etc/UTC');
            },
            startInRange: function (date) {
                return this.start <= date && date < this.end;
            },
            endInRange: function (date) {
                return this.start < date && date <= this.end;
            }
        });
        var scrollbarWidth;
        function scrollbar() {
            scrollbarWidth = scrollbarWidth ? scrollbarWidth : kendo.support.scrollbar();
            return scrollbarWidth;
        }
        kendo.ui.SchedulerView = Widget.extend({
            init: function (element, options) {
                Widget.fn.init.call(this, element, options);
                this._normalizeOptions();
                this._scrollbar = scrollbar();
                this._isRtl = kendo.support.isRtl(element);
                this._resizeHint = $();
                this._moveHint = $();
                this._cellId = kendo.guid();
                this._resourcesForGroups();
                this._selectedSlots = [];
            },
            _normalizeOptions: function () {
                var options = this.options;
                if (options.startTime) {
                    options.startTime.setMilliseconds(0);
                }
                if (options.endTime) {
                    options.endTime.setMilliseconds(0);
                }
                if (options.workDayStart) {
                    options.workDayStart.setMilliseconds(0);
                }
                if (options.workDayEnd) {
                    options.workDayEnd.setMilliseconds(0);
                }
            },
            _isMobile: function () {
                var options = this.options;
                return options.mobile === true && kendo.support.mobileOS || options.mobile === 'phone' || options.mobile === 'tablet';
            },
            _isMobilePhoneView: function () {
                var options = this.options;
                return options.mobile === true && kendo.support.mobileOS && !kendo.support.mobileOS.tablet || options.mobile === 'phone';
            },
            _addResourceView: function () {
                var resourceView = new ResourceView(this.groups.length, this._isRtl);
                this.groups.push(resourceView);
                return resourceView;
            },
            dateForTitle: function () {
                return kendo.format(this.options.selectedDateFormat, this.startDate(), this.endDate());
            },
            shortDateForTitle: function () {
                return kendo.format(this.options.selectedShortDateFormat, this.startDate(), this.endDate());
            },
            _changeGroup: function (selection, previous) {
                var method = previous ? 'prevGroupSlot' : 'nextGroupSlot';
                var slot = this[method](selection.start, selection.groupIndex, selection.isAllDay);
                if (slot) {
                    selection.groupIndex += previous ? -1 : 1;
                }
                return slot;
            },
            _changeGroupContinuously: function () {
                return null;
            },
            _changeViewPeriod: function () {
                return false;
            },
            _horizontalSlots: function (selection, ranges, multiple, reverse) {
                var method = reverse ? 'leftSlot' : 'rightSlot';
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                var group = this.groups[selection.groupIndex];
                if (!multiple) {
                    var slot = this._normalizeHorizontalSelection(selection, ranges, reverse);
                    if (slot) {
                        startSlot = endSlot = slot;
                    }
                }
                startSlot = group[method](startSlot);
                endSlot = group[method](endSlot);
                if (!multiple && !this._isVerticallyGrouped() && (!startSlot || !endSlot)) {
                    startSlot = endSlot = this._changeGroup(selection, reverse);
                }
                var continuousSlot;
                if (!startSlot || !endSlot) {
                    continuousSlot = this._continuousSlot(selection, ranges, reverse);
                    continuousSlot = this._changeGroupContinuously(selection, continuousSlot, multiple, reverse);
                    if (continuousSlot) {
                        startSlot = endSlot = continuousSlot;
                    }
                }
                return {
                    startSlot: startSlot,
                    endSlot: endSlot
                };
            },
            _verticalSlots: function (selection, ranges, multiple, reverse) {
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                var group = this.groups[selection.groupIndex];
                if (!multiple) {
                    var slot = this._normalizeVerticalSelection(selection, ranges, reverse);
                    if (slot) {
                        startSlot = endSlot = slot;
                    }
                }
                var method = reverse ? 'upSlot' : 'downSlot';
                startSlot = group[method](startSlot, multiple);
                endSlot = group[method](endSlot, multiple);
                if (!multiple && this._isVerticallyGrouped() && (!startSlot || !endSlot)) {
                    startSlot = endSlot = this._changeGroup(selection, reverse);
                }
                return {
                    startSlot: startSlot,
                    endSlot: endSlot
                };
            },
            _normalizeHorizontalSelection: function () {
                return null;
            },
            _normalizeVerticalSelection: function (selection, ranges, reverse) {
                var slot;
                if (reverse) {
                    slot = ranges[0].start;
                } else {
                    slot = ranges[ranges.length - 1].end;
                }
                return slot;
            },
            _continuousSlot: function () {
                return null;
            },
            constrainSelection: function (selection) {
                var group = this.groups[0];
                var slot;
                if (!this.inRange(selection)) {
                    slot = group.firstSlot();
                    selection.isAllDay = slot.isDaySlot;
                    selection.start = slot.startDate();
                    selection.end = slot.endDate();
                } else {
                    if (!group.daySlotCollectionCount()) {
                        selection.isAllDay = false;
                    }
                }
                if (!this.groups[selection.groupIndex]) {
                    selection.groupIndex = 0;
                }
            },
            move: function (selection, key, shift) {
                var handled = false;
                var group = this.groups[selection.groupIndex];
                if (!group.timeSlotCollectionCount()) {
                    selection.isAllDay = true;
                }
                var ranges = group.ranges(selection.start, selection.end, selection.isAllDay, false);
                var startSlot, endSlot, reverse, slots;
                if (key === keys.DOWN || key === keys.UP) {
                    handled = true;
                    reverse = key === keys.UP;
                    this._updateDirection(selection, ranges, shift, reverse, true);
                    slots = this._verticalSlots(selection, ranges, shift, reverse);
                    if (!slots.startSlot && !shift && this._changeViewPeriod(selection, reverse, true)) {
                        return handled;
                    }
                } else if (key === keys.LEFT || key === keys.RIGHT) {
                    handled = true;
                    reverse = key === keys.LEFT;
                    this._updateDirection(selection, ranges, shift, reverse, false);
                    slots = this._horizontalSlots(selection, ranges, shift, reverse);
                    if (!slots.startSlot && !shift && this._changeViewPeriod(selection, reverse, false)) {
                        return handled;
                    }
                }
                if (handled) {
                    startSlot = slots.startSlot;
                    endSlot = slots.endSlot;
                    if (shift) {
                        var backward = selection.backward;
                        if (backward && startSlot) {
                            selection.start = startSlot.startDate();
                        } else if (!backward && endSlot) {
                            selection.end = endSlot.endDate();
                        }
                    } else if (startSlot && endSlot) {
                        selection.isAllDay = startSlot.isDaySlot;
                        selection.start = startSlot.startDate();
                        selection.end = endSlot.endDate();
                    }
                    selection.events = [];
                }
                return handled;
            },
            moveToEventInGroup: function (group, slot, selectedEvents, prev) {
                var events = group._continuousEvents || [];
                var found, event;
                var pad = prev ? -1 : 1;
                var length = events.length;
                var idx = prev ? length - 1 : 0;
                while (idx < length && idx > -1) {
                    event = events[idx];
                    if (!prev && event.start.startDate() >= slot.startDate() || prev && event.start.startDate() <= slot.startDate()) {
                        if (selectedEvents.length) {
                            event = events[idx + pad];
                        }
                        if (event && $.inArray(event.uid, selectedEvents) === -1) {
                            found = !!event;
                            break;
                        }
                    }
                    idx += pad;
                }
                return event;
            },
            moveToEvent: function (selection, prev) {
                var groupIndex = selection.groupIndex;
                var group = this.groups[groupIndex];
                var slot = group.ranges(selection.start, selection.end, selection.isAllDay, false)[0].start;
                var length = this.groups.length;
                var pad = prev ? -1 : 1;
                var events = selection.events;
                var event;
                while (groupIndex < length && groupIndex > -1) {
                    event = this.moveToEventInGroup(group, slot, events, prev);
                    groupIndex += pad;
                    group = this.groups[groupIndex];
                    if (!group || event) {
                        break;
                    }
                    events = [];
                    if (prev) {
                        slot = group.lastSlot();
                    } else {
                        slot = group.firstSlot(true);
                    }
                }
                if (event) {
                    selection.events = [event.uid];
                    selection.start = event.start.startDate();
                    selection.end = event.end.endDate();
                    selection.isAllDay = event.start.isDaySlot;
                    selection.groupIndex = event.start.groupIndex;
                }
                return !!event;
            },
            current: function (candidate) {
                if (candidate !== undefined) {
                    this._current = candidate;
                    if (this.content.has(candidate)) {
                        this._scrollTo(candidate, this.content[0]);
                    }
                } else {
                    return this._current;
                }
            },
            select: function (selection) {
                this.clearSelection();
                if (!this._selectEvents(selection)) {
                    this._selectSlots(selection);
                }
            },
            _selectSlots: function (selection) {
                var isAllDay = selection.isAllDay;
                var group = this.groups[selection.groupIndex];
                if (!group.timeSlotCollectionCount()) {
                    isAllDay = true;
                }
                this._selectedSlots = [];
                var ranges = group.ranges(selection.start, selection.end, isAllDay, false);
                var element;
                var slot;
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var collection = range.collection;
                    for (var slotIndex = range.start.index; slotIndex <= range.end.index; slotIndex++) {
                        slot = collection.at(slotIndex);
                        element = slot.element;
                        element.setAttribute('aria-selected', true);
                        addSelectedState(element);
                        this._selectedSlots.push({
                            start: slot.startDate(),
                            end: slot.endDate(),
                            element: element
                        });
                    }
                }
                if (selection.backward) {
                    element = ranges[0].start.element;
                }
                this.current(element);
            },
            _selectEvents: function (selection) {
                var found = false;
                var events = selection.events;
                var groupEvents = this.groups[selection.groupIndex]._continuousEvents || [];
                var idx, length = groupEvents.length;
                if (!events[0] || !groupEvents[0]) {
                    return found;
                }
                var result = $();
                selection.events = [];
                for (idx = 0; idx < length; idx++) {
                    if ($.inArray(groupEvents[idx].uid, events) > -1) {
                        result = result.add(groupEvents[idx].element);
                        selection.events.push(groupEvents[idx].uid);
                    }
                }
                if (result[0]) {
                    result.addClass('k-state-selected').attr('aria-selected', true);
                    this.current(result.last()[0]);
                    this._selectedSlots = [];
                    found = true;
                }
                return found;
            },
            inRange: function (options) {
                var startDate = this.startDate();
                var endDate = JalaliKendoDate.addDays(this.endDate(), 1);
                var start = options.start;
                var end = options.end;
                return startDate <= start && start < endDate && startDate < end && end <= endDate;
            },
            _resourceValue: function (resource, item) {
                if (resource.valuePrimitive) {
                    item = kendo.getter(resource.dataValueField)(item);
                }
                return item;
            },
            _resourceBySlot: function (slot) {
                var resources = this.groupedResources;
                var result = {};
                if (resources.length) {
                    var resourceIndex = slot.groupIndex;
                    for (var idx = resources.length - 1; idx >= 0; idx--) {
                        var resource = resources[idx];
                        var value = this._resourceValue(resource, resource.dataSource.view()[resourceIndex % resource.dataSource.total()]);
                        if (resource.multiple) {
                            value = [value];
                        }
                        var setter = kendo.setter(resource.field);
                        setter(result, value);
                        resourceIndex = Math.floor(resourceIndex / resource.dataSource.total());
                    }
                }
                return result;
            },
            _createResizeHint: function (left, top, width, height) {
                return $(HINT).css({
                    left: left,
                    top: top,
                    width: width,
                    height: height
                });
            },
            _removeResizeHint: function () {
                this._resizeHint.remove();
                this._resizeHint = $();
            },
            _removeMoveHint: function () {
                this._moveHint.remove();
                this._moveHint = $();
            },
            _scrollTo: function (element, container) {
                var elementOffset = element.offsetTop, elementOffsetDir = element.offsetHeight, containerScroll = container.scrollTop, containerOffsetDir = container.clientHeight, bottomDistance = elementOffset + elementOffsetDir, result = 0;
                if (containerScroll > elementOffset) {
                    result = elementOffset;
                } else if (bottomDistance > containerScroll + containerOffsetDir) {
                    if (elementOffsetDir <= containerOffsetDir) {
                        result = bottomDistance - containerOffsetDir;
                    } else {
                        result = elementOffset;
                    }
                } else {
                    result = containerScroll;
                }
                container.scrollTop = result;
            },
            _shouldInverseResourceColor: function (resource) {
                var resourceColorIsDark = new Color(resource.color).isDark();
                var currentColor = this.element.css('color');
                var currentColorIsDark = new Color(currentColor).isDark();
                return resourceColorIsDark == currentColorIsDark;
            },
            _eventTmpl: function (template, wrapper) {
                var options = this.options, settings = $.extend({}, kendo.Template, options.templateSettings), paramName = settings.paramName, html = '', type = typeof template, state = {
                        storage: {},
                        count: 0
                    };
                if (type === 'function') {
                    state.storage['tmpl' + state.count] = template;
                    html += '#=this.tmpl' + state.count + '(' + paramName + ')#';
                    state.count++;
                } else if (type === 'string') {
                    html += template;
                }
                var tmpl = kendo.template(kendo.format(wrapper, html), settings);
                if (state.count > 0) {
                    tmpl = $.proxy(tmpl, state.storage);
                }
                return tmpl;
            },
            eventResources: function (event) {
                var resources = [], options = this.options;
                if (!options.resources) {
                    return resources;
                }
                for (var idx = 0; idx < options.resources.length; idx++) {
                    var resource = options.resources[idx];
                    var field = resource.field;
                    var eventResources = kendo.getter(field)(event);
                    if (eventResources == null) {
                        continue;
                    }
                    if (!resource.multiple) {
                        eventResources = [eventResources];
                    }
                    var data = resource.dataSource.view();
                    for (var resourceIndex = 0; resourceIndex < eventResources.length; resourceIndex++) {
                        var eventResource = null;
                        var value = eventResources[resourceIndex];
                        if (!resource.valuePrimitive) {
                            value = kendo.getter(resource.dataValueField)(value);
                        }
                        for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                            if (data[dataIndex].get(resource.dataValueField) == value) {
                                eventResource = data[dataIndex];
                                break;
                            }
                        }
                        if (eventResource !== null) {
                            var resourceColor = kendo.getter(resource.dataColorField)(eventResource);
                            resources.push({
                                field: resource.field,
                                title: resource.title,
                                name: resource.name,
                                text: kendo.getter(resource.dataTextField)(eventResource),
                                value: value,
                                color: resourceColor
                            });
                        }
                    }
                }
                return resources;
            },
            createLayout: function (layout) {
                var allDayIndex = -1;
                if (!layout.rows) {
                    layout.rows = [];
                }
                for (var idx = 0; idx < layout.rows.length; idx++) {
                    if (layout.rows[idx].allDay) {
                        allDayIndex = idx;
                        break;
                    }
                }
                var allDaySlot = layout.rows[allDayIndex];
                if (allDayIndex >= 0) {
                    layout.rows.splice(allDayIndex, 1);
                }
                var columnLevels = this.columnLevels = levels(layout, 'columns');
                var rowLevels = this.rowLevels = levels(layout, 'rows');
                this.table = $('<table ' + cellspacing() + ' class="k-scheduler-layout k-scheduler-' + this.name + 'view"/>');
                var rowCount = rowLevels[rowLevels.length - 1].length;
                this.table.append(this._topSection(columnLevels, allDaySlot, rowCount));
                this.table.append(this._bottomSection(columnLevels, rowLevels, rowCount));
                this.element.append(this.table);
                this._scroller();
            },
            refreshLayout: function () {
                var that = this, toolbar = that.element.find('>.k-scheduler-toolbar'), height = that.element.innerHeight(), scrollbar = this._scrollbar, headerHeight = 0, paddingDirection = this._isRtl ? 'left' : 'right';
                for (var idx = 0; idx < toolbar.length; idx++) {
                    height -= toolbar.eq(idx).outerHeight();
                }
                if (that.datesHeader) {
                    headerHeight = that.datesHeader.outerHeight();
                }
                if (that.timesHeader && that.timesHeader.outerHeight() > headerHeight) {
                    headerHeight = that.timesHeader.outerHeight();
                }
                if (that.datesHeader && that.timesHeader) {
                    var datesHeaderRows = that.datesHeader.find('table:first tr');
                    that.timesHeader.find('tr').height(function (index) {
                        $(this).height(datesHeaderRows.eq(index).height());
                    });
                }
                if (headerHeight) {
                    height -= headerHeight;
                }
                if (that.footer) {
                    height -= that.footer.outerHeight();
                }
                var isSchedulerHeightSet = function (el) {
                    var initialHeight, newHeight;
                    if (el[0].style.height) {
                        return true;
                    } else {
                        initialHeight = el.height();
                    }
                    el.height('auto');
                    newHeight = el.height();
                    if (initialHeight != newHeight) {
                        el.height('');
                        return true;
                    }
                    el.height('');
                    return false;
                };
                var contentDiv = that.content[0], scrollbarWidth = !kendo.support.kineticScrollNeeded ? scrollbar : 0;
                if (isSchedulerHeightSet(that.element)) {
                    if (height > scrollbar * 2) {
                        that.content.height(height);
                    } else {
                        that.content.height(scrollbar * 2 + 1);
                    }
                    that.times.height(contentDiv.clientHeight);
                    var timesTable = that.times.find('table');
                    if (timesTable.length) {
                        timesTable.height(that.content.find('table')[0].clientHeight);
                    }
                }
                if (contentDiv.offsetWidth - contentDiv.clientWidth > 0) {
                    that.table.addClass('k-scrollbar-v');
                    that.datesHeader.css('padding-' + paddingDirection, scrollbarWidth - parseInt(that.datesHeader.children().css('border-' + paddingDirection + '-width'), 10));
                } else {
                    that.datesHeader.css('padding-' + paddingDirection, '');
                }
                if (contentDiv.offsetHeight - contentDiv.clientHeight > 0 || contentDiv.clientHeight > that.content.children('.k-scheduler-table').height()) {
                    that.table.addClass('k-scrollbar-h');
                } else {
                    that.table.removeClass('k-scrollbar-h');
                }
            },
            _topSection: function (columnLevels, allDaySlot, rowCount) {
                this.timesHeader = timesHeader(columnLevels.length, allDaySlot, rowCount);
                var columnCount = columnLevels[columnLevels.length - 1].length;
                this.datesHeader = datesHeader(columnLevels, columnCount, allDaySlot);
                return $('<tr>').append(this.timesHeader.add(this.datesHeader).wrap('<td>').parent());
            },
            _bottomSection: function (columnLevels, rowLevels, rowCount) {
                this.times = times(rowLevels, rowCount);
                this.content = content(columnLevels[columnLevels.length - 1], rowLevels[rowLevels.length - 1]);
                return $('<tr>').append(this.times.add(this.content).wrap('<td>').parent());
            },
            _scroller: function () {
                var that = this;
                this.content.bind('scroll' + NS, function () {
                    that.datesHeader.find('>.k-scheduler-header-wrap').scrollLeft(this.scrollLeft);
                    that.times.scrollTop(this.scrollTop);
                });
                var touchScroller = kendo.touchScroller(this.content, {
                    avoidScrolling: function (e) {
                        return $(e.event.target).closest('.k-event.k-event-active').length > 0;
                    }
                });
                if (touchScroller && touchScroller.movable) {
                    this._touchScroller = touchScroller;
                    this.content = touchScroller.scrollElement;
                    touchScroller.movable.bind('change', function (e) {
                        that.datesHeader.find('>.k-scheduler-header-wrap').scrollLeft(-e.sender.x);
                        that.times.scrollTop(-e.sender.y);
                    });
                }
            },
            _resourcesForGroups: function () {
                var result = [];
                var groups = this.options.group;
                var resources = this.options.resources;
                groups = groups && groups.resources ? groups.resources : [];
                if (resources && groups.length) {
                    for (var idx = 0, length = resources.length; idx < length; idx++) {
                        for (var groupIdx = 0, groupLength = groups.length; groupIdx < groupLength; groupIdx++) {
                            if (resources[idx].name === groups[groupIdx]) {
                                result.push(resources[idx]);
                            }
                        }
                    }
                }
                this.groupedResources = result;
            },
            _createColumnsLayout: function (resources, inner, template) {
                return createLayoutConfiguration('columns', resources, inner, template);
            },
            _groupOrientation: function () {
                var groups = this.options.group;
                return groups && groups.resources ? groups.orientation : 'horizontal';
            },
            _isVerticallyGrouped: function () {
                return this.groupedResources.length && this._groupOrientation() === 'vertical';
            },
            _createRowsLayout: function (resources, inner, template) {
                return createLayoutConfiguration('rows', resources, inner, template);
            },
            selectionByElement: function () {
                return null;
            },
            clearSelection: function () {
                this.content.find('.k-state-selected').removeAttr('id').attr('aria-selected', false).removeClass('k-state-selected');
            },
            destroy: function () {
                var that = this;
                Widget.fn.destroy.call(this);
                if (that.table) {
                    kendo.destroy(that.table);
                    that.table.remove();
                }
                that.groups = null;
                that.table = null;
                that.content = null;
                that.times = null;
                that.datesHeader = null;
                that.timesHeader = null;
                that.footer = null;
                that._resizeHint = null;
                that._moveHint = null;
            },
            calendarInfo: function () {
                return kendo.getCulture().calendars.standard;
            },
            prevGroupSlot: function (date, groupIndex, isDay) {
                var collection;
                var group = this.groups[groupIndex];
                var slot = group.ranges(date, date, isDay, false)[0].start;
                if (groupIndex <= 0) {
                    return;
                }
                if (this._isVerticallyGrouped()) {
                    if (!group.timeSlotCollectionCount()) {
                        collection = group._collection(group.daySlotCollectionCount() - 1, true);
                        return collection.at(slot.index);
                    } else {
                        collection = group._collection(isDay ? slot.index : slot.collectionIndex, false);
                        return collection.last();
                    }
                } else {
                    if (!group.timeSlotCollectionCount()) {
                        collection = group._collection(slot.collectionIndex, true);
                        return collection.last();
                    } else {
                        collection = group._collection(isDay ? 0 : group.timeSlotCollectionCount() - 1, isDay);
                        return isDay ? collection.last() : collection.at(slot.index);
                    }
                }
            },
            nextGroupSlot: function (date, groupIndex, isDay) {
                var collection;
                var group = this.groups[groupIndex];
                var slot = group.ranges(date, date, isDay, false)[0].start;
                var daySlotCollectionCount;
                if (groupIndex >= this.groups.length - 1) {
                    return;
                }
                if (this._isVerticallyGrouped()) {
                    if (!group.timeSlotCollectionCount()) {
                        collection = group._collection(0, true);
                        return collection.at(slot.index);
                    } else {
                        daySlotCollectionCount = group.daySlotCollectionCount();
                        collection = group._collection(daySlotCollectionCount ? 0 : slot.collectionIndex, daySlotCollectionCount);
                        return isDay ? collection.first() : collection.at(slot.collectionIndex);
                    }
                } else {
                    if (!group.timeSlotCollectionCount()) {
                        collection = group._collection(slot.collectionIndex, true);
                        return collection.first();
                    } else {
                        collection = group._collection(0, isDay);
                        return isDay ? collection.first() : collection.at(slot.index);
                    }
                }
            },
            _eventOptionsForMove: function () {
                return {};
            },
            _updateEventForResize: function () {
                return;
            },
            _updateEventForSelection: function (event) {
                return event;
            }
        });
        function collidingEvents(elements, start, end) {
            var idx, index, startIndex, overlaps, endIndex;
            for (idx = elements.length - 1; idx >= 0; idx--) {
                index = rangeIndex(elements[idx]);
                startIndex = index.start;
                endIndex = index.end;
                overlaps = startIndex <= start && endIndex >= start;
                if (overlaps || startIndex >= start && endIndex <= end || start <= startIndex && end >= startIndex) {
                    if (startIndex < start) {
                        start = startIndex;
                    }
                    if (endIndex > end) {
                        end = endIndex;
                    }
                }
            }
            return eventsForSlot(elements, start, end);
        }
        function rangeIndex(eventElement) {
            return {
                start: eventElement.start,
                end: eventElement.end
            };
        }
        function eventsForSlot(elements, slotStart, slotEnd) {
            var events = [];
            for (var idx = 0; idx < elements.length; idx++) {
                var event = rangeIndex(elements[idx]);
                if (event.start < slotStart && event.end > slotStart || event.start >= slotStart && event.end <= slotEnd) {
                    events.push(elements[idx]);
                }
            }
            return events;
        }
        function createColumns(eventElements) {
            return _createColumns(eventElements);
        }
        function createRows(eventElements) {
            return _createColumns(eventElements);
        }
        var Color = function (value) {
            var color = this, formats = Color.formats, re, processor, parts, i, channels;
            if (arguments.length === 1) {
                value = color.resolveColor(value);
                for (i = 0; i < formats.length; i++) {
                    re = formats[i].re;
                    processor = formats[i].process;
                    parts = re.exec(value);
                    if (parts) {
                        channels = processor(parts);
                        color.r = channels[0];
                        color.g = channels[1];
                        color.b = channels[2];
                    }
                }
            } else {
                color.r = arguments[0];
                color.g = arguments[1];
                color.b = arguments[2];
            }
            color.r = color.normalizeByte(color.r);
            color.g = color.normalizeByte(color.g);
            color.b = color.normalizeByte(color.b);
        };
        Color.prototype = {
            resolveColor: function (value) {
                value = value || '#000';
                if (value.charAt(0) == '#') {
                    value = value.substr(1, 6);
                }
                value = value.replace(/ /g, '');
                value = value.toLowerCase();
                value = Color.namedColors[value] || value;
                return value;
            },
            normalizeByte: function (value) {
                return value < 0 || isNaN(value) ? 0 : value > 255 ? 255 : value;
            },
            percBrightness: function () {
                var color = this;
                return math.sqrt(0.241 * color.r * color.r + 0.691 * color.g * color.g + 0.068 * color.b * color.b);
            },
            isDark: function () {
                var color = this;
                var brightnessValue = color.percBrightness();
                return brightnessValue < 180;
            }
        };
        Color.formats = [
            {
                re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
                process: function (parts) {
                    return [
                        parseInt(parts[1], 10),
                        parseInt(parts[2], 10),
                        parseInt(parts[3], 10)
                    ];
                }
            },
            {
                re: /^(\w{2})(\w{2})(\w{2})$/,
                process: function (parts) {
                    return [
                        parseInt(parts[1], 16),
                        parseInt(parts[2], 16),
                        parseInt(parts[3], 16)
                    ];
                }
            },
            {
                re: /^(\w{1})(\w{1})(\w{1})$/,
                process: function (parts) {
                    return [
                        parseInt(parts[1] + parts[1], 16),
                        parseInt(parts[2] + parts[2], 16),
                        parseInt(parts[3] + parts[3], 16)
                    ];
                }
            }
        ];
        Color.namedColors = {
            aqua: '00ffff',
            azure: 'f0ffff',
            beige: 'f5f5dc',
            black: '000000',
            blue: '0000ff',
            brown: 'a52a2a',
            coral: 'ff7f50',
            cyan: '00ffff',
            darkblue: '00008b',
            darkcyan: '008b8b',
            darkgray: 'a9a9a9',
            darkgreen: '006400',
            darkorange: 'ff8c00',
            darkred: '8b0000',
            dimgray: '696969',
            fuchsia: 'ff00ff',
            gold: 'ffd700',
            goldenrod: 'daa520',
            gray: '808080',
            green: '008000',
            greenyellow: 'adff2f',
            indigo: '4b0082',
            ivory: 'fffff0',
            khaki: 'f0e68c',
            lightblue: 'add8e6',
            lightgrey: 'd3d3d3',
            lightgreen: '90ee90',
            lightpink: 'ffb6c1',
            lightyellow: 'ffffe0',
            lime: '00ff00',
            limegreen: '32cd32',
            linen: 'faf0e6',
            magenta: 'ff00ff',
            maroon: '800000',
            mediumblue: '0000cd',
            navy: '000080',
            olive: '808000',
            orange: 'ffa500',
            orangered: 'ff4500',
            orchid: 'da70d6',
            pink: 'ffc0cb',
            plum: 'dda0dd',
            purple: '800080',
            red: 'ff0000',
            royalblue: '4169e1',
            salmon: 'fa8072',
            silver: 'c0c0c0',
            skyblue: '87ceeb',
            slateblue: '6a5acd',
            slategray: '708090',
            snow: 'fffafa',
            steelblue: '4682b4',
            tan: 'd2b48c',
            teal: '008080',
            tomato: 'ff6347',
            turquoise: '40e0d0',
            violet: 'ee82ee',
            wheat: 'f5deb3',
            white: 'ffffff',
            whitesmoke: 'f5f5f5',
            yellow: 'ffff00',
            yellowgreen: '9acd32'
        };
        function _createColumns(eventElements) {
            var columns = [];
            for (var idx = 0; idx < eventElements.length; idx++) {
                var event = eventElements[idx];
                var eventRange = rangeIndex(event);
                var column = null;
                for (var j = 0, columnLength = columns.length; j < columnLength; j++) {
                    var endOverlaps = eventRange.start > columns[j].end;
                    if (eventRange.start < columns[j].start || endOverlaps) {
                        column = columns[j];
                        if (column.end < eventRange.end) {
                            column.end = eventRange.end;
                        }
                        break;
                    }
                }
                if (!column) {
                    column = {
                        start: eventRange.start,
                        end: eventRange.end,
                        events: []
                    };
                    columns.push(column);
                }
                column.events.push(event);
            }
            return columns;
        }
        function createLayoutConfiguration(name, resources, inner, template) {
            var resource = resources[0];
            if (resource) {
                var configuration = [];
                var data = resource.dataSource.view();
                for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
                    var obj = {
                        text: template({
                            text: kendo.htmlEncode(kendo.getter(resource.dataTextField)(data[dataIndex])),
                            color: kendo.getter(resource.dataColorField)(data[dataIndex]),
                            field: resource.field,
                            title: resource.title,
                            name: resource.name,
                            value: kendo.getter(resource.dataValueField)(data[dataIndex])
                        }),
                        className: 'k-slot-cell'
                    };
                    obj[name] = createLayoutConfiguration(name, resources.slice(1), inner, template);
                    configuration.push(obj);
                }
                return configuration;
            }
            return inner;
        }
        function groupEqFilter(value) {
            return function (item) {
                if ($.isArray(item) || item instanceof kendo.data.ObservableArray) {
                    for (var idx = 0; idx < item.length; idx++) {
                        if (item[idx] == value) {
                            return true;
                        }
                    }
                    return false;
                }
                return item == value;
            };
        }
        var selectedStateRegExp = /\s*k-state-selected/;
        function addSelectedState(cell) {
            cell.className = cell.className.replace(selectedStateRegExp, '') + ' k-state-selected';
        }
        $.extend(ui.SchedulerView, {
            createColumns: createColumns,
            createRows: createRows,
            rangeIndex: rangeIndex,
            collidingEvents: collidingEvents,
            groupEqFilter: groupEqFilter
        });
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));



/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.timelineview', ['kendo.scheduler.view'], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.timelineview',
        name: 'Scheduler Timeline View',
        category: 'web',
        description: 'The Scheduler Timeline View',
        depends: ['scheduler.view'],
        hidden: true
    };
    (function ($, undefined) {
        var kendo = window.kendo, DATE = JalaliDate, ui = kendo.ui, setTime = JalaliKendoDate.setTime, SchedulerView = ui.SchedulerView, extend = $.extend, proxy = $.proxy, getDate = JalaliKendoDate.getDate, getMilliseconds = JalaliKendoDate.getMilliseconds, MS_PER_DAY = JalaliKendoDate.MS_PER_DAY, MS_PER_MINUTE = JalaliKendoDate.MS_PER_MINUTE, CURRENT_TIME_MARKER_CLASS = 'k-current-time', CURRENT_TIME_MARKER_ARROW_CLASS = 'k-current-time-arrow', SCHEDULER_HEADER_WRAP_CLASS = 'k-scheduler-header-wrap', BORDER_SIZE_COEFF = 0.8666, NS = '.kendoTimelineView';
        var EVENT_TEMPLATE = kendo.template('<div>' + '<div class="k-event-template k-event-time">#:kendo.format("{0:t} - {1:t}", start, end)#</div>' + '<div class="k-event-template">${title}</div></div>'), DATA_HEADER_TEMPLATE = kendo.template('<span class=\'k-link k-nav-day\'>#=kendo.format(\'{0:m}\', date)#</span>'), EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" ' + 'data-#=ns#uid="#=uid#"' + '#if (resources[0]) { #' + 'style="background-color:#=resources[0].color#; border-color: #=resources[0].color#"' + 'class="k-event#=inverseColor ? " k-event-inverse" : ""#" ' + '#} else {#' + 'class="k-event"' + '#}#' + '>' + '<span class="k-event-actions">' + '# if(data.tail) {#' + '<span class="k-icon k-i-arrow-w"></span>' + '#}#' + '# if(data.isException()) {#' + '<span class="k-icon k-i-exception"></span>' + '# } else if(data.isRecurring()) {#' + '<span class="k-icon k-i-refresh"></span>' + '# } #' + '</span>' + '{0}' + '<span class="k-event-actions">' + '#if (showDelete) {#' + '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' + '#}#' + '# if(data.head) {#' + '<span class="k-icon k-i-arrow-e"></span>' + '#}#' + '</span>' + '#if(resizable && !data.tail){#' + '<span class="k-resize-handle k-resize-w"></span>' + '#}#' + '#if(resizable && !data.head){#' + '<span class="k-resize-handle k-resize-e"></span>' + '#}#' + '</div>';
        function toInvariantTime(date) {
            var staticDate = new DATE(1980, 1, 1, 0, 0, 0);
            setTime(staticDate, getMilliseconds(date));
            return staticDate;
        }
        function getWorkDays(options) {
            var workDays = [];
            var dayIndex = options.workWeekStart;
            workDays.push(dayIndex);
            while (options.workWeekEnd != dayIndex) {
                if (dayIndex > 6) {
                    dayIndex -= 7;
                } else {
                    dayIndex++;
                }
                workDays.push(dayIndex);
            }
            return workDays;
        }
        function setColspan(columnLevel) {
            var count = 0;
            if (columnLevel.columns) {
                for (var i = 0; i < columnLevel.columns.length; i++) {
                    count += setColspan(columnLevel.columns[i]);
                }
                columnLevel.colspan = count;
                return count;
            } else {
                columnLevel.colspan = 1;
                return 1;
            }
        }
        function collidingEvents(elements, left, right) {
            var idx, startPosition, overlaps, endPosition;
            for (idx = elements.length - 1; idx >= 0; idx--) {
                startPosition = elements[idx].rectLeft;
                endPosition = elements[idx].rectRight;
                overlaps = startPosition <= left && endPosition >= left;
                if (overlaps || startPosition >= left && endPosition <= right || left <= startPosition && right >= startPosition) {
                    if (startPosition < left) {
                        left = startPosition;
                    }
                    if (endPosition > right) {
                        right = endPosition;
                    }
                }
            }
            return eventsForSlot(elements, left, right);
        }
        function eventsForSlot(elements, left, right) {
            var events = [];
            for (var idx = 0; idx < elements.length; idx++) {
                var event = {
                    rectLeft: elements[idx].rectLeft,
                    rectRight: elements[idx].rectRight
                };
                if (event.rectLeft < left && event.rectRight > left || event.rectLeft >= left && event.rectRight <= right) {
                    events.push(elements[idx]);
                }
            }
            return events;
        }
        var TimelineView = SchedulerView.extend({
            init: function (element, options) {
                var that = this;
                SchedulerView.fn.init.call(that, element, options);
                that.title = that.options.title || that.options.name;
                that._workDays = getWorkDays(that.options);
                that._templates();
                that._editable();
                that.calculateDateRange();
                that._groups();
                that._currentTime();
            },
            name: 'timeline',
            _currentTimeMarkerUpdater: function () {
                var currentTime = new DATE();
                var options = this.options;
                this.datesHeader.find('.' + CURRENT_TIME_MARKER_CLASS).remove();
                this.content.find('.' + CURRENT_TIME_MARKER_CLASS).remove();
                if (!this._isInDateSlot({
                        start: currentTime,
                        end: currentTime
                    })) {
                    return;
                }
                if (options.currentTimeMarker.useLocalTimezone === false) {
                    var timezone = options.dataSource.options.schema.timezone;
                    if (options.dataSource && timezone) {
                        var timezoneOffset = kendo.timezone.offset(currentTime, timezone);
                        currentTime = kendo.timezone.convert(currentTime, currentTime.getTimezoneOffset(), timezoneOffset);
                    }
                }
                var groupsCount = !options.group || options.group.orientation == 'vertical' ? 1 : this.groups.length;
                for (var groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
                    var currentGroup = this.groups[groupIndex];
                    if (!currentGroup) {
                        return;
                    }
                    var utcCurrentTime = JalaliKendoDate.toUtcTime(currentTime);
                    var ranges = currentGroup.timeSlotRanges(utcCurrentTime, utcCurrentTime + 1);
                    if (ranges.length === 0) {
                        return;
                    }
                    var collection = ranges[0].collection;
                    var slotElement = collection.slotByStartDate(currentTime);
                    if (slotElement) {
                        var elementHtml = '<div class=\'' + CURRENT_TIME_MARKER_CLASS + '\'></div>';
                        var headerWrap = this.datesHeader.find('.' + SCHEDULER_HEADER_WRAP_CLASS);
                        var left = Math.round(ranges[0].innerRect(currentTime, new DATE(currentTime.getTime() + 1), false).left);
                        var timesTableMarker = $(elementHtml).prependTo(headerWrap).addClass(CURRENT_TIME_MARKER_ARROW_CLASS + '-down');
                        timesTableMarker.css({
                            left: this._adjustLeftPosition(left - timesTableMarker.outerWidth() * BORDER_SIZE_COEFF / 2),
                            top: headerWrap.find('tr:last').prev().position().top
                        });
                        $(elementHtml).prependTo(this.content).css({
                            left: this._adjustLeftPosition(left),
                            width: '1px',
                            bottom: '1px',
                            top: 0
                        });
                    }
                }
            },
            _adjustLeftPosition: function (left) {
                if (this._isRtl) {
                    left -= this.content[0].scrollWidth - this.content[0].offsetWidth;
                }
                return left;
            },
            _currentTime: function () {
                var that = this;
                var markerOptions = that.options.currentTimeMarker;
                if (markerOptions !== false && markerOptions.updateInterval !== undefined) {
                    var updateInterval = markerOptions.updateInterval;
                    that._currentTimeMarkerUpdater();
                    that._currentTimeUpdateTimer = setInterval(proxy(this._currentTimeMarkerUpdater, that), updateInterval);
                }
            },
            _editable: function () {
                if (this.options.editable) {
                    if (this._isMobile()) {
                        this._touchEditable();
                    } else {
                        this._mouseEditable();
                    }
                }
            },
            _mouseEditable: function () {
                var that = this;
                that.element.on('click' + NS, '.k-event a:has(.k-si-close)', function (e) {
                    that.trigger('remove', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                    e.preventDefault();
                });
                if (that.options.editable.create !== false) {
                    that.element.on('dblclick' + NS, '.k-scheduler-content td', function (e) {
                        var slot = that._slotByPosition(e.pageX, e.pageY);
                        if (slot) {
                            var resourceInfo = that._resourceBySlot(slot);
                            that.trigger('add', {
                                eventInfo: extend({
                                    start: slot.startDate(),
                                    end: slot.endDate()
                                }, resourceInfo)
                            });
                        }
                        e.preventDefault();
                    });
                }
                if (that.options.editable.update !== false) {
                    that.element.on('dblclick' + NS, '.k-event', function (e) {
                        that.trigger('edit', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                        e.preventDefault();
                    });
                }
            },
            _touchEditable: function () {
                var that = this;
                var threshold = 0;
                if (kendo.support.mobileOS.android) {
                    threshold = 5;
                }
                if (that.options.editable.create !== false) {
                    that._addUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-scheduler-content td',
                        tap: function (e) {
                            var x = e.x.location !== undefined ? e.x.location : e.x;
                            var y = e.y.location !== undefined ? e.y.location : e.y;
                            var slot = that._slotByPosition(x, y);
                            if (slot) {
                                var resourceInfo = that._resourceBySlot(slot);
                                that.trigger('add', {
                                    eventInfo: extend({
                                        start: slot.startDate(),
                                        end: slot.endDate()
                                    }, resourceInfo)
                                });
                            }
                            e.preventDefault();
                        }
                    });
                }
                if (that.options.editable.update !== false) {
                    that._editUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-event',
                        tap: function (e) {
                            var eventElement = $(e.target).closest('.k-event');
                            if (!eventElement.hasClass('k-event-active')) {
                                that.trigger('edit', { uid: eventElement.attr(kendo.attr('uid')) });
                            }
                            e.preventDefault();
                        }
                    });
                }
            },
            _slotByPosition: function (x, y) {
                var slot;
                var content = this.content;
                var offset = content.offset();
                var group;
                var groupIndex;
                x -= offset.left;
                y -= offset.top;
                if (this._isRtl) {
                    var browser = kendo.support.browser;
                    if (browser.mozilla) {
                        x += content[0].scrollWidth - content[0].offsetWidth;
                        x += content[0].scrollLeft;
                    } else if (browser.msie) {
                        x -= content.scrollLeft();
                        x += content[0].scrollWidth - content[0].offsetWidth;
                    } else if (browser.webkit) {
                        x += content[0].scrollLeft;
                    }
                } else {
                    x += content[0].scrollLeft;
                }
                y += content[0].scrollTop;
                x = Math.ceil(x);
                y = Math.ceil(y);
                for (groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    group = this.groups[groupIndex];
                    slot = group.timeSlotByPosition(x, y);
                    if (slot) {
                        return slot;
                    }
                }
                return null;
            },
            options: {
                name: 'TimelineView',
                title: 'Timeline',
                selectedDateFormat: '{0:D}',
                selectedShortDateFormat: '{0:d}',
                date: JalaliKendoDate.today(),
                startTime: JalaliKendoDate.today(),
                endTime: JalaliKendoDate.today(),
                showWorkHours: false,
                minorTickCount: 2,
                editable: true,
                workDayStart: new DATE(1980, 1, 1, 8, 0, 0),
                workDayEnd: new DATE(1980, 1, 1, 17, 0, 0),
                workWeekStart: 1,
                workWeekEnd: 5,
                majorTick: 60,
                eventHeight: 25,
                eventMinWidth: 0,
                columnWidth: 100,
                groupHeaderTemplate: '#=text#',
                majorTimeHeaderTemplate: '#=kendo.toString(date, \'t\')#',
                slotTemplate: '&nbsp;',
                eventTemplate: EVENT_TEMPLATE,
                dateHeaderTemplate: DATA_HEADER_TEMPLATE,
                footer: { command: 'workDay' },
                currentTimeMarker: {
                    updateInterval: 10000,
                    useLocalTimezone: true
                },
                messages: {
                    defaultRowText: 'All events',
                    showFullDay: 'Show full day',
                    showWorkDay: 'Show business hours'
                }
            },
            events: [
                'remove',
                'add',
                'edit'
            ],
            _templates: function () {
                var options = this.options, settings = extend({}, kendo.Template, options.templateSettings);
                this.eventTemplate = this._eventTmpl(options.eventTemplate, EVENT_WRAPPER_STRING);
                this.majorTimeHeaderTemplate = kendo.template(options.majorTimeHeaderTemplate, settings);
                this.dateHeaderTemplate = kendo.template(options.dateHeaderTemplate, settings);
                this.slotTemplate = kendo.template(options.slotTemplate, settings);
                this.groupHeaderTemplate = kendo.template(options.groupHeaderTemplate, settings);
            },
            _render: function (dates) {
                var that = this;
                dates = dates || [];
                that._dates = dates;
                that._startDate = dates[0];
                that._endDate = dates[dates.length - 1 || 0];
                that._calculateSlotRanges();
                that.createLayout(that._layout(dates));
                that._content(dates);
                that._footer();
                that._setContentWidth();
                that.refreshLayout();
                that.datesHeader.on('click' + NS, '.k-nav-day', function (e) {
                    var th = $(e.currentTarget).closest('th');
                    var slot = that._slotByPosition(th.offset().left, that.content.offset().top);
                    that.trigger('navigate', {
                        view: 'timeline',
                        date: slot.startDate()
                    });
                });
                that.timesHeader.find('table tr:last').hide();
                that.datesHeader.find('table tr:last').hide();
            },
            _setContentWidth: function () {
                var content = this.content;
                var contentWidth = content.width();
                var contentTable = this.content.find('table');
                var columnCount = contentTable.find('tr:first').children().length;
                var minWidth = 100;
                var calculatedWidth = columnCount * this.options.columnWidth;
                if (contentWidth < calculatedWidth) {
                    minWidth = Math.ceil(calculatedWidth / contentWidth * 100);
                }
                contentTable.add(this.datesHeader.find('table')).css('width', minWidth + '%');
            },
            _calculateSlotRanges: function () {
                var dates = this._dates;
                var slotStartTime = this.startTime();
                var slotEndTime = this.endTime();
                if (getMilliseconds(slotEndTime) === getMilliseconds(JalaliKendoDate.getDate(slotEndTime))) {
                    slotEndTime = JalaliKendoDate.getDate(slotEndTime);
                    setTime(slotEndTime, MS_PER_DAY - 1);
                }
                slotEndTime = getMilliseconds(slotEndTime);
                slotStartTime = getMilliseconds(slotStartTime);
                var slotRanges = [];
                for (var i = 0; i < dates.length; i++) {
                    var rangeStart = getDate(dates[i]);
                    setTime(rangeStart, slotStartTime);
                    var rangeEnd = getDate(dates[i]);
                    setTime(rangeEnd, slotEndTime);
                    slotRanges.push({
                        start: JalaliKendoDate.toUtcTime(rangeStart),
                        end: JalaliKendoDate.toUtcTime(rangeEnd)
                    });
                }
                this._slotRanges = slotRanges;
            },
            _forTimeRange: function (min, max, action, after) {
                min = toInvariantTime(min);
                max = toInvariantTime(max);
                var that = this, msMin = getMilliseconds(min), msMax = getMilliseconds(max), minorTickCount = that.options.minorTickCount, msMajorInterval = that.options.majorTick * MS_PER_MINUTE, msInterval = msMajorInterval / minorTickCount || 1, start = new DATE(+min), startDay = start.getDate(), msStart, idx = 0, length, html = '';
                length = MS_PER_DAY / msInterval;
                if (msMin != msMax) {
                    if (msMin > msMax) {
                        msMax += MS_PER_DAY;
                    }
                    length = (msMax - msMin) / msInterval;
                }
                length = Math.round(length);
                for (; idx < length; idx++) {
                    var majorTickDivider = idx % (msMajorInterval / msInterval);
                    var isMajorTickColumn = majorTickDivider === 0;
                    var isMiddleColumn = majorTickDivider < minorTickCount - 1;
                    var isLastSlotColumn = majorTickDivider === minorTickCount - 1;
                    var minorTickColumns = minorTickCount;
                    if (length % minorTickCount !== 0) {
                        var isLastMajorSlot = length - (idx + 1) < minorTickCount;
                        if (isMajorTickColumn && isLastMajorSlot) {
                            minorTickColumns = length % minorTickCount;
                        }
                    }
                    html += action(start, isMajorTickColumn, isMiddleColumn, isLastSlotColumn, minorTickColumns);
                    setTime(start, msInterval, false);
                }
                if (msMax) {
                    msStart = getMilliseconds(start);
                    if (startDay < start.getDate()) {
                        msStart += MS_PER_DAY;
                    }
                    if (msStart > msMax) {
                        start = new DATE(+max);
                    }
                }
                if (after) {
                    html += after(start);
                }
                return html;
            },
            _layout: function (dates) {
                var timeColumns = [];
                var columns = [];
                var that = this;
                var rows = [{ text: that.options.messages.defaultRowText }];
                var minorTickSlots = [];
                for (var minorTickIndex = 0; minorTickIndex < that.options.minorTickCount; minorTickIndex++) {
                    minorTickSlots.push({
                        text: '',
                        className: ''
                    });
                }
                this._forTimeRange(that.startTime(), that.endTime(), function (date, majorTick, middleColumn, lastSlotColumn, minorSlotsCount) {
                    var template = that.majorTimeHeaderTemplate;
                    if (majorTick) {
                        var timeColumn = {
                            text: template({ date: date }),
                            className: lastSlotColumn ? 'k-slot-cell' : '',
                            columns: minorTickSlots.slice(0, minorSlotsCount)
                        };
                        setColspan(timeColumn);
                        timeColumns.push(timeColumn);
                    }
                });
                for (var idx = 0; idx < dates.length; idx++) {
                    columns.push({
                        text: that.dateHeaderTemplate({ date: dates[idx] }),
                        className: 'k-slot-cell',
                        columns: timeColumns.slice(0)
                    });
                }
                var resources = this.groupedResources;
                if (resources.length) {
                    if (this._groupOrientation() === 'vertical') {
                        rows = that._createRowsLayout(resources, null, this.groupHeaderTemplate);
                    } else {
                        columns = that._createColumnsLayout(resources, columns, this.groupHeaderTemplate);
                    }
                }
                return {
                    columns: columns,
                    rows: rows
                };
            },
            _footer: function () {
                var options = this.options;
                if (options.footer !== false) {
                    var html = '<div class="k-header k-scheduler-footer">';
                    var command = options.footer.command;
                    if (command && command === 'workDay') {
                        html += '<ul class="k-reset k-header">';
                        html += '<li class="k-state-default k-scheduler-fullday"><a href="#" class="k-link"><span class="k-icon k-i-clock"></span>';
                        html += (options.showWorkHours ? options.messages.showFullDay : options.messages.showWorkDay) + '</a></li>';
                        html += '</ul>';
                    } else {
                        html += '&nbsp;';
                    }
                    html += '</div>';
                    this.footer = $(html).appendTo(this.element);
                    var that = this;
                    this.footer.on('click' + NS, '.k-scheduler-fullday', function (e) {
                        e.preventDefault();
                        that.trigger('navigate', {
                            view: that.name || options.name,
                            date: that.startDate(),
                            isWorkDay: !options.showWorkHours
                        });
                    });
                }
            },
            _columnCountForLevel: function (level) {
                var columnLevel = this.columnLevels[level];
                return columnLevel ? columnLevel.length : 0;
            },
            _rowCountForLevel: function (level) {
                var rowLevel = this.rowLevels[level];
                return rowLevel ? rowLevel.length : 0;
            },
            _isWorkDay: function (date) {
                var day = date.getDay();
                var workDays = this._workDays;
                for (var i = 0; i < workDays.length; i++) {
                    if (workDays[i] === day) {
                        return true;
                    }
                }
                return false;
            },
            _content: function (dates) {
                var that = this;
                var options = that.options;
                var start = that.startTime();
                var end = this.endTime();
                var groupsCount = 1;
                var rowCount = 1;
                var columnCount = dates.length;
                var html = '';
                var resources = this.groupedResources;
                var slotTemplate = this.slotTemplate;
                var isVerticalGrouped = false;
                if (resources.length) {
                    isVerticalGrouped = that._groupOrientation() === 'vertical';
                    if (isVerticalGrouped) {
                        rowCount = that._groupCount();
                    } else {
                        groupsCount = that._groupCount();
                    }
                }
                html += '<tbody>';
                var appendRow = function (date) {
                    var content = '';
                    var classes = '';
                    var tmplDate;
                    var resources = function (groupIndex) {
                        return function () {
                            return that._resourceBySlot({ groupIndex: groupIndex });
                        };
                    };
                    if (JalaliKendoDate.isToday(dates[idx])) {
                        classes += 'k-today';
                    }
                    if (JalaliKendoDate.getMilliseconds(date) < JalaliKendoDate.getMilliseconds(options.workDayStart) || JalaliKendoDate.getMilliseconds(date) >= JalaliKendoDate.getMilliseconds(options.workDayEnd) || !that._isWorkDay(dates[idx])) {
                        classes += ' k-nonwork-hour';
                    }
                    content += '<td' + (classes !== '' ? ' class="' + classes + '"' : '') + '>';
                    tmplDate = JalaliKendoDate.getDate(dates[idx]);
                    JalaliKendoDate.setTime(tmplDate, JalaliKendoDate.getMilliseconds(date));
                    content += slotTemplate({
                        date: tmplDate,
                        resources: resources(isVerticalGrouped ? rowIdx : groupIdx)
                    });
                    content += '</td>';
                    return content;
                };
                for (var rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                    html += '<tr>';
                    for (var groupIdx = 0; groupIdx < groupsCount; groupIdx++) {
                        for (var idx = 0, length = columnCount; idx < length; idx++) {
                            html += this._forTimeRange(start, end, appendRow);
                        }
                    }
                    html += '</tr>';
                }
                html += '</tbody>';
                this.content.find('table').append(html);
            },
            _groups: function () {
                var groupCount = this._groupCount();
                var dates = this._dates;
                var columnCount = dates.length;
                this.groups = [];
                for (var idx = 0; idx < groupCount; idx++) {
                    var view = this._addResourceView(idx);
                    var start = dates[0];
                    var end = dates[dates.length - 1 || 0];
                    view.addTimeSlotCollection(start, JalaliKendoDate.addDays(end, 1));
                }
                this._timeSlotGroups(groupCount, columnCount);
            },
            _isVerticallyGrouped: function () {
                return this.groupedResources.length && this._groupOrientation() === 'vertical';
            },
            _isHorizontallyGrouped: function () {
                return this.groupedResources.length && this._groupOrientation() === 'horizontal';
            },
            _timeSlotGroups: function (groupCount, datesCount) {
                var interval = this._timeSlotInterval();
                var isVerticallyGrouped = this._isVerticallyGrouped();
                var tableRows = this.content.find('tr');
                var rowCount = tableRows.length;
                tableRows.attr('role', 'row');
                if (isVerticallyGrouped) {
                    rowCount = Math.floor(rowCount / groupCount);
                }
                for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                    var rowMultiplier = 0;
                    var group = this.groups[groupIndex];
                    var time;
                    if (isVerticallyGrouped) {
                        rowMultiplier = groupIndex;
                    }
                    var rowIndex = rowMultiplier * rowCount;
                    var cellMultiplier = 0;
                    if (!isVerticallyGrouped) {
                        cellMultiplier = groupIndex;
                    }
                    var cells = tableRows[rowIndex].children;
                    var cellsPerGroup = cells.length / (!isVerticallyGrouped ? groupCount : 1);
                    var cellsPerDay = cellsPerGroup / datesCount;
                    for (var dateIndex = 0; dateIndex < datesCount; dateIndex++) {
                        var cellOffset = dateIndex * cellsPerDay + cellsPerGroup * cellMultiplier;
                        time = getMilliseconds(new DATE(+this.startTime()));
                        for (var cellIndex = 0; cellIndex < cellsPerDay; cellIndex++) {
                            var cell = cells[cellIndex + cellOffset];
                            var collection = group.getTimeSlotCollection(0);
                            var currentDate = this._dates[dateIndex];
                            var currentTime = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                            var start = currentTime + time;
                            var end = start + interval;
                            cell.setAttribute('role', 'gridcell');
                            cell.setAttribute('aria-selected', false);
                            collection.addTimeSlot(cell, start, end, true);
                            time += interval;
                        }
                    }
                }
            },
            startDate: function () {
                return this._startDate;
            },
            endDate: function () {
                return this._endDate;
            },
            startTime: function () {
                var options = this.options;
                return options.showWorkHours ? options.workDayStart : options.startTime;
            },
            endTime: function () {
                var options = this.options;
                return options.showWorkHours ? options.workDayEnd : options.endTime;
            },
            _timeSlotInterval: function () {
                var options = this.options;
                return options.majorTick / options.minorTickCount * MS_PER_MINUTE;
            },
            nextDate: function () {
                return JalaliKendoDate.nextDay(this.endDate());
            },
            previousDate: function () {
                return JalaliKendoDate.previousDay(this.startDate());
            },
            calculateDateRange: function () {
                this._render([this.options.date]);
            },
            render: function (events) {
                this._headerColumnCount = 0;
                this._groups();
                this.element.find('.k-event').remove();
                events = new kendo.data.Query(events).sort([
                    {
                        field: 'start',
                        dir: 'asc'
                    },
                    {
                        field: 'end',
                        dir: 'desc'
                    }
                ]).toArray();
                var eventsByResource = [];
                this._eventsByResource(events, this.groupedResources, eventsByResource);
                var eventGroups = [];
                var maxRowCount = 0;
                for (var groupIndex = 0; groupIndex < eventsByResource.length; groupIndex++) {
                    var eventGroup = {
                        groupIndex: groupIndex,
                        maxRowCount: 0,
                        events: {}
                    };
                    eventGroups.push(eventGroup);
                    this._renderEvents(eventsByResource[groupIndex], groupIndex, eventGroup);
                    if (maxRowCount < eventGroup.maxRowCount) {
                        maxRowCount = eventGroup.maxRowCount;
                    }
                }
                this._setRowsHeight(eventGroups, eventsByResource.length, maxRowCount);
                this._positionEvents(eventGroups, eventsByResource.length);
                this.trigger('activate');
            },
            _positionEvents: function (eventGroups, groupsCount) {
                for (var groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
                    var eventsForGroup = eventGroups[groupIndex].events;
                    for (var eventUid in eventsForGroup) {
                        var eventObject = eventsForGroup[eventUid];
                        this._positionEvent(eventObject);
                    }
                }
            },
            _setRowsHeight: function (eventGroups, groupsCount, maxRowCount) {
                var eventHeight = this.options.eventHeight + 2;
                var eventBottomOffset = this._getBottomRowOffset();
                groupsCount = this._isVerticallyGrouped() ? groupsCount : 1;
                for (var groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
                    var rowsCount = this._isVerticallyGrouped() ? eventGroups[groupIndex].maxRowCount : maxRowCount;
                    rowsCount = rowsCount ? rowsCount : 1;
                    var rowHeight = (eventHeight + 2) * rowsCount + eventBottomOffset;
                    var timesRow = $(this.times.find('tr')[groupIndex]);
                    var row = $(this.content.find('tr')[groupIndex]);
                    timesRow.height(rowHeight);
                    row.height(rowHeight);
                }
                this._setContentWidth();
                this.refreshLayout();
                this._refreshSlots();
            },
            _getBottomRowOffset: function () {
                var eventBottomOffset = this.options.eventHeight * 0.5;
                var isMobile = this._isMobile();
                var minOffset;
                var maxOffset;
                if (isMobile) {
                    minOffset = 30;
                    maxOffset = 60;
                } else {
                    minOffset = 15;
                    maxOffset = 30;
                }
                if (eventBottomOffset > maxOffset) {
                    eventBottomOffset = maxOffset;
                } else if (eventBottomOffset < minOffset) {
                    eventBottomOffset = minOffset;
                }
                return eventBottomOffset;
            },
            _positionEvent: function (eventObject) {
                var eventHeight = this.options.eventHeight + 2;
                var rect = eventObject.slotRange.innerRect(eventObject.start, eventObject.end, false);
                var left = this._adjustLeftPosition(rect.left);
                var width = rect.right - rect.left - 2;
                if (width < 0) {
                    width = 0;
                }
                if (width < this.options.eventMinWidth) {
                    var slotsCollection = eventObject.slotRange.collection;
                    var lastSlot = slotsCollection._slots[slotsCollection._slots.length - 1];
                    var offsetRight = lastSlot.offsetLeft + lastSlot.offsetWidth;
                    width = this.options.eventMinWidth;
                    if (offsetRight < left + width) {
                        width = offsetRight - rect.left - 2;
                    }
                }
                eventObject.element.css({
                    top: eventObject.slotRange.start.offsetTop + eventObject.rowIndex * (eventHeight + 2) + 'px',
                    left: left,
                    width: width
                });
            },
            _refreshSlots: function () {
                for (var groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    this.groups[groupIndex].refresh();
                }
            },
            _eventsByResource: function (events, resources, result) {
                var resource = resources[0];
                if (resource) {
                    var view = resource.dataSource.view();
                    for (var itemIdx = 0; itemIdx < view.length; itemIdx++) {
                        var value = this._resourceValue(resource, view[itemIdx]);
                        var eventsFilteredByResource = new kendo.data.Query(events).filter({
                            field: resource.field,
                            operator: SchedulerView.groupEqFilter(value)
                        }).toArray();
                        if (resources.length > 1) {
                            this._eventsByResource(eventsFilteredByResource, resources.slice(1), result);
                        } else {
                            result.push(eventsFilteredByResource);
                        }
                    }
                } else {
                    result.push(events);
                }
            },
            _isInDateSlot: function (event) {
                var startTime = event.start;
                var endTime = event.end;
                var rangeStart = getDate(this._startDate);
                var rangeEnd = JalaliKendoDate.addDays(getDate(this._endDate), 1);
                if (startTime < rangeEnd && rangeStart <= endTime) {
                    return true;
                }
                return false;
            },
            _isInTimeSlot: function (event) {
                var startTime = event._startTime || JalaliKendoDate.toUtcTime(event.start);
                var endTime = event._endTime || JalaliKendoDate.toUtcTime(event.end);
                var slotRanges = this._slotRanges;
                if (startTime === endTime) {
                    endTime = endTime + 1;
                }
                for (var slotIndex = 0; slotIndex < slotRanges.length; slotIndex++) {
                    if (startTime < slotRanges[slotIndex].end && slotRanges[slotIndex].start < endTime) {
                        return true;
                    }
                }
                return false;
            },
            _adjustEvent: function (event) {
                var start = event.start;
                var end = event.end;
                var eventStartTime = event._time('start');
                var eventEndTime = event._time('end');
                var startTime = getMilliseconds(this.startTime());
                var endTime = getMilliseconds(this.endTime());
                var adjustedStartDate = null;
                var adjustedEndDate = null;
                var occurrence;
                var head = false;
                var tail = false;
                if (event.isAllDay) {
                    adjustedStartDate = getDate(start);
                    if (startTime > eventStartTime) {
                        setTime(adjustedStartDate, startTime);
                        tail = true;
                    }
                    adjustedEndDate = getDate(end);
                    if (endTime === getMilliseconds(getDate(this.endTime()))) {
                        adjustedEndDate = JalaliKendoDate.addDays(adjustedEndDate, 1);
                    } else {
                        setTime(adjustedEndDate, endTime);
                        head = true;
                    }
                } else {
                    endTime = endTime === 0 ? MS_PER_DAY : endTime;
                    if (startTime > eventStartTime) {
                        adjustedStartDate = getDate(start);
                        setTime(adjustedStartDate, startTime);
                        tail = true;
                    } else if (endTime < eventStartTime) {
                        adjustedStartDate = getDate(start);
                        adjustedStartDate = JalaliKendoDate.addDays(adjustedStartDate, 1);
                        setTime(adjustedStartDate, startTime);
                        tail = true;
                    }
                    if (endTime < eventEndTime) {
                        adjustedEndDate = getDate(end);
                        setTime(adjustedEndDate, endTime);
                        head = true;
                    } else if (startTime > eventEndTime) {
                        adjustedEndDate = getDate(end);
                        adjustedEndDate = JalaliKendoDate.addDays(adjustedEndDate, -1);
                        setTime(adjustedEndDate, endTime);
                        head = true;
                    }
                }
                occurrence = event.clone({
                    start: adjustedStartDate ? adjustedStartDate : start,
                    end: adjustedEndDate ? adjustedEndDate : end,
                    _startTime: adjustedStartDate ? JalaliKendoDate.toUtcTime(adjustedStartDate) : event._startTime,
                    _endTime: adjustedEndDate ? JalaliKendoDate.toUtcTime(adjustedEndDate) : event._endTime,
                    isAllDay: false
                });
                return {
                    occurrence: occurrence,
                    head: head,
                    tail: tail
                };
            },
            _renderEvents: function (events, groupIndex, eventGroup) {
                var event;
                var idx;
                var length;
                for (idx = 0, length = events.length; idx < length; idx++) {
                    event = events[idx];
                    if (this._isInDateSlot(event)) {
                        var isMultiDayEvent = event.isAllDay || event.end.getTime() - event.start.getTime() >= MS_PER_DAY;
                        var container = this.content;
                        if (isMultiDayEvent || this._isInTimeSlot(event)) {
                            var adjustedEvent = this._adjustEvent(event);
                            var group = this.groups[groupIndex];
                            if (!group._continuousEvents) {
                                group._continuousEvents = [];
                            }
                            var ranges = group.slotRanges(adjustedEvent.occurrence, false);
                            var range = ranges[0];
                            var element;
                            if (this._isInTimeSlot(adjustedEvent.occurrence)) {
                                element = this._createEventElement(adjustedEvent.occurrence, event, range.head || adjustedEvent.head, range.tail || adjustedEvent.tail);
                                element.appendTo(container).css({
                                    top: 0,
                                    height: this.options.eventHeight
                                });
                                var eventObject = {
                                    start: adjustedEvent.occurrence._startTime || adjustedEvent.occurrence.start,
                                    end: adjustedEvent.occurrence._endTime || adjustedEvent.occurrence.end,
                                    element: element,
                                    uid: event.uid,
                                    slotRange: range,
                                    rowIndex: 0,
                                    offsetTop: 0
                                };
                                eventGroup.events[event.uid] = eventObject;
                                this.addContinuousEvent(group, range, element, event.isAllDay);
                                this._arrangeRows(eventObject, range, eventGroup);
                            }
                        }
                    }
                }
            },
            addContinuousEvent: function (group, range, element, isAllDay) {
                var events = group._continuousEvents;
                events.push({
                    element: element,
                    isAllDay: isAllDay,
                    uid: element.attr(kendo.attr('uid')),
                    start: range.start,
                    end: range.end
                });
            },
            _createEventElement: function (occurrence, event, head, tail) {
                var template = this.eventTemplate;
                var editable = this.options.editable;
                var isMobile = this._isMobile();
                var showDelete = editable && editable.destroy !== false && !isMobile;
                var resizable = editable && editable.resize !== false;
                var eventStartTime = event._time('start');
                var eventEndTime = event._time('end');
                var eventStartDate = event.start;
                var eventEndDate = event.end;
                var resources = this.eventResources(event);
                if (event._startTime && eventStartTime !== JalaliKendoDate.getMilliseconds(event.start)) {
                    eventStartDate = new DATE(eventStartTime);
                    eventStartDate = kendo.timezone.apply(eventStartDate, 'Etc/UTC');
                }
                if (event._endTime && eventEndTime !== JalaliKendoDate.getMilliseconds(event.end)) {
                    eventEndDate = new DATE(eventEndTime);
                    eventEndDate = kendo.timezone.apply(eventEndDate, 'Etc/UTC');
                }
                var data = extend({}, {
                    ns: kendo.ns,
                    resizable: resizable,
                    showDelete: showDelete,
                    head: head,
                    tail: tail,
                    singleDay: this._dates.length == 1,
                    resources: resources,
                    inverseColor: resources && resources[0] ? this._shouldInverseResourceColor(resources[0]) : false
                }, event, {
                    start: eventStartDate,
                    end: eventEndDate
                });
                var element = $(template(data));
                this.angular('compile', function () {
                    return {
                        elements: element,
                        data: [{ dataItem: data }]
                    };
                });
                return element;
            },
            _arrangeRows: function (eventObject, slotRange, eventGroup) {
                var startIndex = slotRange.start.index;
                var endIndex = slotRange.end.index;
                var rect = eventObject.slotRange.innerRect(eventObject.start, eventObject.end, false);
                var rectRight = rect.right + this.options.eventMinWidth;
                var events = collidingEvents(slotRange.events(), rect.left, rectRight);
                slotRange.addEvent({
                    slotIndex: startIndex,
                    start: startIndex,
                    end: endIndex,
                    rectLeft: rect.left,
                    rectRight: rectRight,
                    element: eventObject.element,
                    uid: eventObject.uid
                });
                events.push({
                    start: startIndex,
                    end: endIndex,
                    uid: eventObject.uid
                });
                var rows = SchedulerView.createRows(events);
                if (eventGroup.maxRowCount < rows.length) {
                    eventGroup.maxRowCount = rows.length;
                }
                for (var idx = 0, length = rows.length; idx < length; idx++) {
                    var rowEvents = rows[idx].events;
                    for (var j = 0, eventLength = rowEvents.length; j < eventLength; j++) {
                        eventGroup.events[rowEvents[j].uid].rowIndex = idx;
                    }
                }
            },
            _groupCount: function () {
                var resources = this.groupedResources;
                if (resources.length) {
                    if (this._groupOrientation() === 'vertical') {
                        return this._rowCountForLevel(resources.length - 1);
                    } else {
                        return this._columnCountForLevel(resources.length - 1);
                    }
                }
                return 1;
            },
            _updateEventForSelection: function (event) {
                var adjustedEvent = this._adjustEvent(event.clone());
                return adjustedEvent.occurrence;
            },
            _eventOptionsForMove: function (event) {
                if (event.isAllDay) {
                    return { isAllDay: false };
                }
                return {};
            },
            _updateEventForResize: function (event) {
                if (event.isAllDay) {
                    event.set('isAllDay', false);
                }
            },
            _updateMoveHint: function (event, groupIndex, distance) {
                var group = this.groups[groupIndex];
                var clonedEvent = event.clone({
                    start: event.start,
                    end: event.end
                });
                var eventDuraton = clonedEvent.duration();
                clonedEvent.start = new DATE(clonedEvent.start.getTime() + distance);
                clonedEvent.end = new DATE(+clonedEvent.start + eventDuraton);
                var adjustedEvent = this._adjustEvent(clonedEvent);
                var ranges = group.slotRanges(adjustedEvent.occurrence, false);
                this._removeMoveHint();
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var startSlot = range.start;
                    var hint = this._createEventElement(adjustedEvent.occurrence, adjustedEvent.occurrence, false, false);
                    hint.addClass('k-event-drag-hint');
                    var rect = range.innerRect(adjustedEvent.occurrence.start, adjustedEvent.occurrence.end, this.options.snap);
                    var width = rect.right - rect.left - 2;
                    if (width < 0) {
                        width = 0;
                    }
                    var left = this._adjustLeftPosition(rect.left);
                    var css = {
                        left: left,
                        top: startSlot.offsetTop,
                        height: startSlot.offsetHeight - 2,
                        width: width
                    };
                    hint.css(css);
                    this._moveHint = this._moveHint.add(hint);
                }
                var content = this.content;
                this._moveHint.appendTo(content);
            },
            _updateResizeHint: function (event, groupIndex, startTime, endTime) {
                var group = this.groups[groupIndex];
                var ranges = group.ranges(startTime, endTime, false, false);
                this._removeResizeHint();
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var start = range.startSlot();
                    var startRect = range.innerRect(startTime, endTime, false);
                    startRect.top = start.offsetTop;
                    var width = startRect.right - startRect.left;
                    var height = start.offsetHeight;
                    var left = this._adjustLeftPosition(startRect.left);
                    var hint = SchedulerView.fn._createResizeHint.call(this, left, startRect.top, width, height);
                    this._resizeHint = this._resizeHint.add(hint);
                }
                var format = 't';
                var container = this.content;
                this._resizeHint.appendTo(container);
                this._resizeHint.find('.k-label-top,.k-label-bottom').text('');
                this._resizeHint.first().addClass('k-first').find('.k-label-top').text(kendo.toString(kendo.timezone.toLocalDate(startTime), format));
                this._resizeHint.last().addClass('k-last').find('.k-label-bottom').text(kendo.toString(kendo.timezone.toLocalDate(endTime), format));
            },
            selectionByElement: function (cell) {
                var offset = cell.offset();
                return this._slotByPosition(offset.left, offset.top);
            },
            _updateDirection: function (selection, ranges, multiple, reverse, vertical) {
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                if (multiple && !vertical) {
                    if (startSlot.index === endSlot.index && startSlot.collectionIndex === endSlot.collectionIndex) {
                        selection.backward = reverse;
                    }
                }
            },
            _changeGroup: function (selection, previous) {
                var method = previous ? 'prevGroupSlot' : 'nextGroupSlot';
                var slot = this[method](selection.start, selection.groupIndex, false);
                if (slot) {
                    selection.groupIndex += previous ? -1 : 1;
                }
                return slot;
            },
            prevGroupSlot: function (date, groupIndex, isDay) {
                var group = this.groups[groupIndex];
                var slot = group.ranges(date, date, isDay, false)[0].start;
                if (groupIndex <= 0) {
                    return;
                }
                if (this._isVerticallyGrouped()) {
                    return slot;
                } else {
                    var collection = group._collection(0, isDay);
                    return collection.last();
                }
            },
            nextGroupSlot: function (date, groupIndex, isDay) {
                var group = this.groups[groupIndex];
                var slot = group.ranges(date, date, isDay, false)[0].start;
                if (groupIndex >= this.groups.length - 1) {
                    return;
                }
                if (this._isVerticallyGrouped()) {
                    return slot;
                } else {
                    var collection = group._collection(0, isDay);
                    return collection.first();
                }
            },
            _verticalSlots: function (selection, ranges, multiple, reverse) {
                var method = reverse ? 'leftSlot' : 'rightSlot';
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                var group = this.groups[selection.groupIndex];
                startSlot = group[method](startSlot);
                endSlot = group[method](endSlot);
                if (!multiple && this._isVerticallyGrouped() && (!startSlot || !endSlot)) {
                    startSlot = endSlot = this._changeGroup(selection, reverse);
                }
                return {
                    startSlot: startSlot,
                    endSlot: endSlot
                };
            },
            _horizontalSlots: function (selection, ranges, multiple, reverse) {
                var method = reverse ? 'upSlot' : 'downSlot';
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                var group = this.groups[selection.groupIndex];
                startSlot = group[method](startSlot);
                endSlot = group[method](endSlot);
                if (!multiple && this._isHorizontallyGrouped() && (!startSlot || !endSlot)) {
                    startSlot = endSlot = this._changeGroup(selection, reverse);
                }
                return {
                    startSlot: startSlot,
                    endSlot: endSlot
                };
            },
            _changeViewPeriod: function (selection, reverse) {
                var date = reverse ? this.previousDate() : this.nextDate();
                var start = selection.start;
                var end = selection.end;
                selection.start = new DATE(date);
                selection.end = new DATE(date);
                if (this._isHorizontallyGrouped()) {
                    selection.groupIndex = reverse ? this.groups.length - 1 : 0;
                }
                var duration = end - start;
                if (reverse) {
                    end = getMilliseconds(this.endTime());
                    end = end === 0 ? MS_PER_DAY : end;
                    setTime(selection.start, end - duration);
                    setTime(selection.end, end);
                } else {
                    start = getMilliseconds(this.startTime());
                    setTime(selection.start, start);
                    setTime(selection.end, start + duration);
                }
                selection.events = [];
                return true;
            },
            move: function (selection, key, shift) {
                var handled = false;
                var group = this.groups[selection.groupIndex];
                var keys = kendo.keys;
                var ranges = group.ranges(selection.start, selection.end, false, false);
                var startSlot, endSlot, reverse, slots;
                if (key === keys.DOWN || key === keys.UP) {
                    handled = true;
                    reverse = key === keys.UP;
                    this._updateDirection(selection, ranges, shift, reverse, true);
                    slots = this._verticalSlots(selection, ranges, shift, reverse);
                } else if (key === keys.LEFT || key === keys.RIGHT) {
                    handled = true;
                    reverse = key === keys.LEFT;
                    this._updateDirection(selection, ranges, shift, reverse, false);
                    slots = this._horizontalSlots(selection, ranges, shift, reverse);
                    if ((!slots.startSlot || !slots.endSlot) && !shift && this._changeViewPeriod(selection, reverse, false)) {
                        return handled;
                    }
                }
                if (handled) {
                    startSlot = slots.startSlot;
                    endSlot = slots.endSlot;
                    if (shift) {
                        var backward = selection.backward;
                        if (backward && startSlot) {
                            selection.start = startSlot.startDate();
                        } else if (!backward && endSlot) {
                            selection.end = endSlot.endDate();
                        }
                    } else if (startSlot && endSlot) {
                        selection.start = startSlot.startDate();
                        selection.end = endSlot.endDate();
                    }
                    selection.events = [];
                }
                return handled;
            },
            destroy: function () {
                var that = this;
                if (that.element) {
                    that.element.off(NS);
                }
                if (that.footer) {
                    that.footer.remove();
                }
                if (that._currentTimeUpdateTimer) {
                    clearInterval(that._currentTimeUpdateTimer);
                }
                SchedulerView.fn.destroy.call(this);
                if (this._isMobile() && that.options.editable) {
                    if (that.options.editable.create !== false) {
                        that._addUserEvents.destroy();
                    }
                    if (that.options.editable.update !== false) {
                        that._editUserEvents.destroy();
                    }
                }
            }
        });
        extend(true, ui, {
            TimelineView: TimelineView,
            TimelineWeekView: TimelineView.extend({
                options: {
                    name: 'TimelineWeekView',
                    title: 'Timeline Week',
                    selectedDateFormat: '{0:D} - {1:D}',
                    selectedShortDateFormat: '{0:d} - {1:d}',
                    majorTick: 120
                },
                name: 'timelineWeek',
                calculateDateRange: function () {
                    var selectedDate = this.options.date, start = JalaliKendoDate.dayOfWeek(selectedDate, this.calendarInfo().firstDay, -1), idx, length, dates = [];
                    for (idx = 0, length = 7; idx < length; idx++) {
                        dates.push(start);
                        start = JalaliKendoDate.nextDay(start);
                    }
                    this._render(dates);
                }
            }),
            TimelineWorkWeekView: TimelineView.extend({
                options: {
                    name: 'TimelineWorkWeekView',
                    title: 'Timeline Work Week',
                    selectedDateFormat: '{0:D} - {1:D}',
                    selectedShortDateFormat: '{0:d} - {1:d}',
                    majorTick: 120
                },
                name: 'timelineWorkWeek',
                nextDate: function () {
                    return JalaliKendoDate.dayOfWeek(JalaliKendoDate.nextDay(this.endDate()), this.options.workWeekStart, 1);
                },
                previousDate: function () {
                    return JalaliKendoDate.previousDay(this.startDate());
                },
                calculateDateRange: function () {
                    var selectedDate = this.options.date, start = JalaliKendoDate.dayOfWeek(selectedDate, this.options.workWeekStart, -1), end = JalaliKendoDate.dayOfWeek(start, this.options.workWeekEnd, 1), dates = [];
                    while (start <= end) {
                        dates.push(start);
                        start = JalaliKendoDate.nextDay(start);
                    }
                    this._render(dates);
                }
            }),
            TimelineMonthView: TimelineView.extend({
                options: {
                    name: 'TimelineMonthView',
                    title: 'Timeline Month',
                    selectedDateFormat: '{0:D} - {1:D}',
                    selectedShortDateFormat: '{0:d} - {1:d}',
                    workDayStart: new DATE(1980, 1, 1, 0, 0, 0),
                    workDayEnd: new DATE(1980, 1, 1, 23, 59, 59),
                    footer: false,
                    majorTick: 1440,
                    minorTickCount: 1
                },
                name: 'timelineMonth',
                calculateDateRange: function () {
                    var selectedDate = this.options.date, start = JalaliKendoDate.firstDayOfMonth(selectedDate), end = JalaliKendoDate.lastDayOfMonth(selectedDate), idx, length, dates = [];
                    for (idx = 0, length = end.getDate(); idx < length; idx++) {
                        dates.push(start);
                        start = JalaliKendoDate.nextDay(start);
                    }
                    this._render(dates);
                }
            })
        });
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));




/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.monthview', ['kendo.scheduler.view'], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.monthview',
        name: 'Scheduler Month View',
        category: 'web',
        description: 'The Scheduler Month View',
        depends: ['scheduler.view'],
        hidden: true
    };
    (function ($) {
        var kendo = window.kendo, ui = kendo.ui, DATE = JalaliDate, SchedulerView = ui.SchedulerView, NS = '.kendoMonthView', extend = $.extend, getDate = JalaliKendoDate.getDate, MS_PER_DAY = JalaliKendoDate.MS_PER_DAY, NUMBER_OF_ROWS = 6, NUMBER_OF_COLUMNS = 7, DAY_TEMPLATE = kendo.template('<span class="k-link k-nav-day">#:kendo.toString(date, "dd")#</span>'), EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" data-#=ns#uid="#=uid#"' + '#if (resources[0]) { #' + 'style="background-color:#=resources[0].color #; border-color: #=resources[0].color#"' + 'class="k-event#=inverseColor ? " k-event-inverse" : ""#"' + '#} else {#' + 'class="k-event"' + '#}#' + '>' + '<span class="k-event-actions">' + '# if(data.tail || data.middle) {#' + '<span class="k-icon k-i-arrow-w"></span>' + '#}#' + '# if(data.isException()) {#' + '<span class="k-icon k-i-exception"></span>' + '# } else if(data.isRecurring()) {#' + '<span class="k-icon k-i-refresh"></span>' + '#}#' + '</span>' + '{0}' + '<span class="k-event-actions">' + '#if (showDelete) {#' + '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' + '#}#' + '# if(data.head || data.middle) {#' + '<span class="k-icon k-i-arrow-e"></span>' + '#}#' + '</span>' + '# if(resizable && !data.tail && !data.middle) {#' + '<span class="k-resize-handle k-resize-w"></span>' + '#}#' + '# if(resizable && !data.head && !data.middle) {#' + '<span class="k-resize-handle k-resize-e"></span>' + '#}#' + '</div>', EVENT_TEMPLATE = kendo.template('<div title="#=title.replace(/"/g,"&\\#34;")#">' + '<div class="k-event-template">#:title#</div>' + '</div>');
        var MORE_BUTTON_TEMPLATE = kendo.template('<div style="width:#=width#px;left:#=left#px;top:#=top#px" class="k-more-events k-button"><span>...</span></div>');
        ui.MonthView = SchedulerView.extend({
            init: function (element, options) {
                var that = this;
                SchedulerView.fn.init.call(that, element, options);
                that.title = that.options.title;
                that._templates();
                that._editable();
                that._renderLayout(that.options.date);
                that._groups();
            },
            name: 'month',
            _updateDirection: function (selection, ranges, multiple, reverse, vertical) {
                if (multiple) {
                    var startSlot = ranges[0].start;
                    var endSlot = ranges[ranges.length - 1].end;
                    var isSameSlot = startSlot.index === endSlot.index;
                    var isSameCollection = startSlot.collectionIndex === endSlot.collectionIndex;
                    var updateDirection;
                    if (vertical) {
                        updateDirection = isSameSlot && isSameCollection || isSameCollection;
                    } else {
                        updateDirection = isSameSlot && isSameCollection;
                    }
                    if (updateDirection) {
                        selection.backward = reverse;
                    }
                }
            },
            _changeViewPeriod: function (selection, reverse, vertical) {
                var pad = vertical ? 7 : 1;
                if (reverse) {
                    pad *= -1;
                }
                selection.start = JalaliKendoDate.addDays(selection.start, pad);
                selection.end = JalaliKendoDate.addDays(selection.end, pad);
                if (!vertical || vertical && this._isVerticallyGrouped()) {
                    selection.groupIndex = reverse ? this.groups.length - 1 : 0;
                }
                selection.events = [];
                return true;
            },
            _continuousSlot: function (selection, ranges, reverse) {
                var index = selection.backward ? 0 : ranges.length - 1;
                var group = this.groups[selection.groupIndex];
                return group.continuousSlot(ranges[index].start, reverse);
            },
            _changeGroupContinuously: function (selection, continuousSlot, multiple, reverse) {
                if (!multiple) {
                    var groupIndex = selection.groupIndex;
                    var lastGroupIndex = this.groups.length - 1;
                    var vertical = this._isVerticallyGrouped();
                    var group = this.groups[groupIndex];
                    if (!continuousSlot && vertical) {
                        continuousSlot = group[reverse ? 'lastSlot' : 'firstSlot']();
                        groupIndex += reverse ? -1 : 1;
                    } else if (continuousSlot && !vertical) {
                        groupIndex = reverse ? lastGroupIndex : 0;
                    }
                    if (groupIndex < 0 || groupIndex > lastGroupIndex) {
                        groupIndex = reverse ? lastGroupIndex : 0;
                        continuousSlot = null;
                    }
                    selection.groupIndex = groupIndex;
                }
                return continuousSlot;
            },
            _normalizeHorizontalSelection: function (selection, ranges, reverse) {
                var slot;
                if (reverse) {
                    slot = ranges[0].start;
                } else {
                    slot = ranges[ranges.length - 1].end;
                }
                return slot;
            },
            _normalizeVerticalSelection: function (selection, ranges) {
                var slot;
                if (selection.backward) {
                    slot = ranges[0].start;
                } else {
                    slot = ranges[ranges.length - 1].end;
                }
                return slot;
            },
            _templates: function () {
                var options = this.options, settings = extend({}, kendo.Template, options.templateSettings);
                this.eventTemplate = this._eventTmpl(options.eventTemplate, EVENT_WRAPPER_STRING);
                this.dayTemplate = kendo.template(options.dayTemplate, settings);
                this.groupHeaderTemplate = kendo.template(options.groupHeaderTemplate, settings);
            },
            dateForTitle: function () {
                return kendo.format(this.options.selectedDateFormat, this._firstDayOfMonth, this._lastDayOfMonth);
            },
            shortDateForTitle: function () {
                return kendo.format(this.options.selectedShortDateFormat, this._firstDayOfMonth, this._lastDayOfMonth);
            },
            nextDate: function () {
                return JalaliKendoDate.nextDay(this._lastDayOfMonth);
            },
            previousDate: function () {
                return JalaliKendoDate.previousDay(this._firstDayOfMonth);
            },
            startDate: function () {
                return this._startDate;
            },
            endDate: function () {
                return this._endDate;
            },
            _renderLayout: function (date) {
                var that = this;
                this._firstDayOfMonth = JalaliKendoDate.firstDayOfMonth(date);
                this._lastDayOfMonth = JalaliKendoDate.lastDayOfMonth(date);
                this._startDate = firstVisibleMonthDay(date, this.calendarInfo());
                this.createLayout(this._layout());
                this._content();
                this.refreshLayout();
                this.content.on('click' + NS, '.k-nav-day,.k-more-events', function (e) {
                    var offset = $(e.currentTarget).offset();
                    var slot = that._slotByPosition(offset.left, offset.top);
                    e.preventDefault();
                    that.trigger('navigate', {
                        view: 'day',
                        date: slot.startDate()
                    });
                });
            },
            _editable: function () {
                if (this.options.editable && !this._isMobilePhoneView()) {
                    if (this._isMobile()) {
                        this._touchEditable();
                    } else {
                        this._mouseEditable();
                    }
                }
            },
            _mouseEditable: function () {
                var that = this;
                that.element.on('click' + NS, '.k-scheduler-monthview .k-event a:has(.k-si-close)', function (e) {
                    that.trigger('remove', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                    e.preventDefault();
                });
                if (that.options.editable.create !== false) {
                    that.element.on('dblclick' + NS, '.k-scheduler-monthview .k-scheduler-content td', function (e) {
                        var offset = $(e.currentTarget).offset();
                        var slot = that._slotByPosition(offset.left, offset.top);
                        if (slot) {
                            var resourceInfo = that._resourceBySlot(slot);
                            that.trigger('add', {
                                eventInfo: extend({
                                    isAllDay: true,
                                    start: slot.startDate(),
                                    end: slot.startDate()
                                }, resourceInfo)
                            });
                        }
                        e.preventDefault();
                    });
                }
                if (that.options.editable.update !== false) {
                    that.element.on('dblclick' + NS, '.k-scheduler-monthview .k-event', function (e) {
                        that.trigger('edit', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                        e.preventDefault();
                    });
                }
            },
            _touchEditable: function () {
                var that = this;
                var threshold = 0;
                if (kendo.support.mobileOS.android) {
                    threshold = 5;
                }
                if (that.options.editable.create !== false) {
                    that._addUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-scheduler-monthview .k-scheduler-content td',
                        tap: function (e) {
                            var offset = $(e.target).offset();
                            var slot = that._slotByPosition(offset.left, offset.top);
                            if (slot) {
                                var resourceInfo = that._resourceBySlot(slot);
                                that.trigger('add', {
                                    eventInfo: extend({
                                        isAllDay: true,
                                        start: slot.startDate(),
                                        end: slot.startDate()
                                    }, resourceInfo)
                                });
                            }
                            e.preventDefault();
                        }
                    });
                }
                if (that.options.editable.update !== false) {
                    that._editUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-scheduler-monthview .k-event',
                        tap: function (e) {
                            if ($(e.event.target).closest('a:has(.k-si-close)').length === 0) {
                                that.trigger('edit', { uid: $(e.target).closest('.k-event').attr(kendo.attr('uid')) });
                                e.preventDefault();
                            }
                        }
                    });
                }
            },
            selectionByElement: function (cell) {
                var offset = $(cell).offset();
                return this._slotByPosition(offset.left, offset.top);
            },
            _columnCountForLevel: function (level) {
                var columnLevel = this.columnLevels[level];
                return columnLevel ? columnLevel.length : 0;
            },
            _rowCountForLevel: function (level) {
                var rowLevel = this.rowLevels[level];
                return rowLevel ? rowLevel.length : 0;
            },
            _content: function () {
                var html = '<tbody>';
                var verticalGroupCount = 1;
                var resources = this.groupedResources;
                if (resources.length) {
                    if (this._isVerticallyGrouped()) {
                        verticalGroupCount = this._rowCountForLevel(resources.length - 1);
                    }
                }
                for (var verticalGroupIdx = 0; verticalGroupIdx < verticalGroupCount; verticalGroupIdx++) {
                    html += this._createCalendar(verticalGroupIdx);
                }
                html += '</tbody>';
                this.content.find('table').html(html);
            },
            _createCalendar: function (verticalGroupIndex) {
                var start = this.startDate();
                var cellCount = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;
                var cellsPerRow = NUMBER_OF_COLUMNS;
                var weekStartDates = [start];
                var html = '';
                var horizontalGroupCount = 1;
                var isVerticallyGrouped = this._isVerticallyGrouped();
                var resources = this.groupedResources;
                if (resources.length) {
                    if (!isVerticallyGrouped) {
                        horizontalGroupCount = this._columnCountForLevel(resources.length - 1);
                    }
                }
                this._slotIndices = {};
                for (var rowIdx = 0, length = cellCount / cellsPerRow; rowIdx < length; rowIdx++) {
                    html += '<tr>';
                    weekStartDates.push(start);
                    var startIdx = rowIdx * cellsPerRow;
                    for (var groupIdx = 0; groupIdx < horizontalGroupCount; groupIdx++) {
                        html += this._createRow(start, startIdx, cellsPerRow, isVerticallyGrouped ? verticalGroupIndex : groupIdx);
                    }
                    for (var w = 0; w < cellsPerRow; w++) {
                        start = JalaliKendoDate.nextDay(start);
                    }
                    //start = JalaliKendoDate.addDays(start, cellsPerRow);
                    html += '</tr>';
                }
                this._weekStartDates = weekStartDates;
                this._endDate = JalaliKendoDate.previousDay(start);
                return html;
            },
            _createRow: function (startDate, startIdx, cellsPerRow, groupIndex) {
                var that = this;
                var min = that._firstDayOfMonth;
                var max = that._lastDayOfMonth;
                var content = that.dayTemplate;
                var classes = '';
                var html = '';
                var resources = function () {
                    return that._resourceBySlot({ groupIndex: groupIndex });
                };
                for (var cellIdx = 0; cellIdx < cellsPerRow; cellIdx++) {
                    classes = '';
                    if (JalaliKendoDate.isToday(startDate)) {
                        classes += 'k-today';
                    }
                    if (!JalaliKendoDate.isInDateRange(startDate, min, max)) {
                        classes += 'k-other-month';
                    }
                    html += '<td ';
                    if (classes !== '') {
                        html += 'class="' + classes + '"';
                    }
                    html += '>';
                    html += content({
                        date: startDate,
                        resources: resources
                    });
                    html += '</td>';
                    that._slotIndices[getDate(startDate).getTime()] = startIdx + cellIdx;
                    startDate = JalaliKendoDate.nextDay(startDate);
                }
                return html;
            },
            _layout: function () {
                var calendarInfo = this.calendarInfo();
                var weekDayNames = this._isMobile() ? calendarInfo.days.namesShort : calendarInfo.days.names;
                var names = shiftArray(weekDayNames, calendarInfo.firstDay);
                var columns = $.map(names, function (value) {
                    return { text: value };
                });
                var resources = this.groupedResources;
                var rows;
                if (resources.length) {
                    if (this._isVerticallyGrouped()) {
                        var inner = [];
                        for (var idx = 0; idx < 6; idx++) {
                            inner.push({
                                text: '<div>&nbsp;</div>',
                                className: 'k-hidden k-slot-cell'
                            });
                        }
                        rows = this._createRowsLayout(resources, inner, this.groupHeaderTemplate);
                    } else {
                        columns = this._createColumnsLayout(resources, columns, this.groupHeaderTemplate);
                    }
                }
                return {
                    columns: columns,
                    rows: rows
                };
            },
            _createEventElement: function (event) {
                var options = this.options;
                var editable = options.editable;
                var isMobile = this._isMobile();
                event.showDelete = editable && editable.destroy !== false && !isMobile;
                event.resizable = editable && editable.resize !== false && !isMobile;
                event.ns = kendo.ns;
                event.resources = this.eventResources(event);
                event.inverseColor = event.resources && event.resources[0] ? this._shouldInverseResourceColor(event.resources[0]) : false;
                var element = $(this.eventTemplate(event));
                this.angular('compile', function () {
                    return {
                        elements: element,
                        data: [{ dataItem: event }]
                    };
                });
                return element;
            },
            _isInDateSlot: function (event) {
                var groups = this.groups[0];
                var slotStart = groups.firstSlot().start;
                var slotEnd = groups.lastSlot().end - 1;
                var startTime = JalaliKendoDate.toUtcTime(event.start);
                var endTime = JalaliKendoDate.toUtcTime(event.end);
                return (isInDateRange(startTime, slotStart, slotEnd) || isInDateRange(endTime, slotStart, slotEnd) || isInDateRange(slotStart, startTime, endTime) || isInDateRange(slotEnd, startTime, endTime)) && (!isInDateRange(endTime, slotStart, slotStart) || isInDateRange(endTime, startTime, startTime) || event.isAllDay);
            },
            _slotIndex: function (date) {
                return this._slotIndices[getDate(date).getTime()];
            },
            _positionMobileEvent: function (slotRange, element, group) {
                var startSlot = slotRange.start;
                if (slotRange.start.offsetLeft > slotRange.end.offsetLeft) {
                    startSlot = slotRange.end;
                }
                var startIndex = slotRange.start.index;
                var endIndex = startIndex;
                var eventCount = 3;
                var events = SchedulerView.collidingEvents(slotRange.events(), startIndex, endIndex);
                events.push({
                    element: element,
                    start: startIndex,
                    end: endIndex
                });
                var rows = SchedulerView.createRows(events);
                var slot = slotRange.collection.at(startIndex);
                var container = slot.container;
                if (!container) {
                    container = $(kendo.format('<div class="k-events-container" style="top:{0};left:{1};width:{2}"/>', startSlot.offsetTop + startSlot.firstChildTop + startSlot.firstChildHeight - 3 + 'px', startSlot.offsetLeft + 'px', startSlot.offsetWidth + 'px'));
                    slot.container = container;
                    this.content[0].appendChild(container[0]);
                }
                if (rows.length <= eventCount) {
                    slotRange.addEvent({
                        element: element,
                        start: startIndex,
                        end: endIndex,
                        groupIndex: startSlot.groupIndex
                    });
                    group._continuousEvents.push({
                        element: element,
                        uid: element.attr(kendo.attr('uid')),
                        start: slotRange.start,
                        end: slotRange.end
                    });
                    container[0].appendChild(element[0]);
                }
            },
            _positionEvent: function (slotRange, element, group) {
                var eventHeight = this.options.eventHeight;
                var startSlot = slotRange.start;
                if (slotRange.start.offsetLeft > slotRange.end.offsetLeft) {
                    startSlot = slotRange.end;
                }
                var startIndex = slotRange.start.index;
                var endIndex = slotRange.end.index;
                var eventCount = startSlot.eventCount;
                var events = SchedulerView.collidingEvents(slotRange.events(), startIndex, endIndex);
                var rightOffset = startIndex !== endIndex ? 5 : 4;
                events.push({
                    element: element,
                    start: startIndex,
                    end: endIndex
                });
                var rows = SchedulerView.createRows(events);
                for (var idx = 0, length = Math.min(rows.length, eventCount); idx < length; idx++) {
                    var rowEvents = rows[idx].events;
                    var eventTop = startSlot.offsetTop + startSlot.firstChildHeight + idx * eventHeight + 3 * idx + 'px';
                    for (var j = 0, eventLength = rowEvents.length; j < eventLength; j++) {
                        rowEvents[j].element[0].style.top = eventTop;
                    }
                }
                if (rows.length > eventCount) {
                    for (var slotIndex = startIndex; slotIndex <= endIndex; slotIndex++) {
                        var collection = slotRange.collection;
                        var slot = collection.at(slotIndex);
                        if (slot.more) {
                            return;
                        }
                        slot.more = $(MORE_BUTTON_TEMPLATE({
                            ns: kendo.ns,
                            start: slotIndex,
                            end: slotIndex,
                            width: slot.clientWidth - 2,
                            left: slot.offsetLeft + 2,
                            top: slot.offsetTop + slot.firstChildHeight + eventCount * eventHeight + 3 * eventCount
                        }));
                        this.content[0].appendChild(slot.more[0]);
                    }
                } else {
                    slotRange.addEvent({
                        element: element,
                        start: startIndex,
                        end: endIndex,
                        groupIndex: startSlot.groupIndex
                    });
                    element[0].style.width = slotRange.innerWidth() - rightOffset + 'px';
                    element[0].style.left = startSlot.offsetLeft + 2 + 'px';
                    element[0].style.height = eventHeight + 'px';
                    group._continuousEvents.push({
                        element: element,
                        uid: element.attr(kendo.attr('uid')),
                        start: slotRange.start,
                        end: slotRange.end
                    });
                    element.appendTo(this.content);
                }
            },
            _slotByPosition: function (x, y) {
                var offset = this.content.offset();
                x -= offset.left;
                y -= offset.top;
                y += this.content[0].scrollTop;
                x += this.content[0].scrollLeft;
                x = Math.ceil(x);
                y = Math.ceil(y);
                for (var groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    var slot = this.groups[groupIndex].daySlotByPosition(x, y);
                    if (slot) {
                        return slot;
                    }
                }
                return null;
            },
            _createResizeHint: function (range) {
                var left = range.startSlot().offsetLeft;
                var top = range.start.offsetTop;
                var width = range.innerWidth();
                var height = range.start.clientHeight - 2;
                var hint = SchedulerView.fn._createResizeHint.call(this, left, top, width, height);
                hint.appendTo(this.content);
                this._resizeHint = this._resizeHint.add(hint);
            },
            _updateResizeHint: function (event, groupIndex, startTime, endTime) {
                this._removeResizeHint();
                var group = this.groups[groupIndex];
                var ranges = group.ranges(startTime, endTime, true, event.isAllDay);
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    this._createResizeHint(ranges[rangeIndex]);
                }
                this._resizeHint.find('.k-label-top,.k-label-bottom').text('');
                this._resizeHint.first().addClass('k-first').find('.k-label-top').text(kendo.toString(kendo.timezone.toLocalDate(startTime), 'M/dd'));
                this._resizeHint.last().addClass('k-last').find('.k-label-bottom').text(kendo.toString(kendo.timezone.toLocalDate(endTime), 'M/dd'));
            },
            _updateMoveHint: function (event, groupIndex, distance) {
                var start = JalaliKendoDate.toUtcTime(event.start) + distance;
                var end = start + event.duration();
                var group = this.groups[groupIndex];
                var ranges = group.ranges(start, end, true, event.isAllDay);
                this._removeMoveHint();
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var startSlot = range.startSlot();
                    var endSlot = range.endSlot();
                    var hint = this._createEventElement(event.clone({
                        head: range.head,
                        tail: range.tail
                    }));
                    hint.css({
                        left: startSlot.offsetLeft + 2,
                        top: startSlot.offsetTop + startSlot.firstChildHeight,
                        height: this.options.eventHeight,
                        width: range.innerWidth() - (startSlot.index !== endSlot.index ? 5 : 4)
                    });
                    hint.addClass('k-event-drag-hint');
                    hint.appendTo(this.content);
                    this._moveHint = this._moveHint.add(hint);
                }
            },
            _groups: function () {
                var groupCount = this._groupCount();
                var columnCount = NUMBER_OF_COLUMNS;
                var rowCount = NUMBER_OF_ROWS;
                this.groups = [];
                for (var idx = 0; idx < groupCount; idx++) {
                    this._addResourceView(idx);
                }
                var tableRows = this.content[0].getElementsByTagName('tr');
                var startDate = this.startDate();
                for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                    var cellCount = 0;
                    var rowMultiplier = 0;
                    if (this._isVerticallyGrouped()) {
                        rowMultiplier = groupIndex;
                    }
                    for (var rowIndex = rowMultiplier * rowCount; rowIndex < (rowMultiplier + 1) * rowCount; rowIndex++) {
                        var group = this.groups[groupIndex];
                        var collection = group.addDaySlotCollection(JalaliKendoDate.addDays(startDate, cellCount), JalaliKendoDate.addDays(this.startDate(), cellCount + columnCount));
                        var tableRow = tableRows[rowIndex];
                        var cells = tableRow.children;
                        var cellMultiplier = 0;
                        tableRow.setAttribute('role', 'row');
                        if (!this._isVerticallyGrouped()) {
                            cellMultiplier = groupIndex;
                        }
                        for (var cellIndex = cellMultiplier * columnCount; cellIndex < (cellMultiplier + 1) * columnCount; cellIndex++) {
                            var cell = cells[cellIndex];
                            var clientHeight = cell.clientHeight;
                            var firstChildHeight = cell.children.length ? cell.children[0].offsetHeight + 3 : 0;
                            var start = JalaliKendoDate.addDays(startDate, cellCount);
                            var end = JalaliKendoDate.MS_PER_DAY;
                            if (startDate.getHours() !== start.getHours()) {
                                end += (startDate.getHours() - start.getHours()) * JalaliKendoDate.MS_PER_HOUR;
                            }
                            start = JalaliKendoDate.toUtcTime(start);
                            end += start;
                            cellCount++;
                            var eventCount = Math.floor((clientHeight - firstChildHeight - this.options.moreButtonHeight) / (this.options.eventHeight + 3));
                            cell.setAttribute('role', 'gridcell');
                            cell.setAttribute('aria-selected', false);
                            collection.addDaySlot(cell, start, end, eventCount);
                        }
                    }
                }
            },
            render: function (events) {
                this.content.children('.k-event,.k-more-events,.k-events-container').remove();
                this._groups();
                events = new kendo.data.Query(events).sort([
                    {
                        field: 'start',
                        dir: 'asc'
                    },
                    {
                        field: 'end',
                        dir: 'desc'
                    }
                ]).toArray();
                var resources = this.groupedResources;
                if (resources.length) {
                    this._renderGroups(events, resources, 0, 1);
                } else {
                    this._renderEvents(events, 0);
                }
                this.refreshLayout();
                this.trigger('activate');
            },
            _renderEvents: function (events, groupIndex) {
                var event;
                var idx;
                var length;
                var isMobilePhoneView = this._isMobilePhoneView();
                for (idx = 0, length = events.length; idx < length; idx++) {
                    event = events[idx];
                    if (this._isInDateSlot(event)) {
                        var group = this.groups[groupIndex];
                        if (!group._continuousEvents) {
                            group._continuousEvents = [];
                        }
                        var ranges = group.slotRanges(event, true);
                        var rangeCount = ranges.length;
                        for (var rangeIndex = 0; rangeIndex < rangeCount; rangeIndex++) {
                            var range = ranges[rangeIndex];
                            var start = event.start;
                            var end = event.end;
                            if (rangeCount > 1) {
                                if (rangeIndex === 0) {
                                    end = range.end.endDate();
                                } else if (rangeIndex == rangeCount - 1) {
                                    start = range.start.startDate();
                                } else {
                                    start = range.start.startDate();
                                    end = range.end.endDate();
                                }
                            }
                            var occurrence = event.clone({
                                start: start,
                                end: end,
                                head: range.head,
                                tail: range.tail
                            });
                            if (isMobilePhoneView) {
                                this._positionMobileEvent(range, this._createEventElement(occurrence), group);
                            } else {
                                this._positionEvent(range, this._createEventElement(occurrence), group);
                            }
                        }
                    }
                }
            },
            _renderGroups: function (events, resources, offset, columnLevel) {
                var resource = resources[0];
                if (resource) {
                    var view = resource.dataSource.view();
                    for (var itemIdx = 0; itemIdx < view.length; itemIdx++) {
                        var value = this._resourceValue(resource, view[itemIdx]);
                        var tmp = new kendo.data.Query(events).filter({
                            field: resource.field,
                            operator: SchedulerView.groupEqFilter(value)
                        }).toArray();
                        if (resources.length > 1) {
                            offset = this._renderGroups(tmp, resources.slice(1), offset++, columnLevel + 1);
                        } else {
                            this._renderEvents(tmp, offset++);
                        }
                    }
                }
                return offset;
            },
            _groupCount: function () {
                var resources = this.groupedResources;
                if (resources.length) {
                    if (this._isVerticallyGrouped()) {
                        return this._rowCountForLevel(resources.length - 1);
                    } else {
                        return this._columnCountForLevel(resources.length) / this._columnOffsetForResource(resources.length);
                    }
                }
                return 1;
            },
            _columnOffsetForResource: function (index) {
                return this._columnCountForLevel(index) / this._columnCountForLevel(index - 1);
            },
            destroy: function () {
                if (this.table) {
                    this.table.removeClass('k-scheduler-monthview');
                }
                if (this.content) {
                    this.content.off(NS);
                }
                if (this.element) {
                    this.element.off(NS);
                }
                SchedulerView.fn.destroy.call(this);
                if (this._isMobile() && !this._isMobilePhoneView() && this.options.editable) {
                    if (this.options.editable.create !== false) {
                        this._addUserEvents.destroy();
                    }
                    if (this.options.editable.update !== false) {
                        this._editUserEvents.destroy();
                    }
                }
            },
            events: [
                'remove',
                'add',
                'edit',
                'navigate'
            ],
            options: {
                title: 'Month',
                name: 'month',
                eventHeight: 25,
                moreButtonHeight: 13,
                editable: true,
                selectedDateFormat: '{0:y}',
                selectedShortDateFormat: '{0:y}',
                groupHeaderTemplate: '#=text#',
                dayTemplate: DAY_TEMPLATE,
                eventTemplate: EVENT_TEMPLATE
            }
        });
        function shiftArray(array, idx) {
            return array.slice(idx).concat(array.slice(0, idx));
        }
        function firstVisibleMonthDay(date, calendarInfo) {
            var firstDay = calendarInfo.firstDay, firstVisibleDay = new DATE(date.getFullYear(), date.getMonth(), 0, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            while (firstVisibleDay.getDay() != firstDay) {
                JalaliKendoDate.setTime(firstVisibleDay, -1 * MS_PER_DAY);
            }
            return firstVisibleDay;
        }
        function isInDateRange(value, min, max) {
            var msMin = min, msMax = max, msValue;
            msValue = value;
            return msValue >= msMin && msValue <= msMax;
        }
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));




/** 
 * Kendo UI v2016.2.504 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

*/
(function (f, define) {
    define('kendo.scheduler.dayview', ['kendo.scheduler.view'], f);
}(function () {
    var __meta__ = {
        id: 'scheduler.dayview',
        name: 'Scheduler Day View',
        category: 'web',
        description: 'The Scheduler Day View',
        depends: ['scheduler.view'],
        hidden: true
    };
    (function ($, undefined) {
        var kendo = window.kendo, DATE = JalaliDate, ui = kendo.ui, setTime = JalaliKendoDate.setTime, SchedulerView = ui.SchedulerView, extend = $.extend, proxy = $.proxy, getDate = JalaliKendoDate.getDate, MS_PER_MINUTE = JalaliKendoDate.MS_PER_MINUTE, MS_PER_DAY = JalaliKendoDate.MS_PER_DAY, CURRENT_TIME_MARKER_CLASS = 'k-current-time', CURRENT_TIME_MARKER_ARROW_CLASS = 'k-current-time-arrow', BORDER_SIZE_COEFF = 0.8666, getMilliseconds = JalaliKendoDate.getMilliseconds, NS = '.kendoMultiDayView';
        var DAY_VIEW_EVENT_TEMPLATE = kendo.template('<div title="(#=kendo.format("{0:t} - {1:t}", start, end)#): #=title.replace(/"/g,"&\\#34;")#">' + '<div class="k-event-template k-event-time">#:kendo.format("{0:t} - {1:t}", start, end)#</div>' + '<div class="k-event-template">${title}</div>' + '</div>'), DAY_VIEW_ALL_DAY_EVENT_TEMPLATE = kendo.template('<div title="(#=kendo.format("{0:t}", start)#): #=title.replace(/"/g,"&\\#34;")#">' + '<div class="k-event-template">${title}</div>' + '</div>'), DATA_HEADER_TEMPLATE = kendo.template('<span class=\'k-link k-nav-day\'>#=kendo.toString(date, \'ddd M/dd\')#</span>'), ALLDAY_EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" ' + 'data-#=ns#uid="#=uid#"' + '#if (resources[0]) { #' + 'style="background-color:#=resources[0].color#; border-color: #=resources[0].color#"' + 'class="k-event#=inverseColor ? " k-event-inverse" : ""#" ' + '#} else {#' + 'class="k-event"' + '#}#' + '>' + '<span class="k-event-actions">' + '# if(data.tail || data.middle) {#' + '<span class="k-icon k-i-arrow-w"></span>' + '#}#' + '# if(data.isException()) {#' + '<span class="k-icon k-i-exception"></span>' + '# } else if(data.isRecurring()) {#' + '<span class="k-icon k-i-refresh"></span>' + '# } #' + '</span>' + '{0}' + '<span class="k-event-actions">' + '#if (showDelete) {#' + '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' + '#}#' + '# if(data.head || data.middle) {#' + '<span class="k-icon k-i-arrow-e"></span>' + '#}#' + '</span>' + '#if(resizable && !singleDay && !data.tail && !data.middle){#' + '<span class="k-resize-handle k-resize-w"></span>' + '#}#' + '#if(resizable && !singleDay && !data.head && !data.middle){#' + '<span class="k-resize-handle k-resize-e"></span>' + '#}#' + '</div>', EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" ' + 'data-#=ns#uid="#=uid#" ' + '#if (resources[0]) { #' + 'style="background-color:#=resources[0].color #; border-color: #=resources[0].color#"' + 'class="k-event#=inverseColor ? " k-event-inverse" : ""#"' + '#} else {#' + 'class="k-event"' + '#}#' + '>' + '<span class="k-event-actions">' + '# if(data.isException()) {#' + '<span class="k-icon k-i-exception"></span>' + '# } else if(data.isRecurring()) {#' + '<span class="k-icon k-i-refresh"></span>' + '# } #' + '</span>' + '{0}' + '<span class="k-event-actions">' + '#if (showDelete) {#' + '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' + '#}#' + '</span>' + '<span class="k-event-top-actions">' + '# if(data.tail || data.middle) {#' + '<span class="k-icon k-i-arrow-n"></span>' + '# } #' + '</span>' + '<span class="k-event-bottom-actions">' + '# if(data.head || data.middle) {#' + '<span class="k-icon k-i-arrow-s"></span>' + '# } #' + '</span>' + '# if(resizable && !data.tail && !data.middle) {#' + '<span class="k-resize-handle k-resize-n"></span>' + '# } #' + '# if(resizable && !data.head && !data.middle) {#' + '<span class="k-resize-handle k-resize-s"></span>' + '# } #' + '</div>';
        function toInvariantTime(date) {
            var staticDate = new DATE(1980, 1, 1, 0, 0, 0);
            setTime(staticDate, getMilliseconds(date));
            return staticDate;
        }
        function isInDateRange(value, min, max) {
            return value >= min && value <= max;
        }
        function isInTimeRange(value, min, max, overlaps) {
            overlaps = overlaps ? value <= max : value < max;
            return value > min && overlaps;
        }
        function addContinuousEvent(group, range, element, isAllDay) {
            var events = group._continuousEvents;
            var lastEvent = events[events.length - 1];
            var startDate = getDate(range.start.startDate()).getTime();
            if (isAllDay && lastEvent && getDate(lastEvent.start.startDate()).getTime() == startDate) {
                var idx = events.length - 1;
                for (; idx > -1; idx--) {
                    if (events[idx].isAllDay || getDate(events[idx].start.startDate()).getTime() < startDate) {
                        break;
                    }
                }
                events.splice(idx + 1, 0, {
                    element: element,
                    isAllDay: true,
                    uid: element.attr(kendo.attr('uid')),
                    start: range.start,
                    end: range.end
                });
            } else {
                events.push({
                    element: element,
                    isAllDay: isAllDay,
                    uid: element.attr(kendo.attr('uid')),
                    start: range.start,
                    end: range.end
                });
            }
        }
        function getWorkDays(options) {
            var workDays = [];
            var dayIndex = options.workWeekStart;
            workDays.push(dayIndex);
            while (options.workWeekEnd != dayIndex) {
                if (dayIndex > 6) {
                    dayIndex -= 7;
                } else {
                    dayIndex++;
                }
                workDays.push(dayIndex);
            }
            return workDays;
        }
        var MultiDayView = SchedulerView.extend({
            init: function (element, options) {
                var that = this;
                SchedulerView.fn.init.call(that, element, options);
                that.title = that.options.title || that.options.name;
                that._workDays = getWorkDays(that.options);
                that._templates();
                that._editable();
                that.calculateDateRange();
                that._groups();
                that._currentTime();
            },
            _currentTimeMarkerUpdater: function () {
                var currentTime = new DATE();
                var options = this.options;
                if (options.currentTimeMarker.useLocalTimezone === false) {
                    var timezone = options.dataSource.options.schema.timezone;
                    if (options.dataSource && timezone) {
                        var timezoneOffset = kendo.timezone.offset(currentTime, timezone);
                        currentTime = kendo.timezone.convert(currentTime, currentTime.getTimezoneOffset(), timezoneOffset);
                    }
                }
                this.times.find('.' + CURRENT_TIME_MARKER_CLASS).remove();
                this.content.find('.' + CURRENT_TIME_MARKER_CLASS).remove();
                var groupsCount = !options.group || options.group.orientation == 'horizontal' ? 1 : this.groups.length;
                var firstTimesCell = this.times.find('tr:first th:first');
                var lastTimesCell = this.times.find('tr:first th:last');
                for (var groupIndex = 0; groupIndex < groupsCount; groupIndex++) {
                    var currentGroup = this.groups[groupIndex];
                    var utcCurrentTime = JalaliKendoDate.toUtcTime(currentTime);
                    var ranges = currentGroup.timeSlotRanges(utcCurrentTime, utcCurrentTime + 1);
                    if (ranges.length === 0) {
                        return;
                    }
                    var collection = ranges[0].collection;
                    var slotElement = collection.slotByStartDate(currentTime);
                    if (slotElement) {
                        var elementHtml = '<div class=\'' + CURRENT_TIME_MARKER_CLASS + '\'></div>';
                        var timesTableMarker = $(elementHtml).prependTo(this.times);
                        var markerTopPosition = Math.round(ranges[0].innerRect(currentTime, new DATE(currentTime.getTime() + 1), false).top);
                        var timesTableMarkerCss = {};
                        if (this._isRtl) {
                            timesTableMarkerCss.right = firstTimesCell.position().left + firstTimesCell.outerHeight() - lastTimesCell.outerHeight();
                            timesTableMarker.addClass(CURRENT_TIME_MARKER_ARROW_CLASS + '-left');
                        } else {
                            timesTableMarkerCss.left = lastTimesCell.position().left;
                            timesTableMarker.addClass(CURRENT_TIME_MARKER_ARROW_CLASS + '-right');
                        }
                        timesTableMarkerCss.top = markerTopPosition - timesTableMarker.outerWidth() * BORDER_SIZE_COEFF / 2;
                        timesTableMarker.css(timesTableMarkerCss);
                        $(elementHtml).prependTo(this.content).css({
                            top: markerTopPosition,
                            height: '1px',
                            right: '1px',
                            left: 0
                        });
                    }
                }
            },
            _currentTime: function () {
                var that = this;
                var markerOptions = that.options.currentTimeMarker;
                if (markerOptions !== false && markerOptions.updateInterval !== undefined) {
                    var updateInterval = markerOptions.updateInterval;
                    that._currentTimeMarkerUpdater();
                    that._currentTimeUpdateTimer = setInterval(proxy(this._currentTimeMarkerUpdater, that), updateInterval);
                }
            },
            _updateResizeHint: function (event, groupIndex, startTime, endTime) {
                var multiday = event.isMultiDay();
                var group = this.groups[groupIndex];
                var ranges = group.ranges(startTime, endTime, multiday, event.isAllDay);
                this._removeResizeHint();
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var start = range.startSlot();
                    var width = start.offsetWidth;
                    var height = start.clientHeight;
                    var top = start.offsetTop;
                    if (multiday) {
                        width = range.innerWidth();
                    } else {
                        var rect = range.outerRect(startTime, endTime, this.options.snap);
                        top = rect.top;
                        height = rect.bottom - rect.top;
                    }
                    var hint = SchedulerView.fn._createResizeHint.call(this, start.offsetLeft, top, width, height);
                    this._resizeHint = this._resizeHint.add(hint);
                }
                var format = 't';
                var container = this.content;
                if (multiday) {
                    format = 'M/dd';
                    container = this.element.find('.k-scheduler-header-wrap:has(.k-scheduler-header-all-day) > div');
                    if (!container.length) {
                        container = this.content;
                    }
                }
                this._resizeHint.appendTo(container);
                this._resizeHint.find('.k-label-top,.k-label-bottom').text('');
                this._resizeHint.first().addClass('k-first').find('.k-label-top').text(kendo.toString(kendo.timezone.toLocalDate(startTime), format));
                this._resizeHint.last().addClass('k-last').find('.k-label-bottom').text(kendo.toString(kendo.timezone.toLocalDate(endTime), format));
            },
            _updateMoveHint: function (event, groupIndex, distance) {
                var multiday = event.isMultiDay();
                var group = this.groups[groupIndex];
                var start = JalaliKendoDate.toUtcTime(event.start) + distance;
                var end = start + event.duration();
                var ranges = group.ranges(start, end, multiday, event.isAllDay);
                start = kendo.timezone.toLocalDate(start);
                end = kendo.timezone.toLocalDate(end);
                this._removeMoveHint();
                if (!multiday && (getMilliseconds(end) === 0 || getMilliseconds(end) < getMilliseconds(this.startTime()))) {
                    if (ranges.length > 1) {
                        ranges.pop();
                    }
                }
                for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                    var range = ranges[rangeIndex];
                    var startSlot = range.start;
                    var hint = this._createEventElement(event.clone({
                        start: start,
                        end: end
                    }), !multiday);
                    hint.addClass('k-event-drag-hint');
                    var css = {
                        left: startSlot.offsetLeft + 2,
                        top: startSlot.offsetTop
                    };
                    if (this._isRtl) {
                        css.left = startSlot.clientWidth * 0.1 + startSlot.offsetLeft + 2;
                    }
                    if (multiday) {
                        css.width = range.innerWidth() - 4;
                    } else {
                        var rect = range.outerRect(start, end, this.options.snap);
                        css.top = rect.top;
                        css.height = rect.bottom - rect.top;
                        css.width = startSlot.clientWidth * 0.9 - 4;
                    }
                    hint.css(css);
                    this._moveHint = this._moveHint.add(hint);
                }
                var content = this.content;
                if (multiday) {
                    content = this.element.find('.k-scheduler-header-wrap:has(.k-scheduler-header-all-day) > div');
                    if (!content.length) {
                        content = this.content;
                    }
                }
                this._moveHint.appendTo(content);
            },
            _slotByPosition: function (x, y) {
                var slot;
                var offset;
                if (this._isVerticallyGrouped()) {
                    offset = this.content.offset();
                    y += this.content[0].scrollTop;
                    x += this.content[0].scrollLeft;
                } else {
                    offset = this.element.find('.k-scheduler-header-wrap:has(.k-scheduler-header-all-day)').find('>div').offset();
                }
                if (offset) {
                    x -= offset.left;
                    y -= offset.top;
                }
                x = Math.ceil(x);
                y = Math.ceil(y);
                var group;
                var groupIndex;
                for (groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    group = this.groups[groupIndex];
                    slot = group.daySlotByPosition(x, y);
                    if (slot) {
                        return slot;
                    }
                }
                if (offset) {
                    x += offset.left;
                    y += offset.top;
                }
                offset = this.content.offset();
                x -= offset.left;
                y -= offset.top;
                if (!this._isVerticallyGrouped()) {
                    y += this.content[0].scrollTop;
                    x += this.content[0].scrollLeft;
                }
                x = Math.ceil(x);
                y = Math.ceil(y);
                for (groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    group = this.groups[groupIndex];
                    slot = group.timeSlotByPosition(x, y);
                    if (slot) {
                        return slot;
                    }
                }
                return null;
            },
            _groupCount: function () {
                var resources = this.groupedResources;
                if (resources.length) {
                    if (this._groupOrientation() === 'vertical') {
                        return this._rowCountForLevel(resources.length - 1);
                    } else {
                        return this._columnCountForLevel(resources.length) / this._columnOffsetForResource(resources.length);
                    }
                }
                return 1;
            },
            _columnCountInResourceView: function () {
                var resources = this.groupedResources;
                if (!resources.length || this._isVerticallyGrouped()) {
                    return this._columnCountForLevel(0);
                }
                return this._columnOffsetForResource(resources.length);
            },
            _timeSlotGroups: function (groupCount, columnCount) {
                var interval = this._timeSlotInterval();
                var tableRows = this.content.find('tr:not(.k-scheduler-header-all-day)');
                tableRows.attr('role', 'row');
                var rowCount = tableRows.length;
                if (this._isVerticallyGrouped()) {
                    rowCount = Math.floor(rowCount / groupCount);
                }
                for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                    var rowMultiplier = 0;
                    if (this._isVerticallyGrouped()) {
                        rowMultiplier = groupIndex;
                    }
                    var rowIndex = rowMultiplier * rowCount;
                    var time;
                    var cellMultiplier = 0;
                    if (!this._isVerticallyGrouped()) {
                        cellMultiplier = groupIndex;
                    }
                    while (rowIndex < (rowMultiplier + 1) * rowCount) {
                        var cells = tableRows[rowIndex].children;
                        var group = this.groups[groupIndex];
                        if (rowIndex % rowCount === 0) {
                            time = getMilliseconds(new DATE(+this.startTime()));
                        }
                        for (var cellIndex = cellMultiplier * columnCount; cellIndex < (cellMultiplier + 1) * columnCount; cellIndex++) {
                            var cell = cells[cellIndex];
                            var collectionIndex = cellIndex % columnCount;
                            var collection = group.getTimeSlotCollection(collectionIndex);
                            var currentDate = this._dates[collectionIndex];
                            var currentTime = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                            var start = currentTime + time;
                            var end = start + interval;
                            cell.setAttribute('role', 'gridcell');
                            cell.setAttribute('aria-selected', false);
                            collection.addTimeSlot(cell, start, end);
                        }
                        time += interval;
                        rowIndex++;
                    }
                }
            },
            _daySlotGroups: function (groupCount, columnCount) {
                var tableRows;
                if (this._isVerticallyGrouped()) {
                    tableRows = this.element.find('.k-scheduler-header-all-day');
                } else {
                    tableRows = this.element.find('.k-scheduler-header-all-day tr');
                }
                tableRows.attr('role', 'row');
                for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                    var rowMultiplier = 0;
                    if (this._isVerticallyGrouped()) {
                        rowMultiplier = groupIndex;
                    }
                    var group = this.groups[groupIndex];
                    var collection = group.getDaySlotCollection(0);
                    var cells = tableRows[rowMultiplier].children;
                    var cellMultiplier = 0;
                    if (!this._isVerticallyGrouped()) {
                        cellMultiplier = groupIndex;
                    }
                    var cellCount = 0;
                    for (var cellIndex = cellMultiplier * columnCount; cellIndex < (cellMultiplier + 1) * columnCount; cellIndex++) {
                        var cell = cells[cellIndex];
                        if (cellIndex % columnCount === 0) {
                            cellCount = 0;
                        }
                        var start = this._dates[cellCount];
                        var currentTime = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
                        cellCount++;
                        cell.setAttribute('role', 'gridcell');
                        cell.setAttribute('aria-selected', false);
                        collection.addDaySlot(cell, currentTime, currentTime + JalaliKendoDate.MS_PER_DAY);
                    }
                }
            },
            _groups: function () {
                var groupCount = this._groupCount();
                var columnCount = this._columnCountInResourceView();
                this.groups = [];
                for (var idx = 0; idx < groupCount; idx++) {
                    var view = this._addResourceView(idx);
                    for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                        view.addTimeSlotCollection(this._dates[columnIndex], JalaliKendoDate.addDays(this._dates[columnIndex], 1));
                    }
                    if (this.options.allDaySlot) {
                        view.addDaySlotCollection(this._dates[0], JalaliKendoDate.addDays(this._dates[this._dates.length - 1], 1));
                    }
                }
                this._timeSlotGroups(groupCount, columnCount);
                if (this.options.allDaySlot) {
                    this._daySlotGroups(groupCount, columnCount);
                }
            },
            options: {
                name: 'MultiDayView',
                selectedDateFormat: '{0:D}',
                selectedShortDateFormat: '{0:d}',
                allDaySlot: true,
                showWorkHours: false,
                title: '',
                startTime: JalaliKendoDate.today(),
                endTime: JalaliKendoDate.today(),
                minorTickCount: 2,
                majorTick: 60,
                majorTimeHeaderTemplate: '#=kendo.toString(date, \'t\')#',
                minorTimeHeaderTemplate: '&nbsp;',
                groupHeaderTemplate: '#=text#',
                slotTemplate: '&nbsp;',
                allDaySlotTemplate: '&nbsp;',
                eventTemplate: DAY_VIEW_EVENT_TEMPLATE,
                allDayEventTemplate: DAY_VIEW_ALL_DAY_EVENT_TEMPLATE,
                dateHeaderTemplate: DATA_HEADER_TEMPLATE,
                editable: true,
                workDayStart: new DATE(1980, 1, 1, 8, 0, 0),
                workDayEnd: new DATE(1980, 1, 1, 17, 0, 0),
                workWeekStart: 1,
                workWeekEnd: 5,
                footer: { command: 'workDay' },
                messages: {
                    allDay: 'all day',
                    showFullDay: 'Show full day',
                    showWorkDay: 'Show business hours'
                },
                currentTimeMarker: {
                    updateInterval: 10000,
                    useLocalTimezone: true
                }
            },
            events: [
                'remove',
                'add',
                'edit'
            ],
            _templates: function () {
                var options = this.options, settings = extend({}, kendo.Template, options.templateSettings);
                this.eventTemplate = this._eventTmpl(options.eventTemplate, EVENT_WRAPPER_STRING);
                this.allDayEventTemplate = this._eventTmpl(options.allDayEventTemplate, ALLDAY_EVENT_WRAPPER_STRING);
                this.majorTimeHeaderTemplate = kendo.template(options.majorTimeHeaderTemplate, settings);
                this.minorTimeHeaderTemplate = kendo.template(options.minorTimeHeaderTemplate, settings);
                this.dateHeaderTemplate = kendo.template(options.dateHeaderTemplate, settings);
                this.slotTemplate = kendo.template(options.slotTemplate, settings);
                this.allDaySlotTemplate = kendo.template(options.allDaySlotTemplate, settings);
                this.groupHeaderTemplate = kendo.template(options.groupHeaderTemplate, settings);
            },
            _editable: function () {
                if (this.options.editable) {
                    if (this._isMobile()) {
                        this._touchEditable();
                    } else {
                        this._mouseEditable();
                    }
                }
            },
            _mouseEditable: function () {
                var that = this;
                that.element.on('click' + NS, '.k-event a:has(.k-si-close)', function (e) {
                    that.trigger('remove', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                    e.preventDefault();
                });
                if (that.options.editable.create !== false) {
                    that.element.on('dblclick' + NS, '.k-scheduler-content td', function (e) {
                        if (!$(this).parent().hasClass('k-scheduler-header-all-day')) {
                            var slot = that._slotByPosition(e.pageX, e.pageY);
                            if (slot) {
                                var resourceInfo = that._resourceBySlot(slot);
                                that.trigger('add', {
                                    eventInfo: extend({
                                        start: slot.startDate(),
                                        end: slot.endDate()
                                    }, resourceInfo)
                                });
                            }
                            e.preventDefault();
                        }
                    }).on('dblclick' + NS, '.k-scheduler-header-all-day td', function (e) {
                        var slot = that._slotByPosition(e.pageX, e.pageY);
                        if (slot) {
                            var resourceInfo = that._resourceBySlot(slot);
                            that.trigger('add', {
                                eventInfo: extend({}, {
                                    isAllDay: true,
                                    start: JalaliKendoDate.getDate(slot.startDate()),
                                    end: JalaliKendoDate.getDate(slot.startDate())
                                }, resourceInfo)
                            });
                        }
                        e.preventDefault();
                    });
                }
                if (that.options.editable.update !== false) {
                    that.element.on('dblclick' + NS, '.k-event', function (e) {
                        that.trigger('edit', { uid: $(this).closest('.k-event').attr(kendo.attr('uid')) });
                        e.preventDefault();
                    });
                }
            },
            _touchEditable: function () {
                var that = this;
                var threshold = 0;
                if (kendo.support.mobileOS.android) {
                    threshold = 5;
                }
                if (that.options.editable.create !== false) {
                    that._addUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-scheduler-content td',
                        tap: function (e) {
                            if (!$(e.target).parent().hasClass('k-scheduler-header-all-day')) {
                                var x = e.x.location !== undefined ? e.x.location : e.x;
                                var y = e.y.location !== undefined ? e.y.location : e.y;
                                var slot = that._slotByPosition(x, y);
                                if (slot) {
                                    var resourceInfo = that._resourceBySlot(slot);
                                    that.trigger('add', {
                                        eventInfo: extend({
                                            start: slot.startDate(),
                                            end: slot.endDate()
                                        }, resourceInfo)
                                    });
                                }
                                e.preventDefault();
                            }
                        }
                    });
                    that._allDayUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-scheduler-header-all-day td',
                        tap: function (e) {
                            var x = e.x.location !== undefined ? e.x.location : e.x;
                            var y = e.y.location !== undefined ? e.y.location : e.y;
                            var slot = that._slotByPosition(x, y);
                            if (slot) {
                                var resourceInfo = that._resourceBySlot(slot);
                                that.trigger('add', {
                                    eventInfo: extend({}, {
                                        isAllDay: true,
                                        start: JalaliKendoDate.getDate(slot.startDate()),
                                        end: JalaliKendoDate.getDate(slot.startDate())
                                    }, resourceInfo)
                                });
                            }
                            e.preventDefault();
                        }
                    });
                }
                if (that.options.editable.update !== false) {
                    that._editUserEvents = new kendo.UserEvents(that.element, {
                        threshold: threshold,
                        filter: '.k-event',
                        tap: function (e) {
                            var eventElement = $(e.target).closest('.k-event');
                            if (!eventElement.hasClass('k-event-active')) {
                                that.trigger('edit', { uid: eventElement.attr(kendo.attr('uid')) });
                            }
                            e.preventDefault();
                        }
                    });
                }
            },
            _layout: function (dates) {
                var columns = [];
                var rows = [];
                var options = this.options;
                var that = this;
                for (var idx = 0; idx < dates.length; idx++) {
                    var column = {};
                    column.text = that.dateHeaderTemplate({ date: dates[idx] });
                    if (JalaliKendoDate.isToday(dates[idx])) {
                        column.className = 'k-today';
                    }
                    columns.push(column);
                }
                var resources = this.groupedResources;
                if (options.allDaySlot) {
                    rows.push({
                        text: options.messages.allDay,
                        allDay: true,
                        cellContent: function (idx) {
                            var groupIndex = idx;
                            idx = resources.length && that._groupOrientation() !== 'vertical' ? idx % dates.length : idx;
                            return that.allDaySlotTemplate({
                                date: dates[idx],
                                resources: function () {
                                    return that._resourceBySlot({ groupIndex: groupIndex });
                                }
                            });
                        }
                    });
                }
                this._forTimeRange(this.startTime(), this.endTime(), function (date, majorTick, middleRow, lastSlotRow) {
                    var template = majorTick ? that.majorTimeHeaderTemplate : that.minorTimeHeaderTemplate;
                    var row = {
                        text: template({ date: date }),
                        className: lastSlotRow ? 'k-slot-cell' : ''
                    };
                    rows.push(row);
                });
                if (resources.length) {
                    if (this._groupOrientation() === 'vertical') {
                        rows = this._createRowsLayout(resources, rows, this.groupHeaderTemplate);
                    } else {
                        columns = this._createColumnsLayout(resources, columns, this.groupHeaderTemplate);
                    }
                }
                return {
                    columns: columns,
                    rows: rows
                };
            },
            _footer: function () {
                var options = this.options;
                if (options.footer !== false) {
                    var html = '<div class="k-header k-scheduler-footer">';
                    var command = options.footer.command;
                    if (command && command === 'workDay') {
                        html += '<ul class="k-reset k-header">';
                        html += '<li class="k-state-default k-scheduler-fullday"><a href="#" class="k-link"><span class="k-icon k-i-clock"></span>';
                        html += (options.showWorkHours ? options.messages.showFullDay : options.messages.showWorkDay) + '</a></li>';
                        html += '</ul>';
                    } else {
                        html += '&nbsp;';
                    }
                    html += '</div>';
                    this.footer = $(html).appendTo(this.element);
                    var that = this;
                    this.footer.on('click' + NS, '.k-scheduler-fullday', function (e) {
                        e.preventDefault();
                        that.trigger('navigate', {
                            view: that.name || options.name,
                            date: that.startDate(),
                            isWorkDay: !options.showWorkHours
                        });
                    });
                }
            },
            _forTimeRange: function (min, max, action, after) {
                min = toInvariantTime(min);
                max = toInvariantTime(max);
                var that = this, msMin = getMilliseconds(min), msMax = getMilliseconds(max), minorTickCount = that.options.minorTickCount, msMajorInterval = that.options.majorTick * MS_PER_MINUTE, msInterval = msMajorInterval / minorTickCount || 1, start = new DATE(+min), startDay = start.getDate(), msStart, idx = 0, length, html = '';
                length = MS_PER_DAY / msInterval;
                if (msMin != msMax) {
                    if (msMin > msMax) {
                        msMax += MS_PER_DAY;
                    }
                    length = (msMax - msMin) / msInterval;
                }
                length = Math.round(length);
                for (; idx < length; idx++) {
                    var majorTickDivider = idx % (msMajorInterval / msInterval), isMajorTickRow = majorTickDivider === 0, isMiddleRow = majorTickDivider < minorTickCount - 1, isLastSlotRow = majorTickDivider === minorTickCount - 1;
                    html += action(start, isMajorTickRow, isMiddleRow, isLastSlotRow);
                    setTime(start, msInterval, false);
                }
                if (msMax) {
                    msStart = getMilliseconds(start);
                    if (startDay < start.getDate()) {
                        msStart += MS_PER_DAY;
                    }
                    if (msStart > msMax) {
                        start = new DATE(+max);
                    }
                }
                if (after) {
                    html += after(start);
                }
                return html;
            },
            _content: function (dates) {
                var that = this;
                var options = that.options;
                var start = that.startTime();
                var end = this.endTime();
                var groupsCount = 1;
                var rowCount = 1;
                var columnCount = dates.length;
                var html = '';
                var resources = this.groupedResources;
                var slotTemplate = this.slotTemplate;
                var allDaySlotTemplate = this.allDaySlotTemplate;
                var isVerticalGroupped = false;
                var allDayVerticalGroupRow;
                if (resources.length) {
                    isVerticalGroupped = that._groupOrientation() === 'vertical';
                    if (isVerticalGroupped) {
                        rowCount = this._rowCountForLevel(this.rowLevels.length - 2);
                        if (options.allDaySlot) {
                            allDayVerticalGroupRow = function (groupIndex) {
                                var result = '<tr class="k-scheduler-header-all-day">';
                                var resources = function () {
                                    return that._resourceBySlot({ groupIndex: groupIndex });
                                };
                                for (var idx = 0, length = dates.length; idx < length; idx++) {
                                    result += '<td>' + allDaySlotTemplate({
                                        date: dates[idx],
                                        resources: resources
                                    }) + '</td>';
                                }
                                return result + '</tr>';
                            };
                        }
                    } else {
                        groupsCount = this._columnCountForLevel(this.columnLevels.length - 2);
                    }
                }
                html += '<tbody>';
                var appendRow = function (date, majorTick) {
                    var content = '';
                    var idx;
                    var length;
                    var classes = '';
                    var tmplDate;
                    var groupIdx = 0;
                    content = '<tr' + (majorTick ? ' class="k-middle-row"' : '') + '>';
                    var resources = function (groupIndex) {
                        return function () {
                            return that._resourceBySlot({ groupIndex: groupIndex });
                        };
                    };
                    for (; groupIdx < groupsCount; groupIdx++) {
                        for (idx = 0, length = columnCount; idx < length; idx++) {
                            classes = '';
                            if (JalaliKendoDate.isToday(dates[idx])) {
                                classes += 'k-today';
                            }
                            if (JalaliKendoDate.getMilliseconds(date) < JalaliKendoDate.getMilliseconds(that.options.workDayStart) || JalaliKendoDate.getMilliseconds(date) >= JalaliKendoDate.getMilliseconds(that.options.workDayEnd) || !that._isWorkDay(dates[idx])) {
                                classes += ' k-nonwork-hour';
                            }
                            content += '<td' + (classes !== '' ? ' class="' + classes + '"' : '') + '>';
                            tmplDate = JalaliKendoDate.getDate(dates[idx]);
                            var beforeStr = tmplDate.toLocaleDateString();
                            JalaliKendoDate.setTime(tmplDate, JalaliKendoDate.getMilliseconds(date));

                            var afterStr = tmplDate.toLocaleDateString();
                            if (beforeStr === afterStr && JalaliKendoDate.getMilliseconds(date) == MS_PER_DAY)
                                JalaliKendoDate.setTime(tmplDate, 90000000);

                            content += slotTemplate({
                                date: tmplDate,
                                resources: resources(isVerticalGroupped ? rowIdx : groupIdx)
                            });
                            content += '</td>';
                        }
                    }
                    content += '</tr>';
                    return content;
                };
                for (var rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                    html += allDayVerticalGroupRow ? allDayVerticalGroupRow(rowIdx) : '';
                    html += this._forTimeRange(start, end, appendRow);
                }
                html += '</tbody>';
                this.content.find('table').append(html);
            },
            _isWorkDay: function (date) {
                var day = date.getDay();
                var workDays = this._workDays;
                for (var i = 0; i < workDays.length; i++) {
                    if (workDays[i] === day) {
                        return true;
                    }
                }
                return false;
            },
            _render: function (dates) {
                var that = this;
                dates = dates || [];
                this._dates = dates;
                this._startDate = dates[0];
                this._endDate = dates[dates.length - 1 || 0];
                this.createLayout(this._layout(dates));
                this._content(dates);
                this._footer();
                this.refreshLayout();
                var allDayHeader = this.element.find('.k-scheduler-header-all-day td');
                if (allDayHeader.length) {
                    this._allDayHeaderHeight = allDayHeader.first()[0].clientHeight;
                }
                that.datesHeader.on('click' + NS, '.k-nav-day', function (e) {
                    var th = $(e.currentTarget).closest('th');
                    var offset = th.offset();
                    var slot = that._slotByPosition(offset.left, offset.top + th.outerHeight());
                    that.trigger('navigate', {
                        view: 'day',
                        date: slot.startDate()
                    });
                });
            },
            startTime: function () {
                var options = this.options;
                return options.showWorkHours ? options.workDayStart : options.startTime;
            },
            endTime: function () {
                var options = this.options;
                return options.showWorkHours ? options.workDayEnd : options.endTime;
            },
            startDate: function () {
                return this._startDate;
            },
            endDate: function () {
                return this._endDate;
            },
            _end: function (isAllDay) {
                var time = getMilliseconds(this.endTime()) || MS_PER_DAY;
                if (isAllDay) {
                    time = 0;
                }
                return new DATE(this._endDate.getTime() + time);
            },
            nextDate: function () {
                return JalaliKendoDate.nextDay(this.endDate());
            },
            previousDate: function () {
                return JalaliKendoDate.previousDay(this.startDate());
            },
            calculateDateRange: function () {
                this._render([this.options.date]);
            },
            destroy: function () {
                var that = this;
                if (that._currentTimeUpdateTimer) {
                    clearInterval(that._currentTimeUpdateTimer);
                }
                if (that.datesHeader) {
                    that.datesHeader.off(NS);
                }
                if (that.element) {
                    that.element.off(NS);
                }
                if (that.footer) {
                    that.footer.remove();
                }
                SchedulerView.fn.destroy.call(this);
                if (this._isMobile() && that.options.editable) {
                    if (that.options.editable.create !== false) {
                        that._addUserEvents.destroy();
                        that._allDayUserEvents.destroy();
                    }
                    if (that.options.editable.update !== false) {
                        that._editUserEvents.destroy();
                    }
                }
            },
            inRange: function (options) {
                var inRange = SchedulerView.fn.inRange.call(this, options);
                var startTime = getMilliseconds(this.startTime());
                var endTime = getMilliseconds(this.endTime()) || JalaliKendoDate.MS_PER_DAY;
                var start = getMilliseconds(options.start);
                var end = getMilliseconds(options.end) || JalaliKendoDate.MS_PER_DAY;
                return inRange && startTime <= start && end <= endTime;
            },
            selectionByElement: function (cell) {
                var offset = cell.offset();
                return this._slotByPosition(offset.left, offset.top);
            },
            _timeSlotInterval: function () {
                var options = this.options;
                return options.majorTick / options.minorTickCount * MS_PER_MINUTE;
            },
            _timeSlotIndex: function (date) {
                var options = this.options;
                var eventStartTime = getMilliseconds(date);
                var startTime = getMilliseconds(this.startTime());
                var timeSlotInterval = options.majorTick / options.minorTickCount * MS_PER_MINUTE;
                return (eventStartTime - startTime) / timeSlotInterval;
            },
            _slotIndex: function (date, multiday) {
                if (multiday) {
                    return this._dateSlotIndex(date);
                }
                return this._timeSlotIndex(date);
            },
            _dateSlotIndex: function (date, overlaps) {
                var idx;
                var length;
                var slots = this._dates || [];
                var slotStart;
                var slotEnd;
                var offset = 1;
                for (idx = 0, length = slots.length; idx < length; idx++) {
                    slotStart = JalaliKendoDate.getDate(slots[idx]);
                    slotEnd = new DATE(JalaliKendoDate.getDate(slots[idx]).getTime() + MS_PER_DAY - (overlaps ? 0 : 1));
                    if (isInDateRange(date, slotStart, slotEnd)) {
                        return idx * offset;
                    }
                }
                return -1;
            },
            _positionAllDayEvent: function (element, slotRange) {
                var slotWidth = slotRange.innerWidth();
                var startIndex = slotRange.start.index;
                var endIndex = slotRange.end.index;
                var allDayEvents = SchedulerView.collidingEvents(slotRange.events(), startIndex, endIndex);
                var currentColumnCount = this._headerColumnCount || 0;
                var leftOffset = 2;
                var rightOffset = startIndex !== endIndex ? 5 : 4;
                var eventHeight = this._allDayHeaderHeight;
                var start = slotRange.startSlot();
                element.css({
                    left: start.offsetLeft + leftOffset,
                    width: slotWidth - rightOffset
                });
                slotRange.addEvent({
                    slotIndex: startIndex,
                    start: startIndex,
                    end: endIndex,
                    element: element
                });
                allDayEvents.push({
                    slotIndex: startIndex,
                    start: startIndex,
                    end: endIndex,
                    element: element
                });
                var rows = SchedulerView.createRows(allDayEvents);
                if (rows.length && rows.length > currentColumnCount) {
                    this._headerColumnCount = rows.length;
                }
                var top = slotRange.start.offsetTop;
                for (var idx = 0, length = rows.length; idx < length; idx++) {
                    var rowEvents = rows[idx].events;
                    for (var j = 0, eventLength = rowEvents.length; j < eventLength; j++) {
                        $(rowEvents[j].element).css({ top: top + idx * eventHeight });
                    }
                }
            },
            _arrangeColumns: function (element, top, height, slotRange) {
                var startSlot = slotRange.start;
                element = {
                    element: element,
                    slotIndex: startSlot.index,
                    start: top,
                    end: top + height
                };
                var columns, slotWidth = startSlot.clientWidth, eventRightOffset = slotWidth * 0.1, columnEvents, eventElements = slotRange.events(), slotEvents = SchedulerView.collidingEvents(eventElements, element.start, element.end);
                slotRange.addEvent(element);
                slotEvents.push(element);
                columns = SchedulerView.createColumns(slotEvents);
                var columnWidth = (slotWidth - eventRightOffset) / columns.length;
                for (var idx = 0, length = columns.length; idx < length; idx++) {
                    columnEvents = columns[idx].events;
                    for (var j = 0, eventLength = columnEvents.length; j < eventLength; j++) {
                        columnEvents[j].element[0].style.width = columnWidth - 4 + 'px';
                        columnEvents[j].element[0].style.left = (this._isRtl ? eventRightOffset : 0) + startSlot.offsetLeft + idx * columnWidth + 2 + 'px';
                    }
                }
            },
            _positionEvent: function (event, element, slotRange) {
                var start = event._startTime || event.start;
                var end = event._endTime || event.end;
                var rect = slotRange.innerRect(start, end, false);
                var height = rect.bottom - rect.top - 2;
                if (height < 0) {
                    height = 0;
                }
                element.css({
                    top: rect.top,
                    height: height
                });
                this._arrangeColumns(element, rect.top, element[0].clientHeight, slotRange);
            },
            _createEventElement: function (event, isOneDayEvent, head, tail) {
                var template = isOneDayEvent ? this.eventTemplate : this.allDayEventTemplate;
                var options = this.options;
                var editable = options.editable;
                var isMobile = this._isMobile();
                var showDelete = editable && editable.destroy !== false && !isMobile;
                var resizable = editable && editable.resize !== false;
                var startDate = getDate(this.startDate());
                var endDate = getDate(this.endDate());
                var startTime = getMilliseconds(this.startTime());
                var endTime = getMilliseconds(this.endTime());
                var eventStartTime = event._time('start');
                var eventEndTime = event._time('end');
                var middle;
                if (startTime >= endTime) {
                    endTime = getMilliseconds(new DATE(this.endTime().getTime() + MS_PER_DAY - 1));
                }
                if (!isOneDayEvent && !event.isAllDay) {
                    endDate = new DATE(endDate.getTime() + MS_PER_DAY);
                }
                var eventStartDate = event.start;
                var eventEndDate = event.end;
                if (event.isAllDay) {
                    eventEndDate = getDate(event.end);
                }
                if (!isInDateRange(getDate(eventStartDate), startDate, endDate) && !isInDateRange(eventEndDate, startDate, endDate) || isOneDayEvent && eventStartTime < startTime && eventEndTime > endTime) {
                    middle = true;
                } else if (getDate(eventStartDate) < startDate || isOneDayEvent && eventStartTime < startTime) {
                    tail = true;
                } else if (eventEndDate > endDate && !isOneDayEvent || isOneDayEvent && eventEndTime > endTime) {
                    head = true;
                }
                var resources = this.eventResources(event);
                if (event._startTime && eventStartTime !== JalaliKendoDate.getMilliseconds(event.start)) {
                    eventStartDate = new DATE(eventStartTime);
                    eventStartDate = kendo.timezone.apply(eventStartDate, 'Etc/UTC');
                }
                if (event._endTime && eventEndTime !== JalaliKendoDate.getMilliseconds(event.end)) {
                    eventEndDate = new DATE(eventEndTime);
                    eventEndDate = kendo.timezone.apply(eventEndDate, 'Etc/UTC');
                }
                var data = extend({}, {
                    ns: kendo.ns,
                    resizable: resizable,
                    showDelete: showDelete,
                    middle: middle,
                    head: head,
                    tail: tail,
                    singleDay: this._dates.length == 1,
                    resources: resources,
                    inverseColor: resources && resources[0] ? this._shouldInverseResourceColor(resources[0]) : false
                }, event, {
                    start: eventStartDate,
                    end: eventEndDate
                });
                var element = $(template(data));
                this.angular('compile', function () {
                    return {
                        elements: element,
                        data: [{ dataItem: data }]
                    };
                });
                return element;
            },
            _isInTimeSlot: function (event) {
                var slotStartTime = this.startTime(), slotEndTime = this.endTime(), startTime = event._startTime || event.start, endTime = event._endTime || event.end;
                if (getMilliseconds(slotEndTime) === getMilliseconds(JalaliKendoDate.getDate(slotEndTime))) {
                    slotEndTime = JalaliKendoDate.getDate(slotEndTime);
                    setTime(slotEndTime, MS_PER_DAY - 1);
                }
                if (event._date('end') > event._date('start')) {
                    endTime = +event._date('end') + (MS_PER_DAY - 1);
                }
                endTime = endTime - event._date('end');
                startTime = startTime - event._date('start');
                slotEndTime = getMilliseconds(slotEndTime);
                slotStartTime = getMilliseconds(slotStartTime);
                if (slotStartTime === startTime && startTime === endTime) {
                    return true;
                }
                var overlaps = startTime !== slotEndTime;
                return isInTimeRange(startTime, slotStartTime, slotEndTime, overlaps) || isInTimeRange(endTime, slotStartTime, slotEndTime, overlaps) || isInTimeRange(slotStartTime, startTime, endTime) || isInTimeRange(slotEndTime, startTime, endTime);
            },
            _isInDateSlot: function (event) {
                var groups = this.groups[0];
                var slotStart = groups.firstSlot().start;
                var slotEnd = groups.lastSlot().end - 1;
                var startTime = JalaliKendoDate.toUtcTime(event.start);
                var endTime = JalaliKendoDate.toUtcTime(event.end);
                return (isInDateRange(startTime, slotStart, slotEnd) || isInDateRange(endTime, slotStart, slotEnd) || isInDateRange(slotStart, startTime, endTime) || isInDateRange(slotEnd, startTime, endTime)) && (!isInDateRange(endTime, slotStart, slotStart) || isInDateRange(endTime, startTime, startTime) || event.isAllDay);
            },
            _updateAllDayHeaderHeight: function (height) {
                if (this._height !== height) {
                    this._height = height;
                    var allDaySlots = this.element.find('.k-scheduler-header-all-day td');
                    if (allDaySlots.length) {
                        allDaySlots.parent().add(this.element.find('.k-scheduler-times-all-day').parent()).height(height);
                        for (var groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                            this.groups[groupIndex].refresh();
                        }
                    }
                }
            },
            _renderEvents: function (events, groupIndex) {
                var allDayEventContainer = this.datesHeader.find('.k-scheduler-header-wrap > div');
                var event;
                var idx;
                var length;
                for (idx = 0, length = events.length; idx < length; idx++) {
                    event = events[idx];
                    if (this._isInDateSlot(event)) {
                        var isMultiDayEvent = event.isAllDay || event.end.getTime() - event.start.getTime() >= MS_PER_DAY;
                        var container = isMultiDayEvent && !this._isVerticallyGrouped() ? allDayEventContainer : this.content;
                        var element;
                        var ranges;
                        var group;
                        if (!isMultiDayEvent) {
                            if (this._isInTimeSlot(event)) {
                                group = this.groups[groupIndex];
                                if (!group._continuousEvents) {
                                    group._continuousEvents = [];
                                }
                                ranges = group.slotRanges(event);
                                var rangeCount = ranges.length;
                                for (var rangeIndex = 0; rangeIndex < rangeCount; rangeIndex++) {
                                    var range = ranges[rangeIndex];
                                    var start = event.start;
                                    var end = event.end;
                                    if (rangeCount > 1) {
                                        if (rangeIndex === 0) {
                                            end = range.end.endDate();
                                        } else if (rangeIndex == rangeCount - 1) {
                                            start = range.start.startDate();
                                        } else {
                                            start = range.start.startDate();
                                            end = range.end.endDate();
                                        }
                                    }
                                    var occurrence = event.clone({
                                        start: start,
                                        end: end,
                                        _startTime: event._startTime,
                                        _endTime: event.endTime
                                    });
                                    if (this._isInTimeSlot(occurrence)) {
                                        var head = range.head;
                                        element = this._createEventElement(event, !isMultiDayEvent, head, range.tail);
                                        element.appendTo(container);
                                        this._positionEvent(occurrence, element, range);
                                        addContinuousEvent(group, range, element, false);
                                    }
                                }
                            }
                        } else if (this.options.allDaySlot) {
                            group = this.groups[groupIndex];
                            if (!group._continuousEvents) {
                                group._continuousEvents = [];
                            }
                            ranges = group.slotRanges(event);
                            if (ranges.length) {
                                element = this._createEventElement(event, !isMultiDayEvent);
                                this._positionAllDayEvent(element, ranges[0]);
                                addContinuousEvent(group, ranges[0], element, true);
                                element.appendTo(container);
                            }
                        }
                    }
                }
            },
            render: function (events) {
                this._headerColumnCount = 0;
                this._groups();
                this.element.find('.k-event').remove();
                events = new kendo.data.Query(events).sort([
                    {
                        field: 'start',
                        dir: 'asc'
                    },
                    {
                        field: 'end',
                        dir: 'desc'
                    }
                ]).toArray();
                var eventsByResource = [];
                this._eventsByResource(events, this.groupedResources, eventsByResource);
                var eventsPerDate = $.map(this._dates, function (date) {
                    return Math.max.apply(null, $.map(eventsByResource, function (events) {
                        return $.grep(events, function (event) {
                            return event.isMultiDay() && isInDateRange(date, getDate(event.start), getDate(event.end));
                        }).length;
                    }));
                });
                var height = Math.max.apply(null, eventsPerDate);
                this._updateAllDayHeaderHeight((height + 1) * this._allDayHeaderHeight);
                for (var groupIndex = 0; groupIndex < eventsByResource.length; groupIndex++) {
                    this._renderEvents(eventsByResource[groupIndex], groupIndex);
                }
                this.refreshLayout();
                this.trigger('activate');
            },
            _eventsByResource: function (events, resources, result) {
                var resource = resources[0];
                if (resource) {
                    var view = resource.dataSource.view();
                    for (var itemIdx = 0; itemIdx < view.length; itemIdx++) {
                        var value = this._resourceValue(resource, view[itemIdx]);
                        var eventsFilteredByResource = new kendo.data.Query(events).filter({
                            field: resource.field,
                            operator: SchedulerView.groupEqFilter(value)
                        }).toArray();
                        if (resources.length > 1) {
                            this._eventsByResource(eventsFilteredByResource, resources.slice(1), result);
                        } else {
                            result.push(eventsFilteredByResource);
                        }
                    }
                } else {
                    result.push(events);
                }
            },
            _columnOffsetForResource: function (index) {
                return this._columnCountForLevel(index) / this._columnCountForLevel(index - 1);
            },
            _columnCountForLevel: function (level) {
                var columnLevel = this.columnLevels[level];
                return columnLevel ? columnLevel.length : 0;
            },
            _rowCountForLevel: function (level) {
                var rowLevel = this.rowLevels[level];
                return rowLevel ? rowLevel.length : 0;
            },
            clearSelection: function () {
                this.content.add(this.datesHeader).find('.k-state-selected').removeAttr('id').attr('aria-selected', false).removeClass('k-state-selected');
            },
            _updateDirection: function (selection, ranges, multiple, reverse, vertical) {
                var isDaySlot = selection.isAllDay;
                var startSlot = ranges[0].start;
                var endSlot = ranges[ranges.length - 1].end;
                if (multiple) {
                    if (vertical) {
                        if (!isDaySlot && startSlot.index === endSlot.index && startSlot.collectionIndex === endSlot.collectionIndex) {
                            selection.backward = reverse;
                        }
                    } else {
                        if (isDaySlot && startSlot.index === endSlot.index || !isDaySlot && startSlot.collectionIndex === endSlot.collectionIndex) {
                            selection.backward = reverse;
                        }
                    }
                }
            },
            _changeViewPeriod: function (selection, reverse, vertical) {
                if (!vertical) {
                    var date = reverse ? this.previousDate() : this.nextDate();
                    var start = selection.start;
                    var end = selection.end;
                    selection.start = new DATE(date);
                    selection.end = new DATE(date);
                    var endMilliseconds = selection.isAllDay ? MS_PER_DAY : getMilliseconds(end);
                    setTime(selection.start, getMilliseconds(start));
                    setTime(selection.end, endMilliseconds);
                    if (!this._isVerticallyGrouped()) {
                        selection.groupIndex = reverse ? this.groups.length - 1 : 0;
                    }
                    selection.events = [];
                    return true;
                }
            }
        });
        extend(true, ui, {
            MultiDayView: MultiDayView,
            DayView: MultiDayView.extend({
                options: {
                    name: 'DayView',
                    title: 'Day'
                },
                name: 'day'
            }),
            WeekView: MultiDayView.extend({
                options: {
                    name: 'WeekView',
                    title: 'Week',
                    selectedDateFormat: '{0:D} - {1:D}',
                    selectedShortDateFormat: '{0:d} - {1:d}'
                },
                name: 'week',
                calculateDateRange: function () {
                    var selectedDate = this.options.date, start = JalaliKendoDate.dayOfWeek(selectedDate, this.calendarInfo().firstDay, -1), idx, length, dates = [];
                    for (idx = 0, length = 7; idx < length; idx++) {
                        dates.push(start);
                        start = JalaliKendoDate.nextDay(start);
                    }
                    this._render(dates);
                }
            }),
            WorkWeekView: MultiDayView.extend({
                options: {
                    name: 'WorkWeekView',
                    title: 'Work Week',
                    selectedDateFormat: '{0:D} - {1:D}',
                    selectedShortDateFormat: '{0:d} - {1:d}'
                },
                name: 'workWeek',
                nextDate: function () {
                    return JalaliKendoDate.dayOfWeek(JalaliKendoDate.nextDay(this.startDate()), this.calendarInfo().firstDay, 1);
                },
                previousDate: function () {
                    var weekStart = JalaliKendoDate.dayOfWeek(this.startDate(), this.calendarInfo().firstDay, -1);
                    return JalaliKendoDate.previousDay(weekStart);
                },
                calculateDateRange: function () {
                    var selectedDate = this.options.date, dayOfWeek = JalaliKendoDate.dayOfWeek, weekStart = dayOfWeek(selectedDate, this.calendarInfo().firstDay, -1), start = dayOfWeek(weekStart, this.options.workWeekStart, 1), end = dayOfWeek(start, this.options.workWeekEnd, 1), dates = [];
                    while (start <= end) {
                        dates.push(start);
                        start = JalaliKendoDate.nextDay(start);
                    }
                    this._render(dates);
                }
            })
        });
    }(window.kendo.jQuery));
    return window.kendo;
}, typeof define == 'function' && define.amd ? define : function (a1, a2, a3) {
    (a3 || a2)();
}));