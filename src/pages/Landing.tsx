
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AuthService from '../services/auth';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();
  
  const handleSignInClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0A2342] to-[#121212]">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png" 
            alt="NURA Logo" 
            className="h-12 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button 
              className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
              <Link to="/register">
                <Button className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C]">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      
      {/* Hero */}
      <section className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            <span className="inline-block text-[#5EF38C] pixel-font">NURA</span>
            <br />
            <span className="inline-block">Cognitive Training</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Train your brain with engaging cognitive exercises designed by clinical psychologists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] px-8 py-6"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] px-8 py-6">
                  Get Started
                </Button>
              </Link>
            )}
            <a href="#features">
              <Button size="lg" variant="outline" className="border-[#5EF38C] text-[#5EF38C] hover:bg-[#5EF38C]/20 px-8 py-6">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <motion.img 
            src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png"
            alt="NURA Hero" 
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
          />
        </div>
      </section>
      
      {/* About Us */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-[#5EF38C] pixel-font" id="about">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                NURA is a cognitive training platform developed by leading neuropsychologists and game designers. We combine clinical expertise with engaging gameplay to create an effective brain training experience.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                Our mission is to make cognitive assessment and training accessible and enjoyable for everyone, while providing powerful tools for clinicians to monitor and analyze patient progress.
              </p>
              <p className="text-lg text-gray-300">
                Founded in 2023, we've already helped thousands of users improve their cognitive abilities through our science-backed exercises.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">5000+</h3>
                    <p className="text-gray-400">Active Users</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">12</h3>
                    <p className="text-gray-400">Cognitive Games</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">98%</h3>
                    <p className="text-gray-400">User Satisfaction</p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-3xl font-bold text-[#5EF38C]">4</h3>
                    <p className="text-gray-400">Cognitive Domains</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-[#5EF38C] pixel-font">Game Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Attention Training</h3>
                <p className="text-gray-400 flex-grow">
                  Enhance focus and concentration with games that challenge your sustained and selective attention abilities.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-3/4 pixel-progress"></div>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">🎮</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Memory Games</h3>
                <p className="text-gray-400 flex-grow">
                  Improve short and long-term memory with engaging pattern recognition and recall challenges.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-2/3 pixel-progress"></div>
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Executive Function</h3>
                <p className="text-gray-400 flex-grow">
                  Develop problem-solving, planning, and reasoning skills through adaptive puzzle challenges.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-4/5 pixel-progress"></div>
                </div>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Progress Tracking</h3>
                <p className="text-gray-400 flex-grow">
                  Monitor your cognitive improvement with detailed analytics and performance metrics.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-4/5 pixel-progress"></div>
                </div>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Clinician Dashboard</h3>
                <p className="text-gray-400 flex-grow">
                  Powerful tools for professionals to assess and monitor patient cognitive performance.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-3/4 pixel-progress"></div>
                </div>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
              <div className="bg-black p-6 rounded-lg h-full flex flex-col">
                <div className="h-12 w-12 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#5EF38C] text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Multi-platform</h3>
                <p className="text-gray-400 flex-grow">
                  Train your brain on any device - desktop, tablet, or mobile - with seamless progress syncing.
                </p>
                <div className="mt-4 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5EF38C] w-1/2 pixel-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Us */}
      <section className="py-20 bg-black/30 backdrop-blur-sm" id="contact">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center text-[#5EF38C] pixel-font">Contact Us</h2>
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#5EF38C]/20 to-[#0A2342] p-1 rounded-lg pixel-border">
            <div className="bg-black p-8 rounded-lg">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Get in Touch</h3>
                  <p className="text-gray-400 mb-6">
                    Have questions or feedback? We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-[#5EF38C]">📧</span>
                      </div>
                      <span className="text-gray-300">support@nuragames.com</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-[#5EF38C]">📱</span>
                      </div>
                      <span className="text-gray-300">+1 (888) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#5EF38C]/20 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-[#5EF38C]">🏢</span>
                      </div>
                      <span className="text-gray-300">123 Cognitive Street, San Francisco, CA</span>
                    </div>
                  </div>
                </div>
                <div>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C]"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-gray-400 mb-2">Message</label>
                      <textarea 
                        id="message" 
                        className="w-full bg-[#222] border border-[#444] text-white px-4 py-2 rounded focus:outline-none focus:border-[#5EF38C] h-32"
                        placeholder="Your message here..."
                      ></textarea>
                    </div>
                    <Button className="w-full bg-[#5EF38C] text-[#0A2342] hover:bg-[#4DD77C] py-6">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/41067270-5c65-44fb-8d3b-89fc90445214.png" 
                alt="NURA Logo" 
                className="h-10 w-auto"
              />
              <p className="text-gray-500 mt-2">© 2025 NURA Games. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#about" className="text-gray-400 hover:text-[#5EF38C]">About Us</a>
              <a href="#features" className="text-gray-400 hover:text-[#5EF38C]">Features</a>
              <a href="#contact" className="text-gray-400 hover:text-[#5EF38C]">Contact</a>
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="text-gray-400 hover:text-[#5EF38C]"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleSignInClick} 
                    className="text-gray-400 hover:text-[#5EF38C]"
                  >
                    Sign In
                  </button>
                  <Link to="/register" className="text-gray-400 hover:text-[#5EF38C]">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
