app.controller('autocompleteController', ['$scope', '$timeout', '$http', 'savevalueService', function ($scope, $timeout, $http, savevalueService) {
    
    $http.get('assets/json/restaurants.json').then(function (data) {
        $scope.restaurants = data.data.results;
    })
    
    $scope.getRestaurant = function () {
        return savevalueService.get();
    }
}])