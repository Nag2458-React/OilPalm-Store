import React from 'react'
import { NewRythu } from '../components/NewRythu'

export const Home = () => {
  return (
  <div class="container dashboard">

    
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
      <div>
        {/* <h2 class="dashboard-title mb-2">
          <i class="bi bi-tree-fill text-success me-2"></i>
          Oil Palm Farmer Dashboard
        </h2>
        <p class="dashboard-subtitle mb-0">
          Rythula registration, discussions and purchase details
        </p> */}
      </div>

      <button
  type="button"
  className="btn btn-success px-4 py-2 rounded-3"
  data-bs-toggle="modal"
  data-bs-target="#newFarmerModal"
>
  <i class="bi bi-person-plus me-2"></i>New Rythu
</button>
    </div>

    
    <div class="row g-4">

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-green">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">248</div>
          <div class="stat-title">Total Rythulu</div>
          <div class="stat-description">Registered farmers</div>
          <div class="stat-footer">
            <span>View farmer details</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-blue">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-person-plus-fill"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">42</div>
          <div class="stat-title">New Rythulu</div>
          <div class="stat-description">Recently registered farmers</div>
          <div class="stat-footer">
            <span>View new farmers</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-orange">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-bag-check-fill"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">126</div>
          <div class="stat-title">Purchase Chesina Rythulu</div>
          <div class="stat-description">Farmers who purchased products</div>
          <div class="stat-footer">
            <span>View purchase details</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-purple">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-chat-dots-fill"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">64</div>
          <div class="stat-title">Discussion Chesina Vallu</div>
          <div class="stat-description">Farmers contacted or discussed</div>
          <div class="stat-footer">
            <span>View discussions</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-red">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-clock-history"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">38</div>
          <div class="stat-title">Follow-up Pending</div>
          <div class="stat-description">Farmers to contact again</div>
          <div class="stat-footer">
            <span>View pending follow-ups</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

      
      <div class="col-12 col-sm-6 col-xl-4">
        <div class="stat-card card-teal">
          <div class="d-flex justify-content-between">
            <div class="stat-icon">
              <i class="bi bi-hand-thumbs-up-fill"></i>
            </div>
            <i class="bi bi-arrow-up-right fs-5"></i>
          </div>
          <div class="stat-number">52</div>
          <div class="stat-title">Interested Rythulu</div>
          <div class="stat-description">Interested in purchasing</div>
          <div class="stat-footer">
            <span>View interested farmers</span>
            <i class="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>

    </div>



   <NewRythu />
  </div>
  )
}
