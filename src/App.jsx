import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebsiteRoutes from './routes/websiteRoutes';

const App = () => (
    <Router>
        <Routes>
            {/* Public routes */}
            <Route path="/*" element={<WebsiteRoutes />} />
        </Routes>
    </Router>
);

export default App;
