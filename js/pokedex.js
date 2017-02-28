var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.controller("Controller", data);

  function data($scope,$log,$http){
    $scope.donnees ={
    pokemons : []
  };

    $scope.$log = $log;

    $scope.printPokemon = function(namePokemon){
      for (var i = 0; i<$scope.donnees.pokemons.length;i++){
        if ($scope.donnees.pokemons[i].name === namePokemon){
          return $scope.donnees.pokemons[i].name;
        }

      }
      return "pokemon non trouvé ";
    }

    $scope.changeValue = function($id,$name){
      $scope.id = $id;
      $scope.name = $name;
    }
    $scope.reset = function(){
      $scope.id = '';
      $scope.name = '';
    }

  $http({
      method: 'GET',
      url : "http://pokeapi.co/api/v1/pokedex/"
    }).then(function successCallback(response) {
      console.log(response.data.objects[0].pokemon);
       response.data.objects[0].pokemon.forEach(function(poke){
         var nom=poke.name;
         $http.get("http://pokeapi.co/"+poke.resource_uri)
            .then(function(response2){
              $scope.donnees.pokemons.push({"name":nom,"id":response2.data.pkdx_id});
            }
          );




        });
        console.log($scope.donnees);
      });
  }
