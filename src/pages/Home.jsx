
import React, { useState, useEffect } from "react";
import { NewRythu } from "../components/NewRythu";
import { RythuluTable } from "../components/RythuluTable";
import { db } from "../firebase/firebase";
import { collection, getDocs,Timestamp  } from "firebase/firestore";

export const Home = () => {
  const [rythulu, setRythulu] = useState([]);
const [showRythuluTable, setShowRythuluTable] = useState(false);
const [thisMonthRythulu, setThisMonthRythulu] = useState(0);

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

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthFarmers = farmers.filter((farmer) => {
      const rawDate = farmer.orderReceivedDate;

      if (!rawDate) return false;

      let farmerDate;

      if (typeof rawDate.toDate === "function") {
        farmerDate = rawDate.toDate();
      } else if (rawDate instanceof Date) {
        farmerDate = rawDate;
      } else if (typeof rawDate === "string") {
        // YYYY-MM-DD ni local date ga convert cheyyadam
        const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (match) {
          farmerDate = new Date(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3])
          );
        } else {
          farmerDate = new Date(rawDate);
        }
      } else {
        return false;
      }

      if (Number.isNaN(farmerDate.getTime())) return false;

      return (
        farmerDate.getMonth() === currentMonth &&
        farmerDate.getFullYear() === currentYear
      );
    });

    setThisMonthRythulu(currentMonthFarmers.length);
  } catch (error) {
    console.error("Farmers fetch error:", error);
  }
};

// Page load / refresh ayinappudu
useEffect(() => {
  fetchRythulu();
}, []);

// New farmer save ayyaka count refresh
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
              <span>View new farmers</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 3. Purchase Chesina Rythulu */}
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="stat-card card-orange">
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-bag-check-fill"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>
            <div className="stat-number">126</div>
            <div className="stat-title">Purchase Chesina Rythulu</div>
            <div className="stat-description">
              Farmers who purchased products
            </div>
            <div className="stat-footer">
              <span>View purchase details</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 4. Discussions */}
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="stat-card card-purple">
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>
            <div className="stat-number">64</div>
            <div className="stat-title">Discussion Chesina Vallu</div>
            <div className="stat-description">
              Farmers contacted or discussed
            </div>
            <div className="stat-footer">
              <span>View discussions</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 5. Follow-up Pending */}
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="stat-card card-red">
            <div className="d-flex justify-content-between">
              <div className="stat-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <i className="bi bi-arrow-up-right fs-5"></i>
            </div>
            <div className="stat-number">38</div>
            <div className="stat-title">Follow-up Pending</div>
            <div className="stat-description">
              Farmers to contact again
            </div>
            <div className="stat-footer">
              <span>View pending follow-ups</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>
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