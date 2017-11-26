(function () {
'use strict';
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownControllerFunction)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
  NarrowItDownControllerFunction.$inject = ['MenuSearchService'];

  function FoundItems() {
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }

  MenuSearchService.$inject = ['$q', '$http', 'ApiBasePath'];
  function MenuSearchService ($q, $http, ApiBasePath) {
    var service = this;


    service.getMatchedMenuItems = function (searchTerm) {
      var deferred = $q.defer();

      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {

        var foundItems = [];
        var menuItems = result.data.menu_items;

        if (searchTerm !== "") {
          var foundItems = menuItems.filter(function(item) {
            if (item.description.includes(searchTerm)) {
              return {
                "short_name": item.name,
                "description": item.description
              };
            }
          });
        }

        deferred.resolve(foundItems);

        // return processed items
        return deferred.promise;
      });
    };
  };

  function NarrowItDownControllerFunction (MenuSearchService) {
    var narrowController = this;
    narrowController.found = [];
    narrowController.searchTerm = "";
    narrowController.errorMessage = "";

    narrowController.narrowResults = function () {
      narrowController.errorMessage = "";
      MenuSearchService.getMatchedMenuItems(narrowController.searchTerm).then(function (response) {
        narrowController.found = response;
        if (narrowController.found.length === 0) {
          narrowController.errorMessage = "Nothing found";
        }
      });
    }

    narrowController.removeItem = function (itemIndex) {
      narrowController.found.splice(itemIndex, 1);
    };

  };



})();