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

// Car data interfaces
export interface CarModel {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  specifications: {
    engine: string;
    transmission: string;
    fuelType: string;
    seating: string;
    topSpeed: string;
    acceleration: string;
    range?: string;
    power?: string;
  };
  features: string[];
  images: string[];
  model3D: string; // URL to 3D model file
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  customizationOptions: {
    colors: CarColor[];
    wheels: CarWheel[];
    interiors: CarInterior[];
    packages: CarPackage[];
  };
}

export interface CarColor {
  id: string;
  name: string;
  hex: string;
  price: number;
  isMetallic?: boolean;
  isPearl?: boolean;
}

export interface CarWheel {
  id: string;
  name: string;
  size: string;
  style: string;
  price: number;
  image: string;
}

export interface CarInterior {
  id: string;
  name: string;
  material: string;
  color: string;
  price: number;
  image: string;
}

export interface CarPackage {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
}

class CarDataService {
  private db = getFirestore();

  // Get all active car models
  async getAllCars(): Promise<CarModel[]> {
    try {
      const carsRef = collection(this.db, 'cars');
      const q = query(carsRef, where('status', '==', 'active'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const cars: CarModel[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cars.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CarModel);
      });
      
      return cars;
    } catch (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
  }

  // Get car by ID
  async getCarById(carId: string): Promise<CarModel | null> {
    try {
      const carRef = doc(this.db, 'cars', carId);
      const carSnap = await getDoc(carRef);
      
      if (carSnap.exists()) {
        const data = carSnap.data();
        return {
          id: carSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CarModel;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching car:', error);
      return null;
    }
  }

  // Get cars by manufacturer
  async getCarsByManufacturer(manufacturerId: string): Promise<CarModel[]> {
    try {
      const carsRef = collection(this.db, 'cars');
      const q = query(
        carsRef, 
        where('manufacturerId', '==', manufacturerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const cars: CarModel[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cars.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CarModel);
      });
      
      return cars;
    } catch (error) {
      console.error('Error fetching manufacturer cars:', error);
      return [];
    }
  }

  // Add new car (manufacturer only)
  async addCar(carData: Omit<CarModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is a manufacturer
      const userType = localStorage.getItem('userType');
      if (userType !== 'manufacturer') {
        throw new Error('Only manufacturers can add cars');
      }

      const carsRef = collection(this.db, 'cars');
      const newCarRef = doc(carsRef);
      
      const carToSave = {
        ...carData,
        manufacturerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newCarRef, carToSave);
      return newCarRef.id;
    } catch (error) {
      console.error('Error adding car:', error);
      throw error;
    }
  }

  // Update car (manufacturer only)
  async updateCar(carId: string, updates: Partial<CarModel>): Promise<void> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is a manufacturer
      const userType = localStorage.getItem('userType');
      if (userType !== 'manufacturer') {
        throw new Error('Only manufacturers can update cars');
      }

      const carRef = doc(this.db, 'cars', carId);
      const carSnap = await getDoc(carRef);
      
      if (!carSnap.exists()) {
        throw new Error('Car not found');
      }

      const carData = carSnap.data();
      if (carData.manufacturerId !== user.uid) {
        throw new Error('You can only update your own cars');
      }

      await updateDoc(carRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  // Delete car (manufacturer only)
  async deleteCar(carId: string): Promise<void> {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('Authentication required');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user is a manufacturer
      const userType = localStorage.getItem('userType');
      if (userType !== 'manufacturer') {
        throw new Error('Only manufacturers can delete cars');
      }

      const carRef = doc(this.db, 'cars', carId);
      const carSnap = await getDoc(carRef);
      
      if (!carSnap.exists()) {
        throw new Error('Car not found');
      }

      const carData = carSnap.data();
      if (carData.manufacturerId !== user.uid) {
        throw new Error('You can only delete your own cars');
      }

      await deleteDoc(carRef);
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }

  // Search cars
  async searchCars(searchParams: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    manufacturer?: string;
  }): Promise<CarModel[]> {
    try {
      const carsRef = collection(this.db, 'cars');
      let q = query(carsRef, where('status', '==', 'active'));

      // Add filters
      if (searchParams.category) {
        q = query(q, where('category', '==', searchParams.category));
      }
      if (searchParams.manufacturer) {
        q = query(q, where('manufacturerName', '==', searchParams.manufacturer));
      }

      const querySnapshot = await getDocs(q);
      
      let cars: CarModel[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cars.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as CarModel);
      });

      // Apply additional filters in memory
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        cars = cars.filter(car => 
          car.name.toLowerCase().includes(query) ||
          car.description.toLowerCase().includes(query) ||
          car.manufacturerName.toLowerCase().includes(query)
        );
      }

      if (searchParams.minPrice !== undefined) {
        cars = cars.filter(car => car.basePrice >= searchParams.minPrice!);
      }

      if (searchParams.maxPrice !== undefined) {
        cars = cars.filter(car => car.basePrice <= searchParams.maxPrice!);
      }

      return cars.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error searching cars:', error);
      return [];
    }
  }

  // Get car categories
  async getCarCategories(): Promise<string[]> {
    try {
      const cars = await this.getAllCars();
      const categories = [...new Set(cars.map(car => car.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get manufacturers
  async getManufacturers(): Promise<string[]> {
    try {
      const cars = await this.getAllCars();
      const manufacturers = [...new Set(cars.map(car => car.manufacturerName))];
      return manufacturers.sort();
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      return [];
    }
  }
}

export const carDataService = new CarDataService(); 