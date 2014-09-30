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

function createListingEntry(imageUri, title, description) {
	var clone = document.importNode(entryTemplate.content, true);
	clone.querySelector(".listing-thumb").src = imageUri || defaultImageUri;
	clone.querySelector(".listing-title").textContent = title;
	clone.querySelector(".listing-description").textContent = description || "";
	mainListing.appendChild(clone);
}
function showTV() {
	var pTV = RPC.send("VideoLibrary.GetTVShows");
	pTV.then(obj => {
		if (!obj.limits.total) { console.log("no movies"); return; }
		obj.tvshows.forEach(
			a => createListingEntry(defaultImageUri, a.label, "No description")
		);
	});
}
function showMovies() {
	var pMovies = RPC.send("VideoLibrary.GetMovies");
	pMovies.then(obj => {
		if (!obj.limits.total) { console.log("no TV"); return; }
		obj.movies.forEach(
			a => createListingEntry(defaultImageUri, a.label, "No description")
		);
	});
}
function showAlbums() {
	var pAlbum = RPC.send("AudioLibrary.GetAlbums");
	pAlbum.then(obj => {
		if (!obj.limits.total) { console.log("no albums"); return; }
		obj.albums.forEach(
			a => createListingEntry(defaultImageUri, a.label, "No description")
		)
	});
}
