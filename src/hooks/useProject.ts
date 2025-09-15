import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  goal: string;
  progress: number;
  project_data: any;
  created_at: string;
  updated_at: string;
  client_id: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  payment_type: string;
  status: string;
  due_date: string;
  paid_date: string;
  description: string;
}

export interface ProjectAddon {
  id: string;
  project_id: string;
  addon_key: string;
  addon_data: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [addons, setAddons] = useState<ProjectAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المشروع",
        variant: "destructive",
      });
    }
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (err: any) {
      console.error('Error fetching files:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('project_payments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPayments(data || []);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from('project_addons')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddons(data || []);
    } catch (err: any) {
      console.error('Error fetching addons:', err);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: 'client'
        });

      if (dbError) throw dbError;

      toast({
        title: "نجح الرفع",
        description: "تم رفع الملف بنجاح",
      });

      fetchFiles();
    } catch (err: any) {
      toast({
        title: "خطأ في الرفع",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProject(),
        fetchFiles(),
        fetchPayments(),
        fetchAddons()
      ]);
      setLoading(false);
    };

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  return {
    project,
    files,
    payments,
    addons,
    loading,
    error,
    uploadFile,
    getFileUrl,
    refetch: () => {
      fetchProject();
      fetchFiles();
      fetchPayments();
      fetchAddons();
    }
  };
};