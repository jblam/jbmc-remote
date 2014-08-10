var exampleImage = "image://http%3a%2f%2fimage.tmdb.org%2ft%2fp%2foriginal%2fpQcSfSu4hy4AJ1KjjTxXKBQdMzE.jpg/"

function acquireImage(imageUrl) {
  var innerUrl = /^image:\/\/(.*)\/$/.exec(imageUrl)[1];
  var output = new Image();
  output.src = decodeURIComponent(innerUrl);
  return output;
}