import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };
    return (
        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <div className="navbar-brand d-flex flex-grow-1">
                    <Link to="/Manager_home" className="navbar-brand" style={{ "color": "white", "letterSpacing": "2px", "fontWeight": "800", "fontFamily": "Verdana, Geneva, sans-serif" }}>Manager Dashboard</Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end text-bg-dark" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel"> Manager Dashboard</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <Link to='/Manager_requests' className='nav-link'>Test Requests</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Manager_work' className='nav-link'>Work in Progress</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Manager_testers' className='nav-link'>Testers Available</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Manager_customers' className='nav-link'>Customers</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Manager_completed' className='nav-link'>Completed</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    Logout
                </button>


            </div>
        </nav>
    )
}

export default Header;
