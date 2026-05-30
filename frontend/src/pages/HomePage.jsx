import { useState } from "react";

import CustomerListings from "../components/Home/CustomerListings";
import SheetsDataIntegration from "../components/Home/SheetsDataIntegration";
import StatusCards from "../components/Home/StatusCards";
import Header from "../components/Layout/Header";

function HomePage() {
  const [customerData, setCustomerData] = useState(null);

  const passData = (customer) => {
    console.log("Customer data from home page: " + customer);
    setCustomerData(customer);
  }
  return (
    <>
      {/* Change background to darker colour */}
      <div className="flex h-screen bg-base-200">
        {/* Add spacing in header - move to the right slightly */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <Header
              h1="Customer Listings"
              p="Import customer details, manage customers and update status"
            />
          </div>
          {/* Pass handler function as prop to button */}
          <SheetsDataIntegration onButtonClick={passData} />
          {/* Pass actual state value as prop to table */}
          <CustomerListings customerData={customerData}/>
          <StatusCards />
        </div>
      </div>
    </>
    
  );
}

export default HomePage;
