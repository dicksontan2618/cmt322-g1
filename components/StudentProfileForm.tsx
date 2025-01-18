import { createClient } from '@/utils/supabase/server';
import StudentProfileFormClient from './StudentProfileFormClient';

export default async function StudentProfileForm() {

    const supabase = await createClient();
    
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    const { data: studentData, error } = await supabase
    .from('students')
    .select('*')
    .eq("id", user.id)
    .single();

    // console.log(studentData);
    const initialData = (studentData || {
        id: studentData?.id || null,
        username: studentData?.name || null,
        studyYear: studentData?.year || null,
        specialization: studentData?.specialization || null,
    });

    console.log(initialData);

    return <StudentProfileFormClient initialData={initialData} />;

}