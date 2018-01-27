define(['angularAMD'], function (app) {
    app.factory("pn.array", ["$filter", function ($filter) {

        function serach(model, searchCondition) {
            var foundItems = $filter("filter")(model, searchCondition, true);
            var result = { items: [], index: -1 }; // inti Result Class

            if (foundItems.length >= 0 && foundItems.length <= 1) {
                result.items = foundItems;
                result.index = model.indexOf(foundItems[0]);
                return result;
            } else if (foundItems.length > 0) { // without Index of
                result.items = foundItems;
                return result;
            }

            return null;
        }
        return {
            serach: serach
        }

    }

    ]);
});