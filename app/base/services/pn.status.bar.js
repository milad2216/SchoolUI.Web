define(['angularAMD'], function (app) {
	app.service("pn.status.bar", ["$rootScope", "routeResolver", function ($rootScope, routeResolver ) {
	    statusBars = {};

	    function setStatus(totalCode, status) {
	        statusBars[totalCode] = status;
	    }
	    function getStatus(totalCode) {
	        return statusBars[totalCode] || [];
	    }
	    function refresh(totalCode) {
	        if (!totalCode)
	            return;
	        $rootScope.$emit('statusbar:update', statusBars[totalCode]);
        }
		return {
			setStatus: setStatus,
			getStatus: getStatus,
			refresh: refresh
		};
	}])
});