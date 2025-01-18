import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = null;
  let profileLink = null;

  if (user) {
    // Get user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      userRole = profile.role;
      // Set profile link based on role
      switch (userRole) {
        case 'student':
          profileLink = '/profile/student';
          break;
        case 'employer':
          profileLink = '/profile/employer';
          break;
        case 'admin':
          profileLink = '/profile/admin/workshops';
          break;
      }
    }
  }

  return user ? (
    <div className="flex items-center gap-10">
      <Link href="/" className="font-semibold">Home</Link>
      <Link href="/tentative" className="font-semibold">Tentative</Link>
      <Link href="/careers" className="font-semibold">Career</Link>
      <Link href="/workshops" className="font-semibold">Workshop</Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FontAwesomeIcon icon={faUser} size="xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <Link href={profileLink || "/profile"} className="p-3">View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <form action={signOutAction}>
              <Button type="submit" size="sm" variant="ghost">
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex gap-10 items-center">
      <Link href="/" className="font-semibold">Home</Link>
      <Link href="/tentative" className="font-semibold">Tentative</Link>
      <Link href="/careers" className="font-semibold">Career</Link>
      <Link href="/workshops" className="font-semibold">Workshop</Link>
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
