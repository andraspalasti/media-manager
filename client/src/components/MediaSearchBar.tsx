import { Box, Center, Collapse, Grid, Input, InputGroup, InputLeftElement, Spinner } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { MediaRow } from "./MediaRow";
import { useSearchMovieLazyQuery } from "../generated/graphql";

let debounce: any;

export const MediaSearchBar: React.FC = () => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		if (e.target.value !== "") {
			setShow(true);
		} else {
			setShow(false);
		}
	};
	const [show, setShow] = useState(false);
	const [title, setTitle] = useState("");

	return (
		<Box width="100%" position="relative">
			<InputGroup rounded="lg" zIndex={10} onFocus={() => title && setShow(true)} onBlur={() => setShow(false)}>
				<InputLeftElement children={<SearchIcon />} />
				<Input rounded="lg" value={title} type="text" placeholder="Search for movie or tv-show" onChange={handleChange} />
			</InputGroup>
			<Box position="absolute" zIndex={9} width="100%">
				<Collapse in={show} animateOpacity>
					<Box shadow="0 10px 15px -3px rgba(0,0,0,0.4)" transition="height ease-in-out 300ms" backgroundColor="gray.700" rounded="lg" p={3}>
						<Results title={title} />
					</Box>
				</Collapse>
			</Box>
		</Box>
	);
};

interface ResultProps {
	title: string;
}

const Results: React.FC<ResultProps> = ({ title }) => {
	const history = useHistory();
	const [searchForMovie, { loading, data, error }] = useSearchMovieLazyQuery();

	useEffect(() => {
		if (title !== "") {
			debounce && clearTimeout(debounce);
			debounce = setTimeout(() => searchForMovie({ variables: { title } }), 500);
		}
	}, [searchForMovie, title]);

	if (error) {
		console.error(error);
		return <Center color="red.400">Ooops... an error occured</Center>;
	}
	if (loading) {
		return (
			<Center p={5}>
				<Spinner size="xl" />
			</Center>
		);
	}
	const movies = data?.searchMovie.results?.slice().sort((a: any, b: any) => b.popularity - a.popularity);
	if (!movies || movies.length === 0) {
		return <Center>No movies found</Center>;
	}
	return (
		<Grid
			templateColumns={{ base: "100%", md: "auto auto auto" }}
			maxH={{ base: "50vh", md: "70vh" }}
			overflow="auto"
			columnGap={6}
			pr={2}
			rowGap={3}
		>
			{movies.slice(0, 6).map(({ id, genres, title, release_date, poster_path, vote_average }: any) => {
				return (
					<MediaRow
						key={id}
						id={id}
						genres={genres}
						releaseDate={new Date(release_date.toString())}
						rating={vote_average}
						imagePath={poster_path}
						title={title}
						onClick={(id) => history.push(`/movies/${id}`)}
					/>
				);
			})}
		</Grid>
	);
};
