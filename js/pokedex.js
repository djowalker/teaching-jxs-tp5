// Nom de l'app
var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');


pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

// Service pour get les informations d'un pokemon
pokeApp.factory('ressourceService', ['$resource',
    function($resource){
      return $resource('http://pokeapi.co/api/v1/pokemon/:id/', {id:'@id'});
    }]
  );

// Service commun pour les deux controleur avec id et name du pokemon actuel
pokeApp.factory('serviceCommun', [function(){
    return {nameCom: "",idCom: "",selectedCom: false};
  }
]);


// Premier contrôleur pour recherche
pokeApp.controller("Controller", data);

// fonctionne que sur firefox.............
// posssible avec chrome avec par exemple wamp
pokeApp.directive('ngPokedex', function() {
  return {
	templateUrl: 'pokedex.html'
  }
});
	

function data($scope,$log,$http,ressourceService,serviceCommun){
    $scope.name = serviceCommun.nameCom;
    $scope.id = serviceCommun.idCom;
    $scope.donnees ={
      pokemons : [],
      pokemonAbi : {},
      selected : ""
    };
    $scope.selected = false ;

    // Print le nom du pokemon en console et le selectionne si il existe e donnée
    $scope.printPokemon = function(){
      for (var i = 0; i<$scope.donnees.pokemons.length;i++){
        if ($scope.donnees.pokemons[i].name === $scope.name){
          $scope.selected = true;
          $scope.donnees.pokemon=$scope.donnees.pokemons[i];
          console.log($scope.donnees.pokemon);
          return;
        }
      }
      $scope.selected = false;
      console.log("pokemon non trouvé");
      return;
    }

    // Fonction d'actualisation quand l'utilisateur selectionne un pokemon
    $scope.changeValue = function (){
      pok = $scope.donnees.selected;
      $scope.id = pok.slice(0,pok.indexOf(':'));
      $scope.name = pok.slice(pok.indexOf(':')+1,pok.length);
      serviceCommun.selectedCom = true;
      console.log(pok);
    }

    // Fonction d'update lorsque l'utilisateur change manuellement les valeurs des input
    $scope.changeInput = function(a){
      // input name
      if (a === 1){
        $scope.id = "";
        serviceCommun.selectedCom = false;
      }
      // input id
      else {
        $scope.name = "";
        serviceCommun.selectedCom = false;
      }
    }

    // Fonction pour reset le form
    $scope.reset = function(){
       $scope.id = "";
       $scope.name = "";
	   serviceCommun.selectedCom = false;
       $scope.selected = false;
    }

    // Requète http pour remplir la liste des pokemons
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
        console.log("donnees",$scope.donnees);
      });

      // $watch pour update le service commun à chaque changement
      $scope.$watch(
          function(){return $scope.id;},
          function(newValue, oldValue) {
            if (newValue !== oldValue){
              serviceCommun.nameCom = $scope.name;
              serviceCommun.idCom = $scope.id;
            }
          }
      );
      $scope.$watch(
          function(){return $scope.name;},
          function(newValue, oldValue) {
            if (newValue !== oldValue){
              serviceCommun.nameCom = $scope.name;
              serviceCommun.idCom = $scope.id;
            }
          }
      );
  }

  // Second contrôleur pour l'affichage des données du pokemon séléctionné
  pokeApp.controller("ControllerRessource", data2);
  function data2($scope,ressourceService,serviceCommun){
    $scope.displayed=false;
    $scope.pokemon2 = {
      name : serviceCommun.nameCom,
      id : serviceCommun.idCom,
      moves : [],
	  abilities : []
    };

    $scope.unDisplay = function(){
      $scope.displayed = false;
    };
    $scope.fillMoves = function(){
      var pok = ressourceService.get({id:$scope.pokemon2.id}, function(data){
		      // reset de l'array pour chaque nouveau pokemon sélectionné
          $scope.pokemon2.moves = [];
          data.moves.forEach(function(move){
		          $scope.pokemon2.moves.push(move.name);
          });
      });
      console.log($scope.pokemon2.moves);
    };
	$scope.fillAbilities = function(){
      var pok = ressourceService.get({id:$scope.pokemon2.id}, function(data){
		      // reset de l'array pour chaque nouveau pokemon sélectionné
          $scope.pokemon2.abilities = [];
          data.abilities.forEach(function(abilities){
              $scope.pokemon2.abilities.push(abilities.name);
          });
      });
      console.log($scope.pokemon2.abilities);
    };
    $scope.displayPokemon = function(){
      $scope.displayed = true;
      $scope.fillMoves();
	  $scope.fillAbilities();
      console.log(serviceCommun);
      console.log($scope.pokemon2);

    };
    $scope.$watch(
        function(){return serviceCommun.selectedCom;},
        function(newValue, oldValue) {
          if (newValue){
            $scope.pokemon2.name = serviceCommun.nameCom;
            $scope.pokemon2.id  = serviceCommun.idCom;
            $scope.fillMoves();
              $scope.fillAbilities();
          }
        }
    );
	
}
