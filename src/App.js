import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getRooms, getAvailability } from './services/api';
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

    const fetchAllRooms = async () => {
      setIsLoading(true);
      try {
        const data = await getRooms();
        setAllRooms(data);
        setSearchResults(data);
      } catch (error) {

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
      const availableData = await getAvailability(startStr, endStr);

      const updatedResults = allRooms.map(room => {
        
        const availableRoom = availableData.find(ar => String(ar.id) === String(room.id) && ar.status === 'AVAILABLE');

        if (availableRoom) {
          return {
            ...room,
            isAvailable: true,
            pricePerNight: availableRoom.pricePerNight 
          };
        }
        return {
          ...room,
          isAvailable: false
        };
      });

      setSearchResults(updatedResults);



      setTimeout(() => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) {
          roomsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {

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



      setIsModalOpen(true);
      return;
    }

    performSearch(selectedDates.checkIn, selectedDates.checkOut);
  };

  return (
    <Router>
      <div className="App">

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
