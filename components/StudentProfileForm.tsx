import { createClient } from '@/utils/supabase/server';
import StudentProfileFormClient from './StudentProfileFormClient';

export default async function StudentProfileForm() {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('students')
        .select('*')
        .single();
    
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    const initialData = (data || {
        id: user?.id || null,
        username: "",
        studyYear: null,
        specialization: "",
    });

    return <StudentProfileFormClient initialData={initialData} />;

}