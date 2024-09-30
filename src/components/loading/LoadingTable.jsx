
const LoadingTable = ({ darkMode }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full divide-y divide-gray-200">
        <thead className="dark:border-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
            </th>
            <th
              scope="col"
              className="md:block hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
            </th>
            <th
              scope="col"
              className="md:block hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div className="animate-pulse bg-gray-300 h-4 w-24 rounded"></div>
            </th>

            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody className="dark:border-gray-600 divide-y divide-gray-200">
          {Array.from({ length: 12 }).map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="animate-pulse bg-gray-300 h-6 w-full rounded"></div>
              </td>
              <td className="md:block hidden px-6 py-4 whitespace-nowrap">
                <div className="animate-pulse bg-gray-300 h-6 w-full rounded"></div>
              </td>
              <td className="md:block hidden px-6 py-4 whitespace-nowrap">
                <div className="animate-pulse bg-gray-300 h-6 w-full rounded"></div>
              </td>

              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoadingTable;
