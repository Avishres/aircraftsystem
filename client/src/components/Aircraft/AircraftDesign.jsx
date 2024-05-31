import { Tooltip } from "@mantine/core";
import { useBooking } from "context/BookingContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const AircraftDesign = ({ nameOfClass, seatClassData, aircraftId }) => {
  const navigate = useNavigate()
  const { selectedSeat, setSelectedSeat, isAuthenticated } = useBooking();

  const aircraftData = seatClassData?.seats;

  // Determine the number of columns on each side based on the class type
  const numColumns = nameOfClass === "firstClass" ? 2 : 3;

  // Split the data into two equal groups
  const halfLength = Math.ceil(aircraftData?.length / 2);
  const leftColumn = aircraftData?.slice(0, halfLength);
  const rightColumn = aircraftData?.slice(halfLength);

  // Function to create rows based on the number of columns
  const createRows = (columnData) => {
    const rows = [];
    for (let i = 0; i < columnData?.length; i += numColumns) {
      rows.push(columnData.slice(i, i + numColumns));
    }
    return rows;
  };

  const leftRows = createRows(leftColumn);
  const rightRows = createRows(rightColumn);

  const seatColor =
    (seatClassData?.name === "First Class" && "red") ||
    (seatClassData?.name === "Business Class" && "blue") ||
    (seatClassData?.name === "Economy Class" && "green");

  const seatClassName = `p-2 text-while w-[44px] h-[50px] bg-[${seatColor}] hover:bg-[#4287f5] cursor-pointer`;

  const selectAndUnselectSeats = (seatId) => {
    const selectedSeatIndex = selectedSeat.findIndex((c) => c?._id === seatId);
    if (selectedSeatIndex !== -1) {
      // Deselect the seat if it's already selected
      setSelectedSeat((prevState) =>
        prevState.filter((seat) => seat?._id !== seatId)
      );
    } else {
      // Select the seat if it's not already selected
      const newSelectedSeat = aircraftData.find((c) => c?._id === seatId);
      setSelectedSeat((prevState) => [...prevState, newSelectedSeat]);
    }
  };

  const proceedToBooking = () => {

    console.log(isAuthenticated);

    if(isAuthenticated){
      return navigate("/checkout/" + aircraftId)
    }else {
      navigate("/login?navigate=true")
      notifications.show({
        color: "red.3",
        title: "Cannot Proceed to Booking",
        message: "Please login to book seats.",
        icon: <IconX />,
      });
    }
    };
  

  return (
    <div className="relative">
      <div className="overflow-y-auto px-10 mt-4">
        <div
          className={`flex flex-1 gap-10 justify-center px-10 py-[2em] border-2 border-black border-b-0 border-t-0`}
        >
          <div className="flex-1 flex flex-col items-center">
            {leftRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex mb-4">
                {row?.map((item, colIndex) => {
                  const isSelected = selectedSeat?.some(
                    (seat) => seat?._id === item?._id
                  );
                  const isBooked = item.seatStatus === "booked";
                  const isAvailable = item.seatStatus === "available";
                  const isLocked = item.seatStatus === "locked";

                  return (
                    <Tooltip.Floating
                      key={colIndex}
                      multiline
                      label={`Status: ${item.seatStatus} | price: $${item.seatPrice}`}
                    >
                      <div
                        key={colIndex}
                        className="m-2"
                        onClick={() => selectAndUnselectSeats(item?._id)}
                      >
                        <button
                          style={{
                            backgroundColor: isSelected
                              ? "yellow"
                              : isBooked
                              ? "black"
                              : seatColor,
                            opacity: isBooked && "0.5",
                            cursor: isBooked ? "not-allowed" : "pointer",
                          }}
                          disabled={isBooked}
                          className={`${seatClassName} text-white`}
                        >
                          {isBooked && "B"}
                          {isAvailable && "A"}
                          {isLocked && "L"}
                        </button>
                      </div>
                    </Tooltip.Floating>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center">
            {rightRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex mb-4">
                {row.map((item, colIndex) => {
                  const isSelected = selectedSeat.some(
                    (seat) => seat?._id === item?._id
                  );

                  const isBooked = item.seatStatus === "booked";
                  const isAvailable = item.seatStatus === "available";
                  const isLocked = item.seatStatus === "locked";
                  return (
                    <Tooltip.Floating
                      key={colIndex}
                      label={`Status: ${item.seatStatus} | price: $${item.seatPrice}`}
                    >
                      <div
                        key={colIndex}
                        className="m-2"
                        onClick={() => selectAndUnselectSeats(item?._id)}
                      >
                        <button
                          style={{
                            backgroundColor: isSelected
                              ? "yellow"
                              : isBooked
                              ? "black"
                              : seatColor,
                            opacity: isBooked && "0.5",
                            cursor: isBooked ? "not-allowed" : "pointer",
                          }}
                          disabled={isBooked}
                          className={`${seatClassName} text-white`}
                        >
                          {isBooked && "B"}
                          {isAvailable && "A"}
                          {isLocked && "L"}
                        </button>
                      </div>
                    </Tooltip.Floating>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedSeat.length > 0 && (
        <div className="flex justify-center absolute bottom-0 -left-[12em]">
          
            <button onClick={proceedToBooking} className="bg-[#4287f5] hover:bg-orange-700 text-white px-10 py-2 rounded-md">
              Proceed to booking
            </button>
        
        </div>
      )}
    </div>
  );
};

export default AircraftDesign;
