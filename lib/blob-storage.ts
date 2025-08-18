import { put, del, list } from '@vercel/blob';

/**
 * Upload an image to Vercel Blob Storage
 * @param file - The file to upload (as ArrayBuffer or Blob)
 * @param filename - The name for the file in storage
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(file: ArrayBuffer | Blob, filename: string) {
  try {
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Prevents naming conflicts
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading to Blob storage:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete an image from Vercel Blob Storage
 * @param url - The URL of the file to delete
 */
export async function deleteImage(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting from Blob storage:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * List all images in a specific folder
 * @param prefix - Optional folder prefix to filter results
 */
export async function listImages(prefix?: string) {
  try {
    const { blobs } = await list({
      prefix,
      limit: 1000,
    });
    
    return blobs;
  } catch (error) {
    console.error('Error listing Blob storage:', error);
    throw new Error('Failed to list images');
  }
}

/**
 * Upload a speaker photo
 * @param file - The photo file
 * @param speakerId - The speaker's ID
 */
export async function uploadSpeakerPhoto(file: File, speakerId: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const filename = `speakers/${speakerId}/photo-${Date.now()}.${file.name.split('.').pop()}`;
  
  return uploadImage(arrayBuffer, filename);
}

/**
 * Upload a resource file (PDF, etc.)
 * @param file - The resource file
 * @param talkPageId - The talk page ID
 */
export async function uploadResourceFile(file: File, talkPageId: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const filename = `resources/${talkPageId}/${Date.now()}-${file.name}`;
  
  return uploadImage(arrayBuffer, filename);
}