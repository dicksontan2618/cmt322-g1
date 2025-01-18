"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"

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
  const employer_logo = formData.companyLogo as File;

  try {
    // Upload images to Supabase storage
    const uploadImage = async (file: File, folder: string) => {
      try {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
        console.log('Attempting to upload file:', fileName);
    
        const { data, error } = await supabase
          .storage
          .from("employer_logo")
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });
    
        if (error) {
          console.error('Upload error details:', {
            errorMessage: error.message,
          });
          throw error;
        }
    
        console.log('Upload successful:', data);
    
        // Get the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from("employer_logo")
          .getPublicUrl(fileName);
    
        return publicUrl;
      } catch (error: any) {
        console.error('Detailed upload error:', {
          error,
          file: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        });
        throw error;
      }
    };

    const logoUrl = employer_logo
      ? await uploadImage(employer_logo, 'logos')
      : null;

    const { data, error } = await supabase
      .from("employers")
      .upsert({
        id,
        name,
        description,
        logo: logoUrl,
      });
    
    if (error) throw error;

    return {
      status: "success",
      message: "Profile updated",
    };
  } catch (error : any) {
    return {
      status: "error",
      message: "Could not update profile",
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

  if (!user) {
    return {
      status: "error",
      message: "Authentication required",
    };
  }

  const {
    workshopName,
    workshopDate,
    workshopStart,
    workshopEnd,
    workshopVenue,
    workshopSpeaker,
    speakerRole,
    speakerLinkedIn,
    workshopDesc,
    workshopThumbnailImg,
    workshopDetailImg,
    workshopTag,
  } = formData;

  try {
    // Upload images to Supabase storage
    const uploadImage = async (file: File, folder: string) => {
      try {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
        console.log('Attempting to upload file:', fileName);
    
        const { data, error } = await supabase
          .storage
          .from("workshop-thumbnail")
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
    
        if (error) {
          console.error('Upload error details:', {
            errorMessage: error.message,
          });
          throw error;
        }
    
        console.log('Upload successful:', data);
    
        // Get the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from("workshop-thumbnail")
          .getPublicUrl(fileName);
    
        return publicUrl;
      } catch (error: any) {
        console.error('Detailed upload error:', {
          error,
          file: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        });
        throw error;
      }
    };

    // Upload images if provided
    const thumbnailUrl = workshopThumbnailImg
      ? await uploadImage(workshopThumbnailImg, 'thumbnails')
      : null;

    const detailImageUrl = workshopDetailImg
      ? await uploadImage(workshopDetailImg, 'details')
      : null;

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
        thumbnail_img: thumbnailUrl,
        detail_img: detailImageUrl,
        tag: workshopTag,
      });

    if (error) throw error;

    return {
      status: "success",
      message: "Workshop created successfully",
    };
  } catch (error: any) {
    console.error('Workshop creation error:', error);
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

  if (!user) {
    return {
      status: "error",
      message: "Authentication required",
    };
  }

  const {
    id,
    workshopName,
    workshopDate,
    workshopStart,
    workshopEnd,
    workshopVenue,
    workshopSpeaker,
    speakerRole,
    speakerLinkedIn,
    workshopDesc,
    workshopThumbnailImg,
    workshopDetailImg,
    workshopTag,
    currentThumbnailPath,
    currentDetailPath
  } = formData;

  try {
    // Handle image uploads
    const uploadImage = async (file: File, folder: string, currentPath: string | null) => {
      // If no new file is provided, return the current path
      if (!file) return currentPath;

      // Delete the old file if it exists
      if (currentPath) {
        const oldFileName = currentPath.split('/').pop();
        if (oldFileName) {
          await supabase
            .storage
            .from("workshop-thumbnail")
            .remove([`${folder}/${oldFileName}`]);
        }
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase
        .storage
        .from("workshop-thumbnail")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from("workshop-thumbnail")
        .getPublicUrl(fileName);

      return publicUrl;
    };

    // Upload new images if provided
    const thumbnailUrl = workshopThumbnailImg instanceof File
      ? await uploadImage(workshopThumbnailImg, 'thumbnails', currentThumbnailPath)
      : currentThumbnailPath;

    const detailImageUrl = workshopDetailImg instanceof File
      ? await uploadImage(workshopDetailImg, 'details', currentDetailPath)
      : currentDetailPath;

    // Update workshop data in the database
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
        thumbnail_img: thumbnailUrl,
        detail_img: detailImageUrl,
        tag: workshopTag,
      })
      .eq("id", id);

    if (error) throw error;

    return {
      status: "success",
      message: "Workshop updated successfully",
    };
  } catch (error: any) {
    console.error('Workshop update error:', error);
    return {
      status: "error",
      message: error.message || "Failed to update workshop",
    };
  }
};

export async function deleteWorkshopAction(workshopId: number) {
  try {
      const supabase = await createClient()

      // First check if user is admin
      const { data: user, error: userError } = await supabase
          .from("profiles")
          .select("role")
          .single()

      if (userError || !user || user.role !== "admin") {
          return {
              status: "error",
              message: "Unauthorized access"
          }
      }

      // Delete related records first (assuming there's a workshop_registrations table)
      const { error: registrationsError } = await supabase
          .from("workshop_application")
          .delete()
          .eq("workshop_id", workshopId)

      if (registrationsError) {
          console.error("Error deleting workshop registrations:", registrationsError)
          return {
              status: "error",
              message: "Failed to delete workshop registrations"
          }
      }

      // Then delete the workshop
      const { error: workshopError } = await supabase
          .from("workshops")
          .delete()
          .eq("id", workshopId)

      if (workshopError) {
          console.error("Error deleting workshop:", workshopError)
          return {
              status: "error",
              message: "Failed to delete workshop"
          }
      }

      revalidatePath("/profile/admin/workshops")
      revalidatePath("/workshops")

      return {
          status: "success",
          message: "Workshop deleted successfully"
      }
  } catch (error) {
      console.error("Delete workshop error:", error)
      return {
          status: "error",
          message: "An unexpected error occurred"
      }
  }
}

export const userRegisterWorkshopAction = async (formData: any) => {
  const supabase = await createClient();

  console.log(formData);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return { status: "error", message: "User is not authenticated." };
  }
  console.log(user.id);
  
  const workshop_id = formData.workshopId as string;
  const student_id =  user?.id as string;
  const phoneNumber = formData.phoneNumber as string;
  const student_email = formData.email as string;
  const familliarity = formData.familliarity as string;
  const remarks = formData.remarks as string;

  const { data, error } = await supabase
    .from("workshop_application")
    .insert([
      {
        workshop_id: workshop_id,
        student_id: student_id,
        student_phonenum: phoneNumber,
        student_email: student_email,
        familiarity: familliarity,
        remarks: remarks,
      },
    ]);

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "success", message: "Successfully registered for the workshop!" };
};

export const userApplyJobAction = async (formData: any) => {
  const supabase = await createClient();
  
  const {
      data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
      return {
          status: "error",
          message: "Authentication required",
      };
  }

  try {
      // Upload resume file
      const uploadResume = async (file: File) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `resumes/${fileName}`;

          const { data, error } = await supabase
              .storage
              .from("job-applications")
              .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false
              });

          if (error) {
              console.error('Resume upload error:', error);
              throw error;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase
              .storage
              .from("job-applications")
              .getPublicUrl(filePath);

          return publicUrl;
      };

      // Upload the resume and get the URL
      const resumeUrl = await uploadResume(formData.resume);

      // Insert application data into the database
      const { data, error } = await supabase
          .from("job_application")
          .insert({
              student_id: user.id,
              job_id: formData.job_id,
              student_name: formData.name,
              student_phonenum: formData.phoneNumber,
              student_email: formData.email,
              resume: resumeUrl,
          });

      if (error) throw error;

      return {
          status: "success",
          message: "Application submitted successfully",
      };
  } catch (error: any) {
      console.error('Job application error:', error);
      return {
          status: "error",
          message: error.message || "Failed to submit application",
      };
  }
};
