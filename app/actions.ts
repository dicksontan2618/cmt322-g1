"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

  interface FormValues {
    email: string;
    password: string;
  }

export const signUpAction = async (formData: FormValues, role: String ) => {

  const email = formData.email as string;
  const password = formData.password as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        role: role,
      },
    },
  });

  let authMsg = null;

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    authMsg = {
      status: "error",
      message: "User already exists",
    };
  } else if (error) {
    authMsg = {
      status: error.name,
      message: error.message,
    };
  } else {
    authMsg = {
      status: "success",
      message: "Thanks for signing up! Please check your email for a verification link.",
    };
  }

  return authMsg;
};

export const signInStudentAction = async (formData: FormValues) => {
  const email = formData.email as string;
  const password = formData.password as string;
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Wrong Email/Password",
    };
  }

  const { data: userDetails, error: roleError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user?.id)
    .single();

  if (roleError || !userDetails || userDetails.role !== 'student') {
    await supabase.auth.signOut(); 
    return {
      status: "error",
      message: "Not Student Role",
    };
  }

  return redirect("/profile/student");
};

export const studentUpdateProfileAction = async (formData: any) => {

  const supabase = await createClient();

  const id = formData.id as string;
  const name = formData.username as string;
  const year = formData.studyYear as string;
  const specialization = formData.specialization as string;


  const { data, error } = await supabase
    .from("students")
    .upsert({
      id,
      name,
      year,
      specialization,
    });

  if (error) {
    return {
      status: "error",
      message: "Could not update profile",
    };
  } else {
    return {
      status: "success",
      message: "Profile updated",
    };
  }

}

export const employerUpdateProfileAction = async (formData: any) => {

  const supabase = await createClient();

  const id = formData.id as string;
  const name = formData.companyName as string;
  const description = formData.companyDesc as string;

  const { data, error } = await supabase
    .from("employers")
    .upsert({
      id,
      name,
      description,
    });

  if (error) {
    return {
      status: "error",
      message: "Could not update profile",
    };
  } else {
    return {
      status: "success",
      message: "Profile updated",
    };
  }

}

export const signInEmployerAction = async (formData: FormValues) => {
  const email = formData.email as string;
  const password = formData.password as string;
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Wrong Email/Password",
    };
  }

  const { data: userDetails, error: roleError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user?.id)
    .single();

  if (roleError || !userDetails || userDetails.role !== 'employer') {
    await supabase.auth.signOut(); 
    return {
      status: "error",
      message: "Not Employer Role",
    };
  }

  return redirect("/profile/employer");
};

export const signInAdminAction = async (formData: FormValues) => {
  const email = formData.email as string;
  const password = formData.password as string;
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Wrong Email/Password",
    };
  }

  const { data: userDetails, error: roleError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.user?.id)
    .single();

  if (roleError || !userDetails || userDetails.role !== 'admin') {
    await supabase.auth.signOut(); 
    return {
      status: "error",
      message: "Not Admin Role",
    };
  }

  return redirect("/profile/admin");
};

export const employerCreateJobAction = async (formData: any) => {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const title = formData.jobTitle as string;
  const mode = formData.workMode as string;
  const category = formData.category as string;
  const qualification = formData.minQualifications as string;
  const salary = formData.salaryRange as string;
  const description = formData.jobDesc as string;
  const skills = formData.requiredSkills as string;
  const employer_id = user?.id as string;

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title,
      mode,
      category,
      qualification,
      salary,
      description,
      skills,
      employer_id,
    });

  if (error) {
    return {
      status: "error",
      message: "Could not create job",
    };
  } else {
    return {
      status: "success",
      message: "Job Created",
    };
  }

}

export const employerEditJobAction = async (formData: any) => {

  const supabase = await createClient();

  console.log(formData);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const title = formData.jobTitle as string;
  const mode = formData.workMode as string;
  const category = formData.category as string;
  const qualification = formData.minQualifications as string;
  const salary = formData.salaryRange as string;
  const description = formData.jobDesc as string;
  const skills = formData.requiredSkills as string;

  const { data, error } = await supabase
    .from("jobs")
    .update({
      title,
      mode,
      category,
      qualification,
      salary,
      description,
      skills,
    }).eq("id", formData.id);

  if (error) {
    return {
      status: "error",
      message: "Could not update job",
    };
  } else {
    return {
      status: "success",
      message: "Job Updated",
    };
  }

}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const adminCreateWorkshopAction = async (formData: any) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workshopName = formData.workshopName as string;
  const workshopDate = formData.workshopDate as Date;
  const workshopStart = formData.workshopStart as string;
  const workshopEnd = formData.workshopEnd as string;
  const workshopVenue = formData.workshopVenue as string;
  const workshopSpeaker = formData.workshopSpeaker as string;
  const speakerRole = formData.speakerRole as string;
  const speakerLinkedIn = formData.speakerLinkedIn as string;
  const workshopDesc = formData.workshopDesc as string;
  // const workshopThumbnailImg = formData.workshopThumbnailImg as File;
  // const workshopDetailImg = formData.workshopDetailImg as File;
  const workshopTag = formData.workshopTag as string;

  try {
    // Upload images to Supabase storage
    // const uploadImage = async (file: File, path: string) => {
    //   const { data, error } = await supabase.storage
    //     .from("workshop-images")
    //     .upload(path, file, { cacheControl: "3600", upsert: false });

    //   if (error) throw error;

    //   return data?.path;
    // };

    // const thumbnailPath = workshopThumbnailImg
    //   ? await uploadImage(workshopThumbnailImg, `thumbnails/${Date.now()}_${workshopThumbnailImg.name}`)
    //   : null;

    // const detailImagePath = workshopDetailImg
    //   ? await uploadImage(workshopDetailImg, `details/${Date.now()}_${workshopDetailImg.name}`)
    //   : null;

    // Insert workshop data into the database
    const { data, error } = await supabase
      .from("workshops")
      .insert({
        name: workshopName,
        date: workshopDate,
        start_time: workshopStart,
        end_time: workshopEnd,
        venue: workshopVenue,
        speaker_name: workshopSpeaker,
        speaker_role: speakerRole,
        speaker_linkedin: speakerLinkedIn,
        description: workshopDesc,
        // thumbnail_img: thumbnailPath,
        // detail_img: detailImagePath,
        tag: workshopTag,
      });

    if (error) throw error;

    return {
      status: "success",
      message: "Workshop created successfully",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Failed to create workshop",
    };
  }
};

export const adminEditWorkshopAction = async (formData: any) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const workshopName = formData.workshopName as string;
  const workshopDate = formData.workshopDate as Date;
  const workshopStart = formData.workshopStart as string;
  const workshopEnd = formData.workshopEnd as string;
  const workshopVenue = formData.workshopVenue as string;
  const workshopSpeaker = formData.workshopSpeaker as string;
  const speakerRole = formData.speakerRole as string;
  const speakerLinkedIn = formData.speakerLinkedIn as string;
  const workshopDesc = formData.workshopDesc as string;
  const workshopTag = formData.workshopTag as string;

  try {

    // Insert workshop data into the database
    const { data, error } = await supabase
      .from("workshops")
      .update({
        name: workshopName,
        date: workshopDate,
        start_time: workshopStart,
        end_time: workshopEnd,
        venue: workshopVenue,
        speaker_name: workshopSpeaker,
        speaker_role: speakerRole,
        speaker_linkedin: speakerLinkedIn,
        description: workshopDesc,
        tag: workshopTag,
      }).eq("id", formData.id);

    if (error) throw error;

    return {
      status: "success",
      message: "Workshop updated successfully",
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Failed to update workshop",
    };
  }
};
