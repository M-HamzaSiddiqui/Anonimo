"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  MoreVertical,
  BarChart2,
  MessageSquare,
  Share2,
  Trash,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Form {
  _id: string;
  title: string;
  responses: number;
  createdAt: string;
  category: string;
  slug: string;
}

const MyForms = () => {
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchForms = async () => {
      try {
        const response = await axios.get(`/api/forms/get-user-forms/${userId}`);
        setForms(response.data.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [userId]);

  const handleShare = async (slug: string) => {
    const formUrl = `${window.location.origin}/forms/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this form",
          text: "Fill out this form now!",
          url: formUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast({
          title: "Error",
          description: "Failed to share the form. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(formUrl);
        toast({
          title: "Link Copied",
          description: "Form link copied to clipboard!",
          variant: "default",
        });
      } catch (error) {
        console.error("Failed to copy:", error);
        toast({
          title: "Error",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const categories = [
    "all",
    ...Array.from(
      new Set(forms.map((form) => form.category || "Uncategorized"))
    ),
  ];
  const filteredForms =
    selectedCategory === "all"
      ? forms
      : forms.filter((form) => form.category === selectedCategory);

  if (!session)
    return (
      <p className="text-center mt-6 text-gray-300">
        Please log in to view your forms.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Forms</h1>
          <Link href="/create-form">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Create New Form
            </Button>
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <span className="font-semibold">Filter by category: </span>
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full md:w-60 bg-gray-800 border-gray-600 text-white mt-1">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="hover:bg-gray-700"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        ) : filteredForms.length === 0 ? (
          <p className="text-center text-gray-400">
            No forms found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredForms.map((form) => (
              <Card
                key={form._id}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 shadow-lg 
                  transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <CardHeader className="relative">
                  {/* Title, Category, Created Date (Top Left) */}
                  <div className="text-left">
                    <CardTitle className="text-lg text-white">
                      {form.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      Created on {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-blue-400">
                      Category: {form.category}
                    </p>
                  </div>

                  {/* Three-dot menu (Top Right) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-gray-700 p-2 absolute top-0 right-0 m-2"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border border-gray-600 text-white">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/forms/${form._id}/edit`}
                          className="flex items-center space-x-2"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this form?"
                            )
                          ) {
                            try {
                              await axios.delete(`/api/forms/${form._id}`);
                              setForms(forms.filter((f) => f._id !== form._id));
                              toast({
                                title: "Form Deleted",
                                description:
                                  "The form has been successfully deleted.",
                                variant: "default",
                              });
                            } catch (error) {
                              console.error("Failed to delete form:", error);
                              toast({
                                title: "Error",
                                description:
                                  "Something went wrong while deleting the form.",
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                        className="text-red-500 flex items-center space-x-2"
                      >
                        <Trash className="h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardFooter className="flex justify-between mt-8">
                  <Link href={`/forms/form-analytics/${form.slug}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <BarChart2 className="h-4 w-4 mr-1" /> Analytics
                    </Button>
                  </Link>
                  <Link href={`/forms/responses/${form._id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageSquare className="h-4 w-4 mr-1" /> Responses
                    </Button>
                  </Link>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleShare(form.slug)}
                  >
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForms;
