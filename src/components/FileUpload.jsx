import { useEffect, useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const FileUpload = () => {
  const [fileNames, setFileNames] = useState([]);
  const [missingORNumbers, setMissingORNumbers] = useState([]);
  const [totalORNumbers, setTotalORNumbers] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [missingUrl, setMissingUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [start, setStart] = useState(false);
  const [customAlert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [missingOnly, setMissingOnly] = useState(false);
  const divRef = useRef(null);
  const [height, setHeight] = useState(768);

  const handleFileChange = (event) => {
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

  const handleProcessFiles = async () => {
    setMissingORNumbers([]);
    setTotalORNumbers([]);
    setDownloadUrl(null);
    setTotalORNumbers([]);
    setDownloadUrl(null);

    const files = document.querySelector('input[type="file"]').files;
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
          console.log(match[1]);
        }

        const maxORNumber = Math.max(...orNumbers);
        const minORNumber = Math.min(...orNumbers);
        orNumbers.sort((a, b) => a - b);

        const withNumbering = orNumbers.map(
          (num, index) => `${index + 1}. ${num}`
        );
        const fileBlob = new Blob([data], { type: "text/plain" });
        const fileUrl = URL.createObjectURL(fileBlob);

        const findMissingNumbers = async (array) => {
          const arrayContainer = [];
          for (let i = 0; i < array.length - 1; i++) {
            const current = Number(array[i]);
            const next = Number(array[i + 1]);
            if (next - current > 1) {
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
            }
          }
          return arrayContainer;
        };

        const missingORNumber = await findMissingNumbers(orNumbers);
        const _fileMissing = await generateMissing(missingORNumber);

        const objectNumbers = {
          fileName: name,
          orNumbers: [...withNumbering],
          fileUrl,
          fileMissing: _fileMissing,
          missingNumbers: missingORNumber,
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
    <div className="h-full w-full mt-5 mb-2 flex justify-center">
      <div
        className={`${
          showReview ? "hidden" : "bg-white"
        } p-8 rounded-lg shadow-lg w-full max-w-md`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Drag & Drop Files Here
        </h2>
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
          Find Something :D 
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
              <div className="ml-12 mb-5 flex gap-5 items-center">
                <button
                  className={` py-3 px-3 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } bg-orange-500 hover:bg-orange-600 transition duration-200`}
                  onClick={() => {
                    setShowReview(false);
                    setPreviewUrl(null);
                    setPreviewIndex(null);
                  }}
                >
                  <IoArrowBackSharp /> Go Back
                </button>
                <button
                  className={` py-3 px-3 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } bg-red-500 hover:bg-red-600 transition duration-200`}
                  onClick={() => setMissingOnly((prev) => !prev)}
                >
                  {missingOnly ? "Show All" : "Show Missing Only"}
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
                          className={` min-w-full mt-4 bg-white rounded-lg shadow-md border border-radius ${
                            previewUrl != null && previewIndex != null
                              ? "xl:w-[800px] w-full lg:w-[600px] md:w-[400px] sm:w-[485px] xsm:w-[200px]"
                              : ""
                          }`}
                        >
                          <thead>
                            <tr className="bg-blue-600 text-white">
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
                                  className={`bg-blue-500 ${
                                    previewUrl != null && previewIndex != null
                                      ? "hidden"
                                      : ""
                                  } text-white py-1 px-2 flex gap-1 text-center rounded-md hover:bg-blue-700 focus:outline-none transition duration-300`}
                                >
                                  View
                                  <MdOutlineRemoveRedEye className="w-5 h-5" />
                                </button>
                                <p>{value.fileName}</p>
                                {previewUrl == null &&
                                  value.fileMissing != null && (
                                    <div className="ml-4 py-1 px-2 rounded-md lg:flex hidden items-center bg-red-500 hover:bg-red-600">
                                      <p>{value.missingNumbers.length} Miss!</p>
                                    </div>
                                  )}
                                {value.orNumbers.length > 5 && (
                                  <span
                                    className="hover:bg-blue-700 transition duration-200 cursor-pointer h-10 rounded-md items-center justify-center flex"
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
                                      {value.showAll ? "Hide" : "Show All"}
                                    </span>
                                  </span>
                                )}
                                {previewIndex !== null && (
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
                                    Close Preview
                                  </button>
                                )}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {value.orNumbers
                              .slice(
                                0,
                                value.showAll ? value.orNumbers.length : 5
                              )
                              .map((num, index) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-100 transition duration-200"
                                >
                                  <td className="border-b border-gray-200 py-2 px-4 text-sm text-gray-700">
                                    {num}
                                  </td>
                                </tr>
                              ))}
                            {value.orNumbers.length > 5 && ( value.showAll ? null :
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
                                      !newTotalORNumbers[filteredIndex].showAll;
                                    setTotalORNumbers(newTotalORNumbers);
                                  }}
                                  className="border-b border-gray-200 font-medium hover:bg-gray-300 cursor-pointer py-2 px-4 text-sm text-gray-700"
                                >
                                  {value.showAll
                                    ? null
                                    : value.orNumbers.length - 5 + " More.."}
                                </td>
                              </tr>
                            )}
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
