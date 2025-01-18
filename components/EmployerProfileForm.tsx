import { createClient } from '@/utils/supabase/server';
import EmployerProfileFormClient from './EmployerProfileFormClient';

export default async function EmployerProfileForm() {
    const supabase = await createClient();
    
    const { data: user } = await supabase.from("profiles").select("*").single();

    const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('id', user?.id)
        .single();

    const initialData = {
        id: user?.id || '',
        name: data?.name || '',
        description: data?.description || '',
        logo_url: data?.employer_logo || ''
    };

    return <EmployerProfileFormClient initialData={initialData} />;
}