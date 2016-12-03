var Helpers ={
	Api : {
		getApiUrl:  "http://www.omdbapi.com/"
	},
	Preloader : {
		open: function(){
			document.body.className = "loading"
		},
		close: function(){
			document.querySelector('body').classList.remove('loading')
		}
	},
	Modal: {
		open: function(){
			document.getElementById("modal-overlay").style["display"] = 'block';
			document.getElementById("modal").style["display"] = 'block';
		},
		close: function(){
			document.getElementById("modal-overlay").style["display"] = "none";
			document.getElementById("modal").style["display"] = "none";
		}
	},
	User: {
		addWatchList: function(movie){
			var watchlist = localStorage.getItem("userwatchlist") == null ? [] : JSON.parse(localStorage.getItem("userwatchlist"));
			moviedetail = {
				"name": movie.getAttribute("data-movie-name"),
				"year": movie.getAttribute("data-movie-year"),
				"poster": movie.getAttribute("data-movie-poster"),
				"id": movie.getAttribute("data-movie-imdbid")
			};
			watchlist.push(moviedetail);
			localStorage.setItem("userwatchlist", JSON.stringify(watchlist));
			swal({
			  title: "Tamamdır!",
			  text: "Film, izlenecekler listenize eklendi.",
			  timer: 2000,
			  showConfirmButton: false
			});
		}
	},
	MobileMenu: function(){
		var x = document.getElementById("topnav");
		if (x.className === "topnav") {
			x.className += " responsive";
		} else {
			x.className = "topnav";
		}
	}
	
}