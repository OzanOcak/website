/* eslint-disable react/jsx-key */
"use client";

import React, { useState } from "react";
import {
  Code2,
  Zap,
  BarChart3,
  Target,
  Brain,
  Shield,
  Download,
  Star,
  Users,
  Award,
  Sparkles,
  BookOpen,
  Filter,
  TrendingUp,
  Trophy,
  Play,
  Menu,
  X,
  User,
} from "lucide-react";

export default function FrontendProLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: "4200+ Practice Questions",
      description:
        "Comprehensive coverage of HTML, CSS, JavaScript, React, Vue, Angular, TypeScript, and Accessibility",
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Smart Performance Analysis",
      description:
        "AI-powered insights that track your weak areas and create personalized study plans",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Visual Progress Tracking",
      description:
        "Beautiful charts and graphs to visualize your improvement across all technologies",
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Exam-Focused Learning",
      description:
        "Specialized tracks for frontend interviews, certifications, and real-world scenarios",
    },
    {
      icon: <Filter className="w-10 h-10" />,
      title: "Advanced Filtering",
      description:
        "Create custom tests based on technology, difficulty, and your past performance",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Offline Mode",
      description: "Study anywhere, anytime - no internet connection required",
    },
  ];

  const technologies = [
    { name: "HTML", level: 85, color: "bg-orange-500", questions: 720 },
    { name: "CSS", level: 78, color: "bg-blue-500", questions: 680 },
    { name: "JavaScript", level: 72, color: "bg-yellow-500", questions: 850 },
    { name: "React", level: 68, color: "bg-cyan-500", questions: 620 },
    { name: "Vue", level: 65, color: "bg-green-500", questions: 380 },
    { name: "Angular", level: 58, color: "bg-red-500", questions: 420 },
    { name: "TypeScript", level: 62, color: "bg-blue-600", questions: 530 },
    {
      name: "Accessibility",
      level: 55,
      color: "bg-purple-600",
      questions: 320,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer at Google",
      content:
        "Frontend Pro helped me land my dream job. The 4200+ questions cover everything interviewers ask.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Alex Rodriguez",
      role: "Senior React Developer",
      content:
        "The performance-based filtering is a game-changer. It focuses on exactly what I need to improve.",
      rating: 5,
      avatar: "AR",
    },
    {
      name: "Priya Sharma",
      role: "Web Development Student",
      content:
        "As a beginner, the structured learning path and visual progress kept me motivated. 5 stars!",
      rating: 5,
      avatar: "PS",
    },
  ];

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "50,000+",
      label: "Active Learners",
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: "4.9/5",
      value: "App Store Rating",
    },
    {
      icon: <Play className="w-6 h-6" />,
      value: "10M+",
      label: "Questions Answered",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      value: "95%",
      label: "Success Rate",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Frontend Pro
                </h1>
                <p className="text-xs text-gray-600">Master Web Development</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Features
              </a>
              <a
                href="#technologies"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Technologies
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Testimonials
              </a>
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Download Now
              </a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Features
                </a>
                <a
                  href="#technologies"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Technologies
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Testimonials
                </a>
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-center"
                >
                  Download Now
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                4200+ Questions • 8 Technologies
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Frontend Development
              <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Anywhere, Anytime
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your complete mobile companion for frontend mastery. Practice
              4200+ questions across HTML, CSS, JavaScript, React, Vue, Angular,
              TypeScript, and Accessibility with AI-powered personalized
              learning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download on App Store
              </a>

              <a
                href="#features"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5" />
                See Features
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    {stat.icon}
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            {/* Mockup Device */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative">
                {/* iPhone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-[14px] border-gray-900">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-2xl z-10"></div>

                  {/* Screen Content */}
                  <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] overflow-hidden h-[600px]">
                    {/* App Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-6 h-6" />
                          <span className="font-bold">Frontend Pro</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold">
                          Day 14 Streak 🔥
                        </div>
                        <div className="text-sm opacity-90">
                          78% Average Score
                        </div>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>React</span>
                          <span>68%</span>
                        </div>
                        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-2/3"></div>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Cards */}
                    <div className="p-4 space-y-4">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">
                            JavaScript Advanced
                          </span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            Hard
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          25 questions • 40 min
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-3/4"></div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">CSS Layouts</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Easy
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          15 questions • 25 min
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
                      <div className="flex justify-around p-3">
                        {[
                          // eslint-disable-next-line react/jsx-key
                          <BookOpen />,
                          <TrendingUp />,
                          <Target />,
                          <Award />,
                        ].map((icon, i) => (
                          <button
                            key={i}
                            className="p-2 text-gray-600 hover:text-blue-600"
                          >
                            {React.cloneElement(icon, { className: "w-6 h-6" })}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gradient-to-b from-white to-blue-50 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Frontend Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to master modern frontend development in one
              app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Master All Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              4200+ questions across 8 essential frontend technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${tech.color} flex items-center justify-center text-white font-bold`}
                    >
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{tech.name}</h3>
                      <p className="text-sm text-gray-500">
                        {tech.questions} questions
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold">{tech.level}%</span>
                </div>

                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tech.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${tech.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="bg-gradient-to-b from-blue-50 to-white py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join 50,000+ developers who improved their skills with Frontend
              Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 mx-auto mb-6" />

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Start Mastering Frontend Today
              </h2>

              <p className="text-xl mb-8 opacity-90">
                Join thousands of developers already improving their skills with
                Frontend Pro
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Download on App Store
                </a>

                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Get it on Google Play
                </a>
              </div>

              <p className="mt-6 text-sm opacity-80">
                Free download • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3">
              <Code2 className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">Frontend Pro</h3>
                <p className="text-gray-400 text-sm">Master Web Development</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Frontend Pro. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Made with ❤️ for developers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
