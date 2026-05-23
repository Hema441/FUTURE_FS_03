import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import heroImg from '../assets/hero.png';
import serviceImg from '../assets/service.png';
import gallery1 from '../assets/gallery1.png';
import gallery2 from '../assets/gallery2.png';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is your rescheduling and cancellation policy?",
      a: "We appreciate that plans change. You can reschedule or cancel your session up to 24 hours prior to your slot directly through our customer care desk (+1 (234) 567-890) or by emailing hello@aurawellness.com. Confirmations are updated in real-time."
    },
    {
      q: "Are the treatments customized to individual physiological needs?",
      a: "Absolutely. Every luxury care request begins with an in-depth, complimentary consultation with our spa specialists to adapt ingredients, massage pressure levels, and therapy oils specifically for you."
    },
    {
      q: "How does the Client Portal work?",
      a: "By navigating to the Portal tab in the navigation bar, you can instantly look up all active, confirmed, or cancelled appointments using the email address or phone number provided during booking. No passwords needed."
    },
    {
      q: "What should I wear or bring to my first session?",
      a: "We provide plush organic robes, premium slippers, and secure personal lockers in our premium changing suites. For holistic massage and skincare sessions, all accessories are fully prepared so you only need to arrive and relax."
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section id="home" className="h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl animate-in fade-in slide-in-from-bottom duration-1000"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
              Restore Your <br /> <span className="italic font-normal">Natural</span> Balance
            </h1>
            <p className="text-xl mb-10 text-gray-200 tracking-wide max-w-xl">
              A premium sanctuary for holistic healing, medical beauty, and spiritual rejuvenation.
            </p>
            <a href="#contact" className="bg-[#d4af37] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#1b4332] hover:shadow-lg transition-all">
              Book Appointment
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img src={serviceImg} alt="About" className="rounded-2xl shadow-2xl" />
            <div className="absolute -bottom-10 -right-10 bg-[#d4af37] p-10 hidden lg:block rounded-xl">
              <p className="text-white text-5xl font-bold">15+</p>
              <p className="text-white/80 uppercase text-xs tracking-tighter">Years of Excellence</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[#1b4332] text-5xl font-bold mb-8">Crafting Moments <br/> of Pure Serenity</h2>
            <p className="text-gray-600 text-lg mb-6">
              Founded on the principles of holistic harmony, Aura Wellness combines traditional wisdom with cutting-edge medical science to provide an unparalleled healing journey.
            </p>
            <p className="text-gray-600 text-lg mb-10">
              Our specialists are dedicated to personalizing every treatment to your unique physiological needs, ensuring lasting results that radiate from within.
            </p>
            <a href="#contact" className="border-2 border-[#1b4332] text-[#1b4332] px-8 py-3 rounded-full font-bold text-sm hover:bg-[#1b4332] hover:text-white transition-all">
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-[#fdfaf5]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#1b4332] text-5xl font-bold mb-4">Our Signature Care</h2>
            <p className="italic text-gray-500 text-lg">Curated treatments for your mind, body, and spirit.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Holistic Massage", desc: "Deep tissue therapy and organic aromatherapy to release tension.", icon: "✨" },
              { title: "Medical Esthetics", desc: "Advanced skincare using pure organic extracts and modern technology.", icon: "🌿" },
              { title: "Energy Healing", desc: "Ancient techniques to restore your spiritual resonance and energy.", icon: "🧘" }
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center transition-all"
              >
                <div className="text-5xl mb-6">{s.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#1b4332]">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#1b4332] text-5xl font-bold mb-4">The Sanctuary</h2>
            <p className="italic text-gray-500 text-lg">A visual journey through our natural healing spaces and high-end suites.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: gallery1, title: "Wellness Lounge Suite", desc: "A serene lounge where your holistic wellness journey begins." },
              { img: gallery2, title: "Minimalist Treatment Room", desc: "Chambers designed with warm lights and therapeutic stones." },
              { img: heroImg, title: "Sanctuary Steams & Baths", desc: "Thermal pools and organic steam baths for deep detoxification." },
              { img: serviceImg, title: "Esthetics & Skincare Suite", desc: "State-of-the-art medical esthetic and organic botanical spaces." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.03 }}
                className="relative h-80 rounded-3xl overflow-hidden shadow-sm group cursor-pointer border border-gray-100"
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-lg font-bold mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-gray-200 text-xs leading-normal">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#fdfaf5] border-t border-b border-gray-100">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-[#1b4332] text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="italic text-gray-500 text-lg">Curated answers to guide you through your luxury wellness experience.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-base md:text-lg text-[#1b4332] hover:text-[#d4af37] transition-all"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#d4af37] text-2xl font-normal leading-none">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-gray-600 text-sm border-t border-gray-50 leading-relaxed bg-[#fdfaf5]/20 animate-in fade-in duration-300">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Booking */}
      <section id="contact" className="py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-[#1b4332] text-5xl font-bold mb-8">Begin Your Journey</h2>
              <p className="text-lg text-gray-600 mb-12">
                Ready to transform your life? Fill out the form to request a consultation with our wellness experts.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="bg-[#fdfaf5] w-12 h-12 flex items-center justify-center rounded-full text-[#d4af37] border border-[#f5ead6]">📍</div>
                  <p className="font-semibold text-sm">123 Wellness Blvd, Sanctuary City, SC 45678</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-[#fdfaf5] w-12 h-12 flex items-center justify-center rounded-full text-[#d4af37] border border-[#f5ead6]">📞</div>
                  <p className="font-semibold text-sm">+1 (234) 567-890</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-[#fdfaf5] w-12 h-12 flex items-center justify-center rounded-full text-[#d4af37] border border-[#f5ead6]">✉️</div>
                  <p className="font-semibold text-sm">hello@aurawellness.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#fdfaf5] p-10 rounded-3xl shadow-xl border border-gray-100">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
