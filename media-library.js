// library ui code
"use strict";
var entryTemplate;
var mainListing;
var defaultImageUri = "http://placehold.it/50x50";
document.addEventListener('DOMContentLoaded', evt => {
	entryTemplate = document.getElementById("listing-template");
	mainListing = document.querySelector(".main-listing");
	document.getElementById("media-music").addEventListener("click", showAlbums, false);
}, false);

function createListingEntry(imageUri, title, description) {
	var clone = document.importNode(entryTemplate.content, true);
	clone.querySelector(".listing-thumb").src = imageUri || defaultImageUri;
	clone.querySelector(".listing-title").textContent = title;
	clone.querySelector(".listing-description").textContent = description || "";
	mainListing.appendChild(clone);
}

function showAlbums() {
	var pAlbum = RPC.send("AudioLibrary.GetAlbums");
	pAlbum.then(obj => alert(obj.albums.length));
	pAlbum.then(obj => obj.albums.forEach(
		a => createListingEntry(defaultImageUri, a.label, "No description")
	));
}
