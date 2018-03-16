app.directive('autocompleteCombobox', ['$parse', '$http', '$sce', '$timeout', 'savevalueService', function ($parse, $http, $sce, $timeout, savevalueService) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "titleField": "@titlefield",
            "class": "@inputclass",
            "localData": "=localdata",
            "matchClass": "@matchclass"

        },
        template: '<div class="autocomplete-holder"><input ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{class}}" onmouseup="this.select();" autocomplete="off"/><div class="autocomplete-dropdown" ng-if="showDropdown"><div class="autocomplete-noresult" ng-show="!results || results.length == 0">Nema rezultata pretrage </div><div class="autocomplete-row" ng-repeat="result in results | limitTo:6" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'autocomplete-selected-row\': $index == currentIndex}"><div class="autocomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div></div></div></div>',

        link: function ($scope, elem, attrs) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.searchStr = null;

            isNewSearchNeeded = function (newTerm, oldTerm) {
                return newTerm.length >= 1 && newTerm != oldTerm
            }

            $scope.processResults = function (responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = ["name", "city"];
                    for (var i = 0; i < responseData.length; i++) {
                        var title = [];
                        for (var t = 0; t < titleFields.length; t++) {
                            if (titleFields[t] == 'city') {
                                title.push(responseData[i].address[titleFields[t]]);
                            } else {
                                title.push(responseData[i][titleFields[t]]);
                            }
                        }
                        var text = title.join(', ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, strPart));
                        }
                        var resultRow = {
                            title: text,
                            rating: responseData[i].rating,
                            restaurant: responseData[i]
                        }
                        $scope.results[$scope.results.length] = resultRow;
                        $scope.results.sort(function (a, b) {
                            return (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0);
                        });

                    }

                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function (str) {
                if (str.length >= 1) {
                    if ($scope.localData) {
                        var searchFields = "name, city";
                        searchFields = searchFields.split(",");
                        var matches = [];
                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;
                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }
                        $scope.processResults(matches, str);
                    }
                }
            }

            $scope.hoverRow = function (index) {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function (event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];

                        $timeout(function () {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, 300);
                    }
                } else {
                    event.preventDefault();
                }
            }

            $scope.selectResult = function (result) {
                if ($scope.matchClass) {
                    result.title = result.title;
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                savevalueService.set($scope.selectedObject);
                $scope.showDropdown = false;
                $scope.results = [];
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if (event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        if ($scope.currentIndex != 5) {
                            $scope.currentIndex++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }
                    }

                    $scope.$apply();
                } else if (event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex--;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });

        }
    };
}]);