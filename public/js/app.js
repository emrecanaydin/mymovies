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
		otherwise({
		redirectTo: '/'
	});
}]);

mymovies.controller('searchMovies', function($scope,$http,Helpers) {
	$scope.movies = [];
	$scope.getMovies = function(pageindex) {
		Helpers.preloader(true);
		$http.get(Helpers.getApiUrl() + "?s="+document.getElementById("txtMovieName").value + "&page="+ pageindex).then(function(result) {
			$scope.movies = result.data;
			Helpers.preloader(false);
			//result.data.Search.forEach(function(val, i) { 
				//$scope.movies.push(val);
			//});
		}, function(error) {
			alert(error);
		});
		
	};
});

mymovies.controller('movieDetail', function($scope,$routeParams,$http,Helpers) {
	$scope.movieObject = [];
	$scope.movieid = $routeParams.imdbId;
	Helpers.preloader(true);
	$http.get(Helpers.getApiUrl() + "?i="+$routeParams.imdbId+"&plot=short&r=json").then(function(result) {
		$scope.movieObject = result.data;
		Helpers.preloader(false);
	}, function(error) {
		alert(error);
	});
});


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
}]);