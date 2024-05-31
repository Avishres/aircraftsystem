import { Text } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import AircraftDesign from "./AircraftDesign";

const Aircraft = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nameOfClass = searchParams.get("class");
  const [seatClassData, setClassData] = useState([]);

 
  const seatClassNames =
    (nameOfClass === "firstClass" && "First Class") ||
    (nameOfClass === "businessClass" && "Business Class") ||
    (nameOfClass === "economyClass" && "Economy Class");

  const { data, isLoading, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/aircraft/" + id
      );
      return data;
    },
    onSuccess: (data) => {
      const classData = data?.seatClass?.[nameOfClass];
      setClassData(classData);
    },
    queryKey: ["aircraft", id],
  });

  return (
    <div className="border-l-2 border-indigo-500 h-full w-full flex flex-col items-center pt-20">
      <h1 className="text-3xl font-bold">{data?.name}</h1>

      <ClassDefination />

      <div className="flex overflow-y-auto">
        <div className="px-10 mt-4">
          <Text c="dimmed" size="sm">
            • Class: {seatClassNames}
          </Text>
          <Text c="dimmed" size="sm">
            • Total Seats: {seatClassData?.numOfSeats}
          </Text>
          <Text c="dimmed" size="sm">
            • Available Seats: {seatClassData.availableSeats}
          </Text>
          {/* <Text c="dimmed" size="sm">• Cost of Each Seat: ${seatClassData.seats?.seatPrice}</Text> */}
        </div>

        <AircraftDesign
          seatClassData={seatClassData}
          nameOfClass={nameOfClass}
          aircraftId = {id}
        />
      </div>
    </div>
  );
};

const classColorData = [
  {
    name: "First Class",
    color: "red",
  },
  {
    name: "Business Class",
    color: "blue",
  },
  {
    name: "Economy Class",
    color: "green",
  },
];

const ClassDefination = () => {
  return (
    <div className="flex gap-3 my-5">
      {classColorData.map((item, i) => {
        return (
          <div key={i} className="flex items-center gap-2 ">
            <div style={{
              backgroundColor: item.color
            }} className={`w-2 h-2 rounded-full`}></div>
            <Text className="text-sm">{item.name}</Text>
          </div>
        );
      })}
    </div>
  );
};

export default Aircraft;

