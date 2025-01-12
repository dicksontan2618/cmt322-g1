import { createClient } from '@/utils/supabase/server';
import EmployerProfileFormClient from './EmployerProfileFormClient';

export default async function EmployerProfileForm() {

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('employers')
        .select('*')
        .single();
    
    const {
        data: user,
    } = await supabase.from("profiles").select("*").single();

    const initialData = (data || {
        id: user?.id || null,
        name: "",
        description: "",
    });

    return <EmployerProfileFormClient initialData={initialData} />;

}