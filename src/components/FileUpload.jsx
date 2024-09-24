import { useEffect, useState } from "react";

const FileUpload = () => {
  const [fileNames, setFileNames] = useState([]);
  const [missingORNumbers, setMissingORNumbers] = useState([]);
  const [duplicateORNumbers, setDuplicateORNumbers] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState("");
  const [start, setStart] = useState(false);
  const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
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

        let compiledMissingNumbers = `${object[propertyName][0]} from ${object[
          propertyName
        ][1].join(", ")} ${object[propertyName][2] || ""} ${
          object[propertyName][3] || ""
        }`;

        return compiledMissingNumbers;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    console.log("content", content)
    setDownloadUrl(url);
    setAlert(true);
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
  }, [missingORNumbers, fileName, alert]);

  const handleProcessFiles = async () => {
    setMissingORNumbers([]);
    setDuplicateORNumbers([]);
    setDownloadUrl(null);

    const files = document.querySelector('input[type="file"]').files;

    if (!files.length) {
      console.error("No files selected");
      return;
    }
    //const endingNo = prompt("Enter the prefix to search for (e.g., 'OR No.:')");

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();

        reader.onload = (event) => {
          const data = event.target.result;
          let name = file.name;

          // const regex = /OR No\.\s*:(\d+)
          
          // or /OR No\.\s*:(\d+)/g;
          const orNumbers = [];
          //const regex = /OR No.:\s*(\d+)/g;
          //const regexz = new RegExp(`${endingNo}`, "g");


          const endingNo = "OR No.:";
          const regex = new RegExp(`${endingNo}\\s*(\\d+)`, "g");




          let match;
          while ((match = regex.exec(data)) !== null) {
            orNumbers.push(match[1]);
          }

        let maxORNumber = Math.max(...orNumbers);
        let minORNumber = Math.min(...orNumbers);

        console.log(maxORNumber, name);
        orNumbers.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));

        function findMissingNumbers(array) {
          let properties = array;
          let propertiesLength = properties.length;
          const arrayContainer = [];

          for (let i = 0; i < propertiesLength - 1; i++) {
            let current = Number(properties[i]);
            let next = Number(properties[i + 1]);

            if (next - current > 1) {
              for (let j = current + 1; j < next; j++) {
                if (j == current + 1) {
                  arrayContainer.push({
                    missing: [
                      [j],
                      [name],
                      ["Min: " + minORNumber],
                      ["Max:" + maxORNumber],
                    ],
                  });
                } else {
                  arrayContainer.push({ missing: [[j], [name]] });
                }
              }
            }
          }

          return arrayContainer;
        }

        let missingORNumber = findMissingNumbers(orNumbers);

        // Update missingORNumbers state correctly
        setMissingORNumbers((prev) => [...prev, ...missingORNumber]);

        orNumbers.length = 0;
      };

      reader.readAsText(file);
    });

    setTimeout(() =>{ setStart(true);
    }, 3000)
    setLoading(true)

    setTimeout(() => { setLoading(false)}, 3000)
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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

          {fileNames.length > 10 && (
            <p className="text-sm text-gray-500">and more...</p>
          )}
        </ul>

        {start ? (
          <div className="mt-4 w-full flex flex-col">
            {missingORNumbers.length == 0 ? (
              <p className={`text-md text-gray-500 mt-2 text-center`}>
                Not Found
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
                  Export
                </a>
              </>
            )}
          </div>
        ) : loading ? <p className={`text-md text-gray-500 mt-2 text-center`}>Loading...</p> : null}
      </div>
    </div>
  );
};

export default FileUpload;
