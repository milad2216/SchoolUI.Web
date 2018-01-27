define(['angularAMD'], function (app) {
    app.service("pn.appContext", ['AuthToken', 'localStorageService', function (authTokenKey, localStorageService) {
      
        var token = localStorageService.get(authTokenKey);
        var appContext = jwt_decode(token);
        var _user = {
            id: appContext.UserId,
            fullName: appContext.FullName,
            organizationPositionPKey: appContext.OrganizationPositionPKey,
            organizationPositionTitle: appContext.OrganizationPositionTitle,
            organizationUnitPKey: appContext.OrganizationUnitPKey,
            organizationUnitTitle: appContext.OrganizationUnitTitle,
            userTypeTitle: appContext.UserTypeTitle,
            userName: appContext.UserName,
            nationalCode: appContext.NationalCode,
            employeeCode: appContext.EmployeeCode
        };
        var _agent = {
            ip: appContext.Ip,
            userAgent: appContext.UserAgent
        };

        return {
            user: _user,
            agent: _agent,
            roles: appContext.Roles
        }

    }])
});