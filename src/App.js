import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AvailabilityModal from './components/AvailabilityModal';
import BackgroundMusic from './components/BackgroundMusic';
import Home from './components/Home';
import FoodOrder from './components/FoodOrder';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [searchResults, setSearchResults] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Fetch all rooms on load
    const fetchAllRooms = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.karunavillas.com/allRooms');
        const data = await response.json();
        setAllRooms(data);
        setSearchResults(data);
      } catch (error) {
        // Silent failure for all rooms fetch
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRooms();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const performSearch = async (checkIn, checkOut) => {
    setHasSearched(true);
    setIsLoading(true);
    const startStr = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`;
    const endStr = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`;

    try {
      const response = await fetch(`https://api.karunavillas.com/available-rooms?startDate=${startStr}&endDate=${endStr}`);
      const availableData = await response.json();

      // Merge availability status into all rooms
      const updatedResults = allRooms.map(room => ({
        ...room,
        isAvailable: availableData.some(availableRoom => availableRoom.id === room.id)
      }));

      setSearchResults(updatedResults);

      // Scroll to rooms section - Only if on home page? 
      // For now, simpler to just update state. visual scroll might depend on where we are.
      setTimeout(() => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) {
          roomsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      // If API fails, better to show all as unavailable or retain previous state than empty
      const updatedResults = allRooms.map(room => ({ ...room, isAvailable: false }));
      setSearchResults(updatedResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
    performSearch(checkIn, checkOut);
  };

  const handleBookStay = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      // If we are not on Home, we might need to navigate there first? 
      // Ideally "Book Stay" is on Home. 
      // If this is called from Header "Book Now", we toggle modal.
      setIsModalOpen(true);
      return;
    }

    performSearch(selectedDates.checkIn, selectedDates.checkOut);
  };

  return (
    <Router>
      <div className="App">
        {/* Header needs to be inside Router to use Link/useLocation if updated */}
        <Header onBookNow={toggleModal} />

        <Routes>
          <Route path="/" element={
            <Home
              onSearch={handleBookStay}
              onOpenCalendar={toggleModal}
              checkIn={selectedDates.checkIn}
              checkOut={selectedDates.checkOut}
              searchResults={searchResults}
              isLoading={isLoading}
              hasSearched={hasSearched}
            />
          } />
          <Route path="/food" element={<FoodOrder />} />
        </Routes>

        <Footer />
        <AvailabilityModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onDateSelect={handleDateSelect}
        />
        <BackgroundMusic />
      </div>
    </Router>
  );
}



export default App;
