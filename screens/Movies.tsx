import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import Slide from '../components/Slide';
import VMedia from '../components/VMedia';
import HMedia from '../components/HMedia';
import { useQuery, useQueryClient } from 'react-query';
import { MovieResponse, moviesApi } from '../api';
import Loader from '../components/Loader';
import HList from '../components/HList';

const Container = styled.ScrollView``;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ListTitle = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin-left: 30px;
`;

const TrendingScroll = styled.FlatList`
    margin-top: 20px;
`;

const ListContainer = styled.View`
    margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
    margin-bottom: 20px;
`;

const VSeparator = styled.View`
    width: 20px;
`;

const HSeparator = styled.View`
    height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, 'Movies'>> = () => {
    const queryClient = useQueryClient();
    let refreshing: boolean,
        setRefreshing: (
            value: ((prevState: boolean) => boolean) | boolean,
        ) => void;
    [refreshing, setRefreshing] = useState(false);
    const {
        isLoading: nowPlayingLoading,
        data: nowPlayingData,
        isRefetching: isRefetchingNowPlaying,
    } = useQuery<MovieResponse>(['movies', 'nowPlaying'], moviesApi.nowPlaying);
    const {
        isLoading: upcomingLoading,
        data: upcomingData,
        isRefetching: isRefetchingUpcoming,
    } = useQuery<MovieResponse>(['movies', 'upcoming'], moviesApi.upcoming);
    const {
        isLoading: trendingLoading,
        data: trendingData,
        isRefetching: isRefetchingTrending,
    } = useQuery<MovieResponse>(['movies', 'trending'], moviesApi.trending);

    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['movies']);
    };

    const renderVMedia = ({ item }) => (
        <VMedia
            posterPath={item.poster_path}
            originalTitle={item.original_title}
            voteAverage={item.vote_average}
        />
    );

    const renderHMedia = ({ item }) => (
        <HMedia
            posterPath={item.poster_path}
            originalTitle={item.original_title}
            overview={item.overview}
            releaseDate={item.release_date}
        />
    );

    const movieKeyExtractor = (item) => item.id + '';
    const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
    return loading ? (
        <Loader />
    ) : upcomingData ? (
        <FlatList
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListHeaderComponent={
                <>
                    <Swiper
                        horizontal
                        loop
                        autoplay
                        autoplayTimeout={3.5}
                        showsButtons={false}
                        showsPagination={false}
                        containerStyle={{
                            marginBottom: 40,
                            width: '100%',
                            height: SCREEN_HEIGHT / 4,
                        }}
                    >
                        {nowPlayingData?.results.map((movie) => (
                            <Slide
                                key={movie.id}
                                backdropPath={movie.backdrop_path || ''}
                                posterPath={movie.poster_path || ''}
                                originalTitle={movie.original_title}
                                voteAverage={movie.vote_average}
                                overview={movie.overview}
                            />
                        ))}
                    </Swiper>
                    {trendingData ? (
                        <HList
                            title='trending Movies'
                            data={trendingData.results}
                        />
                    ) : null}
                    <ComingSoonTitle>Coming soon</ComingSoonTitle>
                </>
            }
            data={upcomingData.results}
            keyExtractor={movieKeyExtractor}
            ItemSeparatorComponent={HSeparator}
            renderItem={renderHMedia}
        />
    ) : null;
};

export default Movies;
