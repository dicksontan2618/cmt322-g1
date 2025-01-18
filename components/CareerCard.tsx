"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

// Define the props interface
interface CareerCardProps {
  slug: string;
  imageSrc: string;
  category: string;
  jobTitle: string;
  workMode: string;
  company: string;
  location?: string;
  canBookmark: boolean;
}

export default function CareerCard({
  slug,
  imageSrc,
  category,
  jobTitle,
  workMode,
  company, // Default value
  canBookmark,
}: CareerCardProps) {
  // State for bookmark functionality
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove">("add");
  const [isVisible, setIsVisible] = useState(true); // State to control card visibility

  const pathname = usePathname()

  // Load bookmark status from localStorage when component mounts
  useEffect(() => {
    const bookmarkedJobs = JSON.parse(localStorage.getItem("bookmarkedJobs") || "[]");
    const isJobBookmarked = bookmarkedJobs.includes(slug); // Check if current job is bookmarked
    setIsBookmarked(isJobBookmarked);
  }, [slug]);

  // Handle bookmark confirmation
  const confirmBookmarkAction = (action: "add" | "remove") => {
    setPendingAction(action);
    setIsDialogOpen(true);
  };

  // Handle the actual bookmark action
  const handleBookmarkAction = () => {
    const bookmarkedJobs = JSON.parse(localStorage.getItem("bookmarkedJobs") || "[]");

    if (pendingAction === "add") {
      // Add to bookmarks
      bookmarkedJobs.push(slug);
      localStorage.setItem("bookmarkedJobs", JSON.stringify(bookmarkedJobs));
      setIsBookmarked(true);
    } else if (pendingAction === "remove") {
      // Remove from bookmarks
      const updatedBookmarks = bookmarkedJobs.filter((jobSlug: string) => jobSlug !== slug);
      localStorage.setItem("bookmarkedJobs", JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      if (pathname === "/profile/student") {
        setIsVisible(false);
      }
    }

    setIsDialogOpen(false);
  };

  if (!isVisible) {
    return null; // Do not render the card if it's not visible
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="relative">
        <Link href={`/careers/${slug}`}>
          <Image
            src={imageSrc}
            alt={jobTitle}
            width={300}
            height={250}
            className="w-full h-56 object-cover"
            priority
          />
        </Link>

        {/* Bookmark button */}
        {canBookmark && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              confirmBookmarkAction(isBookmarked ? "remove" : "add");
            }}
            aria-label="Bookmark this job"
            aria-pressed={isBookmarked}
            className={clsx(
              "focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center absolute top-2 right-4",
              isBookmarked
                ? "text-white bg-primary hover:bg-secondary"
                : "text-primary bg-white border-2 border-primary hover:bg-blue-400 focus:ring-primary"
            )}
          >
            <FontAwesomeIcon icon={faBookmark} className="w-6 h-6" />
          </button>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex gap-2 mt-2">
          <Badge className="bg-primary text-white">{workMode.charAt(0).toUpperCase() + workMode.slice(1).toLowerCase()}</Badge>
          <Badge className="bg-secondary text-white">{category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}</Badge>
        </div>
        <h3 className="text-lg font-bold text-gray-800 leading-tight mb-4 pt-4">{jobTitle}</h3>
        <div className="flex flex-col gap-y-2 text-black font-semibold">
          <div className="flex gap-x-6 items-center">
            <FontAwesomeIcon icon={faBuilding} className="w-[5%]" />
            <p className="text-gray-600 text-sm w-[95%] -ml-2">{company}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Link
              href={`/careers/${slug}`}
              className="inline-flex font-medium items-center text-blue-700 hover:underline mt-4"
            >
              Details
              <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="text-black flex flex-col items-center justify-center rounded-md bg-white shadow-xl fixed">
          <DialogHeader>
            <div className="text-yellow-500 text-7xl text-center mb-2">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
            <DialogTitle className="text-xl font-semibold text-center text-primary">
              {pendingAction === "add" ? "Add Bookmark?" : "Remove Bookmark?"}
            </DialogTitle>
            <p className="text-sm text-center text-gray-500">
              {pendingAction === "add"
                ? "Do you want to add this job to your bookmarks?"
                : "Do you want to remove this job from your bookmarks?"}
            </p>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-3">
            <Button
              onClick={handleBookmarkAction}
              className="bg-primary text-white hover:bg-red-700"
            >
              Yes
            </Button>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-secondary text-white hover:bg-gray-400"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
