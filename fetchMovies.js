let imdbKey = ""

let moviesTitleList = [
  "breaking the waves"
  //"Lost highway ",
  //"once upon a time in america ",
  //"American psycho ",
  //"the pianist ",
  //"her",
  // "city of the god",
  // "dr strangelove",
];

importMovies();

async function importMovies() {
  let moviesObj = { movies: [] };
  for (let i = 0; i < moviesTitleList.length; i++) {
    console.log("fetching data for: " + moviesTitleList[i]);
    let movie = await getMovieDetails(moviesTitleList[i]);
    moviesObj.movies.push(movie);
  }
  console.log(JSON.stringify(moviesObj));
}

async function getMovieDetails(movieTitle) {
  let movie = {};
  await fetch(`https://imdb-api.com/en/API/Search/${imdbKey}/${movieTitle}`)
    .then((response) => response.json())
    .then(async (data) => {
      //mark as skip if no data
      if (data.results[0].title.toLowerCase() == movieTitle.toLowerCase()) {
        let movieId = data.results[0].id; 
        await fetch(`https://imdb-api.com/en/API/Title/${imdbKey}/${movieId}`)
          .then((response) => response.json())
          .then((data) => {
            movie.title = movieTitle;
            movie.year = data.year;
            movie.director = data.directors;
            movie.runningTime = data.runtimeStr;
            movie.trailerLink="";
            movie.thumbPath = "img/" + movie.title.replace(/ |'/g, "-") + ".jpg";
            if(data.genreList){
              movie.tag = data.genreList.map((el) => { return el.value; } );
            }
            movie.imdbScore = data.imDbRating;
            movie.synopsis = data.plot;
          });
      } else {
        console.log("title not found for: " + movieTitle);
      }
    });
  return movie;
}
