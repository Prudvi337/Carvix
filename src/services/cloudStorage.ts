import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { authService } from './auth';

// Build interface
export interface CarBuild {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  basePrice: number;
  totalPrice: number;
  customizations: {
    color: {
      id: string;
      name: string;
      hex: string;
      price: number;
    };
    wheel: {
      id: string;
      name: string;
      price: number;
    };
    interior: {
      id: string;
      name: string;
      price: number;
    };
    package: {
      id: string;
      name: string;
      price: number;
      features: string[];
    };
  };
  specifications: {
    range?: string;
    topSpeed?: string;
    acceleration?: string;
    power?: string;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    tags: string[];
    description?: string;
  };
  exportData?: {
    manufacturingSpecs: any;
    materialList: any[];
    costBreakdown: any;
  };
}

// Cloud storage service class
class CloudStorageService {
  private static instance: CloudStorageService;
  private db = getFirestore();

  static getInstance(): CloudStorageService {
    if (!CloudStorageService.instance) {
      CloudStorageService.instance = new CloudStorageService();
    }
    return CloudStorageService.instance;
  }

  // Save build to cloud
  async saveBuild(build: Omit<CarBuild, 'id' | 'userId' | 'metadata'>): Promise<string> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const buildId = `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const buildData: CarBuild = {
        ...build,
        id: buildId,
        userId: user.uid,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: false,
          tags: [],
        }
      };

      const buildRef = doc(this.db, 'builds', buildId);
      await setDoc(buildRef, {
        ...buildData,
        metadata: {
          ...buildData.metadata,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      });

      // Update user's saved builds
      await authService.saveBuild(buildId);

      return buildId;
    } catch (error) {
      console.error('Save build error:', error);
      throw error;
    }
  }

  // Get build by ID
  async getBuild(buildId: string): Promise<CarBuild | null> {
    try {
      const buildRef = doc(this.db, 'builds', buildId);
      const buildSnap = await getDoc(buildRef);
      
      if (buildSnap.exists()) {
        const data = buildSnap.data();
        return {
          ...data,
          metadata: {
            ...data.metadata,
            createdAt: data.metadata.createdAt?.toDate() || new Date(),
            updatedAt: data.metadata.updatedAt?.toDate() || new Date(),
          }
        } as CarBuild;
      }
      
      return null;
    } catch (error) {
      console.error('Get build error:', error);
      throw error;
    }
  }

  // Get user's saved builds
  async getUserBuilds(): Promise<CarBuild[]> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const buildsRef = collection(this.db, 'builds');
      const q = query(
        buildsRef,
        where('userId', '==', user.uid),
        orderBy('metadata.createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const builds: CarBuild[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        builds.push({
          ...data,
          metadata: {
            ...data.metadata,
            createdAt: data.metadata.createdAt?.toDate() || new Date(),
            updatedAt: data.metadata.updatedAt?.toDate() || new Date(),
          }
        } as CarBuild);
      });
      
      return builds;
    } catch (error) {
      console.error('Get user builds error:', error);
      throw error;
    }
  }

  // Update build
  async updateBuild(buildId: string, updates: Partial<CarBuild>): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const buildRef = doc(this.db, 'builds', buildId);
      
      // Check if user owns this build
      const buildSnap = await getDoc(buildRef);
      if (!buildSnap.exists()) {
        throw new Error('Build not found');
      }
      
      const buildData = buildSnap.data();
      if (buildData.userId !== user.uid) {
        throw new Error('Unauthorized to update this build');
      }

      await updateDoc(buildRef, {
        ...updates,
        'metadata.updatedAt': serverTimestamp(),
      });
    } catch (error) {
      console.error('Update build error:', error);
      throw error;
    }
  }

  // Delete build
  async deleteBuild(buildId: string): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const buildRef = doc(this.db, 'builds', buildId);
      
      // Check if user owns this build
      const buildSnap = await getDoc(buildRef);
      if (!buildSnap.exists()) {
        throw new Error('Build not found');
      }
      
      const buildData = buildSnap.data();
      if (buildData.userId !== user.uid) {
        throw new Error('Unauthorized to delete this build');
      }

      await deleteDoc(buildRef);
      
      // Remove from user's saved builds
      await authService.removeBuild(buildId);
    } catch (error) {
      console.error('Delete build error:', error);
      throw error;
    }
  }

  // Get public builds (for inspiration)
  async getPublicBuilds(limitCount: number = 10): Promise<CarBuild[]> {
    try {
      const buildsRef = collection(this.db, 'builds');
      const q = query(
        buildsRef,
        where('metadata.isPublic', '==', true),
        orderBy('metadata.createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const builds: CarBuild[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        builds.push({
          ...data,
          metadata: {
            ...data.metadata,
            createdAt: data.metadata.createdAt?.toDate() || new Date(),
            updatedAt: data.metadata.updatedAt?.toDate() || new Date(),
          }
        } as CarBuild);
      });
      
      return builds;
    } catch (error) {
      console.error('Get public builds error:', error);
      throw error;
    }
  }

  // Share build (make it public)
  async shareBuild(buildId: string, description?: string, tags?: string[]): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const buildRef = doc(this.db, 'builds', buildId);
      
      // Check if user owns this build
      const buildSnap = await getDoc(buildRef);
      if (!buildSnap.exists()) {
        throw new Error('Build not found');
      }
      
      const buildData = buildSnap.data();
      if (buildData.userId !== user.uid) {
        throw new Error('Unauthorized to share this build');
      }

      await updateDoc(buildRef, {
        'metadata.isPublic': true,
        'metadata.description': description || '',
        'metadata.tags': tags || [],
        'metadata.updatedAt': serverTimestamp(),
      });
    } catch (error) {
      console.error('Share build error:', error);
      throw error;
    }
  }

  // Generate manufacturing specifications
  async generateManufacturingSpecs(buildId: string): Promise<any> {
    const build = await this.getBuild(buildId);
    if (!build) {
      throw new Error('Build not found');
    }

    // Generate production-ready specifications
    const manufacturingSpecs = {
      buildId: build.id,
      carModel: build.carName,
      specifications: {
        exterior: {
          color: {
            name: build.customizations.color.name,
            hex: build.customizations.color.hex,
            paintCode: this.generatePaintCode(build.customizations.color.hex),
            materialType: 'Automotive Paint',
            applicationMethod: 'Electrostatic Spray',
            curingTemperature: '140°C',
            curingTime: '20 minutes'
          },
          wheels: {
            type: build.customizations.wheel.name,
            size: this.extractWheelSize(build.customizations.wheel.name),
            material: 'Aluminum Alloy',
            finish: 'Machined',
            loadRating: '850kg per wheel'
          }
        },
        interior: {
          upholstery: {
            type: build.customizations.interior.name,
            material: this.getInteriorMaterial(build.customizations.interior.name),
            color: this.getInteriorColor(build.customizations.interior.name),
            stitching: 'Contrast Stitching',
            pattern: 'Standard'
          },
          features: build.customizations.package.features
        },
        qualityControl: {
          inspectionPoints: [
            'Paint finish and color accuracy',
            'Wheel alignment and balance',
            'Interior fit and finish',
            'Feature functionality',
            'Safety system verification'
          ],
          testingRequirements: [
            'Road test - 50km',
            'Paint adhesion test',
            'Interior material durability',
            'Electronic system validation'
          ]
        },
        costBreakdown: {
          baseVehicle: build.basePrice,
          colorUpgrade: build.customizations.color.price,
          wheelUpgrade: build.customizations.wheel.price,
          interiorUpgrade: build.customizations.interior.price,
          packageUpgrade: build.customizations.package.price,
          totalCost: build.totalPrice,
          manufacturingOverhead: build.totalPrice * 0.15,
          profitMargin: build.totalPrice * 0.20
        }
      }
    };

    // Save manufacturing specs to build
    await this.updateBuild(buildId, {
      exportData: {
        ...build.exportData,
        manufacturingSpecs
      }
    });

    return manufacturingSpecs;
  }

  // Helper methods for manufacturing specs
  private generatePaintCode(hex: string): string {
    // Convert hex to paint code format
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `CAR-${r.toString().padStart(3, '0')}-${g.toString().padStart(3, '0')}-${b.toString().padStart(3, '0')}`;
  }

  private extractWheelSize(wheelName: string): string {
    const match = wheelName.match(/(\d+)"/);
    return match ? `${match[1]}"` : '18"';
  }

  private getInteriorMaterial(interiorName: string): string {
    if (interiorName.includes('Premium')) return 'Nappa Leather';
    if (interiorName.includes('Luxury')) return 'Premium Leather with Wood Trim';
    return 'Standard Fabric';
  }

  private getInteriorColor(interiorName: string): string {
    if (interiorName.includes('White')) return 'Cream White';
    if (interiorName.includes('Wood')) return 'Dark Brown';
    return 'Black';
  }
}

// Export singleton instance
export const cloudStorage = CloudStorageService.getInstance(); 