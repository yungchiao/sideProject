import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { animals } from "./activityName";
const Upload = styled.input`
  width: 200px;
  height: 50px;
`;
function UserPost() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };
  const variant = "underlined";
  return (
    <div className="m-auto mt-10 w-3/4 border p-10">
      <Select label="選擇活動名稱" className="mb-2 max-w-xs">
        {animals.map((animal) => (
          <SelectItem key={animal.value} value={animal.value}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
      <div className="mt-4 ">
        <DatePicker
          className="z-20 mb-4 cursor-pointer rounded-lg bg-stone-800 text-center text-gray-100"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
      {Array.from({ length: items }).map((index) => (
        <Input
          type="url"
          className="mb-4 w-40"
          placeholder="hashtag"
          labelPlacement="outside"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">#</span>
            </div>
          }
          key={index}
        />
      ))}

      <Button
        className="mb-4 border border-stone-800 bg-white"
        onClick={addAmount}
      >
        <p className="text-stone-800">more #hashtag</p>
      </Button>
      <div className="grid w-full grid-cols-12 gap-4">
        <Input
          key={variant}
          variant={variant}
          labelPlacement="outside"
          placeholder="輸入地點"
          className="col-span-12 mb-6 md:col-span-6 md:mb-4"
        />
      </div>
      <form className="mb-4 ">
        <label className="mr-4 ">
          <input
            type="radio"
            value="option1"
            checked={selectedOption === "option1"}
            onChange={handleRadioChange}
          />
          Sunny
        </label>
        <label className="mr-4 ">
          <input
            type="radio"
            value="option2"
            checked={selectedOption === "option2"}
            onChange={handleRadioChange}
          />
          Rainy
        </label>
        <label className="mr-4 ">
          <input
            type="radio"
            value="option3"
            checked={selectedOption === "option3"}
            onChange={handleRadioChange}
          />
          Cloudy
        </label>
      </form>
      <input type="file" className="mb-4 "></input>
      <Button
        className="mb-2 border border-stone-800 bg-white"
        onClick={addAmount}
      >
        <p className="text-stone-800">上傳檔案</p>
      </Button>
      <Textarea
        variant="bordered"
        placeholder="Enter your description"
        disableAnimation
        disableAutosize
        classNames={{
          base: "w-4/5 ",
          input: "resize-y min-h-[120px]",
        }}
      />
      <div className="mx-auto mt-10 flex items-center justify-center">
        <Button className="bg-stone-800">
          <p className="text-gray-100">發布</p>
        </Button>
      </div>
    </div>
  );
}

export default UserPost;
