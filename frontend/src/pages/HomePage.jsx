import CustomerListings from "../components/Home/CustomerListings";
import SheetsDataIntegration from "../components/Home/SheetsDataIntegration";
import StatusCards from "../components/Home/StatusCards";
import Header from "../components/Layout/Header";

function HomePage() {
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

          <SheetsDataIntegration />
          <CustomerListings />
          <StatusCards />
        </div>
      </div>
    </>
    
  );
}

export default HomePage;
