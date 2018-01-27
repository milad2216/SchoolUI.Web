/* Iran Culture*/
(function (window, undefined) {
    kendo.cultures["fa-IR"] = {
        name: "fa-IR",
        numberFormat: {
            pattern: ["-n"],
            decimals: 2,
            ",": ",",
            ".": ".",
            groupSize: [3],
            percent: {
                pattern: ["-n %", "n %"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "%"
            },
            currency: {
                pattern: ["-$n", "$n"],
                decimals: 2,
                ",": ",",
                ".": ".",
                groupSize: [3],
                symbol: "£"
            }
        },
        calendars: {
            standard: {
                days: {
                    names: ["يکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه"],
                    namesAbbr: ["يک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
                    namesShort: ["ي", "د", "س", "چ", "پ", "ج", "ش"]
                },
                months: {
                    names: ["فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند", ""],
                    namesAbbr: ["فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند", ""]
                },
                AM: ["ق.ض", "ق.ض", "ق.ض"],
                PM: ["ب.ض", "ب.ض", "ب.ض"],
                patterns: {
                    d: "yyyy/MM/dd",
                    D: "yyyy/MM/dd",
                    F: "yyyy/MM/dd HH:mm:ss",
                    g: "yyyy/MM/dd HH:mm",
                    G: "yyyy/MM/dd HH:mm:ss",
                    m: "dd MMMM",
                    M: "dd MMMM",
                    s: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    u: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    y: "MMMM yyyy",
                    Y: "MMMM yyyy"
                },
                "/": "/",
                ":": ":",
                firstDay: 6
            }
        }
    }
})(this);

kendo.culture("fa-IR");


kendo.ui.Locale = "Persian (fa-IR)";
kendo.ui.ColumnMenu.prototype.options.messages =
  $.extend(kendo.ui.ColumnMenu.prototype.options.messages, {

      /* COLUMN MENU MESSAGES 
       ****************************************************************************/
      sortAscending: "مرتب سازی صعودی",
      sortDescending: "مرتب سازی نزولی",
      filter: "فیلتر",
      columns: "ستون ها"
      /***************************************************************************/
  });


kendo.ui.Groupable.prototype.options.messages =
  $.extend(kendo.ui.Groupable.prototype.options.messages, {

      /* GRID GROUP PANEL MESSAGES 
       ****************************************************************************/
      empty: "برای گروه‌بندی، عنوان یک ستون را به اینجا بکشید"
      /***************************************************************************/
  });

kendo.ui.FilterMenu.prototype.options.messages =
  $.extend(kendo.ui.FilterMenu.prototype.options.messages, {

      /* FILTER MENU MESSAGES 
       ***************************************************************************/
      info: "فیلتر:",        // sets the text on top of the filter menu
      filter: "اعمال فیلتر",      // sets the text for the "Filter" button
      clear: "لغو فیلتر",        // sets the text for the "Clear" button
      // when filtering boolean numbers
      isTrue: "درست باشد", // sets the text for "isTrue" radio button
      isFalse: "نادرست باشد",     // sets the text for "isFalse" radio button
      //changes the text of the "And" and "Or" of the filter menu
      and: "و",
      or: "یا",
      selectValue: "-انتخاب کنید-"
      /***************************************************************************/
  });

kendo.ui.FilterMenu.prototype.options.operators =
  $.extend(kendo.ui.FilterMenu.prototype.options.operators, {

      /* FILTER MENU OPERATORS (for each supported data type) 
       ****************************************************************************/
      string: {
          contains: "شامل",
          startswith: "خاتمه یابد به",
          eq: "برابر با",
          neq: "مخالف با",
          doesnotcontain: "شامل نباشد",
          endswith: "شروع شود با"
      },
      number: {
          eq: "مساوی",
          neq: "مخالف",
          gte: "بزرگتر یا مساوی",
          gt: "بزگتر",
          lte: "کوچکتر یا مساوی",
          lt: "کوچکتر"
      },
      date: {
          eq: "برابر با",
          neq: "غیر از",
          gte: "بعد از یا برابر با",
          gt: "بعد از",
          lte: "قبل از یا برابر با",
          lt: "قبل از"
      },
      enums: {
          eq: "برابر",
          neq: "مخالف"
      }
      /***************************************************************************/
  });

kendo.ui.Pager.prototype.options.messages =
  $.extend(kendo.ui.Pager.prototype.options.messages, {

      /* PAGER MESSAGES 
       ****************************************************************************/
      display: "{0} - {1} از {2} مورد",
      empty: "موردی یافت نشد",
      page: "صفحه",
      of: "از {0}",
      itemsPerPage: "تعداد موارد در هر صفحه",
      first: "اولین",
      previous: "قبلی",
      next: "بعدی",
      last: "آخرین",
      refresh: "بازنشانی"
      /***************************************************************************/
  });

kendo.ui.Validator.prototype.options.messages =
  $.extend(kendo.ui.Validator.prototype.options.messages, {

      /* VALIDATOR MESSAGES 
       ****************************************************************************/
      required: "وارد نمودن {0} الزامی است.",
      pattern: "{0} را صحیح وارد نمائید.",
      min: "{0} باید بزرگتر از {1} باشد",
      max: "{0} باید کوچکتر از {1} باشد",
      step: "{0} صحیح نمی باشد.",
      email: "{0} به عنوان آدرس ایمیل صحیح وارد نشده است.",
      url: "{0} به عنوان آدرس اینترنتی صحیح وارد نشده است",
      date: "{0} به عنوان تاریخ صحیح وارد نشده است"
      /***************************************************************************/
  });

kendo.ui.ImageBrowser.prototype.options.messages =
  $.extend(kendo.ui.ImageBrowser.prototype.options.messages, {

      /* IMAGE BROWSER MESSAGES 
       ****************************************************************************/
      uploadFile: "بارگذاری فایل",
      orderBy: "مرتب سازی با",
      orderByName: "مرتب سازی با نام",
      orderBySize: "مرتب سازی با اندازه",
      directoryNotFound: "مسیر مورد نظر یافت نشد.",
      emptyFolder: "خالی نمودن پوشه",
      deleteFile: 'آیا مطمئن هستید که "{0}" حذف شود؟',
      invalidFileType: "فایل انتخاب شده \"{0}\" نامعتبر است. فایل های پشتیبانی شده عبارتند از: {1}.",
      overwriteFile: "فایل با نام \"{0}\" در مسیر مورد نظر وجود دارد. روی آن نوشته شود؟",
      dropFilesHere: "فایل ها را اینجا قرار دهید"
      /***************************************************************************/
  });

kendo.ui.Editor.prototype.options.messages =
  $.extend(kendo.ui.Editor.prototype.options.messages, {

      /* EDITOR MESSAGES 
       ****************************************************************************/
      bold: "پررنگ",
      italic: "مورب",
      underline: "زیرخط",
      strikethrough: "خط روی متن",
      superscript: "بالانویس",
      subscript: "زیرنویس",
      justifyCenter: "مرتب سازی به مرکز",
      justifyLeft: "مرتب سازی به چپ",
      justifyRight: "مرتب سازی به راست",
      justifyFull: "مرتب سازی کامل",
      insertUnorderedList: "درج لیست نامرتب",
      insertOrderedList: "درج لیست مرتب",
      indent: "افزایش فاصله",
      outdent: "کاهش فاصله",
      createLink: "ایجاد پیوند",
      unlink: "حذف پیوند",
      insertImage: "درج تصویر",
      insertHtml: "درج HTML",
      fontName: "نام قلم",
      fontNameInherit: "قلم",
      fontSize: "اندازه قلم",
      fontSizeInherit: "اندازه قلم",
      formatBlock: "قالب دهی",
      foreColor: "رنگ",
      backColor: "رنگ پس زمینه",
      style: "طرح",
      emptyFolder: "خالی نمودن مسیر",
      uploadFile: "بارگذاری فایل",
      orderBy: "مرتب سازی با:",
      orderBySize: "مرتب سازی بر اساس اندازه",
      orderByName: "مرتب سازی بر اساس نام",
      invalidFileType: "فایل انتخاب شده\"{0}\" نامعتبر است. فایل های پشتیبانی شده عبارتند از: {1}.",
      deleteFile: 'آیا مطمئن هستید که  "{0}" حذف شود؟',
      overwriteFile: "فایل با نام \"{0}\" در مسیر مورد نظر وجود دارد. روی آن نوشته شود؟",
      directoryNotFound: "مسیر مورد نظر یافت نشد",
      imageWebAddress: "آدرس اینترنتی تصویر",
      imageAltText: "متن جایگزین",
      dialogInsert: "درج",
      dialogButtonSeparator: "یا",
      dialogCancel: "انصراف"
      /***************************************************************************/
  });

///* FILE UPLOAD MESSAGES */
//kendo.ui.Upload.prototype.options.localization =
//  $.extend(kendo.ui.Upload.prototype.options.localization, {

//      dropFilesHere: "فایل‌ها را برای بارگذاری به اینجا بکشید",
//      remove: "حذف",
//      retry: "تلاش مجدد",
//      select: "انتخاب فایل...",
//      statusFailed: "بارگذاری ناموفق",
//      statusUploaded: "بارگذاری شد",
//      statusUploading: "در حال بارگذاری...",
//      uploadSelectedFiles: "بارگذاری فایل‌های انتخاب شده"
//  });

var PersianToolbar =
            [{ name: "create", text: "ایجاد" },
            { name: "save", text: "ثبت" },
            { name: "cancel", text: "انصراف" }];


/* SCHEDULER MESSAGES */
//if (kendo.ui.JalaliScheduler) {
//    kendo.ui.JalaliScheduler.prototype.options.messages =
//        $.extend(kendo.ui.Scheduler.prototype.options.messages, {

//            allDay: "کل روز",
//            date: "تاریخ",
//            event: "رویداد",
//            time: "زمان",
//            showFullDay: "نمایش روز کامل",
//            showWorkDay: "نمایش ساعت های کاری",
//            today: "امروز",
//            save: ".ذخیره تغییرات",
//            destroy: "حذف",
//            cancel: "انصراف",
//            views: {
//                day: "روز",
//                week: "هفته",
//                workWeek: "هفته کاری",
//                agenda: "Agenda",
//                month: "ماه"
//            },
//            recurrenceMessages: {
//                deleteWindowTitle: "حذف رویداد تکرار شونده",
//                deleteWindowOccurrence: "حذف رویداد",
//                deleteWindowSeries: "حذف سلسله رویدادها",
//                editWindowTitle: "ویرایش رویداد تکرار شونده",
//                editWindowOccurrence: "ویرایش رویداد",
//                editWindowSeries: "ویرایش سلسله رویدادها",
//                deleteRecurring: "آیا میخواهید تنها این رویداد حذف شود یا تمام رویدادهای تکرار شونده حذف شوند ؟",
//                editRecurring: "آیا میخواهید تنها این رویداد ویرایش شود یا تمام رویدادهای تکرار شونده ویرایش شوند ؟"
//            },
//            editor: {
//                title: "عنوان",
//                start: "تاریخ",
//                end: "تاریخ پایان",
//                allDayEvent: "یک روز کامل",
//                description: "توضیحات",
//                repeat: "شیوه تکرار",
//                timezone: " ",
//                startTimezone: "Start timezone",
//                endTimezone: "End timezone",
//                separateTimezones: "استفاده از منطقه زمانی متفاوت برای شروع و پایان",
//                timezoneEditorTitle: "منطقه زمانی",
//                timezoneEditorButton: "منطقه زمانی",
//                timezoneTitle: "منطقه های زمانی",
//                noTimezone: "بدون منطقه زمانی",
//                editorTitle: "اطلاعات رویداد",
//                ownerId: "نوع مناسبت",
//                owner: "نوع مناسبت"
//            }
//        });
//}


kendo.ui.RecurrenceEditor.prototype.options.messages =
	$.extend(kendo.ui.RecurrenceEditor.prototype.options.messages, {
	    frequencies: {
	        never: 'هیچکدام',
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

	});

