define(['base/app'], function (app) {
    app.register.directive('pnOrgRequestDefinition',
           function () {
               return {
                   restrict: 'E',
                   templateUrl: '/app/base/partials/directives/pn-orgRequestDefinition.html',
                   scope: {
                       title:'=',
                       selectRecord:'='
                   },
                   controller: ["$scope", "pn.remote.service", "pn.enum", "pn.dialog", "pn.focus", "Notification", "pn.errorHandler"
                       , "orgWebAccess", "pn.validator", "$q", "pn.message", "$rootScope", "$state", 'pn.appContext', 'AuthToken', 'localStorageService',
                       function ($scope, remoteService, pnenum, dialog, focus, notify, errorHandler, WebAccess, validator, $q, pnMessage, $rootScope, $state, appContext, authToken, localStorageService) {
                   var gridKendo = null;
                   $scope.model = {};
                   $scope.gridSelectedItems = [];
                   ///******************************************************
                   for (var j = 0; j < $rootScope.tabItems.length; j++) {
                       if ($rootScope.tabItems[j].action.toString().trim().length > 0)
                           if ($state.current.name.indexOf($rootScope.tabItems[j].action) == 0) {
                               $scope.model.SystemFeatureKey = $rootScope.tabItems[j].FormId;
                               break;
                           }
                   }
                   $scope.init = function () {
                       enableGrid(true);
                   }
                   function enableGrid(value) {
                       $scope.disableCtrPanelDocument = value;
                       if ($scope.gridApi)
                           $scope.gridApi.setActive(value);
                       $scope.disableCtrForm = value;
                   }
                   function ClearData() {
                       //commented out by Goodarzyar
                       //var token = localStorageService.get(authToken);
                       //var statusBarEntity = statusBar.jwtToJson(token);
                       $scope.model.UserKey = appContext.user.id;
                       $scope.model.UserName = appContext.user.fullName;
                       $scope.model.Desc = null;
                       $scope.model.SolarDate = null;
                       focus.setFocus('model.Desc');
                   }
                   var resultHandler = function (result, notifyP) {
                       if (result.Success) {
                           notify.success(notifyP);
                           reloadGrid();
                           $scope.init();
                       }
                       else {
                           errorHandler.ShowError(result);
                       }
                       return result.Success;
                   };
                   $scope.grid_onKendoReady = function (kendo, options) {
                       gridKendo = kendo;
                       reloadGrid();
                   };

                   function reloadGrid() {
                       var op = gridKendo.getOptions();
                       op.dataSource.transport.read.data = $scope.model;
                       op.dataSource.transport.read.url = WebAccess + "api/RequestDefinition/GetRequestDefinition";
                       gridKendo.setOptions(op);
                   };
                   $scope.$watch('gridSelectedItems', function () {
                       if ($scope.gridSelectedItems.length <= 0) {
                           $scope.selectRecord = null;
                           return;                   
                       }
                       $scope.selectRecord = $scope.gridSelectedItems[0];
                       $scope.showGridSelectedRowInForm($scope.gridSelectedItems[0]);
                   });
                   $scope.gridConfig = {
                       inlineOperationalUrl: {
                           read: {
                               url: "",
                               data: function () { return $scope.filterQuery; }
                           }
                       },
                    
                   };
                   $scope.gridColumns = [

                                               { field: "Desc", editable: false, title: _t("CommonTitle.Desc"), allownull: false, width: 200 },
                                               { field: "SolarDate", editable: false, title: _t("CommonTitle.Date"), allownull: false, width: 100 },
                                               { field: "UserName", editable: false, title: _t("CommonTitle.Regulators"), allownull: false, width: 100 },
                   ];
                   $scope.gridSchema = { model: { id: "Id", fields: { Code: { type: "number", editable: false } } }, data: "Entities", total: "TotalCount" };
                   //دریافت اطلاعات  از گرید
                   $scope.showGridSelectedRowInForm = function (entity) {
                       $scope.model.Key = entity.Key;
                       $scope.model.UserName = entity.UserName;
                       $scope.model.Desc = entity.Desc;
                       $scope.model.SolarDate = entity.SolarDate;
                       $scope.model.UserKey = entity.UserKey;
                   };
                   //*********************************Template Method*******************************************
                   
                   $scope.doInsert = function () {
                       var defferd = $q.defer();
                           $scope.formOperationState = pnenum.pnformstate.insert;
                           ClearData();
                           enableGrid(false);
                           defferd.resolve(true);
                                         return defferd.promise;
                   };
                   $scope.doEdit = function () {
                       var defferd = $q.defer();
                       if ($scope.model == null || $scope.model.Key == null) {
                           var objMsg = { message: pnMessage.common.errorUpdate, title: pnMessage.common.error };
                           notify.error(objMsg);
                           defferd.resolve(false);
                       }
                       else {
                           $scope.formOperationState = pnenum.pnformstate.update;
                           focus.setFocus('model.Desc');
                           enableGrid(false);
                           defferd.resolve(true);
                       }
                       return defferd.promise;
                   };
                   $scope.doDelete = function () {
                       var resultDelete = false;
                       if ($scope.model == null || $scope.model.Key == null) {
                           var objMsg = { message: pnMessage.common.errorDelete, title: pnMessage.common.error };
                           notify.error(objMsg);
                       }
                       else {
                           dialog.showYesNo(pnMessage.common.note, pnMessage.common.deleteSure, pnMessage.common.yes, pnMessage.common.no).then(function (resultConfrim) {
                               if (resultConfrim == null) { return resultDelete; }

                               else if (resultConfrim == true) {
                             
                                       remoteService.post($scope.model, WebAccess + "api/RequestDefinition/Delete").then(function (resultReqDelete) {
                                           if (resultReqDelete.Success) {
                                               var notifyP = { message: pnMessage.common.successfullDelete, title: pnMessage.common.delete };
                                               resultDelete = resultHandler(resultReqDelete, notifyP);
                                               ClearData();
                                           }
                                           else {
                                               errorHandler.ShowError(resultReqDelete);
                                           }
                                       });
                        
                               }
                           });
                       }
                       return resultDelete;
                   };
                   $scope.doApplay = function () {
                       var defferd = $q.defer();
                       if ($scope.ValidationInfoFrom()) {
                           if ($scope.formOperationState === pnenum.pnformstate.insert) {
                               remoteService.post($scope.model, WebAccess + "api/RequestDefinition/Create").then(function (result) {
                                   var notifyP = { message: pnMessage.common.successfullInsert, title: pnMessage.common.insert };
                                   var resultStatus = resultHandler(result, notifyP);
                                   defferd.resolve(resultStatus);
                               });
                           }
                           else if ($scope.formOperationState === pnenum.pnformstate.update) {
                               remoteService.post($scope.model, WebAccess + "api/RequestDefinition/Update").then(function (result) {
                                   var notifyP = { message: pnMessage.common.SuccessfullUpdate, title: pnMessage.common.update };
                                   var resultStatus = resultHandler(result, notifyP);
                                   defferd.resolve(resultStatus);
                               });
                           }
                       }
                       else {
                           defferd.resolve(false);
                       }
                       return defferd.promise;
                   };
                   $scope.doCancel = function () {
                       var defferd = $q.defer();
                       $scope.init();
                       defferd.resolve(true);
                       return defferd.promise;
                   };
                   //*******************************************  
                   // اعتبار سنجی اطلاعات
                   $scope.ValidationInfoFrom = function () {
                       if ($scope.createForm.$valid) {
                           return true;
                       }
                       else {
                           var result = validator.Validate($scope.createForm);
                           errorHandler.ShowError(result);
                           return false;
                       }
                   };
               }],

               };
           });
});