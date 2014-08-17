// library ui code
"use strict";
var entryTemplate;
var mainListing;
var defaultImageUri = "http://placehold.it/50x50";
document.addEventListener('DOMContentLoaded', evt => {
	entryTemplate = document.getElementById("listing-template");
	mainListing = document.querySelector(".main-listing");
}, false);

function createListingEntry(imageUri, title, description) {
	var clone = document.importNode(entryTemplate.content, true);
	clone.querySelector(".listing-thumb").src = imageUri || defaultImageUri;
	clone.querySelector(".listing-title").textContent = title;
	clone.querySelector(".listing-description").textContent = description || "";
	mainListing.appendChild(clone);
}
