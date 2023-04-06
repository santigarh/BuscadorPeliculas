import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";
import debounce from "just-debounce-it";

function useSearch() {
	const [search, updateSearch] = useState("");
	const [error, setError] = useState(null);
	const isFirstInput = useRef(true);

	useEffect(() => {
		if (isFirstInput.current) {
			isFirstInput.current = search === "";
			return;
		}

		if (search === "") {
			setError("No se puede buscar una película vacía");
			return;
		}

		if (search.match(/^\d+$/)) {
			setError("No se puede buscar una película con un número");
			return;
		}

		if (search.length < 3) {
			setError("La búsqueda debe tener al menos 3 caracteres");
			return;
		}

		setError(null);
	}, [search]);

	return { search, updateSearch, error };
}

function App() {
	const [sort, setSort] = useState(false);
	const { search, updateSearch, error } = useSearch();
	const { movies, loading, getMovies } = useMovies({ search, sort });

	const debounceGetMovies = useCallback(
		debounce((search) => {
			getMovies({ search });
		}, 500),
		[getMovies],
	);

	const handleSubmit = (event) => {
		event.preventDefault();
		getMovies({ search });
	};

	const handleChange = (event) => {
		const newSearch = event.target.value;
		updateSearch(newSearch);
		debounceGetMovies(newSearch);
	};
	const handleSort = () => {
		setSort(!sort);
	};

	return (
		<div className="page">
			<header>
				<h1>Buscador de Peliculas</h1>
				<form className="form" onSubmit={handleSubmit}>
					<label>
						<input
							style={{
								border: "1px solid trasnparent",
								borderColor: error ? "red" : "transparent",
							}}
							onChange={handleChange}
							name='query'
							placeholder="Avengers, The Batman, Titanic.."
						/>
						<input type='checkbox' onChange={handleSort} checked={sort} />
						<button type="submit">Buscar</button>
					</label>
				</form>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</header>

			<main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
		</div>
	);
}

export default App;
