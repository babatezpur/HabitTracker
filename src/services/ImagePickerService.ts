import { Alert, Platform } from 'react-native';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import {
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

interface ImageResult {
  uri: string | null;
  error?: string;
}

class ImagePickerService {
  private getPermission(): Permission {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      const permission = this.getPermission();
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  async openCamera(): Promise<ImageResult> {
    const hasPermission = await this.requestCameraPermission();

    if (!hasPermission) {
      return {
        uri: null,
        error: 'Camera permission denied',
      };
    }

    return new Promise(resolve => {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 400,
        maxWidth: 400,
        quality: 0.8 as PhotoQuality,
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve({ uri: null });
        } else if (response.errorMessage) {
          resolve({ uri: null, error: response.errorMessage });
        } else if (response.assets && response.assets[0]) {
          resolve({ uri: response.assets[0].uri || null });
        } else {
          resolve({ uri: null, error: 'Unknown error' });
        }
      });
    });
  }

  async openGallery(): Promise<ImageResult> {
    return new Promise(resolve => {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 400,
        maxWidth: 400,
        quality: 0.8 as PhotoQuality,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          resolve({ uri: null });
        } else if (response.errorMessage) {
          resolve({ uri: null, error: response.errorMessage });
        } else if (response.assets && response.assets[0]) {
          resolve({ uri: response.assets[0].uri || null });
        } else {
          resolve({ uri: null, error: 'Unknown error' });
        }
      });
    });
  }

  showImagePicker(): Promise<ImageResult> {
    return new Promise(resolve => {
      Alert.alert('Select Profile Picture', 'Choose an option', [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await this.openCamera();
            resolve(result);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await this.openGallery();
            resolve(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve({ uri: null }),
        },
      ]);
    });
  }
}

export default new ImagePickerService();
