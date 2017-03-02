var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.factory('ressourceService', ['$resource',
    function($resource){
      return $resource('http://pokeapi.co/api/v1/pokemon/:id/', {id:'@id'});
    }]
  );


pokeApp.controller("Controller", data);

  function data($scope,$log,$http,ressourceService){


    $scope.donnees ={
    pokemons : [],
    pokemon : []

  };

    $scope.$log = $log;

    $scope.printPokemon = function(namePokemon){

      for (var i = 0; i<$scope.donnees.pokemons.length;i++){
        if ($scope.donnees.pokemons[i].name === namePokemon){
          $scope.selected = true;
          console.log($scope.selectedPokemon());
          $scope.donnees.pokemon=$scope.selectedPokemon();
          console.log($scope.donnees.pokemon);
          return $scope.donnees.pokemons[i].name;
        }

      }
      $scope.selected = false;
      return "pokemon non trouvé ";
    }

    $scope.selectedPokemon = function(){
        var i = 0;
        while (i < $scope.donnees.pokemons.length){
          if($scope.donnees.pokemons[i].id === $scope.id){

            return $scope.donnees.pokemons[i].abilities;
          }
          i++;
        }
    }

    $scope.changeValue = function($id,$name){
      $scope.id = $id;
      $scope.name = $name;

    }
    $scope.reset = function(){
      $scope.id = '';
      $scope.name = '';
      $scope.selected = false;
    }

  $http({
      method: 'GET',
      url : "http://pokeapi.co/api/v1/pokedex/"
    }).then(function successCallback(response) {
      //console.log(response.data.objects[0].pokemon);
       response.data.objects[0].pokemon.forEach(function(poke){
         var nom = poke.name;
         var abilities = [];
         $http.get("http://pokeapi.co/"+poke.resource_uri)
            .then(function(response2){
              response2.data.abilities.forEach(function(ability){
                abilities.push(ability.name);
              });
              $scope.donnees.pokemons.push({"name":nom,"id":response2.data.pkdx_id,"abilities":abilities});
            }
          );

        });

      });
  }

  pokeApp.controller("ControllerRessource", data2);
  function data2($scope,ressourceService){
    $scope.pokemon = {
      name : '',
      id : '',
      moves : []
    };
    $scope.displayPokemon = function(idTemp){
      var pok = ressourceService.get({id:idTemp}, function(data){
        $scope.pokemon.name=data.name;
        $scope.pokemon.id=data.pkdx_id;
        data.moves.forEach(function(move){
          $scope.pokemon.moves.push(move.name);
        });
        console.log(data);
      }


      );
      console.log($scope.pokemon);

    };
    $scope.pokemonToString= function(){
      return "mescouilles";
    };
    $scope.nameVide = function(){
      return $scope.pokemon.name === '';
    }
  }
