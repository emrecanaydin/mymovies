var Helpers ={
	Api : {
		getApiUrl:  "http://www.omdbapi.com/"
	},
	WatchList: {
		get: function(){
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
	MobileMenu: function(){
		if (document.body.classList.contains('mobile-menu-opened')) {
			document.body.classList.remove('mobile-menu-opened');
		}else{
			document.body.className += " mobile-menu-opened";
		}
	}
}