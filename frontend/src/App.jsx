import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WikiPages, Home, BuildingPage } from './pages';
import {WikiHeader} from "./components";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <WikiHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page" element={<WikiPages />} />
          <Route path="*" element={<BuildingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;