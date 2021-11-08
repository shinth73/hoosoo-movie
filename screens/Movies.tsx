import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import Slide from "../components/Slide";

const API_KEY = '8f84640eaec345addf5f99ad785ed454';

const Container = styled.ScrollView``;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = (values: readonly [(PromiseLike<T1> | T1), (PromiseLike<T2> | T2), (PromiseLike<T3> | T3), (PromiseLike<T4> | T4), (PromiseLike<T5> | T5), (PromiseLike<T6> | T6), (PromiseLike<T7> | T7), (PromiseLike<T8> | T8), (PromiseLike<T9> | T9), (PromiseLike<T10> | T10)]) => {
    const [loading, setLoading] = useState(true);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [upComing, setUpComing] = useState([]);
    const [trending, setTrending] = useState([]);

    const getTrending = async () => {
        const {results} = await (
            await fetch(
                `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
            )
        ).json();
        setTrending(results);
    };
    const getUpcomming = async () => {
        const {results} = await (
            await fetch(
                `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=KR`,
            )
        ).json();
        setUpComing(results);
    };
    const getNowPlaying = async () => {
        const {results} = await (
            await fetch(
                `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`,
            )
        ).json();
        setNowPlaying(results);
    };
    const getData = async () => {
        await Promise.all([getTrending(), getUpcomming(), getNowPlaying()]);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    }, []);

    return loading ? (
        <Loader>
            <ActivityIndicator/>
        </Loader>
    ) : (
        <Container>
            <Swiper
                horizontal
                loop
                autoplay
                autoplayTimeout={3.5}
                showsButtons={false}
                showsPagination={false}
                containerStyle={{width: '100%', height: SCREEN_HEIGHT / 4}}
            >
                {nowPlaying.map((movie) =>
                    <Slide
                        key={movie.id}
                        backdropPath={movie.backdrop_path}
                        posterPath={movie.poster_path}
                        originalTitle={movie.original_title}
                        voteAverage={movie.vote_average}
                        overview={movie.overview}
                    />)}
            </Swiper>
        </Container>
    );
};

export default Movies;
