import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TitleHeader from "../components/TitleHeader";
import PublicationList from "../components/PublicationList";
import ProfileSettings from "../components/ProfileSettings";
import { publications } from "../api/Publication";
import { users } from "../api/user";
import { useFavourites } from '../context/FavouritesContext';

function AccountPage() {
    const { favouriteIds } = useFavourites();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "My archive";

    const [myPublications, setMyPublications] = useState([]);
    const [favPublications, setFavPublications] = useState([]);
    const [loading, setLoading] = useState(false);

    const categories = ["My archive", "Favorites", "Settings"];
    const navigate = useNavigate();

    const handleTabChange = (tabName) => {
        setSearchParams({ tab: tabName });
    };

    useEffect(() => {
        const loadAccountData = async () => {
            setLoading(true);
            try {
                if (activeTab === "My archive") {
                    const data = await publications.getMyPublications();
                    setMyPublications(data);
                } else if (activeTab === "Favorites") {
                    const data = await users.getFavourites();
                    setFavPublications(data);
                }
            } catch (err) {
                console.error("Error loading account data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadAccountData();
    }, [activeTab]);

    return (
        <div className="account-page-container">
            <TitleHeader title="Account" />
            <div className="account-info">
                <nav className="account-nav">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className="acc-nav-link"
                            id={activeTab === cat ? "nav-selected" : "nav"}
                            onClick={() => handleTabChange(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="account-container">
                <div className="account-content">
                    {activeTab === "My archive" && (
                        loading ? (
                            <p className="main-loader" id="button">Loading archive...</p>
                        ) : (
                            <>
                                <button className="submit-button" id="nav"
                                    onClick={() => navigate('/publication/create')}
                                    style={{ marginBottom: '2rem', marginTop: '2rem' }}>
                                    + NEW PUBLICATION
                                </button>
                                <PublicationList publications={myPublications} />

                            </>
                        )
                    )}

                    {activeTab === "Favorites" && (
                        loading ? (
                            <p className="main-loader" id="button">Loading favorites...</p>
                        ) : (
                            <PublicationList
                                publications={favPublications.filter(pub =>
                                    favouriteIds.includes(String(pub._id || pub.id))
                                )}
                            />
                        )
                    )}

                    {activeTab === "Settings" && (
                        loading ? (
                            <p className="main-loader" id="button">Profile settings will be here soon...</p>
                        ) : (
                            <ProfileSettings />
                        )
                    )}
                </div>
            </div>
        </div >
    );
}

export default AccountPage;