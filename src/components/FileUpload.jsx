import { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const FileUpload = () => {
  const [fileNames, setFileNames] = useState([]); // Array of file names
  const [missingORNumbers, setMissingORNumbers] = useState([]); // Array of missing OR numbers
  const [totalORNumbers, setTotalORNumbers] = useState([]); // Array of total OR numbers
  const [showReview, setShowReview] = useState(false); // Show review
  const [downloadUrl, setDownloadUrl] = useState(null); // URL of the download file
  const [missingUrl, setMissingUrl] = useState(null); // URL of the missing file
  const [fileName, setFileName] = useState(""); // File name
  const [start, setStart] = useState(false); // Start processing
  const [customAlert, setAlert] = useState(false); // Custom alert
  const [isOrignal, setIsOriginal] = useState(false); // Original or sorted
  const [loading, setLoading] = useState(false); // Loading state
  const [previewUrl, setPreviewUrl] = useState(null); // URL of the previewed file
  const [previewIndex, setPreviewIndex] = useState(null); // Index of the previewed file
  const [originalORNumbers, setOriginalORNumbers] = useState("orNumbers"); // Default
  const [missingOnly, setMissingOnly] = useState(false); // Show missing only
  const divRef = useRef(null); // Reference to the div element
  const [height, setHeight] = useState(768); // Default height

  const handleFileChange = (event) => {
    // Reset all states every time a new file is uploaded
    setMissingORNumbers([]);
    setTotalORNumbers([]);
    setDownloadUrl(null);
    setMissingUrl(null);
    setFileName("");
    setStart(false);
    setAlert(false);
    setLoading(false);
    setPreviewUrl(null);
    setPreviewIndex(null);
    setMissingOnly(false);

    // Get the files
    const files = Array.from(event.target.files);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const generateMissingNumbersFile = async (missingNumbers) => {
    const content = missingNumbers
      .map((num, index) => {
        const object = num;
        const propertyName = Object.keys(object)[0];
        const number = index + 1;
        return `${number}. ${object[propertyName][0]} from ${object[
          propertyName
        ][1].join(", ")} ${object[propertyName][2] || ""} ${
          object[propertyName][3] || ""
        }`;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setAlert(true);
  };

  const generateMissing = async (missingNumbers) => {
    const content = missingNumbers
      .map((num, index) => {
        const object = num;
        const propertyName = Object.keys(object)[0];
        const number = index + 1;
        return `${number}. ${object[propertyName][0]}`;
      })
      .join("\n");

    const main = `Missing Numbers with a total of ${missingNumbers.length}:\n\n${content}`;
    const blob = new Blob([main], { type: "text/plain" });
    return missingNumbers.length !== 0 ? URL.createObjectURL(blob) : null;
  };

  useEffect(() => {
    if (missingORNumbers.length > 0) {
      generateMissingNumbersFile(missingORNumbers);
    }

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const formattedTime = date.toTimeString().split(" ")[0].replace(/:/g, "-");
    setFileName(`missingORs_${formattedDate}_${formattedTime}.txt`);

    if (divRef.current) {
      const divHeight = divRef.current.getBoundingClientRect().height;
      setHeight(divHeight);
    }
  }, [missingORNumbers, fileName, customAlert, totalORNumbers]);

  const detectSequence = (array) =>{
    let copiedArray = [...array];
    const indexArray = [];
    
    for (let i = 0; i < array.length; i++){
        let current = Number(array[i]);
        let next = Number(array[i + 1]);

        if (next - current == 1){
            if (!indexArray.includes(current)){
                indexArray.push(current);
            }
            
        }
        
    }
    
    return indexArray;
}

  const handleProcessFiles = async () => {
    setMissingORNumbers([]);
    setTotalORNumbers([]);
    setDownloadUrl(null);
    setTotalORNumbers([]);
    setDownloadUrl(null);

    const files = document.querySelector('input[type="file"]').files;

    localStorage.setItem("files", JSON.stringify(files));
    if (!files.length) {
      console.error("No files selected");
      alert("No files selected");
      return;
    }

    const endingNo = prompt(
      "Enter the prefix to search for (e.g., 'OR No.:'): ",
      "OR No.:"
    );

    if (!endingNo) {
      console.error("No ending number entered");
      alert("No input entered");
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target.result;
        const name = file.name;
        const orNumbers = [];
        //const regex = new RegExp(`${endingNo}\\s*(\\d+[a-zA-Z]+)`, "g");

        const regex = new RegExp(`${endingNo}\\s*(\\d+[a-zA-Z]?\\d*)`, "g");
        //        const regex = new RegExp(${endingNo}\\s*(\\d+), "g"); original
        // const regex = new RegExp(`Transaction Date:\\s*(\\d{2}/\\d{2}/\\d{2})`, "g");

        let match;
        while ((match = regex.exec(data)) !== null) {
          orNumbers.push(match[1]);
          //oconsole.log(match[1]);
        }

        let originalOrNumbers = orNumbers.map(
          (num, index) => index + 1 + ". " + num
        );

        const maxORNumber = Math.max(...orNumbers);
        const minORNumber = Math.min(...orNumbers);
        //orNumbers.sort((a, b) => a - b);

        const withNumbering = orNumbers.map(
          (num, index) => `${index + 1}. ${num}`
        );
        const fileBlob = new Blob([data], { type: "text/plain" });
        const fileUrl = URL.createObjectURL(fileBlob);

        const findMissingNumbers = async (array) => {
          const arrays = [...array];
          const arrayContainer = [];
          const missingTracker = [];
          const numberTracker = [];
          //const skipNumbers = [];

          let indexes = detectSequence(arrays);

          for (let i = 0; i < arrays.length - 1; i++) {
            const current = Number(arrays[i]);
            const next = Number(arrays[i + 1]);
          

            if (!missingTracker.includes(current) && array[indexes[0]] < current) {
              missingTracker.push(current);
            }

            if (!numberTracker.includes(current) &&  (next - current > 1 || -1 >= next - current)){
              const n = "0".repeat(20 - current.toString().length - 1) + Number(current);

              arrayContainer.push({
                skip: [
                  [n + ", skip numbers!"],
                  [name],
                  [`Min: ${minORNumber}`],
                  [`Max: ${maxORNumber}`],
                ],
              }); 
            }


            /*if (next - current > 1 && array[0] < current && array[indexes[0]] < next && !numberTracker.includes(next)&& !numberTracker.includes(current)) {
              for (let j = current + 1; j < next; j++) {
                const n = "0".repeat(20 - j.toString().length - 1) + j;
                if (j === current + 1) {
                  arrayContainer.push({
                    missing: [
                      [n],
                      [name],
                      [`Min: ${minORNumber}`],
                      [`Max: ${maxORNumber}`],
                    ],
                  });
                } else {
                  arrayContainer.push({ missing: [[n], [name]] });
                }
              }
            }*/
          }

          missingTracker.forEach((element, index, array) => {
              let current = array[index];
              let next = array[index + 1];

              if (next - current > 1) {
                console.error("There is a missing number between", current, "and", next);
                
                const n = "0".repeat(20 - current.toString().length - 1) + Number(current + 1);

                arrayContainer.push({
                  missing: [
                    [n + ", missing number"],
                    [name],
                    [`Min: ${minORNumber}`],
                    [`Max: ${maxORNumber}`],
                  ],
                });
              }
          });

          //console.log("numberTracker", numberTracker);
          return arrayContainer;
        };

        const missingORNumber = await findMissingNumbers(orNumbers);
        const _fileMissing = await generateMissing(missingORNumber);

        console.log(missingORNumber)

        const objectNumbers = {
          fileName: name,
          orNumbers: [...withNumbering],
          fileUrl,
          fileMissing: _fileMissing,
          missingNumbers: missingORNumber,
          originalOrNumbers: [...originalOrNumbers],
        };

        setTotalORNumbers((prev) => [...prev, objectNumbers]);
        setMissingORNumbers((prev) => [...prev, ...missingORNumber]);
      };
      reader.readAsText(file);
    });

    setTimeout(() => setStart(true), 3000);
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const handlePreview = (url, index, urlMissing) => {
    setPreviewUrl(url);
    setPreviewIndex(index);
    setMissingUrl(urlMissing);
  };

  return (
    <div className={ `w-[1700px] mt-4 mb-2 flex justify-center  `}>
      <div
        className={`w-[1000px] ${
          showReview ? "hidden" : "bg-white"
        } p-8 rounded-lg border-[1px] shadow-sm w-auto`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Upload Files
        </h2>
        <p className="text-center mb-5">
        Upload files to find missing OR numbers.
        </p>
        <input
          type="file"
          multiple
          accept=".txt"
          onChange={handleFileChange}
          className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleProcessFiles}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Process Files
        </button>
        <ul className="bg-gray-50 border border-gray-300 p-4 rounded-md mt-4">
          {fileNames.length > 0 ? (
            fileNames.slice(0, 10).map((name, index) => (
              <li key={index} className="text-sm text-gray-600">
                {index + 1}. {name}
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No files uploaded yet.</p>
          )}
          {fileNames.length > 5 && (
            <p className="text-sm text-gray-500">and more...</p>
          )}
        </ul>
        {start ? (
          <div className="mt-4 w-full flex flex-col">
            {missingORNumbers.length === 0 ? (
              <p className="text-md text-gray-500 mt-2 text-center">
                No missing numbers found.
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2 text-center">
                  Found the missing numbers!
                </p>
                <a
                  href={downloadUrl}
                  download={fileName}
                  className="bg-green-600 text-white py-2 px-4 text-center rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300"
                >
                  Export Missing ORs No.
                </a>
              </>
            )}
            <button
              onClick={() => setShowReview(true)}
              className="bg-violet-600 mt-3 text-white py-2 px-4 text-center rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition duration-300"
            >
              Review Accumulated ORs
            </button>
          </div>
        ) : loading ? (
          <p className="text-md text-gray-500 mt-2 text-center">Loading...</p>
        ) : null}
      </div>
      <div className="flex md:flex-row flex-col">
        {showReview && (
          <div className="flex flex-col justify-center items-end w-full">
            <div className="w-full">
              <div className="sm:ml-5 mb-5 flex gap-5 items-center">
                <button
                  className={` py-2 px-2 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } border-[1px] bg-white hover:bg-slate-100 transition duration-200`}
                  onClick={() => {
                    setShowReview(false);
                    setPreviewUrl(null);
                    setPreviewIndex(null);
                  }}
                >
                  <IoArrowBackSharp className="text-slate-600"/>
                  <p className="text-black">Go back</p>
                </button>
                <button
                  className={`py-2 px-2 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } bg-red-500 hover:bg-red-600 transition duration-200`}
                  onClick={() => setMissingOnly((prev) => !prev)}
                >
                  {missingOnly ? "Show All" : "Show Missing"}
                </button>
              </div>
            </div>
            {totalORNumbers.length > 0 && (
              <div
                ref={divRef}
                className="lg:px-5 flex-1 rounded-lg xsm:grid-cols-1 sm:grid-cols-2 grid md:grid-cols-3 xl:grid-cols-5 hd:grid-cols-5 w-full gap-5"
              >
                {totalORNumbers
                  .filter((value) => (missingOnly ? value.fileMissing : value))
                  .map((value, index, array) => {
                    return (
                      <div
                        key={value.fileName}
                        className={`col-span-1 ${
                          previewIndex !== null && previewIndex !== index
                            ? "hidden"
                            : ""
                        }`}
                      >
                        <table
                          className={` min-w-full ${
                            previewUrl ? "" : "mt-4"
                          } bg-white rounded-lg shadow-md border border-radius ${
                            previewUrl != null && previewIndex != null
                              ? "xl:w-[800px]  w-full lg:w-[600px] md:w-[400px] sm:w-[485px] xsm:w-[200px]"
                              : ""
                          }`}
                        >
                          <thead>
                            <tr className="border-[1px] bg-white text-white">
                              <th className="py-5 px-4 text-sm font-semibold rounded-lg flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    handlePreview(
                                      value.fileUrl,
                                      index,
                                      value.fileMissing
                                    );

                                    const newTotalORNumbers = [
                                      ...totalORNumbers,
                                    ];
                                    const filteredIndex =
                                      totalORNumbers.findIndex(
                                        (item) =>
                                          item.fileName === value.fileName
                                      );
                                    newTotalORNumbers[filteredIndex].showAll =
                                      !newTotalORNumbers[filteredIndex].showAll;
                                    setTotalORNumbers(newTotalORNumbers);
                                  }}
                                  title="Preview Original File"
                                  className={`border-[1px] shadow-sm ${
                                    previewUrl != null && previewIndex != null
                                      ? "hidden"
                                      : ""
                                  } text-white py-1 px-2 flex gap-1 text-center rounded-md hover:bg-slate-200 focus:outline-none transition duration-300`}
                                >
                                  <p className="text-black font-medium">View</p>
                                  <MdOutlineRemoveRedEye className="w-5 h-5 text-slate-700" />
                                </button>
                                <p className="text-gray-700">{value.fileName}</p>
                                {previewUrl == null &&
                                  value.fileMissing != null && (
                                    <div className="ml-4 py-1 px-2 rounded-md lg:flex hidden items-center bg-red-500 hover:bg-red-600">
                                      <p>{value.missingNumbers.length} Miss</p>
                                    </div>
                                  )}
                                {value.orNumbers.length > 5 && (
                                  <span
                                    className={`${previewUrl ? "border" : ""}  transition duration-200 bg-white hover:bg-slate-100  cursor-pointer h-10 rounded-md items-center justify-center flex`}
                                    onClick={() => {
                                      const newTotalORNumbers = [
                                        ...totalORNumbers,
                                      ];
                                      const filteredIndex =
                                        totalORNumbers.findIndex(
                                          (item) =>
                                            item.fileName === value.fileName
                                        );
                                      newTotalORNumbers[filteredIndex].showAll =
                                        !newTotalORNumbers[filteredIndex]
                                          .showAll;
                                      setTotalORNumbers(newTotalORNumbers);
                                    }}
                                  >
                                    <span
                                      className={`${
                                        value.orNumbers.length > 5 &&
                                        previewIndex != null &&
                                        previewUrl != null
                                          ? ""
                                          : "hidden"
                                      } font-medium py-2 px-4 text-sm text-white`}
                                    >
                                      {value.showAll ? <p className="text-black">Show Less</p> :<p className="text-black">Show All</p>}
                                    </span>
                                  </span>
                                )}
                                {previewIndex !== null && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setPreviewUrl(null);
                                        setPreviewIndex(null);
                                        setHeight(768);
                                        totalORNumbers.forEach(
                                          (item) => (item.showAll = false)
                                        );
                                      }}
                                      className="bg-red-500 text-white py-2 px-4 text-center rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
                                    >
                                      Close{" "}
                                      <span className="sm:hidden block">
                                        Preview
                                      </span>
                                    </button>

                                    {value.missingNumbers.length > 0 && (
                                      <button
                                        onClick={() => {
                                          setIsOriginal((prev) => !prev);

                                          if (isOrignal) {
                                            setOriginalORNumbers("orNumbers");
                                          } else {
                                            setOriginalORNumbers(
                                              "originalOrNumbers"
                                            );
                                          }
                                        }}
                                        className={`${
                                          isOrignal
                                            ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                                            : "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
                                        } text-white py-2 px-4 text-center rounded-md shadow-md  focus:outline-none focus:ring-2  focus:ring-opacity-50 transition duration-300`}
                                      >
                                        {isOrignal
                                          ? "Sorted No."
                                          : "Unsorted No."}
                                      </button>
                                    )}
                                  </>
                                )}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {value[originalORNumbers]
                              .slice(
                                0,
                                value.showAll ? value.orNumbers.length : 5
                              )
                              .map((num, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-100 transition duration-200"
                                >
                                  <td className="border-b bg-white border-gray-200 py-2 px-4 text-sm text-gray-700">
                                    {num}
                                  </td>
                                </tr>
                              ))}
                            {value.orNumbers.length > 5 &&
                              (value.showAll ? null : (
                                <tr>
                                  <td
                                    title="Show All"
                                    onClick={() => {
                                      handlePreview(
                                        value.fileUrl,
                                        index,
                                        value.fileMissing
                                      );

                                      const newTotalORNumbers = [
                                        ...totalORNumbers,
                                      ];
                                      const filteredIndex =
                                        totalORNumbers.findIndex(
                                          (item) =>
                                            item.fileName === value.fileName
                                        );
                                      newTotalORNumbers[filteredIndex].showAll =
                                        !newTotalORNumbers[filteredIndex]
                                          .showAll;
                                      setTotalORNumbers(newTotalORNumbers);
                                    }}
                                    className="border-b border-gray-200 font-medium hover:bg-gray-300 transition-all 0.2s cursor-pointer py-2 px-4 text-sm text-gray-700"
                                  >
                                    {value.showAll
                                      ? null
                                      : value.orNumbers.length - 5 + " More.."}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        {previewUrl && (
          <div
            className={`mr-5 mt-4 w-full flex md:flex-row flex-col gap-2 items-center ${
              previewUrl ? "" : "hidden"
            }`}
          >
            {missingUrl && (
              <iframe
                src={missingUrl}
                title="File Preview"
                className="w-full border border-gray-300 rounded-md text-center resize-y	"
                style={{ height: `${height}px` }}
              ></iframe>
            )}
            <iframe
              src={previewUrl}
              title="File Preview"
              className="w-full border border-gray-300 rounded-md text-center resize-y	"
              style={{ height: `${height}px` }}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;