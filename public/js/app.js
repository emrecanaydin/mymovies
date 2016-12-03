var mymovies = angular.module("movieapp", ["ngRoute"]);

mymovies.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
	when('/', {
		templateUrl: 'templates/search-movie.html',
		controller: 'searchMovies'
	}).
	when('/MovieDetail/:imdbId', {
		templateUrl: 'templates/movie-detail.html',
		controller: 'movieDetail'
	}).
	when('/WatchList/', {
		templateUrl: 'templates/watch-list.html',
		controller: 'watchList'
	}).
	otherwise({
		templateUrl:'templates/404.html'
	});
}]);

mymovies.controller('searchMovies', function($scope,$http) {
	$scope.movies = [];
	$scope.getMovies = function(pageindex) {
		Helpers.Preloader.open();
		$http.get(Helpers.Api.getApiUrl + "?s="+document.getElementById("txtMovieName").value + "&page="+ pageindex).then(function(result) {
			$scope.movies = result.data;
			Helpers.Preloader.close();
		}, function(error) {
			alert(error);
		});
		
	};
});

mymovies.controller('movieDetail', function($scope,$routeParams,$http) {
	$scope.movieObject = [];
	$scope.movieid = $routeParams.imdbId;
	Helpers.Preloader.open();
	$http.get(Helpers.Api.getApiUrl + "?i="+$routeParams.imdbId+"&plot=short&r=json").then(function(result) {
		$scope.movieObject = result.data;
		Helpers.Preloader.close();
	}, function(error) {
		alert(error);
	});
});

mymovies.controller('watchList', function($scope,$http) {
	$scope.movieList = localStorage.getItem("userwatchlist") == null ? [] : JSON.parse(localStorage.getItem("userwatchlist"));
});

mymovies.directive( 'backButton', function() {
    return {
        restrict: 'A',
        link: function( scope, element, attrs ) {
            element.on( 'click', function () {
                history.back();
                scope.$apply();
            } );
        }
    };
} );

/*
mymovies.factory('Helpers', [ function() {
	class helpers {
		getApiUrl(){
			return "http://www.omdbapi.com/";
		}
		preloader(willOpen){
			willOpen == true ? document.body.className = "loading" : document.querySelector('body').classList.remove('loading');
		}
		openmodal(){
			document.getElementById("modal-overlay").style["display"] = 'block';
			document.getElementById("modal").style["display"] = 'block';
		}
		closemodal(){
			document.getElementById("modal-overlay").style["display"] = "none";
			document.getElementById("modal").style["display"] = "none";
		}
	}
	let helperlist = new helpers();
	return helperlist;
}]);*/