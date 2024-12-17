import React from 'react';
import Footer from "./Footer";
import Header from "./Header";

const WebsiteLayout = ({ children }) => {
    return (
        <div className="md:w-full">
            <Header/>
            <main className="container mx-auto px-1 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default WebsiteLayout;
