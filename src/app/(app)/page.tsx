"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BarChart2, Users, MessageSquare, FileText, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const formCategories = [
  { 
    name: "Feedback", 
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />, 
    description: "Collect and analyze sentiment with our ML-powered feedback forms",
    color: "from-blue-500/20 to-blue-600/20",
    hover: "group-hover:text-blue-500"
  },
  { 
    name: "Registration", 
    icon: <Users className="h-6 w-6 text-green-500" />, 
    description: "Track registration trends and participant analytics",
    color: "from-green-500/20 to-green-600/20",
    hover: "group-hover:text-green-500"
  },
  { 
    name: "Survey", 
    icon: <FileText className="h-6 w-6 text-purple-500" />, 
    description: "Deep insights from custom survey responses",
    color: "from-purple-500/20 to-purple-600/20",
    hover: "group-hover:text-purple-500" 
  },
  { 
    name: "Review", 
    icon: <Star className="h-6 w-6 text-amber-500" />, 
    description: "Visualize rating distributions and review metrics",
    color: "from-amber-500/20 to-amber-600/20",
    hover: "group-hover:text-amber-500" 
  }
];

const testimonials = [
  {
    text: "The analytics on my feedback forms helped me improve my business in ways I never expected.",
    author: "Sarah J.",
    role: "Small Business Owner"
  },
  {
    text: "Setting up event registration forms with detailed analytics has transformed our event planning.",
    author: "Michael T.",
    role: "Event Coordinator"
  },
  {
    text: "The sentiment analysis feature alone is worth it. I now understand what my customers really think.",
    author: "Priya N.",
    role: "Product Manager"
  }
];

const Home = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Form Analytics Reimagined
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Create intelligent forms that provide deep insights through AI-powered analytics
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-form">
                <Button className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-lg rounded-lg flex items-center">
                  Create Your Form <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="px-8 py-6 bg-gray-800/50 hover:bg-gray-700/50 text-lg border border-gray-700 rounded-lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Analysis Metrics Display */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-blue-400">100%</div>
                <div className="text-sm text-gray-400">Anonymous Responses</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-purple-400">96%</div>
                <div className="text-sm text-gray-400">Analysis Accuracy</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-green-400">10x</div>
                <div className="text-sm text-gray-400">Faster Insights</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-amber-400">24/7</div>
                <div className="text-sm text-gray-400">Real-time Updates</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Form Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Forms For Every Need
          </motion.h2>
          <motion.p variants={item} className="text-lg text-gray-400 max-w-2xl mx-auto">
            Create specialized forms with custom analytics tailored to your specific requirements
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formCategories.map((category, index) => (
            <motion.div
              key={category.name}
              variants={item}
              className={`group rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br ${category.color} backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:shadow-${category.name.toLowerCase()}-500/10 hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className="mb-4">{category.icon}</div>
                <h3 className={`text-xl font-semibold mb-2 ${category.hover}`}>{category.name} Forms</h3>
                <p className="text-gray-400 mb-6 text-sm">{category.description}</p>
                <Link href={`/forms/templates/${category.name.toLowerCase()}`}>
                  <Button variant="ghost" className="text-gray-300 hover:text-white group-hover:bg-gray-800/50 flex items-center">
                    Explore templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Analytics Feature Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI-Powered Analytics</h2>
              <p className="text-lg text-gray-300 mb-8">
                Transform raw responses into actionable insights through our advanced analytics platform.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500/20 p-2 rounded-lg mr-4">
                    <BarChart2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Sentiment Analysis</h3>
                    <p className="text-gray-400">Understand emotional context behind feedback with ML-powered sentiment detection</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-500/20 p-2 rounded-lg mr-4">
                    <BarChart2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Submission Trends</h3>
                    <p className="text-gray-400">Track response patterns over time with interactive timeline visualizations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-500/20 p-2 rounded-lg mr-4">
                    <BarChart2 className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Demographic Insights</h3>
                    <p className="text-gray-400">Visualize participant demographics while maintaining anonymity</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/analytics-demo">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Analytics Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-gray-700 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-sm font-medium text-gray-400">Feedback Analytics Dashboard</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Sentiment Distribution</h4>
                      <p className="text-2xl font-bold">87% Positive</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Total Responses</h4>
                      <p className="text-2xl font-bold">1,428</p>
                    </div>
                  </div>
                  
                  {/* Simulated chart */}
                  <div className="w-full h-48 bg-gray-800/60 rounded-lg mb-6 flex items-end p-4 space-x-2">
                    <div className="h-1/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-2/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-3/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-4/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-full w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-4/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-3/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-4/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-full w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-4/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-3/5 w-1/12 bg-blue-500 rounded-t"></div>
                    <div className="h-2/5 w-1/12 bg-blue-500 rounded-t"></div>
                  </div>
                  
                  {/* Simulated pie chart */}
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                      87%
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-300">Positive (87%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm text-gray-300">Neutral (10%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-300">Negative (3%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied users who've transformed their data collection
          </p>
        </motion.div>
        
        <div className="relative h-64">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: currentTestimonialIndex === index ? 1 : 0,
                y: currentTestimonialIndex === index ? 0 : 20
              }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{ display: currentTestimonialIndex === index ? 'block' : 'none' }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 h-full flex flex-col justify-center p-8">
                <CardContent className="pt-4 text-center">
                  <p className="text-xl text-gray-300 mb-6">"{testimonial.text}"</p>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  currentTestimonialIndex === index ? 'bg-blue-500' : 'bg-gray-600'
                }`}
                onClick={() => setCurrentTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Data Collection?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Create powerful forms with built-in analytics and begin collecting insightful responses today.
            </p>
            <Link href="/sign-up">
              <Button className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg rounded-lg">
                Get Started For Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Anonylytics</h3>
            <p className="text-gray-400">Intelligent form analytics for insightful data collection</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features/analytics" className="hover:text-white">Analytics</Link></li>
              <li><Link href="/features/sentiment" className="hover:text-white">Sentiment Analysis</Link></li>
              <li><Link href="/features/templates" className="hover:text-white">Form Templates</Link></li>
              <li><Link href="/features/privacy" className="hover:text-white">Privacy Features</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/documentation" className="hover:text-white">Documentation</Link></li>
              <li><Link href="/tutorials" className="hover:text-white">Tutorials</Link></li>
              <li><Link href="/api" className="hover:text-white">API Reference</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Anonylytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;