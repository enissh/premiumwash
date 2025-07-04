import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './BookingForm.css';
import { API_BASE_URL, axiosConfig } from '../config';

// Move vehicleOptions outside the component
const vehicleOptions = {
  auto: [
    { name: 'PERUSPESU', duration: '00:30', price: '30€', description: 'Käsinpesu, ovienvälit ja kumimattojen pesu' },
    { name: 'PREMIUMPESU', duration: '00:30', price: '35€', description: 'Sis. peruspesun,maalipinta pestään liuottimella, ovienvälit ja mattojenpesu.' },
    { name: 'Talvipesu', duration: '00:30', price: '49€', description: 'sis. Liuotinpesun, Alustanpesu sekä nanopesuun(Nanopesun)' },
    { name: 'KEVYT SISÄPUHDISTUS', duration: '00:30', price: '35€', description: 'Lattian, penkkien ja mattojen imurointi sekä kojelaudan pyyhintä Ei sisällä takakontin puhdistusta eikä ikkunapesu' },
    { name: 'TÄYDELLINEN SISÄPUHDISTUS', duration: '01:00', price: '59€', description: 'Auton täydellisessä pesussa sisältyy auton täysi imurointi, pintojen pyyhintä sekä lasien puhdistus sisäpuolelta ( lemmikkieläimen karvojen poisto alk. 20.00€ )' },
    { name: 'TOTAL SISÄPUHDISTUS', duration: '04:00', price: '189€', description: 'Meidän Total-sisäpesu sisältää auton sisäpuolen täydellisen hoidon, johon kuuluu tarkka imurointi, pintojen pyyhintä, lasien puhdistus sekä istuimien märkäpesu. Mikäli haluatte myös lattianpesun, suosittelemme sitä lämpimästi, mutta siitä tulee lisämaksu. Ilmoitattehan kassalla, niin lisäämme sen palveluun' },
    { name: 'Nanokeraaminen pinnoite PCS2', duration: '03:00', price: '349€', description: 'Antaa autollesi jopa 36 kk:n suojan' },
    { name: 'KOVAVAHA', duration: '01:15', price: '149€', description: 'Kovavahaus suojaa autoasi oikein hoidettuna 6-8kk. Se on erinomainen vaihtoehto kausihoidoksi ja vahauksen voi suorittaa milloin vain. Kaikki vahamme käyvät myös uusille autoille. Meillä kovavahauksen hintaan sisältyvät kaikki pohjatyöt, kuten käsinpesu, pienpoisto, savestus, ovenvälien pesu ja kuivaus ja kumimattojen pesu. Kesto 6kk-8kk' },
    { name: 'NANOVAHA', duration: '01:45', price: '210€', description: 'NanoProtection Hard Wax on nanoteknologian pohjainen ja eniten nykyaikaisin maalin suojelemiseen kehitetty värivaha joka on saatavissa. pitkän suojelun takaavat nano-osat ja nykyaikaiset polymeerit mikä suojelevat maalipintaa: maantiesuolalta, hyönteisilta, puupihkalta ja monilta muilta ympäristövaikutuksilta. nanovaha suojaa pintaa jopa 3 kertaa kauemmin kuin perinteiset vahat Kesto 12kk' },
  ],
  maastoauto: [
    { name: 'PERUSPESU', duration: '00:30', price: '35€', description: 'Käsinpesu, ovienvälit ja kumimattojen pesu' },
    { name: 'PREMIUMPESU', duration: '00:30', price: '40€', description: 'Sis. peruspesun,maalipinta pestään liuottimella, ovienvälit ja mattojenpesu.' },
    { name: 'Talvipesu', duration: '00:30', price: '59€', description: 'sis. Liuotinpesun, Alustanpesu sekä nanopesuun(Nanopesun)' },
    { name: 'KEVYT SISÄPUHDISTUS', duration: '00:30', price: '40€', description: 'Lattian, penkkien ja mattojen imurointi sekä kojelaudan pyyhintä Ei sisällä takakontin puhdistusta eikä ikkunapesu' },
    { name: 'TÄYDELLINEN SISÄPUHDISTUS', duration: '01:00', price: '69€', description: 'Auton täydellisessä pesussa sisältyy auton täysi imurointi, pintojen pyyhintä sekä lasien puhdistus sisäpuolelta ( lemmikkieläimen karvojen poisto alk. 20.00€ )' },
    { name: 'TOTAL SISÄPUHDISTUS', duration: '04:00', price: '199€', description: 'Meidän Total-sisäpesu sisältää auton sisäpuolen täydellisen hoidon, johon kuuluu tarkka imurointi, pintojen pyyhintä, lasien puhdistus sekä istuimien märkäpesu. Mikäli haluatte myös lattianpesun, suosittelemme sitä lämpimästi, mutta siitä tulee lisämaksu. Ilmoitattehan kassalla, niin lisäämme sen palveluun' },
    { name: 'Nanokeraaminen pinnoite PCS2', duration: '03:00', price: '369€', description: 'Antaa autollesi jopa 36 kk:n suojan' },
    { name: 'KOVAVAHA', duration: '01:15', price: '159€', description: 'Kovavahaus suojaa autoasi oikein hoidettuna 6-8kk. Se on erinomainen vaihtoehto kausihoidoksi ja vahauksen voi suorittaa milloin vain. Kaikki vahamme käyvät myös uusille autoille. Meillä kovavahauksen hintaan sisältyvät kaikki pohjatyöt, kuten käsinpesu, pienpoisto, savestus, ovenvälien pesu ja kuivaus ja kumimattojen pesu. Kesto 6kk-8kk' },
    { name: 'NANOVAHA', duration: '01:45', price: '220€', description: 'NanoProtection Hard Wax on nanoteknologian pohjainen ja eniten nykyaikaisin maalin suojelemiseen kehitetty värivaha joka on saatavissa. pitkän suojelun takaavat nano-osat ja nykyaikaiset polymeerit mikä suojelevat maalipintaa: maantiesuolalta, hyönteisilta, puupihkalta ja monilta muilta ympäristövaikutuksilta. nanovaha suojaa pintaa jopa 3 kertaa kauemmin kuin perinteiset vahat Kesto 12kk' },
    { name: 'VANNETYÖ, IRTORENKAIDEN ALLELAITTO + TASAPAINOTUS', duration: '00:30', price: '129€', description: 'VANNETYÖ, IRTORENKAIDEN ALLELAITTO + TASAPAINOTUS 129€ alkaen 15´16 koko' },
    { name: 'RENKAIDEN PESU', duration: '00:15', price: '25€', description: 'RENKAIDEN PESU' },
    { name: 'TASAPAINOTUS', duration: '00:30', price: '69€', description: 'TASAPAINOTUS' },
    { name: 'TUBELESS/RENGASPAIKKAUS', duration: '00:30', price: '60€', description: 'TUBELESS/RENGASPAIKKAUS' },
    { name: 'RENKAIDEN ALLEVAIHTO', duration: '00:30', price: '50€', description: 'RENKAIDEN ALLEVAIHTO (Kirjoita kommentti jos renkaat on hotellissa)' },
    { name: 'Rengashotelli + Renkaiden vaihto', duration: '00:30', price: '140€', description: 'Huomioithan, että renkaiden varaaminen hotellistamme on mahdollista vain vähintään 24 tuntia ennen varauksen alkua. Ilmanpaineen tarkistus Aikaehdotus renkaidenvaihtoa varten Alumiinivanteiden jälkikiristys 100 km:n jälkeen' },
    { name: 'Rengaspussisarja 4kpl', duration: '00:30', price: '15€', description: 'Rengaspussisarja 4kpl, 13"-19"' },
    { name: 'MAALIPINNAN KIILLOTUS', duration: '06:00', price: '400€', description: 'MAALIPINNAN KIILLOTUS' },
    { name: 'ILMASTOINNIN TÄYTTÖHUOLTO', duration: '01:00', price: '85€', description: 'ILMASTOINNIN TÄYTTÖHUOLTO' },
    { name: 'UMPIOIDEN KORJAUS', duration: '00:15', price: '80€', description: 'UMPIOIDEN KORJAUS' },
    { name: 'OTSONOINTI/HAJUNPOISTO', duration: '00:15', price: '89€', description: 'Otsonointi on tehokas ja turvallinen tapa poistaa epätoivottuja hajuja ja allergianaiheuttajia, kuten tupakan, eläinten, homeen, viemärin ja kalman hajua sekä ummehtuneisuutta. Otsonointi poistaa epämiellyttävät hajut asunnoista, autoista, asuntovaunuista, veneistä ym' },
    { name: 'TUULILASIN KORJAUS', duration: '01:00', price: '69€', description: 'TUULILASIN KORJAUS' },
    { name: 'Lasinpesuneste täyttö', duration: '00:15', price: '25€', description: 'Lasinpesuneste täyttö' },
    { name: 'Tuulilasin vaihto', duration: '00:15', price: '200€', description: 'Vain varattavissa puhelimitse. Puhelinnumero: +358442438872' },
    { name: 'STARDUST PCS 5', duration: '08:00', price: '900€', description: 'Maalipinnan kiillotus ( 3 - step ) Stardust PCS 5 pinnoitusaine muodostaa auton maalipintaan elastisen ja erittäin kestävän suojakerroksen. Pinnoite suojaa mm. maantiesuolan aiheuttamalta korroosiolta, lialta, pieltä, öljyltä, liuottomilta, alkalisilta sekä muilta syövyttäviltä pesuaineilta. Stardustilla käsitelty auto pysyy pitkään puhtaana eikä tarvitse vahausta. Pinnoitteen kestävyys 48 – 60 kk.' },
    { name: 'STARDUST PCS 2', duration: '07:30', price: '550€', description: '(One step ) Stardust PCS 2 pinnoitusaine muodostaa auton maalipintaan elastisen ja erittäin kestävän suojakerroksen. Pinnoite suojaa mm. maantiesuolan aiheuttamalta korroosiolta, lialta, pieltä, öljyltä, alkalisilta ja muilta syövyttäviltä pesuliuoksilta. Stardustilla käsitelty auto pysyy pitkään puhtaana eikä tarvitse vahausta. Pinnoitteen kestävyys 18 - 24 kk.' },
    { name: 'Vanteiden pinnoitus', duration: '00:15', price: '90€', description: 'Vanteet ovat yksi kovimmalla rasituksella olevista alueista autossa, ja niiden oikeanlainen suojaaminen onkin ensiarvoisen tärkeää. Pinnoite kestää erinomaisesti lämpötilan vaihtelut sekä jarrupölyn, tiesuolan ja muut vanteiden kohtaamat rasitteet. Se estää lian pinttymisen vanteen pintaan ja helpottaa näin niiden puhdistusta' },
    { name: 'STARDUST GLASS', duration: '00:15', price: '90€', description: 'STARDUST GLASS -pinnoite tekee tuulilasista hydrofobisen ja likaa hylkivän ja parantaa näin näkyvyyttä. Vähentää tuulilasinpyyhkijöiden ja lasinpesunesteen käyttötarvetta maantienopeuksilla. Helpottaa myös lasin puhtaanapitoa (mm. hyönteislian poistaminen) ja jään irrottamista ikkunoista. Kestää hyvin vahvoja lasinpesunesteitä ja liuottimia.' },
    { name: 'Tarjous #2', duration: '01:15', price: '189€', description: 'Kovavaha sisältää pesun . Kesto noin 1.5h' },
    { name: 'Tarjous #1', duration: '01:15', price: '189€', description: 'Kesto noin 2 tunti.' }
  ],
  pakettiauto: [
    { name: 'PERUSPESU', duration: '00:30', price: '40€', description: 'Käsinpesu, ovienvälit ja kumimattojen pesu' },
    { name: 'PREMIUMPESU', duration: '00:30', price: '45€', description: 'Sis. peruspesun,maalipinta pestään liuottimella, ovienvälit ja mattojenpesu.' },
    { name: 'Talvipesu', duration: '00:30', price: '69€', description: 'sis. Liuotinpesun, Alustanpesu sekä nanopesuun(Nanopesun)' },
    { name: 'KEVYT SISÄPUHDISTUS', duration: '00:30', price: '45€', description: 'Lattian, penkkien ja mattojen imurointi sekä kojelaudan pyyhintä Ei sisällä takakontin puhdistusta eikä ikkunapesu' },
    { name: 'TÄYDELLINEN SISÄPUHDISTUS', duration: '01:00', price: '79€', description: 'Auton täydellisessä pesussa sisältyy auton täysi imurointi, pintojen pyyhintä sekä lasien puhdistus sisäpuolelta ( lemmikkieläimen karvojen poisto alk. 20.00€ )' },
    { name: 'TOTAL SISÄPUHDISTUS', duration: '04:00', price: '209€', description: 'Meidän Total-sisäpesu sisältää auton sisäpuolen täydellisen hoidon, johon kuuluu tarkka imurointi, pintojen pyyhintä, lasien puhdistus sekä istuimien märkäpesu. Mikäli haluatte myös lattianpesun, suosittelemme sitä lämpimästi, mutta siitä tulee lisämaksu. Ilmoitattehan kassalla, niin lisäämme sen palveluun' },
    { name: 'Nanokeraaminen pinnoite PCS2', duration: '03:00', price: '409€', description: 'Antaa autollesi jopa 36 kk:n suojan' },
    { name: 'KOVAVAHA', duration: '01:15', price: '169€', description: 'Kovavahaus suojaa autoasi oikein hoidettuna 6-8kk. Se on erinomainen vaihtoehto kausihoidoksi ja vahauksen voi suorittaa milloin vain. Kaikki vahamme käyvät myös uusille autoille. Meillä kovavahauksen hintaan sisältyvät kaikki pohjatyöt, kuten käsinpesu, pienpoisto, savestus, ovenvälien pesu ja kuivaus ja kumimattojen pesu. Kesto 6kk-8kk' },
    { name: 'NANOVAHA', duration: '01:45', price: '230€', description: 'NanoProtection Hard Wax on nanoteknologian pohjainen ja eniten nykyaikaisin maalin suojelemiseen kehitetty värivaha joka on saatavissa. pitkän suojelun takaavat nano-osat ja nykyaikaiset polymeerit mikä suojelevat maalipintaa: maantiesuolalta, hyönteisilta, puupihkalta ja monilta muilta ympäristövaikutuksilta. nanovaha suojaa pintaa jopa 3 kertaa kauemmin kuin perinteiset vahat Kesto 12kk' },
    { name: 'VANNETYÖ, IRTORENKAIDEN ALLELAITTO + TASAPAINOTUS', duration: '00:30', price: '129€', description: 'VANNETYÖ, IRTORENKAIDEN ALLELAITTO + TASAPAINOTUS 129€ alkaen 15´16 koko' },
    { name: 'RENKAIDEN PESU', duration: '00:15', price: '30€', description: 'RENKAIDEN PESU' },
    { name: 'TASAPAINOTUS', duration: '00:30', price: '79€', description: 'TASAPAINOTUS' },
    { name: 'TUBELESS/RENGASPAIKKAUS', duration: '00:30', price: '70€', description: 'TUBELESS/RENGASPAIKKAUS' },
    { name: 'RENKAIDEN ALLEVAIHTO', duration: '00:30', price: '60€', description: 'RENKAIDEN ALLEVAIHTO (Kirjoita kommentti jos renkaat on hotellissa)' },
    { name: 'Rengashotelli + Renkaiden vaihto', duration: '00:30', price: '150€', description: 'Huomioithan, että renkaiden varaaminen hotellistamme on mahdollista vain vähintään 24 tuntia ennen varauksen alkua. Ilmanpaineen tarkistus Aikaehdotus renkaidenvaihtoa varten Alumiinivanteiden jälkikiristys 100 km:n jälkeen' },
    { name: 'Rengaspussisarja 4kpl', duration: '00:30', price: '15€', description: 'Rengaspussisarja 4kpl, 13"-19"' },
    { name: 'MAALIPINNAN KIILLOTUS', duration: '06:30', price: '450€', description: 'MAALIPINNAN KIILLOTUS' },
    { name: 'ILMASTOINNIN TÄYTTÖHUOLTO', duration: '01:00', price: '85€', description: 'ILMASTOINNIN TÄYTTÖHUOLTO' },
    { name: 'UMPIOIDEN KORJAUS', duration: '02:00', price: '80€', description: 'UMPIOIDEN KORJAUS' },
    { name: 'OTSONOINTI/HAJUNPOISTO', duration: '00:15', price: '89€', description: 'Otsonointi on tehokas ja turvallinen tapa poistaa epätoivottuja hajuja ja allergianaiheuttajia, kuten tupakan, eläinten, homeen, viemärin ja kalman hajua sekä ummehtuneisuutta. Otsonointi poistaa epämiellyttävät hajut asunnoista, autoista, asuntovaunuista, veneistä ym' },
    { name: 'TUULILASIN KORJAUS', duration: '01:00', price: '69€', description: 'TUULILASIN KORJAUS' },
    { name: 'Lasinpesuneste täyttö', duration: '00:15', price: '10€', description: 'Lasinpesuneste täyttö' },
    { name: 'Tuulilasin vaihto', duration: '00:15', price: '200€', description: 'Vain varattavissa puhelimitse. Puhelinnumero: +358442438872' },
    { name: 'STARDUST PCS 5', duration: '08:00', price: '950€', description: 'Maalipinnan kiillotus ( 3 - step ) Stardust PCS 5 pinnoitusaine muodostaa auton maalipintaan elastisen ja erittäin kestävän suojakerroksen. Pinnoite suojaa mm. maantiesuolan aiheuttamalta korroosiolta, lialta, pieltä, öljyltä, liuottomilta, alkalisilta sekä muilta syövyttäviltä pesuaineilta. Stardustilla käsitelty auto pysyy pitkään puhtaana eikä tarvitse vahausta. Pinnoitteen kestävyys 48 – 60 kk.' },
    { name: 'STARDUST PCS 2', duration: '07:30', price: '600€', description: '(One step ) Stardust PCS 2 pinnoitusaine muodostaa auton maalipintaan elastisen ja erittäin kestävän suojakerroksen. Pinnoite suojaa mm. maantiesuolan aiheuttamalta korroosiolta, lialta, pieltä, öljyltä, alkalisilta ja muilta syövyttäviltä pesuliuoksilta. Stardustilla käsitelty auto pysyy pitkään puhtaana eikä tarvitse vahausta. Pinnoitteen kestävyys 18 - 24 kk.' },
    { name: 'Vanteiden pinnoitus', duration: '00:15', price: '90€', description: 'Vanteet ovat yksi kovimmalla rasituksella olevista alueista autossa, ja niiden oikeanlainen suojaaminen onkin ensiarvoisen tärkeää. Pinnoite kestää erinomaisesti lämpötilan vaihtelut sekä jarrupölyn, tiesuolan ja muut vanteiden kohtaamat rasitteet. Se estää lian pinttymisen vanteen pintaan ja helpottaa näin niiden puhdistusta' },
    { name: 'STARDUST GLASS', duration: '00:15', price: '90€', description: 'STARDUST GLASS -pinnoite tekee tuulilasista hydrofobisen ja likaa hylkivän ja parantaa näin näkyvyyttä. Vähentää tuulilasinpyyhkijöiden ja lasinpesunesteen käyttötarvetta maantienopeuksilla. Helpottaa myös lasin puhtaanapitoa (mm. hyönteislian poistaminen) ja jään irrottamista ikkunoista. Kestää hyvin vahvoja lasinpesunesteitä ja liuottimia.' },
    { name: 'Tarjous #2', duration: '01:15', price: '199€', description: 'Kovavaha sisältää pesun . Kesto noin 1.5h' },
    { name: 'Tarjous #1', duration: '01:15', price: '249€', description: 'Kesto noin 2 tunti.' }
  ],
  asuntoauto: [
    { name: 'MAALIPINNAN KIILLOTUS', duration: '04:00', price: '400€', description: 'MAALIPINNAN KIILLOTUS' },
    { name: 'ILMASTOINNIN TÄYTTÖHUOLTO', duration: '01:00', price: '95€', description: 'ILMASTOINNIN TÄYTTÖHUOLTO' },
    { name: 'UMPIOIDEN KORJAUS', duration: '02:00', price: '60€', description: 'UMPIOIDEN KORJAUS' }
  ]
};

const vehicleIcons = {
  auto: 'fa-car',
  maastoauto: 'fa-truck-pickup',
  pakettiauto: 'fa-truck',
  asuntoauto: 'fa-caravan'
};

const BookingForm = () => {
  const [vehicleType, setVehicleType] = useState('auto');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState({});
  const [startDateOffset, setStartDateOffset] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use useMemo for time options
  const timeOptions = useMemo(() => {
    const times = [];
    let hour = 9; // Start at 9 AM
    while (hour < 18) { // Until 6 PM
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeStr);
      }
      hour++;
    }
    times.push('18:00'); // Add 6 PM as the last option
    return times;
  }, []);

  // Reset selected services when vehicle type changes
  useEffect(() => {
    if (vehicleOptions[vehicleType]) {
      setSelectedServices([]);
      setSelectedHour('');
      setErrorMessage('');
    }
  }, [vehicleType]);

  const generateDates = (offset, count) => {
    return Array.from({ length: count }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + offset);
      return {
        display: date.toLocaleString('default', { weekday: 'short', day: 'numeric', month: 'short' }),
        value: date.toISOString().split('T')[0]
      };
    });
  };

  const generateTimeSlots = (startHour, endHour, intervalMinutes) => {
    const slots = [];
    const start = new Date();
    start.setHours(startHour, 0, 0, 0);

    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    // Include the end time (18:00) in the slots
    while (start <= end) {
      const timeStr = start.toTimeString().slice(0, 5);
      slots.push(timeStr);
      start.setMinutes(start.getMinutes() + intervalMinutes);
    }

    return slots;
  };

  const calculateEndTime = (startTime, totalDuration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + totalDuration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const fetchBookedSlots = async (date) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bookings?date=${date}`, axiosConfig);
      const bookings = response.data;
      
      // Create a map of time slots for the selected date
      const slots = {};
      bookings.forEach(booking => {
        const startTime = booking.time;
        const endTime = booking.endTime;
        
        // Mark all 15-minute intervals between start and end time as booked
        let currentTime = moment(startTime, 'HH:mm');
        const endMoment = moment(endTime, 'HH:mm');
        
        while (currentTime.isBefore(endMoment)) {
          const timeStr = currentTime.format('HH:mm');
          slots[timeStr] = true;
          currentTime.add(15, 'minutes');
        }
      });
      
      setBookedSlots(prev => ({
        ...prev,
        [date]: slots
      }));
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      if (error.response?.status === 404) {
        // If the endpoint is not found, we'll assume no bookings for this date
        setBookedSlots(prev => ({
          ...prev,
          [date]: {}
        }));
      } else {
        setErrorMessage('Varattuja aikoja ei voitu hakea. Yritä päivittää sivu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect to fetch booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const isTimeSlotAvailable = (time, duration) => {
    if (!selectedDate || !bookedSlots[selectedDate]) return true;
    
    const endTime = calculateEndTime(time, duration);
    const currentMoment = moment(time, 'HH:mm');
    const endMoment = moment(endTime, 'HH:mm');
    
    // Check each 15-minute interval within the service duration
    let checkMoment = moment(time, 'HH:mm');
    while (checkMoment.isBefore(endMoment)) {
      const checkTimeStr = checkMoment.format('HH:mm');
      if (bookedSlots[selectedDate][checkTimeStr]) {
        return false;
      }
      checkMoment.add(15, 'minutes');
    }
    
    return true;
  };

  const availableTimes = generateTimeSlots(9, 18, 15);

  const handleApiError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      setErrorMessage(error.response.data.message || 'Palvelimella tapahtui virhe. Yritä uudelleen.');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      setErrorMessage('Palvelimeen ei saada yhteyttä. Tarkista internet-yhteys ja yritä uudelleen.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      setErrorMessage('Virhe pyynnön käsittelyssä. Yritä uudelleen.');
    }
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateBookingTime = (selectedTime, duration) => {
    const startMoment = moment(selectedTime, 'HH:mm');
    const endMoment = moment(calculateEndTime(selectedTime, duration), 'HH:mm');
    const openingTime = moment('09:00', 'HH:mm');
    const closingTime = moment('18:00', 'HH:mm');

    if (startMoment.isBefore(openingTime) || endMoment.isAfter(closingTime)) {
      setErrorMessage('Valittu aika on ulkopuolella liiketoimintaa (9:00 - 18:00)');
      return false;
    }

    return true;
  };

  const handleServiceSelect = (selectedService) => {
    setSelectedServices(prev => {
      const isAlreadySelected = prev.find(s => s.name === selectedService.name);
      
      if (isAlreadySelected) {
        // Remove the service if it's already selected
        const updatedServices = prev.filter(s => s.name !== selectedService.name);
        setErrorMessage('');
        return updatedServices;
      }
      
      if (prev.length >= 5) {
        setErrorMessage('Voit valita enintään 5 palvelua');
        return prev;
      }
      
      // Add the new service
      const updatedServices = [...prev, selectedService];
      setErrorMessage('');
      
      // Reset time selection when services change
      setSelectedHour('');
      
      return updatedServices;
    });
  };

  const calculateTotalDurationAndPrice = (services) => {
    return services.reduce((total, service) => {
      const [hours, minutes] = service.duration.split(':').map(Number);
      const durationInMinutes = hours * 60 + minutes;
      const price = parseInt(service.price.replace('€', ''));
      return {
        duration: total.duration + durationInMinutes,
        price: total.price + price
      };
    }, { duration: 0, price: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!vehicleType || selectedServices.length === 0 || !selectedDate || !selectedHour || !name || !email) {
        setErrorMessage('Täytä kaikki pakolliset kentät ja valitse vähintään yksi palvelu.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Syötä kelvollinen sähköpostiosoite.');
        return;
      }

      const { duration } = calculateTotalDurationAndPrice(selectedServices);
      const endTime = calculateEndTime(selectedHour, duration);

      if (!validateBookingTime(selectedHour, `${Math.floor(duration/60)}:${duration%60}`)) {
        return;
      }

      // Check if the selected time slot is still available
      const currentBookings = await axios.get(`${API_BASE_URL}/api/bookings?date=${selectedDate}`, axiosConfig);
      const isTimeSlotTaken = currentBookings.data.some(booking => {
        const bookingStart = moment(booking.time, 'HH:mm');
        const bookingEnd = moment(booking.endTime, 'HH:mm');
        const selectedStart = moment(selectedHour, 'HH:mm');
        const selectedEnd = moment(endTime, 'HH:mm');
        
        return (selectedStart.isBetween(bookingStart, bookingEnd, null, '[)') ||
                selectedEnd.isBetween(bookingStart, bookingEnd, null, '(]') ||
                bookingStart.isBetween(selectedStart, selectedEnd, null, '[)') ||
                bookingEnd.isBetween(selectedStart, selectedEnd, null, '(]'));
      });

      if (isTimeSlotTaken) {
        setErrorMessage('Valittu aika on jo varattu. Ole hyvä ja valitse toinen aika.');
        await fetchBookedSlots(selectedDate);
        return;
      }

      const bookingData = {
        vehicleType,
        services: selectedServices.map(s => ({
          name: s.name,
          price: s.price,
          duration: s.duration
        })),
        date: selectedDate,
        time: selectedHour,
        endTime,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        note: note.trim()
      };

      const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData, {
        ...axiosConfig,
        timeout: 15000 // Increased timeout to 15 seconds
      });
      
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Varaus onnistui! Tarkista sähköpostisi vahvistusta varten.');
        setErrorMessage('');
        
        // Reset form
        setSelectedServices([]);
        setSelectedDate('');
        setSelectedHour('');
        setName('');
        setEmail('');
        setPhone('');
        setNote('');
        setVehicleType('auto');
        
        // Fetch updated booked slots
        await fetchBookedSlots(selectedDate);

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Booking error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        setErrorMessage(error.response.data.message || 'Palvelimella tapahtui virhe. Yritä uudelleen.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setErrorMessage('Palvelimeen ei saada yhteyttä. Tarkista internet-yhteys ja yritä uudelleen.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        setErrorMessage('Virhe pyynnön käsittelyssä. Yritä uudelleen.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setErrorMessage('');
  }, [selectedServices]);

  const toggleDescription = (serviceName) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  // Render time slots as buttons, booked slots are red and disabled
  const renderTimeSlots = () => {
    if (!selectedDate) return null;
    
    if (isLoading) {
      return (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Ladataan...</span>
          </div>
          <p className="mt-2">Tarkistetaan varattuja aikoja...</p>
        </div>
      );
    }

    const slots = timeOptions;
    const booked = bookedSlots[selectedDate] || {};
    return (
      <div className="time-slots">
        {slots.map((time) => {
          const isBooked = booked[time];
          const isSelected = selectedHour === time;
          return (
            <button
              key={time}
              type="button"
              className={`btn time-slot-btn ${isBooked ? 'btn-danger' : isSelected ? 'btn-success' : 'btn-outline-secondary'}`}
              style={{ margin: '2px', minWidth: 70, opacity: isBooked ? 0.6 : 1, cursor: isBooked ? 'not-allowed' : 'pointer' }}
              disabled={isBooked}
              onClick={() => {
                if (!isBooked) setSelectedHour(time);
              }}
            >
              {time}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-xl-9">
          <div className="card shadow-lg border-0" style={{ borderRadius: '16px', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center mb-5" style={{ fontSize: '2rem', fontWeight: '600' }}>Varaa pesuaika</h2>

              <form onSubmit={handleSubmit}>
                {/* Vehicle Selection */}
                <div className="mb-4">
                  <h5 className="mb-3">Valitse ajoneuvotyyppi:</h5>
                  <div className="d-flex justify-content-around flex-wrap gap-2">
                    {Object.keys(vehicleOptions).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`btn ${vehicleType === type ? 'btn-primary' : 'btn-outline-primary'} flex-grow-1 d-flex flex-column align-items-center py-3`}
                        onClick={() => setVehicleType(type)}
                        style={{ maxWidth: '200px', minHeight: '100px' }}
                      >
                        {type === 'maastoauto' ? (
                          <i className={`fas fa-truck-pickup fa-2x mb-2`}></i>
                        ) : (
                          <i className={`fas ${vehicleIcons[type]} fa-2x mb-2`}></i>
                        )}
                        <span>{type.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Selection */}
                <div className="mb-4">
                  <h5 className="mb-3">Valitse palvelut (enintään 5):</h5>
                  <div className="row g-3">
                    {vehicleType && vehicleOptions[vehicleType] && vehicleOptions[vehicleType].map((service) => {
                      const isSelected = selectedServices.some(s => s.name === service.name);
                      return (
                        <div key={service.name} className="col-md-6">
                          <div 
                            className={`card service-card h-100 ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleServiceSelect(service)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleServiceSelect(service);
                              }
                            }}
                          >
                            <div className="card-body">
                              <h6 className="card-title">{service.name}</h6>
                              <div className="service-price-duration">
                                <span className="text-primary fw-bold">{service.price}</span>
                                <span className="text-muted small">Kesto: {service.duration}</span>
                              </div>
                              <div 
                                className="description-toggle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDescription(service.name);
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    toggleDescription(service.name);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                <span>{expandedDescriptions[service.name] ? 'Näytä vähemmän' : 'Näytä lisää'}</span>
                                <i className={`fas fa-chevron-down ${expandedDescriptions[service.name] ? 'expanded' : ''}`}></i>
                              </div>
                              <div 
                                className={`service-description ${expandedDescriptions[service.name] ? 'expanded' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="card-text small mb-0">{service.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Services Summary */}
                {selectedServices.length > 0 && (
                  <div className="mt-4 p-4 bg-light rounded shadow-sm">
                    <h6 className="mb-3">Valitut palvelut:</h6>
                    <ul className="list-unstyled">
                      {selectedServices.map((service, index) => (
                        <li key={index} className="mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-bold">{service.name}</span>
                            <br />
                            <small className="text-muted">Kesto: {service.duration}</small>
                          </div>
                          <span className="text-primary fw-bold">{service.price}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Yhteensä: </strong>
                        <div className="text-end">
                          {(() => {
                            const { duration, price } = calculateTotalDurationAndPrice(selectedServices);
                            const hours = Math.floor(duration / 60);
                            const minutes = duration % 60;
                            return (
                              <>
                                <div className="text-primary fw-bold fs-5">{price}€</div>
                                <small className="text-muted">Kokonaiskesto: {hours}h {minutes}min</small>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                {selectedServices.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Valitse päivä:</h5>
                    <div className="date-selection-container">
                      <div className="nav-button-container">
                        <button 
                          type="button" 
                          className="nav-button prev"
                          onClick={() => {
                            const wrapper = document.querySelector('.dates-wrapper');
                            wrapper.style.opacity = '0.5';
                            setTimeout(() => {
                              setStartDateOffset((prev) => Math.max(prev - 7, 0));
                              wrapper.style.opacity = '1';
                            }, 150);
                          }}
                          disabled={startDateOffset === 0}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button 
                          type="button" 
                          className="nav-button next"
                          onClick={() => {
                            const wrapper = document.querySelector('.dates-wrapper');
                            wrapper.style.opacity = '0.5';
                            setTimeout(() => {
                              setStartDateOffset((prev) => prev + 7);
                              wrapper.style.opacity = '1';
                            }, 150);
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>

                      <div className="dates-wrapper">
                        {generateDates(startDateOffset, 7).map((date) => (
                          <button
                            key={date.value}
                            type="button"
                            className={`date-button ${selectedDate === date.value ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(date.value)}
                          >
                            <span className="date-weekday">
                              {date.display.split(' ')[0]}
                            </span>
                            <span className="date-day">
                              {date.display.split(' ')[1]}
                            </span>
                            <span className="date-month">
                              {date.display.split(' ')[2]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Selection */}
                {selectedServices.length > 0 && selectedDate && (
                  <div className="mb-4">
                    <h5 className="mb-3">Valitse aika:</h5>
                    <div className="time-selection">
                      {renderTimeSlots()}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Nimi/Rekisterinumero</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Sähköposti</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Puhelin</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ padding: '0 8px' }}>
                        <span role="img" aria-label="Finnish flag">🇫🇮</span> +358
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Lisätiedot</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>

                {/* Messages */}
                {errorMessage && (
                  <div className="alert alert-danger mb-3" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success mb-3" role="alert">
                    {successMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg"
                  disabled={!vehicleType || selectedServices.length === 0 || !selectedDate || !selectedHour || !name || !email || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Varataan...
                    </>
                  ) : (
                    'Varaa aika'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
