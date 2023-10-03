import axios from "axios";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { RotatingLines } from "react-loader-spinner";

import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [filterdCustomers, setFilterdCustomers] = useState([]);

  async function getCustomers() {
    const { data } = await axios.get(`http://localhost:5000/customers`);
    // console.log(data);
    setCustomers(data);
  }

  const returnPie = (customer) => {
    // console.log(customer);
    let totalIncom = customer.transaction
      .map((trans) => trans.income)
      .reduce((total, current) => total + current);

    let totalWithdraw = customer.transaction
      .map((trans) => trans.withdraw)
      .reduce((total, current) => total + current);

    // console.log(totalIncom, totalWithdraw, totalNet);

    const data = {
      labels: ["Income", "Withdraw"],
      datasets: [
        {
          // label: ["total income", "total Transactions"],
          data: [totalIncom, totalWithdraw],
          backgroundColor: ["tomato", "teal"],
        },
      ],
    };
    const options = {};

    return <Pie className="draw" data={data} options={options} />;
  };

  function searchCustomer(e) {
    const value = e.target.value;

    if (isNaN(value)) {
      // if number ==> false
      // if string ==> true
      const filterCustomers = customers.filter((customer) =>
        customer.name.includes(value.toLowerCase())
      );
      // console.log(filterCustomers);
      setFilterdCustomers(filterCustomers);
    } else if (value !== "") {
      const filterCustomers = customers.filter((customer) => {
        return (
          customer.transaction[0].income === +value ||
          customer.transaction[1].income === +value ||
          customer.transaction[2].income === +value
        );
      });

      setFilterdCustomers(filterCustomers);
    }
  }

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <>
      {customers.length > 0 ? (
        <div className="container py-5 text-center">
          <h1 className="mb-4 bg-primary text-white p-2 text-center fw-bold rounded-3">
            User Transaction Flow
          </h1>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by Name or Income"
            onChange={(e) => searchCustomer(e)}
          />
          <Table striped bordered>
            <thead>
              <tr>
                <th className="bg-primary text-white">
                  <span>ID</span>
                </th>
                <th className="text-primary fs-5">Name</th>
                <th className="text-primary fs-5">Chart</th>
                <th className="text-primary fs-5">
                  Net Transaction For Last 3 Days
                </th>
              </tr>
            </thead>
            <tbody>
              {filterdCustomers.length > 0
                ? filterdCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td className="fw-bold text-capitalize">
                        {customer.name}
                      </td>
                      <td className="draw" style={{ width: "230px" }}>
                        {returnPie(customer)}
                      </td>
                      {/* <td>{calcNet(customer.transaction)}</td> */}
                      <td>
                        <div className="all d-flex justify-content-evenly py-3">
                          {" "}
                          <div className="income">
                            <h5 className="text-primary fw-bold mb-2">
                              All Income
                            </h5>
                            <hr />
                            {customer.transaction.map((trans) => (
                              <div key={trans.day}>
                                <p className="text-start">
                                  day {trans.day} {"==>"}{" "}
                                  <span className="text-danger fw-bold">
                                    {trans.income}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="withdraw">
                            <h5 className="text-primary fw-bold mb-2">
                              All Withdraw
                            </h5>
                            <hr />
                            {customer.transaction.map((trans) => (
                              <div key={trans.day}>
                                <p className="text-start">
                                  day {trans.day} {"==>"}{" "}
                                  <span className="text-danger fw-bold">
                                    {trans.withdraw}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                : customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td className="fw-bold text-capitalize">
                        {customer.name}
                      </td>
                      <td className="draw" style={{ width: "230px" }}>
                        {returnPie(customer)}
                      </td>
                      {/* <td>{calcNet(customer.transaction)}</td> */}
                      <td>
                        <div className="all d-flex justify-content-evenly py-3">
                          {" "}
                          <div className="income">
                            <h5 className="text-primary fw-bold mb-2">
                              All Income
                            </h5>
                            <hr />
                            {customer.transaction.map((trans) => (
                              <div key={trans.day}>
                                <p className="text-start">
                                  day {trans.day} {"==>"}{" "}
                                  <span className="text-danger fw-bold">
                                    {trans.income}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="withdraw">
                            <h5 className="text-primary fw-bold mb-2">
                              All Withdraw
                            </h5>
                            <hr />
                            {customer.transaction.map((trans) => (
                              <div key={trans.day}>
                                <p className="text-start">
                                  day {trans.day} {"==>"}{" "}
                                  <span className="text-danger fw-bold">
                                    {trans.withdraw}
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="position-absolute d-flex justify-content-center align-items-center top-0 bottom-0 start-0 end-0">
          <RotatingLines
            strokeColor="blue"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
    </>
  );
}
