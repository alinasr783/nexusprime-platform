import { supabase } from '@/integrations/supabase/client';

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadAllFiles = async (files: any[], getFileUrl: (path: string) => string) => {
  if (!files.length) return false;

  try {
    for (const file of files) {
      const fileUrl = getFileUrl(file.file_path);
      downloadFile(fileUrl, file.file_name);
      // Small delay between downloads to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    return true;
  } catch (error) {
    console.error('Error downloading files:', error);
    return false;
  }
};

export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.startsWith('video/')) return '🎥';
  if (fileType.startsWith('audio/')) return '🎵';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📋';
  if (fileType.includes('zip') || fileType.includes('archive')) return '🗜️';
  if (fileType.includes('text')) return '📄';
  return '📁';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getStoragePublicUrl = (bucketName: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  return data.publicUrl;
};