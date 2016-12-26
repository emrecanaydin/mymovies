var mymovies = angular.module("movieapp", ["ngRoute"]);

mymovies.config(['$routeProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
	when('/', {
		templateUrl: 'templates/home-page.html',
		controller: 'homePage'
	}).
	when('/SearchMovie/:Keyword/Page/:Index', {
		templateUrl: 'templates/search-results.html',
		controller: 'searchResults'
	}).
	when('/MovieDetail/:imdbID', {
		templateUrl: 'templates/movie-detail.html',
		controller: 'movieDetail'
	}).
	when('/WatchList/', {
		templateUrl: 'templates/watch-list.html',
		controller: 'watchList'
	}).
	otherwise({
		templateUrl:'templates/404.html',
		controller: '404'
	});
}]);

mymovies.controller('mainCtrl', function($scope, SiteServices){
	
	$scope.authList = [
		{
		  modelName:"createdAuthValue.sumList",
		  modelText: "Sistem Özeti Okuma",
		  status   : false
		}
	];
		
	$scope.Helpers = SiteServices;
	
	$scope.Helpers.Site.deviceSensitivities();
	
	$scope.$on('$routeChangeStart', function(next, current) { 
		SiteServices.MobileMenu.close();
	 });
	 
	
	$scope.goPreviousPage = function() {
		window.history.back();
	};
	
	$scope.AddWatchList = function(movie){
		var watchlist = SiteServices.WatchList.get();
		newmovieitem = {
			"Title": movie.Title,
			"Year": movie.Year,
			"Poster": movie.Poster,
			"imdbID": movie.imdbID
		};
		watchlist.push(newmovieitem);
		localStorage.setItem("userwatchlist", JSON.stringify(watchlist));
		swal({title: "Success!",text: "Movie added your watchlist.",timer: 900,showConfirmButton: false});
	}
	
	$scope.RemoveMovieWatchList = function(movie){
		var watchlist = SiteServices.WatchList.get();
		watchlist = _.without(watchlist, _.findWhere(watchlist, {
		  imdbID: movie.imdbID
		}));
		localStorage.setItem("userwatchlist", JSON.stringify(watchlist));
		swal({title: "Success!",text: "Movie removed from your watchlist.",timer: 900,showConfirmButton: false});
	}
	
	$scope.CheckWatchList = function(movieId){
		var isMovieWatchList = false;
		if( _.findWhere(SiteServices.WatchList.get(), {imdbID: movieId}) ){
			isMovieWatchList = true;
		}else{
			isMovieWatchList = false;
		}
		return isMovieWatchList;
	}
	
});

mymovies.controller('homePage', function($scope,$http, SiteServices) {
	$scope.runSearch = function() {
		window.location.href = "#!/SearchMovie/" + document.getElementById("txtMovieName").value + "/Page/1";
	};
	SiteServices.Site.setPageTitle("Home Page");
});

mymovies.controller('404', function($scope,$http, SiteServices) {
	SiteServices.Site.setPageTitle("404 Page Not Found");
});


mymovies.controller('searchResults', function($scope,$routeParams,$http, SiteServices) {
	$scope.movies = [];
	$scope.keyword = $routeParams.Keyword;
	$scope.index = $routeParams.Index;
	$scope.getSearchResults = function() {
		SiteServices.Preloader.open();
		$http.get(SiteServices.Api.getApiUrl + "?s="+$scope.keyword+"&page="+ $scope.index).then(function(result) {
			//return search result
			$scope.movies = result.data;
			//crete pager
			$scope.pagerLength = Math.round($scope.movies.totalResults / 8);
			$scope.pagerArray = {
				pagerItems : [],
				pagerInfo: {
					prevIndex: Number($scope.index) - 1,
					nextIndex : Number($scope.index) + 1,
					isFirstIndex: Number($scope.index) == 1,
					isLastIndex: Number($scope.index) == $scope.pagerLength
				}
			};
			for (i = 0; i < $scope.pagerLength; i++){
				var pagerItem = {
					number: i,
					isActive: i == Number($scope.index) -1
				}
				$scope.pagerArray.pagerItems.push(pagerItem);
			}
			console.log($scope.pagerArray);
			SiteServices.Site.setPageTitle("Search Results: " + $scope.keyword);
			SiteServices.Preloader.close();
		}, function(error) {
			alert(error);
		});

	};
	$scope.getSearchResults(1);
});

mymovies.controller('movieDetail', function($scope,$routeParams,$http, SiteServices) {
	$scope.movieObject = [];
	$scope.movieid = $routeParams.imdbID;
	SiteServices.Preloader.open();
	$scope.getMovieDetail = function() {
		$http.get(SiteServices.Api.getApiUrl + "?i="+$scope.movieid+"&plot=short&r=json").then(function(result) {
			$scope.movieObject = result.data;
			SiteServices.Site.setPageTitle($scope.movieObject.Title);
			SiteServices.Preloader.close();
		}, function(error) {
			alert(error);
		});
	}; 
	$scope.getMovieDetail();
});

mymovies.controller('watchList', function($scope,$http, SiteServices) {
	$scope.movieList = [];
	$scope.loadUserWatchList = function () {
		$scope.movieList = SiteServices.WatchList.get();
		SiteServices.Site.setPageTitle("My Watchlist");
	};
	$scope.loadUserWatchList();
});


mymovies.service('SiteServices', function ($window) {
	SiteServices = { 
		Site : {
			scrollTop: function(duration){
				var scrollStep = -window.scrollY / (duration / 15),
					scrollInterval = setInterval(function(){
					if ( window.scrollY != 0 ) {
						window.scrollBy( 0, scrollStep );
					}
					else clearInterval(scrollInterval); 
				},15);
			},
			deviceSensitivities: function(){
				window.onresize = function(event) {
					if( window.innerWidth > 767 ){
						SiteServices.MobileMenu.close();
					}
				};
			},
			setPageTitle : function (title) {
				$window.document.title = title + " | " + SiteServices.Site.siteName;
			},
			siteName: "Movie Collector"
		},
		Api : {
			getApiUrl:  "http://www.omdbapi.com/"
		},
		WatchList : {
			get:  function(){
				return localStorage.getItem("userwatchlist") == null ? [] : JSON.parse(localStorage.getItem("userwatchlist"));
			}
		},
		Preloader : {
			open: function(){
				document.body.className += " loading";
			},
			close: function(){
				document.body.classList.remove('loading');
			}
		},
		Modal : {
			open: function(){
				document.getElementById("modal-overlay").style["display"] = 'block';
				document.getElementById("modal").style["display"] = 'block';
			},
			close: function(){
				document.getElementById("modal-overlay").style["display"] = "none";
				document.getElementById("modal").style["display"] = "none";
			}
		},
		MobileMenu : {
			open: function(){
				document.body.className += " mobile-menu-opened";
			},
			close: function(){
				document.body.classList.remove('mobile-menu-opened');
			},
			run: function(){
				if (document.body.classList.contains('mobile-menu-opened')){
					this.close();
				}
				else{
					this.open();
				}
			}
		}
	}
	
	return SiteServices;
		
});