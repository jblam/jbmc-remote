// library ui code
"use strict";
var entryTemplate;
var mainListing;
var defaultImageUri = "http://placehold.it/50x50";
document.addEventListener('DOMContentLoaded', evt => {
	entryTemplate = document.getElementById("listing-template");
	mainListing = document.querySelector(".main-listing");
	mainListing.addEventListener("click", function(evt) {
		alert(evt.target.textContent);
	}, false);
	document.getElementById("media-music").addEventListener("click", showAlbums, false);
	document.getElementById("media-tv").addEventListener("click", showTV, false);
	document.getElementById("media-movies").addEventListener("click", showMovies, false);
}, false);

function createListingEntry(title, detailPromise) {
	var clone = document.importNode(entryTemplate.content, true);
	clone.querySelector(".listing-title").textContent = title;
	var img = clone.querySelector(".listing-thumb");
	var desc = clone.querySelector(".listing-description");
	detailPromise.then(details => {
		console.log(details.desc, details.img);
		desc.textContent = (details.desc || []).join(", ");
		if (details.img) {
			img.src = decodeURIComponent(formatImageUri(details.img));
		}
	});
	mainListing.appendChild(clone);
}
function showTV() {
	mainListing.innerHTML = "";
	var pTV = RPC.send("VideoLibrary.GetTVShows");
	pTV.then(obj => {
		if (!obj.limits.total) { console.log("no TV"); return; }
		obj.tvshows.forEach(
			a => createListingEntry(
			  a.label,
			  RPC.send(new RpcObject("VideoLibrary.GetTVShowDetails",
				{ tvshowid:a.tvshowid,
				  properties:[ "art", "genre" ] }))
				.then(o => ({ desc:o.tvshowdetails.genre, img:o.tvshowdetails.art.fanart }))
			)
		);
	});
}
function showMovies() {
	mainListing.innerHTML = "";
	var pMovies = RPC.send("VideoLibrary.GetMovies");
	pMovies.then(obj => {
		if (!obj.limits.total) { console.log("no movies"); return; }
		obj.movies.forEach(
			a => createListingEntry(
			  a.label,
			  RPC.send(new RpcObject("VideoLibrary.GetMovieDetails",
				{ movieid:a.movieid,
				  properties:[ "art", "genre" ] }))
				.then(o => ({ desc:o.moviedetails.genre, img:o.moviedetails.art.fanart }))
			)
		);
	});
}
function showAlbums() {
	mainListing.innerHTML = "";
	var pAlbum = RPC.send("AudioLibrary.GetAlbums");
	pAlbum.then(obj => {
		if (!obj.limits.total) { console.log("no albums"); return; }
		obj.albums.forEach(
			a => createListingEntry(
			  a.label,
			  Promise.resolve({desc:[], img:undefined})
			  // Can't get a suitable description for albums
			  // Thumbnail returns a local file path
			  // Therefore, don't provide extra information here
			  // RPC.send(new RpcObject("AudioLibrary.GetAlbumDetails",
			  //   { albumid:a.albumid,
			  // 	 properties:[ "thumbnail" ] }))
			  // .then(o => ({ desc:[], img:undefined }))
			)
		);
	});
}
