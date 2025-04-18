'use client';

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <a className="text-xl font-bold" href="#">
          Anonylytics
        </a>

        {session ? (
          <span className="text-xl font-bold text-center flex-1">
            Welcome, {user.username || user?.email}
          </span>
        ) : null}

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/my-forms">
                <Button className="w-full md:w-auto">My Forms</Button>
              </Link>
              <Button className="w-full md:w-auto" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
