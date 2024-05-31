import React from 'react'
// import {useBooking} from 'context/BookingContext' 
import {useBooking} from 'context/BookingContext'



const Checkout = () => {
    const {selectedSeat} = useBooking()

    console.log(selectedSeat);
  return (
    <div>asdasd</div>
  )
}

export default Checkout