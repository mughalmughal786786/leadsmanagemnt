import React, { useEffect, useState } from "react";
import { invoiceAPI, projectAPI } from "../services/api";
import "./Invoices.css";

const Invoices = () => {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [form, setForm] = useState({
    project: "",
    clientName: "",
    itemName: "",
    qty: 1,
    price: "",
    issueDate: "",
    dueDate: "",
    status: "Pending",
  });

  useEffect(() => {
    loadProjects();
    loadInvoices();
  }, []);

  const loadProjects = async () => {
    const res = await projectAPI.getAllProjects();
    setProjects(res.data || []);
  };

  const loadInvoices = async () => {
    const res = await invoiceAPI.getInvoices();
    setInvoices(res.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createInvoice = async () => {
    try {
      const subTotal = form.qty * form.price;

      const payload = {
        project: form.project,
        clientName: form.clientName,
        items: [
          {
            name: form.itemName,
            quantity: Number(form.qty),
            price: Number(form.price),
            total: subTotal,
          },
        ],
        subTotal,
        tax: 0,
        discount: 0,
        totalAmount: subTotal,
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        status: form.status,
      };

      await invoiceAPI.createInvoice(payload);
      alert("Invoice created successfully");
      loadInvoices();
    } catch (err) {
  console.error("Invoice error:", err.response?.data || err);
  alert(err.response?.data?.message || "Invoice creation failed");
}
  };

  return (
    <div className="invoice-page">
      <h1>Invoices</h1>
      <p className="sub">Create & manage invoices</p>

      {/* CREATE CARD */}
      <div className="invoice-card">
        <h3>Create Invoice</h3>

        <div className="grid">
          <select name="project" onChange={handleChange} required>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            name="clientName"
            placeholder="Client Name"
            onChange={handleChange}
            required
          />

          <input
            name="itemName"
            placeholder="Item / Service"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="qty"
            placeholder="Qty"
            onChange={handleChange}
            required
            min="1"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
            min="0"
          />

          <input type="date" name="issueDate" onChange={handleChange} />
          <input type="date" name="dueDate" onChange={handleChange} required />

          <select name="status" onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <button onClick={createInvoice}>Create Invoice</button>
      </div>

      {/* LIST */}
      <div className="invoice-table">
        <h3>All Invoices</h3>
        {invoices.length === 0 ? (
          <p>No invoices yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i._id}>
                  <td>{i.clientName}</td>
                  <td>${i.totalAmount}</td>
                  <td>{i.status}</td>
                  <td>{new Date(i.dueDate).toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Invoices;
