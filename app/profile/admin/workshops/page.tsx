import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import Link from "next/link"
import WorkshopCard from "@/components/WorkshopCard";
import { Key } from "react";

export default async function AdminWorkshopPage() {

    const supabase = await createClient();
    
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    if (!user) {
        return redirect("/sign-in");
    }

    if (user.role !== "admin") {
        return redirect("/");
    }

    const {
        data: workshops,
        error
    } = await supabase.from("workshops").select("*");

    return (
        <div className="px-8 mb-8 lg:px-16 lg:py-8">
            <div className="flex flex-col mb-6">
                <p className="text-black font-bold text-lg lg:text-3xl">Manage Workshop</p>
                <p className="text-gray-600 font-semibold lg:text-lg">Add new / Manage posted workshop</p>
                
            </div>
            <Link href="/profile/admin/workshops/create">
                <Button variant="secondary" className="text-white">
                    Create New Workshop <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </Link>
            <p className="text-gray-600 font-semibold my-4 lg:mt-8">Created Workshop</p>
            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-4">
                {workshops && workshops.map((workshop: { id: string; imageSrc: string; name: string; tag: string; date: string; venue: string; }, index: Key | null | undefined) => (
                    <WorkshopCard key={index} slug={workshop.id} imageSrc={workshop.imageSrc} title={workshop.name} category={workshop.tag} date={workshop.date} venue={workshop.venue} colorCode="#ED4989" canEdit={true} />
                ))}
            </div>
        </div>
    )
}