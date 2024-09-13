import React, { useEffect, useState } from 'react';
import './MoviesApp.css';
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

export default function MoviesApp() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const [expandedMovieId, setExpandedMovieId] = useState(null); // Corrected variable name

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    'http://api.themoviedb.org/3/genre/movie/list',
                    {
                        params: {
                            api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
                        },
                    }
                );
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(
                    'http://api.themoviedb.org/3/discover/movie',
                    {
                        params: {
                            api_key: '0fa2853e7c4d6c8f146aba861c5e4a06',
                            sort_by: sortBy,
                            page: 1,
                            with_genres: selectedGenre,
                            query: searchQuery,
                        },
                    }
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, [sortBy, selectedGenre, searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };
    const handleGenreChange = (event) => {
        setSelectedGenre(event.target.value);
    };

    const toggleDescription = (movieId) => {
        setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
    };

    return (
        <div>
            <h1>MoviesHub</h1>
            <div className='search-bar'>
                <input 
                    type='text' 
                    placeholder='Search for a movie' 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                    className='search-input' 
                />
                <button className='search-button'>
                    <AiOutlineSearch />
                </button>
            </div>
            <div className='filters'>
                <label htmlFor='sort-by'>Sort By:</label>
                <select id='sort-by' value={sortBy} onChange={handleSortChange}>
                    <option value="popularity.desc">Popularity Descending</option>
                    <option value="popularity.asc">Popularity Ascending</option>
                    <option value="vote_average.asc">Rating Ascending</option>
                    <option value="vote_average.desc">Rating Descending</option>
                    <option value="release_date.desc">Release Date Descending</option>
                    <option value="release_date.asc">Release Date Ascending</option>
                </select>
                
                <label htmlFor='genre'>Genre:</label>
                <select id='genre' value={selectedGenre} onChange={handleGenreChange}>
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className='movies-wrapper'>
                {movies.map((movie) => (
                    <div key={movie.id} className='movie'>
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className='movie-poster'
                        />
                        <h2>{movie.title}</h2>
                        <p className='rating'>Rating: {movie.vote_average}</p> {/* Fixed rating value */}
                        {expandedMovieId === movie.id ? (
                            <p>{movie.overview}</p>
                        ) : (
                            <p>{movie.overview.substring(0, 150)}...</p>
                        )}
                        <button onClick={() => toggleDescription(movie.id)} className='read-more'>
                            {expandedMovieId === movie.id ? 'Read Less' : 'Read More'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
