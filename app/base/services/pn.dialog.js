define(['angularAMD'], function (app) {
    app.factory('pn.dialog', ["ModalService", "$q", function (ModalService, $q) {


		function show(templateUrl, controller, title, message, yesTitle, noTitle, params) {
			
            var deferred = $q.defer();
            ModalService.showModal({
                templateUrl: templateUrl,
                controller: controller,
                inputs: {
                    title: title,
                    message: message,
                    yesTitle: yesTitle,
                    noTitle: noTitle,
                    isQuestion: true,
                    params: params
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        };


        // TODO Expand This
        function showYesNo(title, message, yesTitle, noTitle, params) {
            var deferred = $q.defer();
            ModalService.showModal({
                templateUrl: "/app/base/views/dialog.html",
                controller: "dialogController",
                inputs: {
                    title: title,
                    message: message,
                    yesTitle: yesTitle,
                    noTitle: noTitle,
                    isQuestion: true,
                    params: params
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        };

        function showMessage(title, message, params) {
            var deferred = $q.defer();
            ModalService.showModal({
                templateUrl: "/app/base/views/dialog.html",
                controller: "dialogController",
                inputs: {
                    title: title,
                    message: message,
                    yesTitle: "",
                    noTitle: "",
                    isQuestion: false,
                    params: params
                }
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        };

        return {
            showYesNo,
            showMessage,
            show
        }
    }
    ]);
});
