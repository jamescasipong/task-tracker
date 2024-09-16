import React, { useState } from 'react';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(['Assignment', 'Project']);
  const [newTask, setNewTask] = useState({
    name: '',
    category: 'Assignment',
    date: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const maxPaginationButtons = 4; // Maximum number of pagination buttons to display


  const addTask = () => {
    if (newTask.name.trim() !== '') {
      setTasks([...tasks, newTask]);

      
      setNewTask({
        name: '',
        category: 'Assignment',
        date: new Date().toISOString().split('T')[0],
      });

    }
  };


  const handleTaskNameChange = (e) => {
    setNewTask({ ...newTask, name: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setNewTask({ ...newTask, category: e.target.value });
  };

  const handleDateChange = (e) => {
    setNewTask({ ...newTask, date: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredTasks = filter
    ? tasks.filter((task) => task.category === filter)
    : tasks;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate pagination buttons
  const startPage = Math.max(1, currentPage - Math.floor(maxPaginationButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPaginationButtons - 1);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Task Tracker</h2>
      <div className="mb-4">
        <input
          
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={handleTaskNameChange}
          className="border border-gray-300 rounded px-2 py-1 mr-2  sm:w-[50%]"
        />
        <select
          value={newTask.category}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTask.date}
          onChange={handleDateChange}
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-bold">
          Filter by Category:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b w-1/3 text-center">Task</th>
              <th className="py-2 px-4 border-b w-1/3 text-center">Category</th>
              <th className="py-2 px-4 border-b w-1/3 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4 border-b text-center">{task.name}</td>
                <td className="py-2 px-4 border-b text-center">{task.category}</td>
                <td className="py-2 px-4 border-b text-center">{task.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        {totalPages > 1 && (
          <>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const pageNumber = startPage + index;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskTracker;
