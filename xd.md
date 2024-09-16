console.log(worksheet);

    // Apply styles to the worksheet
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      alignment: { horizontal: "center", vertical: "center" }
    };

    const bodyStyle = {
      font: { color: { rgb: "000000" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      alignment: { horizontal: "left", vertical: "center" }
    };

    const totalColumns = 10;

    // Apply styles to the header row (row 1)
    const headers = Object.keys(data[0]);
    for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      const headerValue = headers[colIndex] || `Column ${colIndex + 1}`; // Default header if undefined
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: headerValue };
      }
      worksheet[cellAddress].s = headerStyle; // Set style to header cell
    }

    // Apply styles to the rest of the rows
    data.forEach((row, rowIndex) => {
      for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
        const cellValue = row[headers[colIndex]] || ''; // Default value if undefined
        if (!worksheet[cellAddress]) {
          worksheet[cellAddress] = { v: cellValue };
        }
        worksheet[cellAddress].s = bodyStyle; // Set style to body cells
      }
    });

    // Dynamically calculate the column widths based on content
    const colWidths = headers.map((header, colIndex) => {
      let maxLength = header.length; // Start with header length
      data.forEach(row => {
        const cellValue = row[header] ? row[header].toString() : '';
        maxLength = Math.max(maxLength, cellValue.length); // Compare with each cell length
      });
      return { wch: maxLength + 2 }; // Add some padding (2 characters)
    });

    worksheet['!cols'] = colWidths; // Set the column widths


    
//axios.defaults.baseURL = "https://tasktracker-server.vercel.app";