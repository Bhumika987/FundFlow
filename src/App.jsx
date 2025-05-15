import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomeComponent';
import CreateCampaignComponent from './components/CreateCampaignComponent';
import { Toaster } from 'react-hot-toast';
import { MetaMaskProvider } from './hooks/useMetamask';
import CampaignsComponent from './components/CampaignsComponent';
import NavbarComponent from './NavbarComponent';
import CampaignsListComponent from './components/CampaignsListComponent';

function App() {
  return (
    <MetaMaskProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <NavbarComponent/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-campaign" element={<CreateCampaignComponent />} />
            <Route path="/campaigns" element={<CampaignsListComponent />} />
            <Route path="/campaign/:address" element={<CampaignsComponent />} />
            {/* <Route path="/campaign/:address" element={<CampaignComponent />} /> */}
          </Routes>
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </MetaMaskProvider>
  );
}

export default App;