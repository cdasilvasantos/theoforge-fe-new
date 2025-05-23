'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose, 
  SheetHeader, 
  SheetTitle, 
} from "@/components/ui/sheet";
import { LogOut, MenuIcon, User } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useAuthStore } from '@/lib/store/authStore';
import LoginModal from '@/components/Auth/LoginModal';
import RegisterModal from '@/components/Auth/RegisterModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Listen for custom event to open login modal after registration
  useEffect(() => {
    const handleOpenLoginModal = () => {
      console.log('Opening login modal after successful registration');
      setRegisterModalOpen(false); // Ensure register modal is closed
      setLoginModalOpen(true); // Open login modal
    };

    // Add event listener
    window.addEventListener('open-login-modal', handleOpenLoginModal);
    
    // Clean up
    return () => {
      window.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Insights", path: "/insights" },
    { label: "The Forge", path: "/forge" }, 
    { label: "Community", path: "/community" },
    { label: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full",
          "bg-gradient-to-r from-black/80 via-black/70 to-black/80",
          "backdrop-blur-md supports-[backdrop-filter]:bg-black/30",
          "transition-all duration-300"
        )}
      >
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center shrink-0 mr-4">
            <Image
              className="dark:invert"
              src="/logo.png"
              alt="TheoForge Logo"
              width={60} 
              height={16}
              priority
            />
            <span className="ml-2 font-poppins font-semibold text-lg text-white dark:text-white hidden sm:inline">
              TheoForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex sm:gap-6 lg:gap-8 flex-grow justify-center">
             {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.path ? "text-primary dark:text-primary-light" : "text-white dark:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Authentication UI */}
          <div className="hidden sm:flex items-center space-x-2">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 px-3">
                    <span className="hidden md:inline-block">
                      {user.nickname || `${user.first_name} ${user.last_name}`}
                    </span>
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.nickname}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer w-full">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 hover:text-primary transition-all duration-300"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="bg-primary hover:bg-primary/80 text-white transition-all duration-300"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Trigger (Hamburger Menu) */}
          <div className="sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm p-6 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-lg border-r border-white/10 text-white">
                {/* Optional Sheet Header */}
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-white">
                    <Link href="/" className="flex items-center" onClick={(e) => (e.target as HTMLElement).closest<HTMLElement>('[data-radix-sheet-close]')?.click()}>
                       <Image
                          className="dark:invert mr-2"
                          src="/logo.png"
                          alt="TheoForge Logo"
                          width={45} // Slightly smaller logo in sheet
                          height={12}
                          priority
                        />
                        <span className="font-poppins font-semibold text-lg text-white">
                          TheoForge
                        </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4 overflow-y-auto">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.path}
                        className={cn(
                          "block py-2 text-sm font-medium transition-colors hover:text-primary",
                          pathname === item.path ? "text-primary dark:text-primary-light" : "text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  
                  {/* Mobile Authentication UI */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    {isAuthenticated && user ? (
                      <>
                        <SheetClose asChild>
                          <Link
                            href="/dashboard/profile"
                            className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                          >
                            Profile
                          </Link>
                        </SheetClose>
                        {user.role === 'ADMIN' && (
                          <SheetClose asChild>
                            <Link
                              href="/dashboard"
                              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                            >
                              Dashboard
                            </Link>
                          </SheetClose>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full py-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <SheetClose asChild>
                          <Link href="/login" className="w-full">
                            <Button 
                              variant="outline" 
                              className="w-full border-white text-white hover:bg-white/10 hover:text-primary transition-all duration-300"
                            >
                              Log in
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/register" className="w-full">
                            <Button 
                              className="w-full bg-primary hover:bg-primary/80 text-white transition-all duration-300"
                            >
                              Sign up
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Optional: Placeholder for CTA button if needed on desktop */}
          {/* <div className="hidden sm:flex items-center"> */}
          {/*   <Button>Contact Us</Button> */}
          {/* </div> */}
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onOpenLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Header;
