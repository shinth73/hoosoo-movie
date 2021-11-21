import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useQuery, useQueryClient } from 'react-query';
import Loader from '../components/Loader';
import HList from '../components/HList';
import {TV, tvApi} from "../api";

const Tv = () => {
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);
    const {
        isLoading: todayLoading,
        data: todayData,
        isRefetching: todayRefetching,
    } = useQuery(['tv', 'today'], tvApi.airingToday);
    const {
        isLoading: topLoading,
        data: topData,
        isRefetching: topRefetching,
    } = useQuery(['tv', 'top'], tvApi.topRated);
    const {
        isLoading: trendingLoading,
        data: trendingData,
        isRefetching: trendingRefetching,
    } = useQuery(['tv', 'trending'], tvApi.trending);
    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['tv']);
    };
    const loading = todayLoading || topLoading || trendingLoading;
    if (loading) {
        return <Loader />;
    }
    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} />}
            contentContainerStyle={{ paddingVertical: 30 }}
        >
            <HList title='Trending TV' data={trendingData.results} />
            <HList title='Airing Today' data={todayData.results} />
            <HList title='Top Rated TV' data={topData.results} />
        </ScrollView>
    );
};

export default Tv;
