define(['angularAMD'], function (app) {
	app.factory('pn.message', [function () {
		// TODO Expand This
		var service = {

                   confirm: 'تایید',
					deleteSure: 'آیا نسبت به حذف این آیتم اطمینان دارید؟',
					successfullDelete: "حذف اطلاعات با موفقیت انجام شد",
					deleteItem: "حذف آیتم",
					errorInsert: "اطلاعات برای ثبت وجود ندارد",
					errorUpdate: "اطلاعاتی برای ویرایش وجود ندارد",
					errorDelete: "اطلاعاتی برای حذف وجود ندارد",
					errorRepeat: "اطلاعات مورد نظر تکراری است",
					error: "خطا",
					successfullInsert: "اطلاعات با موفقیت ثبت شدند",
					SuccessfullUpdate: "اطلاعات با موفقیت ویرایش شدند",
					SuccessfullDelete: "اطلاعات با موفقیت حذف شدند",
					notFoundApplyData: "عملیاتی برای ثبت یافت نشد",
					insert: "ثبت اطلاعات",
					update: "ویرایش اطلاعات",
					delete: "حذف اطلاعات",
					note: "توجه",
					noSelectedGoodItemForDelete: "حذف ردیف انتخاب شده ممکن نمی باشد",
					yes: "بله",
					no:"خیر",
					noSelectedUser: "کاربر به درستی انتخاب نشد است",
                    noExistsPersonWithId: "شخصی با شماره پرسنل وارد شده موجود نمی باشد",
			common:
				{
                    confirm: 'تایید',
					deleteSure: 'آیا نسبت به حذف این آیتم اطمینان دارید؟',
					successfullDelete: "حذف اطلاعات با موفقیت انجام شد",
					deleteItem: "حذف آیتم",
					errorInsert: "اطلاعاتی برای ثبت وجود ندارد",
					errorUpdate: "اطلاعاتی برای ویرایش وجود ندارد",
					errorDelete: "اطلاعاتی برای حذف وجود ندارد",
					errorView: "اطلاعاتی برای نمایش وجود ندارد",
					errorRepeat: "اطلاعات مورد نظر تکراری است",
					error: "خطا",
					successfullInsert: "اطلاعات با موفقیت ثبت شد",
					SuccessfullUpdate: "اطلاعات با موفقیت ویرایش شدند",
					SuccessfullDelete: "اطلاعات با موفقیت حذف شدند",
					notFoundApplyData: "عملیاتی برای ثبت یافت نشد",
					insert: "ثبت اطلاعات",
					update: "ویرایش اطلاعات",
					delete: "حذف اطلاعات",
					note: "توجه",
					noSelectedGoodItemForDelete: "آیتم مناسبی برای حذف انتخاب نشده است",
					yes: "بله",
					no:"خیر",
					noSelectedUser: "کاربر به درستی انتخاب نشد است",
					disableUpdate: "این رکورد قابل ویرایش نیست",
					unSelectInfo: "اطلاعاتی انتخاب نشده است",
					cancel: "انصراف",
					okChange: "ثبت تغییرات",
                    add: "افزودن",
                    wfCartableReferenceOperation: "اتمام عملیات",
                    wfCartableReferenceOperationSure: "آیا از اتمام عملیات مطمئن هستید؟",
                    wfCartableFinishOperationNoSelectedRecord: "رکوردی انتخاب نشده است",
                    wfCartableFinishedOperationSuccess: "گردش با موفقیت پایان یافت",
                    wfCartableFinishedOperationError: "در خاتمه گردش خطایی رخ داده است",


				},
			um:
                {
			    role: 'نقش',
			    noExistsPersonWithId: "شخصی با شماره پرسنل وارد شده موجود نمی باشد"
                },
			inf:
                {
                    noSelectedGoodItemForDelete: "حذف ردیف انتخاب شده ممکن نمی باشد",
                    noSelectedGoodItemForUpdate: "ردیف انتخاب شده قابل ویرایش نمی باشد",
                    selectSystemItemFirst: "لطفا گروه سیستم را انتخاب نمایید",
                }
		};

		return service;
	}
	]);
});