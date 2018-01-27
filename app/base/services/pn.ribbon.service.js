define(['angularAMD'], function (app) {
    app.service("pn.ribbon.service", ['$rootScope', '$state', '$interval', function ($rootScope, $state, $interval) {

        this.Operation = {
            Add: "Add",
            Edit: "Edit",
            Delete: "Delete",
            Apply: "Apply",
            Cancel: "Cancel",
            Report: "Report",
            Archive: "Archive",
            Workflow: "Workflow",
            Refresh: "Refresh",
            Log: "Log",
            LoadLog: "LoadLog",
            User1: "User1",
            User2: "User2",
            User3: "User3",
            User4: "User4",
            User5: "User5",
            User6: "User6",
            User7: "User7",
            User8: "User8",
            User9: "User9"
        }
        this.Property =
            {
                Disabled: "Disabled",
                Visibility: "Visibility",
                Display: "Display"
            }

        this.toggleSlide = function () {
            angular.element('#format-tab0').parent().toggle();
        }

        this.ToolbarSetting = function (operation, property, propertyValue, title) {
            $rootScope.ToolbarSetting(operation, property, propertyValue, title);
        }

        this.MainOperation = function (property, propertyValue) {
            this.ToolbarSetting(this.Operation.Add, property, propertyValue);
            this.ToolbarSetting(this.Operation.Delete, property, propertyValue);
            this.ToolbarSetting(this.Operation.Edit, property, propertyValue);
            this.ToolbarSetting(this.Operation.Apply, property, propertyValue);
            this.ToolbarSetting(this.Operation.Cancel, property, propertyValue);
        }
        this.AdditionalOperation = function (property, propertyValue) {
            this.ToolbarSetting(this.Operation.Report, property, propertyValue);
            this.ToolbarSetting(this.Operation.Archive, property, propertyValue);
            this.ToolbarSetting(this.Operation.Workflow, property, propertyValue);
            this.ToolbarSetting(this.Operation.Refresh, property, propertyValue);
            this.ToolbarSetting(this.Operation.Log, property, propertyValue);
            this.ToolbarSetting(this.Operation.LoadLog, property, propertyValue);
        }
        this.OtherOperation = function (property, propertyValue) {
            this.ToolbarSetting(this.Operation.User1, property, propertyValue);
            this.ToolbarSetting(this.Operation.User2, property, propertyValue);
            this.ToolbarSetting(this.Operation.User3, property, propertyValue);
            this.ToolbarSetting(this.Operation.User4, property, propertyValue);
            this.ToolbarSetting(this.Operation.User5, property, propertyValue);
            this.ToolbarSetting(this.Operation.User6, property, propertyValue);
            this.ToolbarSetting(this.Operation.User7, property, propertyValue);
            this.ToolbarSetting(this.Operation.User8, property, propertyValue);
            this.ToolbarSetting(this.Operation.User9, property, propertyValue);
        }


        this.addTab = function (title, action, systemId, featureId, systemKey) {

            //$rootScope.$emit('toolbar:menuTabClick', { systemKey: data.systemKey, systemId: data.systemId });

            console.log("checking items of: " + systemKey);
            for (var i = 0; i < $rootScope.tabItems.length; i++) {
                if ($rootScope.tabItems[i].action == action) {
                    $rootScope.tabItems[i].isActive = true;

                    var isExists = true;
                    $rootScope.openedTaps.map(function (item) {
                        if (item.FormId == $rootScope.tabItems[i].FormId)
                            isExists = false;
                    });
                    if (isExists)
                        $rootScope.openedTaps.push(angular.copy($rootScope.tabItems[i]));
                    $rootScope.onClickTab($rootScope.tabItems[i]);

                    break;
                }
            }

            setCurrentTabState({ title, action, systemId, featureId, systemKey });
            $state.go(action);

           
        }

        function setCurrentTabState(tab) {
            $rootScope.CurrentTabState = {
                title: tab.title,
                action: tab.action,
                systemId: tab.systemId,
                featureId: tab.featureId,
                systemKey: tab.systemKey
            };

            addToOpenedTabs(tab);
        }

        function removeFromOpenedTabs(tabToRemove) {
            var currentTabs = JSON.parse(localStorage.getItem('currentTabs'));
            currentTabs = jQuery.grep(currentTabs, function (tab) {
                return tab.action != tabToRemove;
            });
            localStorage.setItem('currentTabs', JSON.stringify(currentTabs));
        }

        function addToOpenedTabs(tabToAdd) {
            var currentTabs = JSON.parse(localStorage.getItem('currentTabs'));
            if (!currentTabs)
                currentTabs = [];
            else {
                currentTabs = jQuery.grep(currentTabs, function (tab) {
                    return tab.action != tabToAdd.action;
                });
            }
            currentTabs.push({
                title: tabToAdd.title,
                action: tabToAdd.action,
                systemId: tabToAdd.systemId,
                featureId: tabToAdd.featureId,
                systemKey: tabToAdd.systemKey
            });
            localStorage.setItem('currentTabs', JSON.stringify(currentTabs));
        }

        function resetOpenedTabs() {
            localStorage.setItem('currentTabs', JSON.stringify([]));
        }

       //

     

    }]);
});
