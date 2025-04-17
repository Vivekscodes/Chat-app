import React from 'react';
import SplitText from './SplitText';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Header/Navigation */}
            <header className="py-6 px-8 flex justify-between items-center">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-xl font-bold">ChatWave</span>
                </div>
                <nav>
                    <ul className="flex space-x-8">
                        <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                        <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
                        <li><a href="/login" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Login</a></li>
                    </ul>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="px-8 py-20 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            <SplitText text="Connect with friends     instantly" />
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Experience real-time messaging with a modern, secure, and feature-rich chat platform designed for seamless communication.
                        </p>
                        <div className="flex space-x-4">
                            <a href="/signup" className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                                Get Started
                            </a>
                            <a href="/demo" className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium text-lg">
                                Try Demo
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="relative w-80 h-96 bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
                            <div className="absolute top-0 left-0 right-0 h-16 bg-gray-700 flex items-center px-4">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <div className="ml-4 text-sm font-medium">Chat</div>
                            </div>
                            <div className="pt-16 px-4 h-full">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold mr-2">JD</div>
                                        <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-xs">
                                            <p className="text-sm">Hey there! How's it going?</p>
                                            <span className="text-xs text-gray-400 mt-1 block">10:24 AM</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start mb-4 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold ml-2">ME</div>
                                        <div className="bg-blue-600 rounded-lg rounded-tr-none p-3 max-w-xs">
                                            <p className="text-sm">Pretty good! Just checking out this new chat app.</p>
                                            <span className="text-xs text-blue-200 mt-1 block">10:26 AM</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start mb-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold mr-2">JD</div>
                                        <div className="bg-gray-700 rounded-lg rounded-tl-none p-3 max-w-xs">
                                            <p className="text-sm">It looks amazing! The interface is so clean.</p>
                                            <span className="text-xs text-gray-400 mt-1 block">10:27 AM</span>
                                        </div>
                                    </div>
                                    <div className="mt-auto p-2">
                                        <div className="bg-gray-700 rounded-full px-4 py-2 flex">
                                            <input type="text" placeholder="Type a message..." className="bg-transparent outline-none flex-grow text-sm" />
                                            <button className="ml-2 text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-800">
                <div className="max-w-6xl mx-auto px-8">
                    <h2 className="text-3xl font-bold text-center mb-16">Why Choose ChatWave?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-gray-700 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Secure Messaging</h3>
                            <p className="text-gray-300">End-to-end encryption ensures your conversations remain private and secure.</p>
                        </div>
                        <div className="bg-gray-700 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Real-time Chat</h3>
                            <p className="text-gray-300">Instant messaging with real-time typing indicators and read receipts.</p>
                        </div>
                        <div className="bg-gray-700 p-8 rounded-xl">
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Group Chats</h3>
                            <p className="text-gray-300">Create group conversations with friends, family, or colleagues with ease.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">About ChatWave</h2>
                    <p className="text-xl text-gray-300 mb-10">
                        ChatWave was built with a simple mission: to create a messaging platform that's both powerful and easy to use.
                        Our team is passionate about connecting people and making communication seamless.
                    </p>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-10 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                        <p className="text-lg mb-6">Join thousands of users already enjoying ChatWave.</p>
                        <a href="/signup" className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg inline-block">
                            Create Your Account
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-10">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-6 md:mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-xl font-bold">ChatWave</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} ChatWave. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;