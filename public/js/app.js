var mymovies = angular.module("movieapp", ["ngRoute"]);

mymovies.config(['$routeProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
	when('/', {
		title: 'Ana Sayfa',
		templateUrl: 'templates/home-page.html',
		controller: 'homePage'
	}).
	when('/SearchMovie/:Keyword', {
		title: 'Arama Sonuçları',
		templateUrl: 'templates/search-results.html',
		controller: 'searchResults'
	}).
	when('/MovieDetail/:imdbID', {
		title: 'Film Detay',
		templateUrl: 'templates/movie-detail.html',
		controller: 'movieDetail'
	}).
	when('/WatchList/', {
		title: 'İzlenecekler Listem',
		templateUrl: 'templates/watch-list.html',
		controller: 'watchList'
	}).
	otherwise({
		title: '404 Sayfa Bulunamadı',
		templateUrl:'templates/404.html'
	});
}]);

mymovies.controller('mainCtrl', function($scope){
	$scope.goPreviousPage = function() {
		window.history.back();
	};
	$scope.AddWatchList = function(movie){
		var watchlist = Helpers.WatchList.get();
		newmovieitem = {
			"Title": movie.Title,
			"Year": movie.Year,
			"Poster": movie.Poster,
			"imdbID": movie.imdbID
		};
		watchlist.push(newmovieitem);
		localStorage.setItem("userwatchlist", JSON.stringify(watchlist));
		swal({title: "Tamamdır!",text: "Film, izlenecekler listenize eklendi.",timer: 900,showConfirmButton: false});
	}
	$scope.RemoveMovieWatchList = function(movie){
		var watchlist = Helpers.WatchList.get();
		watchlist = _.without(watchlist, _.findWhere(watchlist, {
		  imdbID: movie.imdbID
		}));
		localStorage.setItem("userwatchlist", JSON.stringify(watchlist));
		swal({title: "Tamamdır!",text: "Film, izlenecekler listenizden çıkartıldı.",timer: 900,showConfirmButton: false});
	}
	$scope.CheckWatchList = function(movieId){
		var isMovieWatchList = false;
		if( _.findWhere(Helpers.WatchList.get(), {imdbID: movieId}) ){
			isMovieWatchList = true;
		}else{
			isMovieWatchList = false;
		}
		return isMovieWatchList;
	}
});

mymovies.controller('homePage', function($scope,$http) {
	$scope.runSearch = function() {
		window.location.href = "#!/SearchMovie/" + document.getElementById("txtMovieName").value;
	};
});

mymovies.controller('searchResults', function($scope,$routeParams,$http) {
	$scope.movies = [];
	$scope.keyword = $routeParams.Keyword;
	$scope.getSearchResults = function(pageindex) {
		Helpers.Preloader.open();
		$http.get(Helpers.Api.getApiUrl + "?s="+$scope.keyword+"&page="+ pageindex).then(function(result) {
			$scope.movies = result.data;
			Helpers.Preloader.close();
		}, function(error) {
			alert(error);
		});
	};
	$scope.getSearchResults(1);
});

mymovies.controller('movieDetail', function($scope,$routeParams,$http) {
	$scope.movieObject = [];
	$scope.movieid = $routeParams.imdbID;
	Helpers.Preloader.open();
	$scope.getMovieDetail = function() {
		$http.get(Helpers.Api.getApiUrl + "?i="+$scope.movieid+"&plot=short&r=json").then(function(result) {
			$scope.movieObject = result.data;
			Helpers.Preloader.close();
		}, function(error) {
			alert(error);
		});
	};
	$scope.getMovieDetail();
});

mymovies.controller('watchList', function($scope,$http) {
	$scope.movieList = [];
	$scope.loadUserWatchList = function () {
		$scope.movieList = Helpers.WatchList.get();
	};
	$scope.loadUserWatchList();
});

/*mymovies.directive( 'backButton', function() {
    return {
        restrict: 'A',
        link: function( scope, element, attrs ) {
            element.on( 'click', function () {
                history.back();
                scope.$apply();
            } );
        }
    };
} );*/

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