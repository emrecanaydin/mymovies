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
	MobileMenu: function(){
		var x = document.getElementById("topnav");
		if (x.className === "topnav") {
			x.className += " responsive";
		} else {
			x.className = "topnav";
		}
	}
	
}