var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'http://pokeapi.co');

pokeApp.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.factory('ressourceService', ['$resource',
    function ($resource) {
        return $resource('http://pokeapi.co/api/v1/pokemon/:id/', {id: '@id'});
    }]
);

pokeApp.controller("Controller", data);

function data($scope, $log, $http, POKEAPI, PokeSearched) {
    $scope.donnees = {
        pokemons: [],
        pokemon: []
    };

    $scope.$log = $log;

    // METTRE CES FONCTIONS DANS LE SECOND CONTROLLER LE 1er ici sert juste à rechercher
    $scope.printPokemon = function (namePokemon) {
        for (var i = 0; i < $scope.donnees.pokemons.length; i++) {
            if ($scope.donnees.pokemons[i].name === namePokemon) {
                $scope.selected = true;
                //console.log($scope.selectedPokemon());
                $scope.donnees.pokemon = $scope.selectedPokemon();
                //console.log($scope.donnees.pokemon);
                return $scope.donnees.pokemons[i].name;
            }

        }
        $scope.selected = false;
        return "pokemon non trouvé ";
    };

    $scope.searchingIdPoke = function (idSearched) {
        PokeSearched.id = idSearched;
        PokeSearched.name = null;
    };

    $scope.selectedPokemon = function () {
        var i = 0;
        while (i < $scope.donnees.pokemons.length) {
            if ($scope.donnees.pokemons[i].id === $scope.id) {
                return $scope.donnees.pokemons[i].abilities;
            }
            i++;
        }
    };

    $scope.changeValue = function ($id, $name) {
        $scope.id = $id;
        $scope.name = $name;
        $scope.pokeSearched = $id;

    };

    $scope.reset = function () {
        $scope.id = '';
        $scope.name = '';
        $scope.selected = false;
        $scope.pokeSearched = null;
        console.log("pokeSearched="+$scope.pokeSearched);
    };

    $http({
        method: 'GET',
        url: POKEAPI + "/api/v1/pokedex/"
    }).then(function successCallback(response) {
        //console.log(response.data.objects[0].pokemon);
        response.data.objects[0].pokemon.forEach(function (poke) {
            var nom = poke.name;
            var abilities = [];
            $http.get("http://pokeapi.co/" + poke.resource_uri)
                .then(function (response2) {
                        response2.data.abilities.forEach(function (ability) {
                            abilities.push(ability.name);
                        });
                        $scope.donnees.pokemons.push({"name": nom, "id": response2.data.pkdx_id, "abilities": abilities});
                    }
                );

        });

    },function errorCallback(response) {
        console.log("Le pokemon n'a pas pu être trouvé, il y a eu un problème lors du chargement")
    });
}

pokeApp.controller("ControllerRessource", data2);
function data2($scope, ressourceService, PokeSearched) {
    $scope.pokemon = {
        name: '',
        id: '',
        moves: [],
        abilities:[]
    };

    $scope.pokeSearched = PokeSearched;
    $scope.$watch('pokeSearched.id', function () {
        // récupère les informations d'un pokémon grace au service et à partir de l'id
        var datasPokemons = ressourceService.get({id: PokeSearched.id});
        if (PokeSearched.id != null) {
            $scope.showInfo = true;
            // promise afin de conserver les infos asynchroniquement une fois que le get a eu lieu ensuite on peut les afficher
            datasPokemons.$promise.then(function (data) {
                $scope.infoPoke = data;
                // mise à jour du nom de l'information dans le service du pokemon
                PokeSearched.name = data.name;
                $scope.id = data.pkdx_id;
                $scope.name = data.name;
                $scope.attacks = data.moves;
                $scope.taille = data.height * 10;
                $scope.poids = data.weight / 10;
                $scope.abilities = data.abilities.forEach(function (abilities) {
                    $scope.pokemon.abilities.push(abilities.name);
                });

                console.log(datasPokemons);
                console.log(PokeSearched);
                 // reset de l'array pour chaque nouveau pokemon sélectionné
                 if ($scope.pokemon.moves.length > 1) {
                 $scope.pokemon.moves.length = 0;
                 }

                 $scope.moves = data.moves.forEach(function (move) {
                     $scope.pokemon.moves.push(move.name);
                 });

                //Debug contenu
                console.log(data);
                console.log({id: $scope.id, name: $scope.name, moves: data.moves, abilities : data.abilities});
            }, true);
        }
    });


/*    $scope.displayPokemon = function (idTemp) {
        console.log("l\'idTemp vaut" + idTemp);
        var pok = ressourceService.get({id: idTemp}, function (data) {
                $scope.pokemon.name = data.name;
                $scope.pokemon.id = data.pkdx_id;
                console.log("2è contro" + data.name + " , " + data.pkdx_id);

                // reset de l'array pour chaque nouveau pokemon sélectionné
                if ($scope.pokemon.moves.length > 1) {
                    $scope.pokemon.moves.length = 0;
                }

                data.moves.forEach(function (move) {
                    $scope.pokemon.moves.push(move.name);
                });
                console.log(data);
            }
        );
        console.log($scope.pokemon);

    };*/
    $scope.pokemonToString = function () {
        if($scope.showInfo = true) {
            return "Pokemon Id : " + $scope.pokemon.id + " , " + "Pokemon name : " + $scope.pokemon.name;
        }
        else{
            return "marchepas";
        }
    };
    $scope.nameVide = function () {
        return $scope.pokemon.name == '';
    };

    $scope.showInfo = function(showInfo){
        return PokeSearched.id!=null;

    }
}

// Service pour lier les deux controllers, ici grâce à l'id
pokeApp.factory('PokeSearched',function () {
    return {
        id: null,
        name : null
    }
});
