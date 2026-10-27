
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NewRythu } from "../components/NewRythu";
import { RythuluTable } from "../components/RythuluTable";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
const [rythulu, setRythulu] = useState([]);
const [showRythuluTable, setShowRythuluTable] = useState(false);
const [thisMonthRythulu, setThisMonthRythulu] = useState(0);
const [thisMonthPurchasedRythulu, setThisMonthPurchasedRythulu] = useState(0);
const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
const [overallTotalEarnings, setOverallTotalEarnings] = useState(0);
// Firebase nunchi farmers fetch cheyyadam


const fetchRythulu = async () => {
  try {
    const snapshot = await getDocs(collection(db, "rythulu"));

    const farmers = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setRythulu(farmers);

    const now = new Date();
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const getDate = (value) => {
      if (!value) return null;

      if (typeof value.toDate === "function") {
        return value.toDate();
      }

      if (value instanceof Date) {
        return value;
      }

      if (typeof value === "string") {
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        const date = match
          ? new Date(
              Number(match[1]),
              Number(match[2]) - 1,
              Number(match[3])
            )
          : new Date(value);

        return Number.isNaN(date.getTime()) ? null : date;
      }

      if (typeof value === "object" && value.seconds != null) {
        return new Date(value.seconds * 1000);
      }

      if (typeof value === "number") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
      }

      return null;
    };

    // ఈ నెలలో order వచ్చిన రైతులు
    const currentMonthFarmers = farmers.filter((farmer) => {
      const date = getDate(farmer.orderReceivedDate);

      return (
        date &&
        date >= monthStart &&
        date < nextMonthStart
      );
    });

    // ఈ నెలలో payment complete అయిన రైతులు
    const purchasedFarmers = currentMonthFarmers.filter(
      (farmer) =>
        String(farmer.paymentStatus ?? "")
          .trim()
          .toLowerCase() === "yes"
    );

    // Earnings calculation
    const earnings = purchasedFarmers.reduce((total, farmer) => {
      const amount = Number(
        farmer.finalAmount ?? farmer.totalAmount ?? 0
      );

      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const paidFarmers = farmers.filter(
  (farmer) =>
    String(farmer.paymentStatus ?? "")
      .trim()
      .toLowerCase() === "yes"
);

const totalEarnings = paidFarmers.reduce((total, farmer) => {
  const amount = Number(
    farmer.finalAmount ?? farmer.totalAmount ?? 0
  );

  return total + (Number.isFinite(amount) ? amount : 0);
}, 0);


    setThisMonthRythulu(currentMonthFarmers.length);
    setThisMonthPurchasedRythulu(purchasedFarmers.length);
    setThisMonthEarnings(earnings);
    setOverallTotalEarnings(totalEarnings);
    console.log("All farmers:", farmers.length);
    console.log("This month farmers:", currentMonthFarmers.length);
    console.log("This month purchased farmers:", purchasedFarmers.length);
    console.log("This month earnings:", earnings);
  } catch (error) {
    console.error("Farmers fetch error:", error);
    alert("Farmers load cheyyadam lo error vachindi.");
  }
};

useEffect(() => {
  fetchRythulu();
}, []);

const handleSaveRythu = () => {
  fetchRythulu();
};

  return (
    <div className="container dashboard">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          {/* Dashboard heading kavali ante ikkada add cheyyandi */}
        </div>

        <button
          type="button"
          className="btn btn-success px-4 py-2 rounded-3"
          data-bs-toggle="modal"
          data-bs-target="#newFarmerModal"
        >
          <i className="bi bi-person-plus me-2"></i>
          New Rythu
        </button>
      </div>

      <div className="row g-4">

        {/* 1. Total Rythulu */}
        <div className="col-12 col-sm-6 col-xl-4">
        <div
            className="stat-card card-green"
            role="link"
            tabIndex={0}
            onClick={() => {
            window.location.href = "/rythulu";
                            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                window.location.href = "/rythulu";
                }
            }}
            >
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>

            <div className="stat-number">{rythulu.length}</div>
            <div className="stat-title">Total Rythulu</div>
            <div className="stat-description">
              Registered farmers
            </div>

            <div className="stat-footer">
              <span>
                {showRythuluTable ? "Hide farmer details" : "View farmer details"}
              </span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 2. New Rythulu */}
        <div className="col-12 col-sm-6 col-xl-4">
         <div
            className="stat-card card-blue"
            role="button"
            tabIndex={0}
            onClick={() => {
                window.location.href = "/this-month-rythulu";
            }}
            >
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-person-plus-fill"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>
            <div className="stat-number">{thisMonthRythulu}</div>
            <div className="stat-title">This Month Rythulu</div>
            <div className="stat-description">
              this month registered farmers
            </div>
            <div className="stat-footer">
              <span>View This Month Farmers</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 3. Purchase Chesina Rythulu */}
        
<div className="col-12 col-sm-6 col-xl-4">
  <Link
    to="/this-month-purchased-rythulu"
    className="text-decoration-none text-reset d-block h-100"
  >
    <div
      className="stat-card card-orange h-100"
      role="link"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between">
        <div className="stat-icon">
          <i className="bi bi-bag-check-fill"></i>
        </div>

        <i className="bi bi-arrow-up-right fs-5"></i>
      </div>

      <div className="stat-number">{thisMonthPurchasedRythulu}</div>

      <div className="stat-title">
        This Month Purchased Rythulu
      </div>

      <div className="stat-description">
        Farmers with Payment Status Yes
      </div>

      <div className="stat-footer">
        <span>View purchase details</span>
        <i className="bi bi-arrow-right"></i>
      </div>
    </div>
  </Link>
</div>

        {/* 4. Total Earnings */}
       <div className="col-12 col-sm-6 col-xl-4">
  <Link
    to="/this-month-total-earnings"
    className="text-decoration-none"
    style={{ color: "inherit" }}
  >
    <div
      className="stat-card card-purple"
      role="button"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between">
        <div className="stat-icon">
          <i className="bi bi-currency-rupee"></i>
        </div>

        <i className="bi bi-arrow-up-right fs-5"></i>
      </div>

      <div className="stat-number">
        ₹{thisMonthEarnings.toLocaleString("en-IN")}
      </div>

      <div className="stat-title">
        This Month Total Earnings
      </div>

      <div className="stat-description">
        Total Products Sales Amount
      </div>

      <div className="stat-footer">
        <span>View Sales</span>
        <i className="bi bi-arrow-right"></i>
      </div>
    </div>
  </Link>
</div>

        {/* 5. Follow-up Pending */}
        
<div className="col-12 col-sm-6 col-xl-4">
  <Link
    to="/overall-total-earnings"
    className="text-decoration-none"
    style={{ color: "inherit" }}
  >
    <div
      className="stat-card card-red"
      role="button"
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex justify-content-between">
        <div className="stat-icon">
          <i className="bi bi-currency-rupee"></i>
        </div>

        <i className="bi bi-arrow-up-right fs-5"></i>
      </div>

      <div className="stat-number">
        ₹{overallTotalEarnings.toLocaleString("en-IN")}
      </div>

      <div className="stat-title">
        Overall Total Earnings
      </div>

      <div className="stat-description">
        Total sales amount from all paid orders
      </div>

      <div className="stat-footer">
        <span>View All Sales</span>
        <i className="bi bi-arrow-right"></i>
      </div>
    </div>
  </Link>
</div>

        {/* 6. Interested Rythulu */}
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="stat-card card-teal">
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-hand-thumbs-up-fill"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>
            <div className="stat-number">52</div>
            <div className="stat-title">Interested Rythulu</div>
            <div className="stat-description">
              Interested in purchasing
            </div>
            <div className="stat-footer">
              <span>View interested farmers</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

      </div>

      {/* Total Rythulu table separate component */}
      {showRythuluTable && <RythuluTable />}

      {/* New Rythu registration modal */}
      <NewRythu onSaveRythu={handleSaveRythu} />
    </div>
  );
};