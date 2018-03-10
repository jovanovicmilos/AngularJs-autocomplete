app.service('savevalueService', function () {
    var restaurant = "";
    return {
        get: function () { return restaurant; },
        set: function (f) {
            restaurant = f
        }
    }
});