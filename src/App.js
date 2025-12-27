import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import RoomList from './components/RoomList';
import Amenities from './components/Amenities';
import Footer from './components/Footer';
import AvailabilityModal from './components/AvailabilityModal';
import BackgroundMusic from './components/BackgroundMusic';
import Dashboard from './components/Dashboard';
import StorySection from './components/StorySection'; // Import StorySection
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch all rooms on load
    const fetchAllRooms = async () => {
      try {
        const response = await fetch('https://api.karunavillas.com/allRooms');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        // Silent failure for all rooms fetch
      }
    };

    fetchAllRooms();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleDateSelect = (checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
  };

  const handleBookStay = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setIsModalOpen(true);
      return;
    }

    const { checkIn, checkOut } = selectedDates;
    const startStr = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`;
    const endStr = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`;

    try {
      const response = await fetch(`https://api.karunavillas.com/available-rooms?startDate=${startStr}&endDate=${endStr}`);
      const data = await response.json();

      // USER REQUEST: Strictly use API data, ignoring status.
      setSearchResults(data);

      // Scroll to rooms section
      setTimeout(() => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) {
          roomsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      setSearchResults([]);
    }
  };

  return (
    <div className="App">
      <Header />

      <Hero
        onSearch={handleBookStay}
        onOpenCalendar={toggleModal}
        checkIn={selectedDates.checkIn}
        checkOut={selectedDates.checkOut}
      />



      <RoomList rooms={searchResults} />

      <StorySection />

      <Dashboard />

      <Amenities />

      <Footer />
      <AvailabilityModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onDateSelect={handleDateSelect}
      />
      <BackgroundMusic />
    </div>
  );
}

export default App;
