import React from 'react';
import Hero from './Hero';
import RoomList from './RoomList';
import Amenities from './Amenities';
import Dashboard from './Dashboard';
import StorySection from './StorySection';

const Home = ({
    onSearch,
    onOpenCalendar,
    checkIn,
    checkOut,
    searchResults,
    isLoading,
    hasSearched
}) => {
    return (
        <>
            <Hero
                onSearch={onSearch}
                onOpenCalendar={onOpenCalendar}
                checkIn={checkIn}
                checkOut={checkOut}
            />
            <RoomList
                rooms={searchResults}
                isLoading={isLoading}
                hasSearched={hasSearched}
                onSearch={onSearch}
            />
            <StorySection />
            <Dashboard />
            <Amenities />
        </>
    );
};

export default Home;
