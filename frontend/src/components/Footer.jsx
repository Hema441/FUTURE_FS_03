import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#111] text-white py-20">
            <div className="container">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 tracking-tighter">AURA<span className="text-[#d4af37]">WELLNESS</span></h3>
                        <p className="text-gray-400 max-w-sm mb-8">
                            Premium holistic care for the modern individual. We believe in beauty that begins with wellness and health that radiates from within.
                        </p>
                        <div className="flex gap-4 text-2xl">
                            <a href="#" className="hover:text-[#d4af37] transition-all">FB</a>
                            <a href="#" className="hover:text-[#d4af37] transition-all">IG</a>
                            <a href="#" className="hover:text-[#d4af37] transition-all">TW</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white">Our Philosophy</a></li>
                            <li><a href="#" className="hover:text-white">Services & Pricing</a></li>
                            <li><a href="#" className="hover:text-white">The Sanctuary</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Join our community for wellness tips.</p>
                        <div className="flex bg-white/5 p-1 rounded-lg">
                            <input type="email" placeholder="Email" className="bg-transparent p-2 outline-none w-full text-sm" />
                            <button className="bg-[#d4af37] px-4 py-2 rounded-md text-xs font-bold">JOIN</button>
                        </div>
                    </div>
                </div>
                <div className="border-top border-white/10 pt-8 text-center text-gray-500 text-xs tracking-widest">
                    &copy; 2026 AURA WELLNESS CENTER. ALL RIGHTS RESERVED.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
