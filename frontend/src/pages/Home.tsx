import { useSelector, useDispatch } from "react-redux";
import { TbAnalyzeFilled } from "react-icons/tb";
import { MdClear } from "react-icons/md";
import { setInputValue } from "../features/inputSlice";
import { RootState } from "../store";
import { server } from "../server/server";
import axios from "axios";
import Results from "../components/Results";
import { setResponseData } from "../features/apiSlice";
import { useEffect, useState } from "react";
import { processDataFromExcel } from "../utils/util";

const Home = () => {
  const [showResults, setShowResults] = useState(false);
  const dispatch = useDispatch();

  const inputValues = useSelector((state: RootState) => state.input); // Use RootState
  const apiData = useSelector((state: RootState) => state.api);

  // Check if any input field has an empty value
  const isAnyInputEmpty = inputValues.some((value) => value === "");

  // console.log(inputValues);

  // const handleInputChange = (index: number, value: number) => {
  //   if (value > 36) {
  //     // Display a pop-up message when the input value is greater than 36
  //     window.alert("Number cannot exceed 36");
  //     return; // Exit the function without updating the state
  //   }
  //   dispatch(setInputValue({ index, value }));
  // };

  const handleShiftClick = async (e: any) => {
    e.preventDefault();

    const config = { headers: { "Content-Type": "application/json" } };

    try {
      const response = await axios.post(
        `${server}/process`,
        {
          values: inputValues,
        },
        config
      );
      if (response.data) {
        console.log(response.data);
        dispatch(setResponseData(response.data));
        setShowResults(true)
        console.log("successfull");
      }
    } catch (error: any) {
      console.log("error occured");
      console.log(error.message);
    }

    // Check if all input fields have values before allowing the shift
    const allInputsFilled = inputValues.every((value) => value !== "");

    if (allInputsFilled) {
      // Create a copy of the inputValues array
      const updatedInputValues = [...inputValues];

      // Remove the first input box by shifting all values one position to the left
      for (let i = 0; i < updatedInputValues.length - 1; i++) {
        updatedInputValues[i] = updatedInputValues[i + 1];
      }

      // Add an empty input at the last position
      updatedInputValues[updatedInputValues.length - 1] = "";

      // Dispatch the updated input values to Redux store
      for (let i = 0; i < updatedInputValues.length; i++) {
        dispatch(setInputValue({ index: i, value: updatedInputValues[i] }));
      }
    }
    const result = processDataFromExcel();
    console.log("processData", result);
  };

  // const handleInputChange = (index: number, value: number) => {
  //   if (value > 36) {
  //     // Display a pop-up message when the input value is greater than 36
  //     window.alert("Number cannot exceed 36");
  //     return; // Exit the function without updating the state
  //   }

  //   // Update the input value
  //   dispatch(setInputValue({ index, value }));

  //   // Check if the value has a length of 2 and is valid
  //   if (value.toString().length === 2 && value >= 1 && value <= 36) {
  //     // If it's valid and the next input field exists, focus on it
  //     const nextInputIndex = index + 1;
  //     if (nextInputIndex < inputValues.length) {
  //       const nextInput = document.getElementById(`input-${nextInputIndex}`);
  //       if (nextInput) {
  //         nextInput.focus();
  //       }
  //     }
  //   }
  // };

  const handleInputChange = (index: number, value: number) => {
    if (value > 36) {
      // Display a pop-up message when the input value is greater than 36
      window.alert("Number cannot exceed 36");
      return; // Exit the function without updating the state
    }

    // Update the input value
    dispatch(setInputValue({ index, value }));

    // Save the input value to local storage
    localStorage.setItem(`input-${index}`, value.toString());

    // Check if the value has a length of 2 and is valid
    if (value.toString().length === 2 && value >= 1 && value <= 36) {
      // If it's valid and the next input field exists, focus on it
      const nextInputIndex = index + 1;
      if (nextInputIndex < inputValues.length) {
        const nextInput = document.getElementById(`input-${nextInputIndex}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleClear = () => {
    // Create an array with the same length as inputValues, filled with empty strings
    const initialInputValues = Array(inputValues.length).fill("");

    // Dispatch an action to set inputValues to the initial state
    initialInputValues.forEach((value, index) => {
      dispatch(setInputValue({ index, value }));
    });
  };

  //in order not to loose user's input data

  window.addEventListener("beforeunload", () => {
    // Save input values to local storage before the page is refreshed
    inputValues.forEach((value, index) => {
      localStorage.setItem(`input-${index}`, value);
    });
  });

  // Add this code in your component's useEffect hook or componentDidMount if using class components
  useEffect(() => {
    // Populate input values from local storage when the page is loaded
    const savedInputValues = inputValues.map((_, index) => {
      const savedValue = localStorage.getItem(`input-${index}`);
      return savedValue ? Number(savedValue) : "";
    });

    // Dispatch an action to set inputValues to the saved values
    savedInputValues.forEach((value, index) => {
      dispatch(setInputValue({ index, value }));
    });
  }, []);

  return (
    <>
      {showResults && <Results responseData={apiData.responseData} setShowResults={setShowResults}/>}
      <div className=" overflow-hidden">
        <header className="px-3 py-2 flex items-center justify-between max-[500px]:w-[100%] bg-gray-800">
          <h1 className="text-3xl text-white font-semibold">Roulette</h1>
        </header>
        <main className=" max-[500px]:max-w-[95%] mx-auto">
          <section className="flex flex-wrap gap-4 mt-3 bg-slate-60  p-3">
            {inputValues.map((value: number, index: number) => (
              <div className="w-1/5" key={index}>
                <input
                  type="number"
                  name=""
                  id={`input-${index}`}
                  value={value}
                  onChange={(e) =>
                    handleInputChange(index, e.target.valueAsNumber)
                  }
                  className="border-2 py-[4px] rounded w-full text-center shadow-md focus:border-green-700"
                />
              </div>
            ))}
            <button
              className={`border-2 border-green-700 bg-green-700 text-white px-5 text-[14px] font-medium rounded ${
                isAnyInputEmpty ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleShiftClick}
              disabled={isAnyInputEmpty}
            >
              <TbAnalyzeFilled size={25} />
            </button>
            <button
              className={`border-2 border-red-700 bg-red-700 text-white px-5 text-[14px] font-medium rounded`}
              onClick={handleClear}
              // disabled={isAnyInputEmpty}
            >
              <MdClear size={20} />
            </button>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
