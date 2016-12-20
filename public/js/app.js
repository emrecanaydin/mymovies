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
		templateUrl:'templates/404.html',
		controller: '404'
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

mymovies.controller('homePage', function($scope,$http, SiteServices) {
	$scope.runSearch = function() {
		window.location.href = "#!/SearchMovie/" + document.getElementById("txtMovieName").value;
	};
	SiteServices.setPageTitle("Ana Sayfa");
});

mymovies.controller('404', function($scope,$http, SiteServices) {
	SiteServices.setPageTitle("404 Sayfa Bulunamadı");
});


mymovies.controller('searchResults', function($scope,$routeParams,$http, SiteServices) {
	$scope.movies = [];
	$scope.keyword = $routeParams.Keyword;
	$scope.getSearchResults = function(pageindex) {
		Helpers.Preloader.open();
		$http.get(Helpers.Api.getApiUrl + "?s="+$scope.keyword+"&page="+ pageindex).then(function(result) {
			$scope.movies = result.data;
			SiteServices.setPageTitle("Arama Sonuçları: " + $scope.keyword);
			Helpers.Preloader.close();
		}, function(error) {
			alert(error);
		});
	};
	$scope.getSearchResults(1);
});

mymovies.controller('movieDetail', function($scope,$routeParams,$http, $window, SiteServices) {
	$scope.movieObject = [];
	$scope.movieid = $routeParams.imdbID;
	Helpers.Preloader.open();
	$scope.getMovieDetail = function() {
		$http.get(Helpers.Api.getApiUrl + "?i="+$scope.movieid+"&plot=short&r=json").then(function(result) {
			$scope.movieObject = result.data;
			SiteServices.setPageTitle($scope.movieObject.Title);
			Helpers.Preloader.close();
		}, function(error) {
			alert(error);
		});
	};
	$scope.getMovieDetail();
});

mymovies.controller('watchList', function($scope,$http, SiteServices) {
	$scope.movieList = [];
	$scope.loadUserWatchList = function () {
		$scope.movieList = Helpers.WatchList.get();
		SiteServices.setPageTitle("İzleme Listeniz");
	};
	$scope.loadUserWatchList();
});


mymovies.service('SiteServices', function ($window) {
    this.setPageTitle = function (title) {
		$window.document.title = title + " | " + Helpers.Site.siteName;
    };
});