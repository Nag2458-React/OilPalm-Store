
import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const RythuluTable = () => {
  const [rythulu, setRythulu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRythulu = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "rythulu"));

      const farmers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRythulu(farmers);
    } catch (error) {
      console.error("Farmers fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRythulu();
  }, []);

  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <i className="bi bi-people-fill me-2"></i>
          Total Rythulu ({rythulu.length})
        </h5>
      </div>

      <div className="card-body">
        {loading ? (
          <p className="text-center">Loading farmers...</p>
        ) : rythulu.length === 0 ? (
          <p className="text-center text-muted">
            No farmer records found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle">
              <thead className="table-success">
                <tr>
                  <th>S.No</th>
                  <th>Rythu Name</th>
                  <th>Farm Name</th>
                  <th>Acres</th>
                  <th>1 Litre Bottles</th>
                  <th>Kits</th>
                  <th>Mobile</th>
                  <th>Alternate Mobile</th>
                  <th>Order Date</th>
                  <th>Village</th>
                  <th>Mandal</th>
                  <th>District</th>
                  <th>State</th>
                  <th>PIN Code</th>
                  <th>Full Address</th>
                  <th>Discussion Status</th>
                  <th>Transportation</th>
                  <th>Payment Status</th>
                  <th>Next Follow-up</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {rythulu.map((farmer, index) => (
                  <tr key={farmer.id}>
                    <td>{index + 1}</td>
                    <td>{farmer.rythuName || "-"}</td>
                    <td>{farmer.farmName || "-"}</td>
                    <td>{farmer.acres || "-"}</td>
                    <td>{farmer.bottles || "-"}</td>
                    <td>{farmer.kits || "-"}</td>
                    <td>{farmer.mobile || "-"}</td>
                    <td>{farmer.alternateMobile || "-"}</td>
                    <td>{farmer.orderReceivedDate || "-"}</td>
                    <td>{farmer.village || "-"}</td>
                    <td>{farmer.mandal || "-"}</td>
                    <td>{farmer.district || "-"}</td>
                    <td>{farmer.state || "-"}</td>
                    <td>{farmer.pinCode || "-"}</td>
                    <td>{farmer.fullAddress || "-"}</td>
                    <td>{farmer.discussionStatus || "-"}</td>
                    <td>{farmer.transportation || "-"}</td>
                    <td>{farmer.paymentStatus || "-"}</td>
                    <td>{farmer.nextFollowUpDate || "-"}</td>
                    <td>{farmer.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};