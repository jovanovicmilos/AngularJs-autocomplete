app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/', {
        templateUrl: "app/views/home.html",
        controller: "autocompleteController"
    })
    .otherwise({redirectTo: '/'});
}])