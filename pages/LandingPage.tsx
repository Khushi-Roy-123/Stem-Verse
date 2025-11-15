import React from 'react';
import { ChatIcon, BriefcaseIcon, GamepadIcon, SparklesIcon, DocumentTextIcon, LightbulbIcon, ForumIcon, TrophyIcon, UserIcon, Logo, TwitterIcon, LinkedinIcon, GithubIcon } from '../components/icons';

interface LandingPageProps {
    onNavigateToAuth: () => void;
}

const FeatureCard: React.FC<{ icon: React.FC<React.SVGProps<SVGSVGElement>>, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ avatar: string, name: string, role: string, children: React.ReactNode }> = ({ avatar, name, role, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600 italic mb-4">"{children}"</p>
        <div className="flex items-center gap-4">
            <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-gray-900">{name}</p>
                <p className="text-sm text-blue-600">{role}</p>
            </div>
        </div>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
    return (
        <div className="bg-sky-50 text-gray-800">
            {/* Header now floats over the Hero section */}
            <header className="absolute top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center p-1.5">
                        <Logo className="text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-white [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]">Stem Verse</h1>
                </div>
                 <div className="flex items-center gap-4">
                     <button
                        onClick={onNavigateToAuth}
                        className="px-5 py-2 text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Sign In / Join
                    </button>
                 </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative text-center px-6 overflow-hidden flex items-center justify-center min-h-screen">
                     <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black/70"></div>
                     <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white [text-shadow:0_2px_4px_rgb(0_0_0_/_0.5)] mb-4 animate-pop-in">
                            Unlock Your Potential in STEM.
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-200 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)] max-w-3xl mx-auto mb-10 animate-pop-in" style={{ animationDelay: '0.2s' }}>
                            Join a universe of opportunity. Stem Verse provides the tools, community, and inspiration for women to thrive in Science, Technology, Engineering, and Math.
                        </p>
                        <button
                            onClick={onNavigateToAuth}
                            className="px-10 py-5 text-xl font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 animate-pop-in shadow-lg"
                            style={{ animationDelay: '0.4s' }}
                        >
                            Join for Free
                        </button>
                    </div>
                </section>

                {/* Why Section */}
                <section id="why-stemverse" className="py-20 px-6 bg-white">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Stem Verse?</h2>
                        <p className="text-lg text-gray-600 mb-12">
                            We're more than a platform; we're a community dedicated to closing the gender gap in technology and science. We provide a supportive ecosystem for you to learn, grow, and succeed.
                        </p>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <TrophyIcon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900">Learn & Grow</h3>
                                <p className="text-gray-600 mt-2">Follow gamified career paths, complete quests, and earn badges as you master new skills.</p>
                            </div>
                            <div className="text-center">
                                <UserIcon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900">Connect & Collaborate</h3>
                                <p className="text-gray-600 mt-2">Join a vibrant community forum to ask questions, share knowledge, and find collaborators.</p>
                            </div>
                            <div className="text-center">
                                <BriefcaseIcon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900">Find Opportunities</h3>
                                <p className="text-gray-600 mt-2">Access a curated database of scholarships, internships, and grants to launch your career.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-6 bg-sky-50">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything You Need to Succeed</h2>
                            <p className="text-lg text-gray-600 mt-4">Explore our powerful suite of tools designed for you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard icon={ChatIcon} title="Ask STEMVerse">Your personal AI mentor. Get instant answers to your STEM questions, 24/7.</FeatureCard>
                            <FeatureCard icon={BriefcaseIcon} title="Opportunities Hub">Discover curated scholarships, internships, and grants to fuel your journey.</FeatureCard>
                            <FeatureCard icon={GamepadIcon} title="STEMQuest">Level up your skills with our gamified career roadmaps. Earn XP and badges!</FeatureCard>
                            <FeatureCard icon={LightbulbIcon} title="Inspiration Hub">Get inspired by the stories of pioneering women who have shaped the world of STEM.</FeatureCard>
                            <FeatureCard icon={DocumentTextIcon} title="AI Resume Analyzer">Receive AI-powered feedback to craft a resume that gets you noticed.</FeatureCard>
                            <FeatureCard icon={ForumIcon} title="Community Forum">Connect with peers, ask for help, and share your experiences in a supportive space.</FeatureCard>
                        </div>
                    </div>
                </section>

                 {/* How it works Section */}
                <section id="how-it-works" className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Get Started in 3 Simple Steps</h2>
                        <div className="relative">
                             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                                <div className="text-center">
                                    <div className="inline-block p-4 bg-white border-2 border-blue-500 rounded-full mb-4 text-2xl font-bold text-blue-500">1</div>
                                    <h3 className="text-xl font-bold text-gray-900">Create Your Account</h3>
                                    <p className="text-gray-600 mt-2">Sign up for free and tell us about your goals.</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block p-4 bg-white border-2 border-blue-500 rounded-full mb-4 text-2xl font-bold text-blue-500">2</div>
                                    <h3 className="text-xl font-bold text-gray-900">Choose Your Quest</h3>
                                    <p className="text-gray-600 mt-2">Select a career path and start your learning journey.</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block p-4 bg-white border-2 border-blue-500 rounded-full mb-4 text-2xl font-bold text-blue-500">3</div>
                                    <h3 className="text-xl font-bold text-gray-900">Engage & Grow</h3>
                                    <p className="text-gray-600 mt-2">Explore resources, connect with the community, and apply for opportunities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 px-6 bg-sky-50">
                    <div className="max-w-5xl mx-auto">
                         <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">From Our Community</h2>
                            <p className="text-lg text-gray-600 mt-4">See how Stem Verse is making an impact.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <TestimonialCard avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=461&q=80" name="Priya Patel" role="Computer Science Student">
                                "The STEMQuest feature is amazing! It broke down the overwhelming process of becoming a software developer into manageable steps. I feel so much more confident in my path."
                            </TestimonialCard>
                             <TestimonialCard avatar="https://images.unsplash.com/photo-1544005313-94ddf0286de2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" name="Maria Rodriguez" role="Aspiring Data Scientist">
                                "I found a scholarship through the Opportunities Hub that I never would have known about otherwise. Stem Verse genuinely helps you find the resources you need to succeed."
                            </TestimonialCard>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <SparklesIcon className="w-12 h-12 text-blue-500 mx-auto mb-4"/>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-lg text-gray-600 mb-8">Your future in STEM is waiting. Join a supportive community of brilliant minds today.</p>
                         <button
                            onClick={onNavigateToAuth}
                            className="px-8 py-4 text-lg font-bold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                            Create Your Free Account
                        </button>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center p-1.5">
                                    <Logo className="text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-blue-600">Stem Verse</h1>
                            </div>
                            <p className="text-sm text-gray-500">Empowering the next generation of women in Science, Technology, Engineering, and Math.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Explore</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</a></li>
                                    <li><a href="#how-it-works" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">How It Works</a></li>
                                    <li><a href="#testimonials" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a></li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-2">
                                    <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Connect</h3>
                                <div className="flex mt-4 space-x-4">
                                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="w-6 h-6" /></a>
                                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><span className="sr-only">LinkedIn</span><LinkedinIcon className="w-6 h-6" /></a>
                                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><span className="sr-only">GitHub</span><GithubIcon className="w-6 h-6" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Stem Verse. All rights reserved. Built to empower.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;