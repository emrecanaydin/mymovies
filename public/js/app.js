var movieapp = angular.module('movieapp',[]);

movieapp.controller('searchMovies', function($scope,$http,Helpers) {
	$scope.movies = [];
	$scope.movieObject = [];
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
	$scope.getMovieDetail = function(imdbid) {
		Helpers.preloader(true);
		$http.get(Helpers.getApiUrl() + "?i="+ imdbid + "&plot=short&r=json").then(function(result) {
			$scope.movieObject = result.data;
			Helpers.preloader(false);
			Helpers.openmodal();
		}, function(error) {
			alert(error);
		});
	};
});

movieapp.factory('Helpers', [ function() {
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