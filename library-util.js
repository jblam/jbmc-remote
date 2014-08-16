var exampleImage = "image://http%3a%2f%2fimage.tmdb.org%2ft%2fp%2foriginal%2fpQcSfSu4hy4AJ1KjjTxXKBQdMzE.jpg/"

var formatImageUri = uri => /^image:\/\/(.*)\/$/.exec(uri)[1];

function acquireImage(imageUri) {
  var innerUrl = formatImageUri(imageUri);
  var output = new Image();
  output.src = decodeURIComponent(innerUrl);
  return output;
}