
import { Link } from 'react-router-dom';

const Header = ({ toggleDrawer }) => {
    return (
        <header className="bg-dark-blue p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <button onClick={toggleDrawer} className="mr-4 focus:outline-none toggle-button">
                    <svg className="w-6 h-6" fill="none" stroke="#29e6c0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <Link to="/" style={{ width: "25%", height: "auto" }}>
                    <img src="/logo.svg" alt="Logo" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
