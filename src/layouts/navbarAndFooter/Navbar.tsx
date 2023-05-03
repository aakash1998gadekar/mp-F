import { NavLink, Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";

export const Navbar = () => {

    const { oktaAuth, authState } = useOktaAuth();
    if (!authState) {
        return (
            <div>Loading.....</div>
        )
    }
    const handleLogout = async () => {
        oktaAuth.signOut()};
    // console.log(authState);
    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className="container-fluid">
                <span className="navbar-brand">Read and Return</span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/home">Home</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className="nav-link" to="/search">Search Books</NavLink>
                        </li>
                        {authState.isAuthenticated && 
                            <li className='nav-item'>
                                <NavLink className="nav-link" to="/shelf">Shelf</NavLink>
                            </li>
                        }
                        {authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' && 
                            <li className='nav-item'>
                                <NavLink className="nav-link" to="/admin">Library Admin Facilities</NavLink>
                            </li>
                        }
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {!authState.isAuthenticated ?
                            <li className='nav-item m-1'>
                                <Link type="button" className="btn btn-outline-light" to="/login">Sign In</Link>
                            </li>
                            :
                            <li className='nav-item m-1'>
                                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                            </li>
                        }

                    </ul>
                </div>
            </div>
        </nav>
    );
}

// navlink vs link in react
// The NavLink is used when you want to highlight a link as active. 
// So, on every routing to a page, the link is highlighted according to the activeClassName .
// Link is for links that need no highlighting.