import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { authService } from './auth';

class FileUploadService {
  private storage = getStorage();

  // Compress image before upload
  private async compressImage(file: File, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload image files with compression
  async uploadImages(files: File[], carId: string): Promise<string[]> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Compress image if it's larger than 1MB
        const processedFile = file.size > 1024 * 1024 ? await this.compressImage(file) : file;
        
        const fileExtension = processedFile.name.split('.').pop() || 'jpg';
        const fileName = `cars/${carId}/images/${Date.now()}_${index}.${fileExtension}`;
        const storageRef = ref(this.storage, fileName);
        
        await uploadBytes(storageRef, processedFile);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error(`Error uploading image ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    return Promise.all(uploadPromises);
  }

  // Upload 3D model file
  async upload3DModel(file: File, carId: string): Promise<string> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const fileExtension = file.name.split('.').pop() || 'glb';
      const fileName = `cars/${carId}/models/${Date.now()}.${fileExtension}`;
      const storageRef = ref(this.storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error(`Error uploading 3D model ${file.name}:`, error);
      throw new Error(`Failed to upload 3D model: ${file.name}`);
    }
  }

  // Delete file from storage
  async deleteFile(fileURL: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, fileURL);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}

export const fileUploadService = new FileUploadService(); 