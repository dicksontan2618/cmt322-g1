import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMap } from "@fortawesome/free-regular-svg-icons";

interface WorkshopCardProps {
    slug: string;
    imageSrc: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    colorCode: string;
    canEdit: boolean;
  }
  
  const WorkshopCard: React.FC<WorkshopCardProps> = ({ slug,  imageSrc, title, category, date, venue, colorCode, canEdit }) => {
  return (
    <Link href={`${!canEdit ? `/workshops/${slug}` : `/profile/admin/workshops/${slug}`}`}>
        <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
            <Image
            src={imageSrc}
            alt={title}
            width={1500}
            height={1500}
            className="w-full h-56 object-cover"
            priority
            />
        </CardHeader>
        <CardContent>
            <Badge style={{backgroundColor: colorCode}} className="my-2 text-gray-800">{category}</Badge>
            <h3 className="text-lg font-bold text-gray-800 leading-tight mb-4">{title}</h3>
            <div className="flex flex-col gap-y-2 text-black font-semibold">
                <div className="flex gap-x-6 items-center">
                    <FontAwesomeIcon icon={faCalendar} className="w-[5%]"/>
                    <p className="text-gray-600 text-sm w-[95%] -ml-2">{date}</p>
                </div>
                <div className="flex gap-x-6 items-center">
                    <FontAwesomeIcon icon={faMap} className="w-[5%]"/>
                    <p className="text-gray-600 text-sm w-[95%] -ml-2">{venue}</p>
                </div>
            </div>
        </CardContent>
        </Card>
    </Link>
  );
};

export default WorkshopCard;