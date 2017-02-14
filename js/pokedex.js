var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.controller("Controller",data);

  function data($scope,$log){
    $scope.donnees ={
    pokemons :[
      {name : 'Pikachu' , id : 1},
      {name : 'Bulbizarre' , id : 2},
      {name : 'Herbizarre' , id : 3},
      {name : 'Aspicot' , id : 4},
      {name : 'Ortide' , id : 5},
      {name : 'Kabuto' , id : 6},
      {name : 'Pyroli' , id : 7},
      {name : 'Mew' , id : 8},
      {name : 'Ronflex' , id : 9}
    ]};

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

  }
