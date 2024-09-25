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
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [missingOnly, setMissingOnly] = useState(false);
  const divRef = useRef(null);
  const [height, setHeight] = useState(768); // State to store the height

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const generateMissingNumbersFile = async (missingNumbers) => {
    const content = await missingNumbers
      .map((num, index) => {
        let object = num;
        let propertyName = Object.keys(object)[0];
        let number = index + 1;

        let compiledMissingNumbers = `${number}. ${object[propertyName][0]} from ${object[
          propertyName
        ][1].join(", ")} ${object[propertyName][2] || ""} ${
          object[propertyName][3] || ""
        }`;

        return compiledMissingNumbers;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    setDownloadUrl(url);
    setAlert(true);
  };

  const generateMissing = async (missingNumbers) => {
    const content = await missingNumbers
      .map((num, index) => {
        let object = num;
        let propertyName = Object.keys(object)[0];
        let number = index + 1;

        let compiledMissingNumbers = `${number}. ${object[propertyName][0]}`;

        return compiledMissingNumbers;
      })
      .join("\n");

    const main = "Missing Numbers with a total of " + missingNumbers.length +"\n" + content;


    const blob = new Blob([main], { type: "text/plain" });
    const url = missingNumbers.length !== 0 ? URL.createObjectURL(blob) : null;

    console.log("url", url);
    return url;
  };

  useEffect(() => {
    if (missingORNumbers.length > 0) {
      generateMissingNumbersFile(missingORNumbers);
    }

    const date = new Date();

    // Format the date and time as YYYY-MM-DD_HH-MM-SS
    const formattedDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const formattedTime = date.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS

    const fileName = `missingORs_${formattedDate}_${formattedTime}.txt`;

    setFileName(fileName);

    if (divRef.current) {
      // Get the height of the div
      const divHeight = divRef.current.getBoundingClientRect().height;
      setHeight(divHeight); // Set the height in state

      console.log("divHeight", divHeight);
    }
  }, [missingORNumbers, fileName, alert, totalORNumbers]);

  const handleProcessFiles = async () => {
    setMissingORNumbers([]);
    setTotalORNumbers([]);
    setDownloadUrl(null);

    const files = document.querySelector('input[type="file"]').files;

    if (!files.length) {
      console.error("No files selected");
      return;
    }
    const endingNo = prompt(
      "Enter the prefix to search for (e.g., 'OR No.:'): "
    );

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const data = event.target.result;
        let name = file.name;

        const orNumbers = [];
        const regex = new RegExp(`${endingNo}\\s*(\\d+)`, "g");

        let match;
        while ((match = regex.exec(data)) !== null) {
          orNumbers.push(match[1]);
        }

        let maxORNumber = Math.max(...orNumbers);
        let minORNumber = Math.min(...orNumbers);

        orNumbers.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

        let withNumbering = orNumbers.map((num, index) => {
          return `${index + 1}. ${num}`;
        });

        const fileBlob = new Blob([data], { type: "text/plain" });
        const fileUrl = URL.createObjectURL(fileBlob);

        console.log("orNumbers:", orNumbers);

        const findMissingNumbers = async (array) => {
          let properties = array;
          let propertiesLength = properties.length;
          const arrayContainer = [];

          for (let i = 0; i < propertiesLength - 1; i++) {
            let current = Number(properties[i]);
            let next = Number(properties[i + 1]);

            if (next - current > 1) {
              for (let j = current + 1; j < next; j++) {
                let k = j.toString().length;
                let l = 20;
                let m = l - k;
                let n = "0".repeat(m - 1) 
                + j;

                if (j == current + 1) {
                  arrayContainer.push({
                    missing: [
                      [n],
                      [name],
                      ["Min: " + minORNumber],
                      ["Max:" + maxORNumber],
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

        let missingORNumber = await findMissingNumbers(orNumbers);

        console.log("missingORNumber", missingORNumber);

        let _fileMissing = await generateMissing(missingORNumber);

        let objectNumbers = {
          fileName: name,
          orNumbers: [...withNumbering],
          fileUrl: fileUrl,
          fileMissing: _fileMissing,
        };

        try {
          setTotalORNumbers((prev) => [...prev, objectNumbers]);
          console.log("Total OR Numbers:", objectNumbers);
        } catch (error) {
          console.error("Error processing files:", error);
        }

        setMissingORNumbers((prev) => [...prev, ...missingORNumber]);

        orNumbers.length = 0;
      };

      reader.readAsText(file);
    });

    setTimeout(() => {
      setStart(true);
    }, 3000);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handlePreview = (url, index, urlMissing) => {
    console.log("Preview URL:", url);
    console.log("Missing URL:", urlMissing);
    setPreviewUrl(url);
    setPreviewIndex(index);
    setMissingUrl(urlMissing);
  };

  return (
    <div className="h-full w-full mt-[20px] mb-2 flex justify-center">
      <div
        className={`${
          showReview ? "hidden" : "bg-white"
        } p-8 rounded-lg shadow-lg w-full max-w-md`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Upload Files
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
            {missingORNumbers.length == 0 ? (
              <p className={`text-md text-gray-500 mt-2 text-center`}>
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
              onClick={() => {
                setShowReview(true);
              }}
              className="bg-violet-600 mt-3 text-white py-2 px-4 text-center rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition duration-300"
            >
              Review Accumulated ORs
            </button>
          </div>
        ) : loading ? (
          <p className={`text-md text-gray-500 mt-2 text-center`}>Loading...</p>
        ) : null}
      </div>

      {showReview && (
        <div className="flex flex-col w-full">
          {showReview ? (
            <div className="w-full">
              <div className="flex ga-5 items-center">
                <button
                  className={`ml-10 py-3 px-3 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } bg-orange-500 hover:bg-orange-600 transition duration-200`}
                  onClick={() => {
                    setShowReview(false);
                    setPreviewUrl(null);
                    setPreviewIndex(null);
                  }}
                >
                  <IoArrowBackSharp></IoArrowBackSharp> Go Back
                </button>

                <button
                  className={`ml-10 py-3 px-3 text-white justify-start rounded-md items-center flex gap-2 ${
                    previewUrl != null && previewIndex != null ? "hidden" : ""
                  } bg-red-500 hover:bg-red-600 transition duration-200`}
                  onClick={() => {
                    setMissingOnly(prev => !prev);
                  }}
                >
                  {missingOnly ? "Show All" : "Missing No. Only"}
                </button>
              </div>
            </div>
          ) : null}

          {showReview && totalORNumbers.length > 0 ? (
            <div
              ref={divRef}
              className="px-5 rounded-lg xsm:grid-cols-1 sm:grid-cols-2 grid md:grid-cols-3 xl:grid-cols-5 hd:grid-cols-5 w-full gap-2 "
            >
              {totalORNumbers
  .filter((value) => (missingOnly ? value.fileMissing : value))
  .map((value, index) => (
    <div
      key={value.fileName}
      className={`col-span-1 ${
        previewIndex !== null && previewIndex !== index ? "hidden" : ""
      }`}
    >
      <table
        className={`min-w-full mt-4 bg-white rounded-lg shadow-md border border-radius ${
          previewUrl != null && previewIndex != null ? "w-[768px]" : ""
        }`}
      >
        <thead className="">
          <tr className="bg-blue-600 text-white">
            <th className="py-5 px-4 text-sm font-semibold rouned flex items-center gap-2">
              <button
                onClick={() =>
                  handlePreview(value.fileUrl, index, value.fileMissing)
                }
                title="Preview Original File"
                className={`bg-blue-500 ${
                  previewUrl != null && previewIndex != null ? "hidden" : ""
                } text-white py-1 px-2 text-center rounded-md hover:bg-blue-700 focus:outline-none transition duration-300`}
              >
                <MdOutlineRemoveRedEye className="w-5 h-5" />
              </button>

              <p>{value.fileName}</p>
              {previewUrl == null && value.fileMissing != null && (
                <div className="ml-10 p-2 rounded-md flex items-center bg-red-500 hover:bg-red-600">
                  <p className="">Missing Found!</p>
                </div>
              )}
              {value.orNumbers.length > 5 && (
                <span
                  className="hover:bg-blue-700 transition duration-200 cursor-pointer h-10 rounded-md items-center justify-center flex"
                  onClick={() => {
                    const newTotalORNumbers = [...totalORNumbers];
                    const filteredIndex = totalORNumbers.findIndex(
                      (item) => item.fileName === value.fileName
                    );
                    newTotalORNumbers[filteredIndex].showAll =
                      !newTotalORNumbers[filteredIndex].showAll;
                    setTotalORNumbers(newTotalORNumbers);
                  }}
                >
                  <span
                    className={`${
                      (value.orNumbers.length > 5) &
                      (previewIndex != null) &
                      (previewUrl != null)
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

                    for (let i = 0; i < totalORNumbers.length; i++) {
                      totalORNumbers[i].showAll = false;
                    }
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
            .slice(0, value.showAll ? value.orNumbers.length : 5)
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
          <tr className={`${value.orNumbers.length > 5 ? "" : "hidden"}`}>
            <td className="border-b border-gray-200 py-2 px-4 text-sm text-gray-700">
              {value.orNumbers.length > 5
                ? value.showAll
                  ? ""
                  : "More..."
                : ""}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ))}
            </div>
          ) : null}
        </div>
      )}

      {previewUrl && (
        <div
          className={`mr-5 mt-4 w-full flex flex-row gap-2 items-center ${
            previewUrl ? "" : "hidden"
          }`}
        >
          <iframe
            src={previewUrl}
            title="File Preview"
            className={`w-full border border-gray-300 rounded-md text-center`}
            style={{ height: `${height}px` }}
          ></iframe>
          {missingUrl && 
          <iframe
            src={missingUrl}
            title="File Preview"
            className={`w-full border border-gray-300 rounded-md text-center`}
            style={{ height: `${height}px` }}
          ></iframe>}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
