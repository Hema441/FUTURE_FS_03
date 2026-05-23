import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLinkHref = (item) => {
        return isHomePage ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`;
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isSticky ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-[#1b4332]">
                    AURA<span className="text-[#d4af37]">WELLNESS</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center">
                    {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((item) => (
                        <a 
                            key={item} 
                            href={getLinkHref(item)} 
                            className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                                isSticky ? 'text-gray-700 hover:text-[#d4af37]' : 'text-white hover:text-[#d4af37]'
                            }`}
                        >
                            {item}
                        </a>
                    ))}
                    <Link 
                        to="/my-bookings" 
                        className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                            isSticky ? 'text-gray-700 hover:text-[#d4af37]' : 'text-white hover:text-[#d4af37]'
                        }`}
                    >
                        Portal
                    </Link>
                    <Link 
                        to="/admin" 
                        className="text-xs uppercase tracking-widest font-bold text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/20 hover:bg-[#d4af37] hover:text-white transition-all"
                    >
                        Admin
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div 
                    className={`md:hidden cursor-pointer ${isSticky || !isHomePage ? 'text-gray-800' : 'text-white'}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white absolute top-full left-0 w-full p-8 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top duration-300">
                    {['Home', 'About', 'Services', 'Gallery', 'Contact'].map((item) => (
                        <a 
                            key={item} 
                            href={getLinkHref(item)} 
                            onClick={() => setIsMenuOpen(false)} 
                            className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-[#d4af37] transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                    <Link 
                        to="/my-bookings" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-[#d4af37] transition-colors"
                    >
                        Client Portal
                    </Link>
                    <Link 
                        to="/admin" 
                        onClick={() => setIsMenuOpen(false)} 
                        className="text-sm font-bold uppercase tracking-wider text-[#d4af37] font-semibold"
                    >
                        Admin Dashboard
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
