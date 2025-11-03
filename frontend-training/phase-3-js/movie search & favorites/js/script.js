const apiKey = 'cf953335';

const seachBtnMovie = document.querySelector('.search-btn-movie')
const movieInput = document.querySelector('.movie-text')

const result = document.querySelector ('.results')
const movieDetails = document.querySelector ('.movie-details')
const movieFav = document.querySelector ('.movie-favorites')
const dropdownItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.getElementById('dropdownMenuButton');

const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')

let selectedGenre = '';
let currentPage = 1;

// when a genre is clicked the dropdown gets its name
dropdownItems.forEach( item => {
    item.addEventListener('click', e => {
        selectedGenre = item.textContent;
        dropdownButton.textContent = selectedGenre;
    })
})

seachBtnMovie.addEventListener('click', () => {
    const movieName = movieInput.value.trim();

    if (!movieName) {
        alert('Please type a movie!');
        return;
    }

    if (!selectedGenre) {
        alert('Please select a genre!');
        return;
    }

    localStorage.setItem('lastMovie', movieName);
    localStorage.setItem('lastGenre', selectedGenre)

    currentPage = 1;
    fetchByGenre(selectedGenre, currentPage);
});


movieInput.addEventListener('keypress', function (e) {
    const movieName = movieInput.value.trim();

    if (e.key === "Enter"){
        if (!movieName) {
            alert('Please type a movie!');
            return;
        }

        if (!selectedGenre) {
            alert('Please select a genre!');
            return;
        }

        localStorage.setItem('lastMovie', movieName);
        localStorage.setItem('lastGenre', selectedGenre)

        currentPage = 1;
        fetchByGenre(selectedGenre, currentPage);
    }
})

// previous btn decreases the current page and fetches the movies that list
prevBtn.addEventListener('click', () => {
    if (currentPage > 1){
        currentPage --;

        fetchByGenre(selectedGenre, currentPage);
    }
})

// next btn increases the current page and fetches the movies from that list
nextBtn.addEventListener('click', () => {
    currentPage ++;

    result.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    fetchByGenre(selectedGenre, currentPage);
})

// show the last searched genre when resfresh
window.addEventListener('DOMContentLoaded', () => {
    const lastMovie = localStorage.getItem('lastMovie');
    const lastGenre = localStorage.getItem('lastGenre')

    if (lastMovie) {
        movieInput.value = lastMovie;
    }

    if(lastGenre){
        dropdownButton.textContent = lastGenre;
    }
});

async function fetchByGenre(selectedGenre, page) {
    const movieName = movieInput.value.trim();
    if (!movieName) {
        alert('Please type a movie first!');
        return;
    }

    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}&page=${page}&type=movie`;
    result.innerHTML = `
        <p style="text-align:center;
        margin-top: 5rem;
        font-size: 28px">Loading...</p>
    `;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error');

        const data = await response.json();

        const detailMovies = await Promise.all(
            data.Search.map(async (movie) => {
                const detailResults = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
                return await detailResults.json();
            })
        );

        const filterMovies = detailMovies.filter(m => m.Genre && m.Genre.includes(selectedGenre));

        if (filterMovies.length === 0){
            result.innerHTML = `
                <p style="text-align:center;
                margin-top: 5rem;
                font-size: 28px">No movies found in this genre.</p>
            `;
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }

        if(filterMovies.length < 10){
            showMovies({ Search: filterMovies });
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }

        else{
            showMovies({ Search: filterMovies });
            prevBtn.style.display = 'inline-block';
            nextBtn.style.display = 'inline-block';
        }

    } catch (error) {
        console.log(error);
        result.innerHTML = '<p style="color:red; text-align:center;">Error loading movies. Check your internet connection.</p>';
    }
}

// fn that shows the movies in a list
function showMovies (data) {
    if (!data.Search || data.Search.length === 0) {
        result.innerHTML = '<p>No movies found.</p>';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }

    const movies = data.Search;
    result.innerHTML = '';

    // create a div to display every movie info
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.dataset.imdbid = movie.imdbID;

        movieCard.innerHTML = `
        <div style="margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center;">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
            <h4>${movie.Title}</h4>
            <h2>${movie.Year}</h2>
        </div>
    `;

        movieCard.addEventListener('click', () => {
            const id = movieCard.dataset.imdbid;
            fetchMovieDetailsAndShow(id);
        });

        result.appendChild(movieCard);
    });
}

// fn that gets Genre, Actors & Plot
async function fetchMovieDetailsAndShow(imdbID) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=short`);
        const movieDetailsData = await res.json();

        showMovieDetails(movieDetailsData);

    } catch (error) {
        console.log('Error fetching movie details',error)
    }
}

//fn for the details of the movie that's clicked
function showMovieDetails (movie) {
    movieDetails.innerHTML = `
        <h4 style="margin-top:2rem; color: darkslategray; font-weight: bold; font-size: 24px">${movie.Title}</h4>
        <h2 style="font-weight: lighter; font-style: italic; text-align: left; font-size: 18px">(${movie.Year})</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <button class="add-fav-btn" 
            style="padding: 0.5rem 1rem;
            margin-left: 5px;
            background-color: #2F4F4F;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;">Add to Favorites</button>
    `;

    document.querySelector('.add-fav-btn').addEventListener('click', () => addToFavorites(movie));
}

//fn that adds the movie to favorites list
function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // If this movie is NOT already in favorites
    if (!favorites.some(f => f.imdbID === movie.imdbID)) {
        // adds id, title, year, poster to favorites list
        favorites.push({
            imdbID: movie.imdbID,
            Title: movie.Title,
            Year: movie.Year,
            Poster: movie.Poster
        });

        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();

        const btn = document.querySelector('.add-fav-btn');
        btn.textContent = 'Added!';
        btn.style.backgroundColor = 'green';
    }
}

//fn that lists the movies in the favorites list
function renderFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    movieFav.innerHTML = '';

    if (favorites.length === 0) {
        movieFav.innerHTML = `
            <p style="opacity:0.7; text-align:center; margin-top:3rem">
                No favorite movies yet...
            </p>
        `;
        return;
    }

    favorites.forEach(fav => {
        // create a div for the favorite movie
        const favItem = document.createElement('div');
        favItem.classList.add('fav-item');
        favItem.style.display = 'flex';
        favItem.style.alignItems = 'center';
        favItem.style.marginBottom = '2rem';

        // create an element for the poster
        const poster = document.createElement('img');
        poster.src = fav.Poster !== "N/A" ? fav.Poster : 'placeholder.jpg';
        poster.alt = fav.Title;
        poster.style.width = '50px';
        poster.style.height = '70px';
        poster.style.objectFit = 'cover';
        poster.style.marginRight = '10px';

        favItem.appendChild(poster);

        // p for the title and the year
        const title = document.createElement('p');
        title.textContent = `${fav.Title} (${fav.Year})`;
        favItem.appendChild(title);

        // del btn ❌ which on click removes the movie from the saved list, new list, updated favorites container
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.style.background = 'transparent';
        delBtn.style.border = 'none';
        delBtn.style.color = 'red';
        delBtn.style.fontSize = '18px';
        delBtn.style.cursor = 'pointer';
        delBtn.addEventListener('click', () => {
            favorites = favorites.filter(f => f.imdbID !== fav.imdbID);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });

        favItem.appendChild(delBtn);

        movieFav.appendChild(favItem);
    });
}

document.addEventListener('DOMContentLoaded', renderFavorites)

let debounceTimer;
document.addEventListener('keypress', function(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if(!movieInput) {
            alert('Please type a movie!');
            return;
        }
        currentPage = 1;
        fetchByGenre(selectedGenre, currentPage);
    }, 500);
})
