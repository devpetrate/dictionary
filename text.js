const API_URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=6b789b1582aa7d6f8babaffac322232c&page=1`

const dictionary = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.results);
    } catch (error) {
        console.error("Error:", error);
    }
}

dictionary(API_URL)