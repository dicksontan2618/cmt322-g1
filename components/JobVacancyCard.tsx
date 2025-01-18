import Link from "next/link"; // Import Link for navigation
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import JobAnalyticsDialog from "@/components/JobAnalyticsDialog";

interface JobVacancyCardProps {
  slug: string;
  jobTitle: string;
  workMode: string;
  category: string;
}

const JobVacancyCard: React.FC<JobVacancyCardProps> = ({ slug, jobTitle, workMode, category }) => {
  return (
    <Card className="flex items-center justify-between bg-white shadow-lg rounded-lg p-4">
      {/* Left Section: Job Details */}
      <div>
        {/* Job Title */}
        <CardHeader className="text-xl font-semibold text-black">{jobTitle}</CardHeader>

        {/* Badges */}
        <CardContent className="flex gap-2 mt-2">
          <Badge className="bg-primary text-white">{workMode.charAt(0).toUpperCase() + workMode.slice(1)}</Badge>
          <Badge className="bg-secondary text-white">{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>
        </CardContent>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex gap-4">
        {/* Edit Button */}
        <Link
          href={`/profile/employer/jobs/edit/${slug}`}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
          title="Edit"
        >
          <FontAwesomeIcon icon={faPen} /> Edit
        </Link>

        {/* Analytics Button */}
        <JobAnalyticsDialog jobId={slug}/>
      </div>
    </Card>
  );
};

export default JobVacancyCard;
