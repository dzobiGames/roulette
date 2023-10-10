import { AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import { toggleCheckbox } from "../features/checkboxSlice";
import {
  setCheckedValue,
  removeCheckedValue,
} from "../features/checkedValuesSlice";

import {
  setSearchResultsData,
  // clearSearchResultsData,
} from "../features/searchResultsSlice";
import { searchAlgoValues } from "../utils/util";

interface MatchValue {
  index: string;
  zero: number;
  ten: number;
  red: number;
  last: number;
  win: number;
}

interface ResultsProps {
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  responseData: Array<{
    zero: number;
    ten: number;
    red: number;
    matchValues: MatchValue[];
  }> | null;
}

const Results = ({ setShowResults, responseData }: ResultsProps) => {
  const dispatch = useDispatch();
  const checkboxState = useSelector((state: RootState) => state.checkbox);
  const checkedValues = useSelector((state: RootState) => state.checkedValues);
  const searchResults = useSelector((state: RootState) => state.searchResults);

  // Determine if any checkbox is checked
  const isAnyCheckboxChecked = Object.values(checkboxState).some(
    (checked) => checked
  );

  //console.log("values", checkedValues);
  //console.log("search results", searchResults);

  const handleCheckboxChange = (index: number, match: string) => {
    dispatch(toggleCheckbox(index));

    if (!checkboxState[index]) {
      dispatch(setCheckedValue(match));
    } else {
      dispatch(removeCheckedValue(match));
    }
  };

  //console.log("checked values to be sent to the backend", checkedValues);

  const handleSearch = async () => {
    /* const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post(
      `${server}/search`,
      checkedValues,
      config
    ); */
    const newStringArray = checkedValues.values.map(value => value.toString());
    console.log(newStringArray);
    const response = await searchAlgoValues(newStringArray);
    console.log(response);

    //console.log(response.data);
    dispatch(setSearchResultsData(response));
  };

  const handleClose = () => {
    setShowResults(false);
    window.location.reload();
  };

  if (responseData && responseData.length > 0) {
    return (
      <>
        <div className="">
          <div className="fixed h-screen inset-0 z-50 flex items-center w-full mx-auto justify-center overflow-x-hidden bg-[#00000080]">
            <button
              className="absolute right-2 top-3 text-red-600 font-extrabold"
              onClick={handleClose}
            >
              <AiOutlineCloseCircle size={35} />
            </button>
            <div className="w-full overflow-y-auto">
              <section className="w-11/12 bg-white mx-auto py-3 px-1 flex gap-1 justify-evenly">
                <div className="">
                  <p className="font-medium">zero</p>
                  <span>{responseData[0].zero}</span>
                </div>
                <div className="">
                  <p className="font-medium">ten</p>
                  <span>{responseData[0].ten}</span>
                </div>
                <div className="">
                  <p className="font-medium">red</p>
                  <span>{responseData[0].red}</span>
                </div>
              </section>
              <hr className="w-11/12 mx-auto" />
              {responseData[1].matchValues.length > 0 ? (
                <section className="w-11/12 bg-white mx-auto py-3 px-1 flex flex-col gap-2 justify-evenly">
                  <table className="table-auto w-full  bg-white">
                    <thead>
                      <tr>
                        <th className="text-center px-2"></th>
                        <th className="text-center px-2">zero</th>
                        <th className="text-center px-2">ten</th>
                        <th className="text-center px-2">red</th>
                        <th className="text-center px-2">last</th>
                        <th className="text-center px-2">win</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responseData[1].matchValues.map((match, index) => (
                        <tr key={match.index}>
                          <td className="text-center px-2">
                            <input
                              type="checkbox"
                              name=""
                              id=""
                              checked={checkboxState[index] || false}
                              onChange={() =>
                                handleCheckboxChange(index, match.index)
                              }
                            />
                          </td>
                          <td className="text-center px-2">{match.zero}</td>
                          <td className="text-center px-2">{match.ten}</td>
                          <td className="text-center px-2">{match.red}</td>
                          <td className="text-center px-2">{match.last}</td>
                          <td className="text-center px-2">{match.win}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className={`bg-green-700 w-[30%] mx-auto text-white font-medium py-[6px] rounded ${
                      isAnyCheckboxChecked
                        ? ""
                        : "bg-green-800/50 pointer-events-none"
                    }`}
                    onClick={handleSearch}
                    disabled={!isAnyCheckboxChecked}
                  >
                    search
                  </button>
                </section>
              ) : (
                <section className="w-11/12 bg-white mx-auto py-3 px-1 flex flex-col gap-2 justify-evenly">
                  <span className="text-center text-gray-700/50">
                    No match results found
                  </span>
                  <button
                    className={`bg-green-700 w-[30%] mx-auto text-white font-medium py-[6px] rounded ${
                      isAnyCheckboxChecked
                        ? ""
                        : "bg-green-800/50 pointer-events-none"
                    }`}
                    onClick={handleSearch}
                    disabled={!isAnyCheckboxChecked}
                  >
                    search
                  </button>
                </section>
              )}

              <section className="w-11/12 bg-white mx-auto py-3 px-1 flex flex-col gap-2 justify-evenly">
                {searchResults && (
                  <div className="overflow-x-scroll overflow-y-scroll">
                    <table className="table-auto w-full bg-white">
                      <tbody>
                        {Array.from({ length: 9 }).map((_, rowIndex) => (
                          <tr key={rowIndex} className="">
                            {Array.from({ length: 5 }).map((_, colIndex) => {
                              const dataIndex = rowIndex * 5 + colIndex;
                              const dataItem = searchResults[dataIndex];

                              return (
                                <td key={colIndex} className="text-center px-2">
                                  {dataItem ? (
                                    <>
                                      <span>{dataItem.key}</span>
                                      <sub className="text-red-700">
                                        {dataItem.value}
                                      </sub>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* <section className="w-11/12 bg-white mx-auto py-3 px-1 flex flex-col gap-2 justify-evenly">
                <div className="flex justify-around gap-2">
                  <div>
                    {searchResults.slice(0, 9).map((item) => (
                      <div className="mb-1">
                        <span>{item.key}</span>
                        <sub className="text-red-700">{item.value}</sub>
                      </div>
                    ))}
                  </div>
                  <div>
                    {searchResults.slice(9, 18).map((item) => (
                      <div className="mb-1">
                        <span>{item.key}</span>
                        <sub className="text-red-700">{item.value}</sub>
                      </div>
                    ))}
                  </div>
                  <div>
                    {searchResults.slice(18, 27).map((item) => (
                      <div className="mb-1">
                        <span>{item.key}</span>
                        <sub className="text-red-700">{item.value}</sub>
                      </div>
                    ))}
                  </div>
                  <div>
                    {searchResults.slice(27, 36).map((item) => (
                      <div className="mb-1">
                        <span>{item.key}</span>
                        <sub className="text-red-700">{item.value}</sub>
                      </div>
                    ))}
                  </div>
                  <div>
                    {searchResults.slice(36, 40).map((item) => (
                      <div>
                        <span>{item.key}</span>
                        <sub className="text-red-700">{item.value}</sub>
                      </div>
                    ))}
                  </div>
                </div>
              </section> */}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    // Handle the case when responseData is null or empty
    // return <div>No data available</div>;
  }
};

export default Results;
