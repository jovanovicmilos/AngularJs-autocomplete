app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/', {
        templateUrl: "dist/app/views/home.html",
        controller: "autocompleteController"
    })
    .otherwise({redirectTo: '/'});
}])