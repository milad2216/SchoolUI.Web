define(['angularAMD'], function (app) {
    app.factory("pn.enum", [function () {
        // TODO Expand This
        var service = {
            hierarchicalSchoolOrganizationType:
            {
                School:1, Grade:2, FieldOfStudy:3, ClassRoom:4
            },
            ExportType:
            {
                Pdf: 1 , Word: 2 , Excel: 3
            },
            pnformstate: { browse: 0, insert: 1, update: 2, deletee: 3 },
            pnWorkflowState: { toDo: 1, inprogress: 2, done: 3 },
            sexState: {
                women: "1531b014-1a1d-4330-bde8-dd987ec5242f",
                men: "129f870a-9ed8-45d0-a91e-2af718afc8bc"
            },
            relativesState: {
                Spouse: "5f66255e-80e0-4508-85d2-0dd4596b0fb0",//همسر
                child: "d8960967-1814-40ca-950a-2aad2af77970",//	فرزند
                father: "b31f90fe-678e-4f66-ad03-38e911194f7a",//	پدر
                mother: "696c547a-0955-4465-855f-5bc41c246d4a",	//مادر
                sister: "d7c3a039-d938-40ec-a07d-6f6f7e22504e",//	خواهر
                brother: "08eaa9be-00d5-40f2-853f-89256a0f6176",//	برادر
                grandson: "db8416cc-6e0e-466b-b969-98593485498f",//	نواده
                protector: "cddf1e3b-98bf-43ec-8f65-a101cb5e0302",//	قيم
                causedChild: "0cb32572-98e7-4d21-afa6-bf5cd7b84de0",//	فرزند عليل
                causedGrandson: "5f4056d6-8e71-47bd-8710-d11dab71c307"//	نواده عليل
            },
            lifeState: {
                life: "Alive", //زنده
                death: "Death",//فوت شده
                martyr: "Martyr",//شهید
                missing: "Missing"//مفقودالاثر
            },
            physicalStatus: {
                healthy: "Healthy"//سالم
                , defective: "Disabled"//معلول
                , maim: "FlawMember"//نقض عضو
            },
            typeLicense: {
                group: "627c9206-a4b3-4123-8c75-6d656fb6ec6f",
                unit: "c8cb42fc-3f9d-4487-913a-cfe75ef5de34"
            },
            typePhoneBook: {
                tel: "2b53b10f-da50-43ab-9e7c-3fbdc63c6b73",
                mobile: "caa6232e-c66b-4d77-8a3d-010b1bc30844",
                fax: "97ce1c16-1653-4a7a-a396-190c23b162a3"
            },
            addressStatues: {
                work: "5e4d7569-4c85-e611-80f8-000c29c9d3ad",
                live: "b721dc70-4c85-e611-80f8-000c29c9d3ad",
                school: "6c469e79-4c85-e611-80f8-000c29c9d3ad"

            },
            typeCondition: {
                fromTo: "8cabae0b-d5fd-e611-ac51-38d54778b1eb"
            } 

        };

        return service;
    }
    ]);
});