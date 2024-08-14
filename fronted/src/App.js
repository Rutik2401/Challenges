import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [transaction, setTransaction] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [totalSale, setTotalSale] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState("");
 

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchTransaction = async () => {
    try {
      // Here i am Using Backend Api to Fetch All Response
      const response = await fetch('http://localhost:5000/transaction');
      // response is Converted Into JSON
      const data = await response.json();
      setTransaction(data);
      setFilteredTransactions(data);
      calculateStatistics(data);
    } catch (e) {
      console.log("Error is:" + e);
    }
  };

  const calculateStatistics = (data) => {
    const totalSaleAmount = data.reduce((accu, curTran) => accu + (curTran.sold ? curTran.price : 0), 0);
    const totalSold = data.filter(curTran => curTran.sold).length;
    const totalNotSold = data.filter(curTran => !curTran.sold).length;

    setTotalSale(totalSaleAmount);
    setTotalSoldItems(totalSold);
    setTotalNotSoldItems(totalNotSold);
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);

    if (month === "") {
      setFilteredTransactions(transaction);
      calculateStatistics(transaction); 
    } else {
      const filtered = transaction.filter(tran => new Date(tran.dateOfSale).getMonth() + 1 === parseInt(month));
      setFilteredTransactions(filtered);
      calculateStatistics(filtered); 
    }

    setCurrentPage(1); 
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredTransactions.length / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return (
    <div className="App container mt-4">
      <h1 className='p-3'>Transaction Dashboard</h1>
      <div className='search-select d-flex justify-content-sm-between'>
        <div className='search'>
          <input className="form-control me-2" placeholder="Search Transaction"></input>
        </div>
        <div className='select'>
          <select className="form-select" value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Select Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>
      <table className='table table-striped pb-5'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {(
            currTransactions.map((curTran) => {
              const { id, title, description, price, category, sold, image } = curTran;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{title}</td>
                  <td>{description}</td>
                  <td>{price}</td>
                  <td>{category}</td>
                  <td>{sold ? "Yes" : "No"}</td>
                  <td><img src={image} alt={title} width="60" /></td>
                </tr>
              );
            })
          )}
          
        </tbody>
      </table>

      <div className='pagination'>
        <nav className='d-flex  w-100'>
          <span> Page {currentPage} </span>
          <div className='d-flex justify-content-evenly gap-3'>
            <button className='rounded border-0 bg-white text-dark' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            <button className='rounded border-0 bg-white text-dark' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          </div>
          <p>per Page: {itemsPerPage}</p>
        </nav>
      </div>

      <div className='Statistic mt-4'>
        <p>Total Sale: ${totalSale.toFixed(2)}</p>
        <p>Total Sold Items: {totalSoldItems}</p>
        <p>Total Not Sold Items: {totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default App;
