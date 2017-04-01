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

pokeApp.factory('serviceCommun', [function(){
    return {nameCom: "",idCom: ""};
  }
]);

pokeApp.controller("Controller", data);

  function data($scope,$log,$http,ressourceService,serviceCommun){

    $scope.name = serviceCommun.nameCom;
    $scope.id = serviceCommun.idCom;
    $scope.$watch(
        function(){return $scope.id;},
        function(newValue, oldValue) {
          if (newValue !== oldValue){
            serviceCommun.nameCom = $scope.name;
            serviceCommun.idCom = $scope.id;
          }
        }
    );

    $scope.donnees ={
    pokemons : [],
    pokemon : {},
    selected : ""
  };

    $scope.$log = $log;

    $scope.printPokemon = function(namePokemon){
      for (var i = 0; i<$scope.donnees.pokemons.length;i++){
        if ($scope.donnees.pokemons[i].name === namePokemon){
          $scope.selected = true;
          $scope.donnees.pokemon=$scope.saveSelectedPokemon(i);
          return $scope.donnees.pokemons[i].name;
        }
      }
      $scope.selected = false;
      return "pokemon non trouvé ";
    }

    $scope.saveSelectedPokemon = function(i){
        return $scope.donnees.pokemons[i];
    }

    $scope.changeValue = function($id,$name){
      console.log($id,$name);
      $scope.id = $id;
      $scope.name = $name;
      console.log($scope.id,$scope.name);

    }
    $scope.changeValueBis = function (){
      pok = $scope.donnees.selected;
      console.log(pok);
       $scope.id = pok.slice(0,pok.indexOf(':'));
       $scope.name = pok.slice(pok.indexOf(':')+1,pok.length);
       console.log(serviceCommun);
       console.log($scope.id,$scope.name);
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

       response.data.objects[0].pokemon.forEach(function(poke){
         var nom = poke.name;
         var abilities = [];
         var id ="";
         $http.get("http://pokeapi.co/"+poke.resource_uri)
            .then(function(response2){
              id = response2.data.pkdx_id;
              response2.data.abilities.forEach(function(ability){
                abilities.push(ability.name);
              });
              $scope.donnees.pokemons.push({"name":nom,"id":id,"abilities":abilities});
            }
          );
        });

        console.log($scope.donnees);
      });
  }

  pokeApp.controller("ControllerRessource", data2);
  function data2($scope,ressourceService,serviceCommun){
    $scope.$watch(
        function(){return serviceCommun.nameCom;},
        function(newValue, oldValue) {
          if (newValue !== oldValue){
            $scope.pokemon2.name = serviceCommun.nameCom;
            $scope.pokemon2.id  = serviceCommun.idCom;
          }
          if (newValue === ""){
            $scope.displayed = false;
          }
        }
    );
    $scope.displayed=false;
    $scope.pokemon2 = {
      name : serviceCommun.nameCom,
      id : serviceCommun.idCom,
      moves : []
    };
    $scope.displayPokemon = function(){
      console.log(serviceCommun);
      console.log($scope.pokemon2);
      var pok = ressourceService.get({id:$scope.pokemon2.id}, function(data){
          $scope.displayed = true;
		      // reset de l'array pour chaque nouveau pokemon sélectionné
		      if($scope.pokemon2.moves.length >1){
			         $scope.pokemon2.moves.length = 0;
		       }
          data.moves.forEach(function(move){
		          $scope.pokemon2.moves.push(move.name);
          });
      });
    }
  }
