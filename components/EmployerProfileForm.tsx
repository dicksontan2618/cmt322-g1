import { createClient } from '@/utils/supabase/server';
import EmployerProfileFormClient from './EmployerProfileFormClient';

export default async function EmployerProfileForm() {

    const supabase = await createClient();


    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    const { data: employerData, error } = await supabase
    .from('employers')
    .select('*')
    .eq("id", user.id)
    .single();

    const initialData = (employerData || {
        id: employerData?.id || null,
        name: employerData?.name || null,
        description: employerData?.description || null,
    });

    return <EmployerProfileFormClient initialData={initialData} />;

}