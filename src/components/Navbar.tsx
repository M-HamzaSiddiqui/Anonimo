'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { 
  Menu, 
  ChevronDown, 
  BarChart2, 
  LogOut, 
  User as UserIcon, 
  FileText, 
  Plus,
  Home,
  X,
  Menu as MenuIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-md shadow-md py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Anonylytics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/templates" className="text-gray-300 hover:text-white transition-colors">
              Templates
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/create-form">
                  <Button size="sm" variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/20">
                    <Plus className="h-4 w-4 mr-2" /> New Form
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full pl-3 pr-3 py-1 border border-gray-700/50">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                        <span className="text-sm font-medium">
                          {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {user?.username || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mr-2 bg-gray-800 border border-gray-700 text-gray-200">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/my-forms" className="flex items-center cursor-pointer">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>My Forms</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        <span>Analytics</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center cursor-pointer">
                        <UserIcon className="h-4 w-4 mr-2" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      onClick={() => signOut()} 
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-gray-300 hover:text-white p-1">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 animate-in slide-in-from-top">
          <div className="px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-300 hover:text-white flex items-center py-2" onClick={toggleMobileMenu}>
                <Home className="h-5 w-5 mr-3" /> Home
              </Link>
              <Link href="/features" className="text-gray-300 hover:text-white flex items-center py-2" onClick={toggleMobileMenu}>
                <BarChart2 className="h-5 w-5 mr-3" /> Features
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white flex items-center py-2" onClick={toggleMobileMenu}>
                <FileText className="h-5 w-5 mr-3" /> Pricing
              </Link>
              <Link href="/templates" className="text-gray-300 hover:text-white flex items-center py-2" onClick={toggleMobileMenu}>
                <Menu className="h-5 w-5 mr-3" /> Templates
              </Link>
            </div>

            <div className="border-t border-gray-800 pt-4">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 pb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <span className="text-sm font-medium">
                        {user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {user?.username || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <Link href="/my-forms" className="flex items-center py-2 text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                    <FileText className="h-5 w-5 mr-3" /> My Forms
                  </Link>
                  
                  <Link href="/create-form" className="flex items-center py-2 text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                    <Plus className="h-5 w-5 mr-3" /> New Form
                  </Link>
                  
                  <Link href="/account" className="flex items-center py-2 text-gray-300 hover:text-white" onClick={toggleMobileMenu}>
                    <UserIcon className="h-5 w-5 mr-3" /> Account Settings
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center w-full justify-start py-2 text-red-400 hover:text-red-300 pl-0" 
                    onClick={() => {
                      signOut();
                      toggleMobileMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href="/sign-in" onClick={toggleMobileMenu}>
                    <Button variant="ghost" className="text-gray-300 hover:text-white w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={toggleMobileMenu}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;