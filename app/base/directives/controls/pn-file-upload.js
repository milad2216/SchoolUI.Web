define(['angularAMD'], function (control) {
    control.directive('pnFileUpload', ["$timeout", "Notification", "pn.message", function ($timeout, notify, pnMessage) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                config: '=?',
                api: '=',
                isHidden: "@",
                onSelected: "&",
                onSuccess: "&",
                onCancel: "&",
                onUploadComplete: "&",
                onProgress: "&",
                onRemove: "&",
                onUpload: "&"
            },
            template: '<input  type="file" ng-hide="isHidden" />',

            link: function (scope, element, attrs) {

                var _fileUploadData = $(element).kendoUpload({
                    //async: {
                    //    saveUrl: (scope.config == undefined || scope.config.saveUrl == undefined) ? true : scope.config.saveUrl,
                    //    removeUrl: (scope.config == undefined || scope.config.removeUrl == undefined) ? true : scope.config.removeUrl,
                    //    autoUpload: (scope.config == undefined || scope.config.autoUpload == undefined) ? true : scope.config.autoUpload,
                    //    batch: (scope.config == undefined || scope.config.batch == undefined) ? true : scope.config.batch,
                    //    saveField: (scope.config == undefined || scope.config.saveField == undefined) ? true : scope.config.saveField
                    //},
                    multiple: (scope.config == undefined || scope.config.multiple == undefined) ? true : scope.config.multiple,
                    //validation: {
                    //maxFileSize: 10,
                    //allowedExtensions: [".gif", ".jpg", ".png"],
                    //  allowedExtensions: (scope.config == undefined ||  scope.config.allowedExtensions == undefined )? true : scope.config.allowedExtensions
                    //},
                    success: onSuccess,
                    cancel: onCancel,
                    select: onSelect,
                    complete: onUploadComplete,
                    error: onError,
                    progress: onProgress,
                    remove: onRemove,
                    upload: onUpload

                }).data("kendoUpload");



                function onSelect(e) {
                    var files = e.files;
                    var filesAllowed = true;
                    $.each(files, function () {
                        debugger
                        if (scope.config.allowedExtensions.length > 0)
                            if ($.inArray(this.extension.toLowerCase(), scope.config.allowedExtensions) < 0) {
                                e.preventDefault();
                                objMsg = { message: 'فرمت فایل اشتباه است', title: pnMessage.common.error };
                                notify.error(objMsg);
                                filesAllowed = false;
                            }
                            else if (this.size > scope.config.maxSize) {
                                objMsg = { message: 'حجم فایل بیش از حد مجاز است', title: pnMessage.common.error };
                                notify.error(objMsg);
                            }
                    });

                    if (filesAllowed) {
                        var _fileUpload = _fileUploadData.element[0];
                        if (_fileUpload.files.length > 0) {
                            var _fileReader = new FileReader();
                            _fileReader.onload = function (fileStream) {
                                if (attrs.panelfile == "false") {
                                    $(".k-upload .k-upload-files").hide();
                                }
                                if (scope.config.preview) {
                                    var fileInfo = e.files[0];
                                    var wrapper = e.sender.wrapper;
                                    setTimeout(function () {
                                        addPreview(fileInfo, wrapper);
                                    });
                                }

                                scope.onSelected({ fileStream: fileStream.target.result, fileInfo: e });
                            };
                            _fileReader.readAsDataURL(_fileUpload.files[0]);
                        }
                    }

                }

                function onSuccess(e) {
                    scope.onSuccess({ e: e });
                }

                function onCancel(e) {
                    scope.OnCancel({ e: e });
                }

                function onUploadComplete(e) {
                    scope.onUploadComplete({ e: e });
                }

                function onError(e) {

                    if (e.XMLHttpRequest.status == 500) {
                        var objMsg = { message: e.XMLHttpRequest.response, title: 'ارسال فایل' };
                        notify.error(objMsg);
                    }
                }

                function onProgress(e) {
                    scope.onProgress({ e: e });
                }

                function onRemove(e) {
                    scope.onRemove({ e: e });
                }

                function onUpload(e) {
                    scope.onUpload({ e: e });
                }



                scope.api = {
                    toggle: function () {
                        _fileUploadData.toggle();
                    },
                    enable: function () {
                        _fileUploadData.enable();
                    },
                    disable: function () {

                        _fileUploadData.disable();
                    },
                    upload: function () {
                        _fileUploadData.upload();
                    },
                    focus: function () {
                        _fileUploadData.focus();
                    }
                }


                if (attrs.panelfile == "false") {
                    setTimeout(function () { $(".k-upload .k-upload-files").hide(); }, 1000);
                }

                function addPreview(file, wrapper) {
                    var raw = file.rawFile;
                    var reader = new FileReader();

                    if (raw) {
                        reader.onloadend = function () {
                            var preview = $("<img class='image-preview'>").attr("src", this.result);

                            wrapper.find(".k-file[data-uid='" + file.uid + "']")
                                .append(preview);
                        };

                        reader.readAsDataURL(raw);
                    }
                }
              
            }
        }
    }]);
});
