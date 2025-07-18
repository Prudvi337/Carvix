import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Manufacturer credentials (in a real app, these would be in a secure database)
const MANUFACTURER_CREDENTIALS = {
  "manufacturer@carvix.com": {
    password: "manufacturer123",
    name: "Test Manufacturer",
    userType: "manufacturer"
  }
};

// User interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType: 'customer' | 'manufacturer';
  preferences: {
    favoriteColors: string[];
    favoriteBrands: string[];
    budget: number;
  };
  savedBuilds: string[];
  createdAt: Date;
  lastLogin: Date;
}

class AuthService {
  private userProfile: UserProfile | null = null;
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.loadUserProfile(user);
      } else {
        this.userProfile = null;
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userType");
        localStorage.removeItem("manufacturerName");
      }
    });
    
    this.isInitialized = true;
  }

  async loadUserProfile(user: User) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.userProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || data.displayName || 'User',
          photoURL: user.photoURL || undefined,
          userType: data.userType || 'customer',
          preferences: data.preferences || {
            favoriteColors: [],
            favoriteBrands: [],
            budget: 50000
          },
          savedBuilds: data.savedBuilds || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: new Date()
        };
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userType", this.userProfile.userType);
        if (this.userProfile.userType === 'manufacturer') {
          localStorage.setItem("manufacturerName", this.userProfile.displayName);
        }
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || undefined,
          userType: 'customer',
          preferences: {
            favoriteColors: [],
            favoriteBrands: [],
            budget: 50000
          },
          savedBuilds: [],
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        await setDoc(doc(db, 'users', user.uid), newProfile);
        this.userProfile = newProfile;
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userType", "customer");
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Check if email is a manufacturer credential
  isManufacturerEmail(email: string): boolean {
    return email.toLowerCase() in MANUFACTURER_CREDENTIALS;
  }

  // Get manufacturer info by email
  getManufacturerInfo(email: string) {
    return MANUFACTURER_CREDENTIALS[email.toLowerCase() as keyof typeof MANUFACTURER_CREDENTIALS];
  }

  // Sign in with email and password (including manufacturer credentials)
  async signInWithEmail(email: string, password: string): Promise<UserProfile> {
    try {
      // Check if it's a manufacturer email
      if (this.isManufacturerEmail(email)) {
        const manufacturerInfo = this.getManufacturerInfo(email);
        if (manufacturerInfo.password === password) {
          // Create a mock user for manufacturer (in real app, you'd have proper auth)
          const mockUser = {
            uid: `manufacturer_${email.split('@')[0]}`,
            email: email,
            displayName: manufacturerInfo.name,
            photoURL: undefined
          } as User;
          
          // Create manufacturer profile
          const manufacturerProfile: UserProfile = {
            uid: mockUser.uid,
            email: email,
            displayName: manufacturerInfo.name,
            userType: 'manufacturer',
            preferences: {
              favoriteColors: [],
              favoriteBrands: [],
              budget: 100000
            },
            savedBuilds: [],
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          // Save to database
          await setDoc(doc(db, 'users', mockUser.uid), manufacturerProfile);
          this.userProfile = manufacturerProfile;
          
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userType", "manufacturer");
          localStorage.setItem("manufacturerName", manufacturerInfo.name);
          
          return manufacturerProfile;
        } else {
          throw new Error('Invalid manufacturer credentials');
        }
      } else {
        // Regular Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await this.loadUserProfile(userCredential.user);
        
        if (!this.userProfile) {
          throw new Error('Failed to load user profile');
        }
        
        return this.userProfile;
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await this.loadUserProfile(result.user);
      
      if (!this.userProfile) {
        throw new Error('Failed to load user profile');
      }
      
      return this.userProfile;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  // Sign in with GitHub
  async signInWithGithub(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await this.loadUserProfile(result.user);
      
      if (!this.userProfile) {
        throw new Error('Failed to load user profile');
      }
      
      return this.userProfile;
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      throw new Error(error.message || 'Failed to sign in with GitHub');
    }
  }

  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, { displayName });
      
      // Create user profile
      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        userType: 'customer',
        preferences: {
          favoriteColors: [],
          favoriteBrands: [],
          budget: 50000
        },
        savedBuilds: [],
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newProfile);
      this.userProfile = newProfile;
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", "customer");
      
      return newProfile;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      this.userProfile = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userType");
      localStorage.removeItem("manufacturerName");
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.userProfile !== null;
  }

  // Get current user
  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) return firebaseUser;
    // If manufacturer mock login
    if (this.userProfile && this.userProfile.userType === 'manufacturer') {
      return {
        uid: this.userProfile.uid,
        email: this.userProfile.email,
        displayName: this.userProfile.displayName,
        photoURL: undefined,
        // @ts-ignore
        providerId: 'mock',
        // @ts-ignore
        emailVerified: true,
        // @ts-ignore
        isAnonymous: false,
        // @ts-ignore
        phoneNumber: null,
        // @ts-ignore
        tenantId: null,
        // @ts-ignore
        metadata: {},
        // @ts-ignore
        reload: () => {},
        // @ts-ignore
        delete: () => {},
        // @ts-ignore
        toJSON: () => this.userProfile,
      } as unknown as User;
    }
    return null;
  }

  // Get current user profile
  getCurrentUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  // Check if user is manufacturer
  isManufacturer(): boolean {
    return this.userProfile?.userType === 'manufacturer';
  }

  // Get manufacturer credentials for display
  getManufacturerCredentials() {
    return Object.entries(MANUFACTURER_CREDENTIALS).map(([email, info]) => ({
      email,
      name: info.name,
      password: info.password
    }));
  }

  // Restore user profile from localStorage (for manufacturer mock login persistence)
  restoreProfileFromLocalStorage() {
    const userType = localStorage.getItem('userType');
    const manufacturerName = localStorage.getItem('manufacturerName');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (userType === 'manufacturer' && isLoggedIn === 'true' && manufacturerName) {
      this.userProfile = {
        uid: `manufacturer_${manufacturerName.toLowerCase().replace(/\s/g, '')}`,
        email: 'manufacturer@carvix.com',
        displayName: manufacturerName,
        userType: 'manufacturer',
        preferences: {
          favoriteColors: [],
          favoriteBrands: [],
          budget: 100000
        },
        savedBuilds: [],
        createdAt: new Date(),
        lastLogin: new Date()
      };
    }
  }
}

export const authService = new AuthService(); 