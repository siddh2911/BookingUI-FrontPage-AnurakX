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
  const [guestCount, setGuestCount] = useState(4);
  const [discount, setDiscount] = useState(0);

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

  useEffect(() => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      performSearch(selectedDates.checkIn, selectedDates.checkOut);
    }
  }, [guestCount]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const performSearch = async (checkIn, checkOut) => {
    setHasSearched(true);
    setIsLoading(true);
    const startStr = `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(2, '0')}-${String(checkIn.getDate()).padStart(2, '0')}`;
    const endStr = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}-${String(checkOut.getDate()).padStart(2, '0')}`;

    try {
      const availableData = await getAvailability(startStr, endStr);

      const checkRoomAvailability = (id, possibleName) => {
        const ar = availableData.find(r =>
          String(r.id) === String(id) ||
          (r.roomName && possibleName && r.roomName.toLowerCase().includes(possibleName.toLowerCase()))
        );
        if (!ar) return false;
        return ar.isAvailable === true || ar.isAvailable === 'true' || ar.isAvailable === undefined;
      };

      const areAllVillaPartsAvailable =
        checkRoomAvailability(1, "Tranquil") &&
        checkRoomAvailability(3, "Elite") &&
        checkRoomAvailability(4, "Zenith");

      const updatedResults = allRooms.map(room => {
        const availableRoom = availableData.find(ar => String(ar.id) === String(room.id));

        if (String(room.id) === '5') {
          return {
            ...room,
            guests: `${guestCount} Adults`,
            isAvailable: areAllVillaPartsAvailable,
            pricePerNight: room.pricePerNight
          };
        }

        if (availableRoom) {
          return {
            ...room,
            guests: `${guestCount} Adults`,
            isAvailable: availableRoom.isAvailable === true || availableRoom.isAvailable === 'true' || availableRoom.isAvailable === undefined,
            pricePerNight: availableRoom.pricePerNight
          };
        }

        return {
          ...room,
          guests: `${guestCount} Adults`,
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
      const fallbackResults = allRooms.map(room => ({
        ...room,
        guests: `${guestCount} Adults`,
        isAvailable: true
      }));
      setSearchResults(fallbackResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
    performSearch(checkIn, checkOut);
  };

  const handleBookStay = (discountValue = 0) => {
    if (typeof discountValue === 'number') {
      setDiscount(discountValue);
    }

    const roomsSection = document.getElementById('rooms');
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth' });
    }

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
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              discount={discount}
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
