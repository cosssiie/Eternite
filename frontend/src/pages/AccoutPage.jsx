import React, { useState } from "react";
import TitleHeader from "../components/TitleHeader";

function AccountPage() {
    const [activeTab, setActiveTab] = useState("My archive");

    const categories = ["My archive", "Favorites", "Settings"];

    return (
        <div className="account-page-container">
            <TitleHeader title="Account" />

            <div className="account-container">
                <div className="account-info">
                    <span className="account-username" id="nav">@username</span>

                    <nav className="account-nav">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className="acc-nav-link"
                                id={activeTab === cat ? "nav-selected" : "nav"}
                                onClick={() => setActiveTab(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="account-content"></div>
            </div>
        </div>
    );
}

export default AccountPage;