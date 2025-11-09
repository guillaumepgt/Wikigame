import { BrowserRouter, Routes, Route } from "react-router-dom";

import { WikiPages, Home } from './pages';
import {WikiHeader} from "./components";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <WikiHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page" element={<WikiPages />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;