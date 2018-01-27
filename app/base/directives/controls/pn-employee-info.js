define(['angularAMD'], function (app) {
    app.directive('pnEmployeeInfo',
           function () {
               return {
                   restrict: 'E',
                   templateUrl: '/app/base/partials/directives/pn-employee-info.html',
                   scope: {
                       disabledInfo: '@',
                       disabledSearch: '@',
                       hiddenSearch: '@',
                       hiddenGrid: '@',
                       hiddenInfo: '@',
                       urlListPersonel: '@',
                       modelEmployeKey: '=',
                       selectPersonel: '=',
                       extraEmployeData: '=',
                       api:'='
                    
                   },
                   controller: ['$scope', 'empWebAccess', "pn.remote.service", 'pn.focus',
                       function ($scope, empWebAccess, remoteService, focus) {
                           $scope.api = {};

                           $scope.api.setFocus = function () {                    
                           focus.setFocus('ModelPersonnel');
                     }
                       //****************************************************************************************************************************************************
                   
                       if ($scope.disabledInfo == null)
                           $scope.disabledInfo = "true";
                       if ($scope.disabledSearch == null)
                           $scope.disabledSearch = "false";

                           
                       if ($scope.hiddenSearch == null)
                           $scope.hiddenSearch = "false";
                       if ($scope.hiddenInfo == null)
                           $scope.hiddenInfo = "false";

                       if ($scope.hiddenGrid == null)
                           $scope.hiddenGrid = "true";

                       if($scope.urlListPersonel==null)
                           $scope.urlListPersonel = empWebAccess + "api/Employee/GetAllEmployees"

                       if ($scope.hiddenSearch.toLowerCase() == "true" && $scope.hiddenInfo.toLowerCase() == "true" && $scope.hiddenGrid.toLowerCase() == "true")
                           $scope.hiddenAll = true;
                       else
                           $scope.hiddenAll = false; 
                       $scope.Personnel = {};
                       $scope.optionsPersonnel = {
                           allowDuplicate: true,
                           required: true,
                           lookup: {
                               fields: [
                                        { latinName: "NationalId", persianName: _t('CommonTitle.NationalId'), typeKey: 101, items: null, showInSearchPanel: true, showInGrid: true, groupId: 1 },
                                        { latinName: "FirstName", persianName: _t('CommonTitle.FirstName'), typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, groupId: 1 },
                                        { latinName: "LastName", persianName: _t('CommonTitle.LastName'), typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, groupId: 1 },
                                        { latinName: "FatherName", persianName: _t('CommonTitle.FatherName'), typeKey: 104, items: null, showInSearchPanel: true, showInGrid: true, groupId: 1 }
                               ],

                               url: $scope.urlListPersonel,
                               textField: "LastName",
                               valueField: "Key",
                           },
                       }
                       $scope.ExtraData = function () {
                           if ($scope.extraEmployeData == null)
                               return null;
                           else
                               return $scope.extraEmployeData();
                       }
                       $scope.$watch('disabledSearch', function () {
                           if ($scope.disabledSearch.toString() == "false")
                               $scope.optionsPersonnel.disabled = false;
                           else
                               $scope.optionsPersonnel.disabled = true;

                       });
                       //**********************************************************************************************************************************************************
                       $scope.$watch('optionsPersonnel.value', function () {
                           
                           if ($scope.optionsPersonnel.value != null) {
                               if ($scope.optionsPersonnel.value != "") {
                                   remoteService.post({ EmployeeKey: $scope.optionsPersonnel.value }, empWebAccess + "api/Employee/GetEmployeebyKey").then(function (result) {
                                       $scope.selectPersonel = result.Entity;
                                       $scope.optionsPersonnel.showValue = result.Entity.LastName;

                                   });
                                   $scope.modelEmployeKey = $scope.optionsPersonnel.value;
                               }
                           }
                       });
                       //************************************************************************************************************************************
                       $scope.$watch('selectPersonel', function () {
                          
                           if ($scope.selectPersonel == {}) {
                               $scope.optionsPersonnel.showValue = null;
                               $scope.optionsPersonnel.text = null;
                               $scope.optionsPersonnel.value = null;
                           }
                          else if ($scope.modelEmployeKey == null) {
                               $scope.optionsPersonnel.showValue = null;
                               $scope.optionsPersonnel.text = null;
                               $scope.optionsPersonnel.value = null;
                           }
                       });
                       //************************************************************************************************************************************
                       $scope.$watch('modelEmployeKey', function () {
                           $scope.optionsPersonnel.value = $scope.modelEmployeKey;
                       });
                       //*************************************************************
                        $scope.gridConfig = {
                           autoBind: true,
                           pageSizes: [10, 20, 50, 100],
                           inlineOperationalUrl: {
                               read: {
                                   url: $scope.urlListPersonel
                               }
                           }
                       };
                       $scope.gridColumns = [
                           {
                            field: 'NationalId',
                            editable: false,
                            title: "کد ملی",
                            allownull: false,
                            width: 100,
                        },
                        {
                            field: 'EmployeeId',
                            editable: false,
                            title: "شماره پرسنلی",
                            allownull: false,
                            width: 130
                        },
                        {
                            field: 'FirstName',
                            editable: false,
                            title: "نام",
                            allownull: false,
                            width: 130
                        },
                        {
                            field: 'LastName',
                            editable: false,
                            title: "نام خانوادگی",
                            allownull: false,
                            width: 130
                        },
                        {
                            field: 'BirthCertificateId',
                            editable: false,
                            title: "شماره شناسنامه",
                            allownull: false,
                            width: 130
                        },
                        {
                            field: 'FatherName',
                            editable: false,
                            title: "نام پدر",
                            allownull: false,
                            width: 130
                        },
                        {
                            field: 'SolarBirthDate',
                            editable: false,
                            title: "تاریخ تولد",
                            allownull: false,
                            width: 130
                        }
                       ];
                       $scope.gridSchema = {
                           model: {
                               id: 'Id',
                               fields: {
                                   Code: {
                                       type: 'number',
                                       editable: false
                                   }
                               }
                           },
                           data: 'Entities',
                           total: 'TotalCount'
                       };
                       $scope.gridSelectedItems = [];
                       $scope.$watch('gridSelectedItems', function () {
                           if ($scope.gridSelectedItems.length <= 0) return;
                           if ($scope.hiddenGrid.toString() == "false"){
                               $scope.selectPersonel = $scope.gridSelectedItems[0];
                               $scope.modelEmployeKey = $scope.selectPersonel.Key;
                           }
                       });
                   }]
               };
           });
});