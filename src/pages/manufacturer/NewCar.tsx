import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Car, Save, ArrowLeft, Loader2, Info, CheckCircle, AlertCircle, FileText, Image, Box, Settings, Plus, Trash2 } from "lucide-react";
import { carDataService } from "@/services/carData";
import { authService } from "@/services/auth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fileUploadService } from "@/services/fileUploadService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper functions (moved outside component for accessibility)
const getOptionTypeLabel = (type: string) => {
  const labels: { [key: string]: string } = {
    colors: "Colors",
    wheels: "Wheels", 
    interiors: "Interiors",
    packages: "Feature Packages",
    exteriorFeatures: "Exterior Features",
    technology: "Technology",
    performance: "Performance"
  };
  return labels[type] || type;
};

const getDefaultOption = (type: string) => {
  switch (type) {
    case 'colors':
      return { name: 'New Color', hex: '#000000', price: 0 };
    case 'wheels':
      return { name: 'New Wheel', size: '18"', style: 'Alloy', price: 0, image: '/images/wheel-standard.png' };
    case 'interiors':
      return { name: 'New Interior', material: 'Cloth', color: 'Black', price: 0, image: '/images/interior-standard.png' };
    case 'packages':
      return { name: 'New Package', description: 'Package description', features: ['Feature 1'], price: 0 };
    default:
      return { name: 'New Option', description: 'Option description', price: 0 };
  }
};

// Add Customization Form Component
const AddCustomizationForm = ({ type, onAdd, onCancel }: { 
  type: string; 
  onAdd: (option: any) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState(getDefaultOption(type));

  const handleSubmit = () => {
    if (!formData.name || formData.price === 0) {
      return;
    }
    onAdd(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="add-name">Name *</Label>
          <Input
            id="add-name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="add-price">Price ($) *</Label>
          <Input
            id="add-price"
            type="number"
            placeholder="0"
            value={formData.price}
            onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      {type === 'colors' && (
        <div>
          <Label htmlFor="add-color">Color *</Label>
          <div className="flex gap-2">
            <Input
              id="add-color"
              type="color"
              value={formData.hex}
              onChange={(e) => updateField('hex', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              placeholder="#000000"
              value={formData.hex}
              onChange={(e) => updateField('hex', e.target.value)}
            />
          </div>
        </div>
      )}

      {(type === 'wheels' || type === 'interiors') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="add-detail1">
              {type === 'wheels' ? 'Size (e.g., 18")' : 'Material'}
            </Label>
            <Input
              id="add-detail1"
              placeholder={type === 'wheels' ? "Size (e.g., 18\")" : "Material"}
              value={type === 'wheels' ? formData.size : formData.material}
              onChange={(e) => updateField(type === 'wheels' ? 'size' : 'material', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="add-detail2">
              {type === 'wheels' ? 'Style (e.g., Alloy)' : 'Color'}
            </Label>
            <Input
              id="add-detail2"
              placeholder={type === 'wheels' ? "Style (e.g., Alloy)" : "Color"}
              value={type === 'wheels' ? formData.style : formData.color}
              onChange={(e) => updateField(type === 'wheels' ? 'style' : 'color', e.target.value)}
            />
          </div>
        </div>
      )}

      {(type === 'packages' || type === 'exteriorFeatures' || type === 'technology' || type === 'performance') && (
        <div>
          <Label htmlFor="add-description">Description</Label>
          <Textarea
            id="add-description"
            placeholder="Describe this option..."
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" onClick={handleSubmit}>
          Add {getOptionTypeLabel(type)}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Edit Customization Form Component
const EditCustomizationForm = ({ type, data, onUpdate, onCancel }: { 
  type: string; 
  data: any; 
  onUpdate: (option: any) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState(data);

  const handleSubmit = () => {
    if (!formData.name || formData.price === 0) {
      return;
    }
    onUpdate(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="edit-price">Price ($) *</Label>
          <Input
            id="edit-price"
            type="number"
            value={formData.price}
            onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      {type === 'colors' && (
        <div>
          <Label htmlFor="edit-color">Color *</Label>
          <div className="flex gap-2">
            <Input
              id="edit-color"
              type="color"
              value={formData.hex}
              onChange={(e) => updateField('hex', e.target.value)}
              className="w-20 h-10"
            />
            <Input
              value={formData.hex}
              onChange={(e) => updateField('hex', e.target.value)}
            />
          </div>
        </div>
      )}

      {(type === 'wheels' || type === 'interiors') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-detail1">
              {type === 'wheels' ? 'Size (e.g., 18")' : 'Material'}
            </Label>
            <Input
              id="edit-detail1"
              value={type === 'wheels' ? formData.size : formData.material}
              onChange={(e) => updateField(type === 'wheels' ? 'size' : 'material', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-detail2">
              {type === 'wheels' ? 'Style (e.g., Alloy)' : 'Color'}
            </Label>
            <Input
              id="edit-detail2"
              value={type === 'wheels' ? formData.style : formData.color}
              onChange={(e) => updateField(type === 'wheels' ? 'style' : 'color', e.target.value)}
            />
          </div>
        </div>
      )}

      {(type === 'packages' || type === 'exteriorFeatures' || type === 'technology' || type === 'performance') && (
        <div>
          <Label htmlFor="edit-description">Description</Label>
          <Textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" onClick={handleSubmit}>
          Update {getOptionTypeLabel(type)}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

const NewCar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    specifications: {
      engine: "",
      transmission: "",
      fuelType: "",
      seating: "",
      topSpeed: "",
      acceleration: ""
    },
    features: "",
    images: [] as File[],
    model3D: null as File | null,
    customizationOptions: {
      colors: [
        { id: "color1", name: "Red", hex: "#FF0000", price: 0 },
        { id: "color2", name: "Blue", hex: "#0000FF", price: 500 },
        { id: "color3", name: "Black", hex: "#000000", price: 0 },
        { id: "color4", name: "White", hex: "#FFFFFF", price: 0 }
      ],
      wheels: [
        { id: "wheel1", name: "Standard", size: "18\"", style: "Alloy", price: 0, image: "/images/wheel-standard.png" },
        { id: "wheel2", name: "Sport", size: "19\"", style: "Sport", price: 1500, image: "/images/wheel-sport.png" },
        { id: "wheel3", name: "Premium", size: "20\"", style: "Premium", price: 2500, image: "/images/wheel-premium.png" }
      ],
      interiors: [
        { id: "interior1", name: "Standard", material: "Cloth", color: "Black", price: 0, image: "/images/interior-standard.png" },
        { id: "interior2", name: "Leather", material: "Leather", color: "Beige", price: 2000, image: "/images/interior-leather.png" },
        { id: "interior3", name: "Luxury", material: "Nappa Leather", color: "Brown", price: 3500, image: "/images/interior-luxury.png" }
      ],
      packages: [
        { id: "package1", name: "Base Package", description: "Standard features", features: ["Standard Audio", "Manual Seats", "Basic Safety"], price: 0 },
        { id: "package2", name: "Premium Package", description: "Enhanced comfort and safety", features: ["Premium Audio", "Heated Seats", "Advanced Safety"], price: 4500 },
        { id: "package3", name: "Ultimate Package", description: "Maximum luxury and technology", features: ["Premium Audio", "Ventilated Seats", "Full Self-Driving"], price: 8000 }
      ],
      exteriorFeatures: [
        { id: "exterior1", name: "Sunroof", description: "Power sunroof", price: 1200 },
        { id: "exterior2", name: "LED Headlights", description: "Advanced LED lighting", price: 800 },
        { id: "exterior3", name: "Sport Package", description: "Sport body kit and exhaust", price: 2500 }
      ],
      technology: [
        { id: "tech1", name: "Navigation System", description: "Built-in GPS navigation", price: 600 },
        { id: "tech2", name: "Wireless Charging", description: "Wireless phone charging pad", price: 300 },
        { id: "tech3", name: "360° Camera", description: "Surround view camera system", price: 900 }
      ],
      performance: [
        { id: "perf1", name: "Sport Mode", description: "Enhanced performance tuning", price: 1500 },
        { id: "perf2", name: "Performance Brakes", description: "Upgraded brake system", price: 2000 },
        { id: "perf3", name: "Suspension Upgrade", description: "Sport suspension system", price: 1800 }
      ]
    }
  });

  // State for editing customization options
  const [editingOption, setEditingOption] = useState<{
    type: string;
    index: number;
    data: any;
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState<{
    type: string;
    show: boolean;
  } | null>(null);

  const steps = [
    { id: 1, title: "Basic Information", description: "Car name, category, and pricing" },
    { id: 2, title: "Specifications", description: "Technical details and features" },
    { id: 3, title: "3D Model & Images", description: "Upload 3D model and car images" },
    { id: 4, title: "Customization Options", description: "Colors, wheels, and packages" },
    { id: 5, title: "Review & Publish", description: "Final review and publish to catalog" }
  ];

  useEffect(() => {
    // Check if user is a manufacturer
    const userType = localStorage.getItem("userType");
    if (userType !== "manufacturer") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("spec_")) {
      const specName = name.replace("spec_", "");
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specName]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        
        if (!isValidType) {
          toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: `${file.name} is not a valid image file.`,
          });
        }
        
        if (!isValidSize) {
          toast({
            variant: "destructive",
            title: "File Too Large",
            description: `${file.name} is larger than 5MB.`,
          });
        }
        
        return isValidType && isValidSize;
      });
      
      if (validFiles.length > 0) {
        setFormData({ ...formData, images: [...formData.images, ...validFiles] });
        toast({
          title: "Images Added",
          description: `${validFiles.length} image(s) added successfully.`,
        });
      }
    }
  };

  const handle3DModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Only validate file type and size, don't check for images
      const isValidType = file.name.toLowerCase().endsWith('.glb');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a GLB format file.",
        });
        return;
      }
      
      if (!isValidSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "3D model file must be smaller than 50MB.",
        });
        return;
      }
      
      setFormData({ ...formData, model3D: file });
      toast({
        title: "3D Model Added",
        description: `${file.name} uploaded successfully.`,
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  // Helper functions for customization options
  const addCustomizationOption = (type: string, newOption: any) => {
    const optionId = `${type}_${Date.now()}`;
    const optionWithId = { ...newOption, id: optionId };
    
    setFormData({
      ...formData,
      customizationOptions: {
        ...formData.customizationOptions,
        [type]: [...formData.customizationOptions[type as keyof typeof formData.customizationOptions], optionWithId]
      }
    });
    setShowAddForm(null);
  };

  const updateCustomizationOption = (type: string, index: number, updatedOption: any) => {
    const updatedOptions = [...formData.customizationOptions[type as keyof typeof formData.customizationOptions]];
    updatedOptions[index] = { ...updatedOptions[index], ...updatedOption };
    
    setFormData({
      ...formData,
      customizationOptions: {
        ...formData.customizationOptions,
        [type]: updatedOptions
      }
    });
    setEditingOption(null);
  };

  const deleteCustomizationOption = (type: string, index: number) => {
    const updatedOptions = formData.customizationOptions[type as keyof typeof formData.customizationOptions].filter((_, i) => i !== index);
    
    setFormData({
      ...formData,
      customizationOptions: {
        ...formData.customizationOptions,
        [type]: updatedOptions
      }
    });
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let canProceed = true;
    
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.category || !formData.price || !formData.description) {
          toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all required fields before proceeding.",
          });
          canProceed = false;
        }
        break;
      case 2:
        // Step 2 is optional, no validation needed
        break;
      case 3:
        if (!formData.model3D) {
          toast({
            variant: "destructive",
            title: "Missing 3D Model",
            description: "Please upload a 3D model before proceeding.",
          });
          canProceed = false;
        }
        if (formData.images.length === 0) {
          toast({
            variant: "destructive",
            title: "Missing Images",
            description: "Please upload at least one image before proceeding.",
          });
          canProceed = false;
        }
        break;
      case 4:
        // Step 4 is optional, no validation needed
        break;
    }
    
    if (canProceed && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      if (!formData.model3D) {
        throw new Error('Please upload a 3D model');
      }

      // Get current user
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get manufacturer name from localStorage or user profile
      const manufacturerName = localStorage.getItem("manufacturerName") || "Unknown Manufacturer";

      // Create a temporary car ID for file uploads
      const tempCarId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setUploadProgress(10);
      toast({
        title: "🚀 Uploading Images",
        description: "Uploading car images...",
      });

      // Upload images and get URLs
      let imageUrls: string[] = [];
      try {
        imageUrls = await fileUploadService.uploadImages(formData.images, tempCarId);
        console.log('Uploaded image URLs:', imageUrls);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Image Upload Failed",
          description: err.message || 'Failed to upload images.'
        });
        setIsLoading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(45);
      toast({
        title: "🚗 Uploading 3D Model",
        description: "Uploading 3D model file...",
      });

      // Upload 3D model and get URL
      let model3DUrl = '';
      try {
        model3DUrl = await fileUploadService.upload3DModel(formData.model3D, tempCarId);
        console.log('Uploaded 3D model URL:', model3DUrl);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "3D Model Upload Failed",
          description: err.message || 'Failed to upload 3D model.'
        });
        setIsLoading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(60);
      toast({
        title: "💾 Saving to Database",
        description: "Storing car information...",
      });

      // Prepare car data for saving
      const carData = {
        manufacturerId: user.uid,
        manufacturerName: manufacturerName,
        name: formData.name,
        category: formData.category,
        basePrice: parseFloat(formData.price),
        description: formData.description,
        specifications: {
          engine: formData.specifications.engine,
          transmission: formData.specifications.transmission,
          fuelType: formData.specifications.fuelType,
          seating: formData.specifications.seating,
          topSpeed: formData.specifications.topSpeed,
          acceleration: formData.specifications.acceleration
        },
        features: formData.features.split('\n').filter(feature => feature.trim()),
        images: imageUrls, // Use uploaded image URLs
        model3D: model3DUrl, // Use uploaded 3D model URL
        status: 'active' as const,
        customizationOptions: formData.customizationOptions
      };

      // Save car to database
      setUploadProgress(85);
      const carId = await carDataService.addCar(carData);
      setUploadProgress(100);

      toast({
        title: "🎉 Car Published Successfully!",
        description: `"${formData.name}" is now live in the catalog!`,
      });

      // Navigate immediately
      setTimeout(() => {
        navigate("/manufacturer/cars");
      }, 500);

    } catch (error: any) {
      console.error('Error adding car:', error);
      toast({
        variant: "destructive",
        title: "❌ Upload Failed",
        description: error.message || "Failed to add car. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Basic Information</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Start with the essential details about your car model. This information will be displayed to customers in the catalog.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Car Model Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Tesla Model S, BMW i4"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sports">Sports Car</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Base Price (USD) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="50000"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your car model, its features, and what makes it special..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Technical Specifications</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Provide detailed technical specifications that customers will use to compare your vehicle with others.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="spec_engine">Engine</Label>
                <Input
                  id="spec_engine"
                  name="spec_engine"
                  placeholder="e.g., 2.0L Turbo, Electric Motor"
                  value={formData.specifications.engine}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec_transmission">Transmission</Label>
                <Input
                  id="spec_transmission"
                  name="spec_transmission"
                  placeholder="e.g., Automatic, Manual, Single-speed"
                  value={formData.specifications.transmission}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec_fuelType">Fuel Type</Label>
                <Input
                  id="spec_fuelType"
                  name="spec_fuelType"
                  placeholder="e.g., Gasoline, Electric, Hybrid"
                  value={formData.specifications.fuelType}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec_seating">Seating Capacity</Label>
                <Input
                  id="spec_seating"
                  name="spec_seating"
                  placeholder="e.g., 5 seats, 7 seats"
                  value={formData.specifications.seating}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec_topSpeed">Top Speed</Label>
                <Input
                  id="spec_topSpeed"
                  name="spec_topSpeed"
                  placeholder="e.g., 155 mph, 200 km/h"
                  value={formData.specifications.topSpeed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spec_acceleration">0-60 mph Acceleration</Label>
                <Input
                  id="spec_acceleration"
                  name="spec_acceleration"
                  placeholder="e.g., 3.1 seconds"
                  value={formData.specifications.acceleration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Key Features</Label>
              <Textarea
                id="features"
                name="features"
                placeholder="Enter each feature on a new line:&#10;• Advanced Safety Features&#10;• Premium Audio System&#10;• Heated Seats&#10;• Navigation System"
                value={formData.features}
                onChange={handleInputChange}
                rows={6}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Box className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">3D Model & Images</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Upload a 3D model (GLB format) and high-quality images to showcase your vehicle in the 3D viewer and catalog.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>3D Model (GLB Format) *</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.model3D ? formData.model3D.name : "Drop your 3D model here or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500">Supports GLB format, max 50MB</p>
                    <Input
                      type="file"
                      accept=".glb"
                      onChange={handle3DModelUpload}
                      className="hidden"
                      id="3d-model"
                    />
                    <Button variant="outline" type="button" onClick={() => document.getElementById('3d-model')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose 3D Model
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Car Images</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upload high-quality images of your car (multiple angles recommended)
                    </p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, max 5MB each</p>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="car-images"
                    />
                    <Button variant="outline" type="button" onClick={() => document.getElementById('car-images')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Images
                    </Button>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Car image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">Customization Options</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Configure all the customization options that customers can choose from when building their car.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Colors Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Colors</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'colors', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.customizationOptions.colors.map((color, index) => (
                    <div key={color.id} className="relative group">
                      <div className="text-center">
                        <div
                          className="w-full h-16 rounded-lg mb-2 border-2 border-gray-200 cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setEditingOption({ type: 'colors', index, data: color })}
                        />
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-xs text-gray-500">${color.price}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteCustomizationOption('colors', index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wheels Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Wheels</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'wheels', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Wheel
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.wheels.map((wheel, index) => (
                    <div key={wheel.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{wheel.name}</p>
                          <p className="text-sm text-gray-600">{wheel.size} {wheel.style}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">${wheel.price}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption({ type: 'wheels', index, data: wheel })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCustomizationOption('wheels', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interiors Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Interiors</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'interiors', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Interior
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.interiors.map((interior, index) => (
                    <div key={interior.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{interior.name}</p>
                          <p className="text-sm text-gray-600">{interior.material} {interior.color}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">${interior.price}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption({ type: 'interiors', index, data: interior })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCustomizationOption('interiors', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Packages Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Feature Packages</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'packages', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Package
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.packages.map((pkg, index) => (
                    <div key={pkg.id} className="p-3 border rounded-lg group">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{pkg.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">${pkg.price}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingOption({ type: 'packages', index, data: pkg })}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteCustomizationOption('packages', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exterior Features Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Exterior Features</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'exteriorFeatures', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.exteriorFeatures.map((feature, index) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div>
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">${feature.price}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption({ type: 'exteriorFeatures', index, data: feature })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCustomizationOption('exteriorFeatures', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Technology</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'technology', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Tech
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.technology.map((tech, index) => (
                    <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-gray-600">{tech.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">${tech.price}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption({ type: 'technology', index, data: tech })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCustomizationOption('technology', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Section */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Performance</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddForm({ type: 'performance', show: true })}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Performance
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.customizationOptions.performance.map((perf, index) => (
                    <div key={perf.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div>
                        <p className="font-medium">{perf.name}</p>
                        <p className="text-sm text-gray-600">{perf.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">${perf.price}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption({ type: 'performance', index, data: perf })}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCustomizationOption('performance', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">Review & Publish</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Review all the information before publishing your car to the catalog. You can edit any details after publishing.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {formData.name}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {formData.category}
                  </div>
                  <div>
                    <span className="font-medium">Base Price:</span> ${formData.price}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Specs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><span className="font-medium">Engine:</span> {formData.specifications.engine}</div>
                  <div><span className="font-medium">Transmission:</span> {formData.specifications.transmission}</div>
                  <div><span className="font-medium">Fuel Type:</span> {formData.specifications.fuelType}</div>
                  <div><span className="font-medium">Seating:</span> {formData.specifications.seating}</div>
                  <div><span className="font-medium">Top Speed:</span> {formData.specifications.topSpeed}</div>
                  <div><span className="font-medium">Acceleration:</span> {formData.specifications.acceleration}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  <span>3D Model: {formData.model3D ? formData.model3D.name : "Not uploaded"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Images: {formData.images.length} uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Customization Options: {formData.customizationOptions.colors.length} colors, {formData.customizationOptions.wheels.length} wheels, {formData.customizationOptions.packages.length} packages</span>
                </div>
              </CardContent>
            </Card>

            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Animated Header */}
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center animate-pulse">
                            <Car className="h-8 w-8 text-white animate-bounce" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Publishing Your Car</h3>
                      <p className="text-gray-600">We're making your car live in the catalog...</p>
                    </div>

                    {/* Step-by-step Progress */}
                    <div className="space-y-4">
                      {/* Step 1: File Upload */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        uploadProgress >= 10 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          uploadProgress >= 70 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {uploadProgress >= 70 ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : uploadProgress >= 10 ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-sm font-bold">1</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Uploading Files</p>
                          <p className="text-sm text-gray-600">
                            {uploadProgress >= 70 
                              ? `✅ ${formData.images.length} images and 3D model uploaded`
                              : uploadProgress >= 10 
                                ? '📤 Uploading images and 3D model...'
                                : '⏳ Waiting to start...'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Database Save */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        uploadProgress >= 85 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          uploadProgress >= 95 ? 'bg-green-500 text-white' : uploadProgress >= 85 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {uploadProgress >= 95 ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : uploadProgress >= 85 ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-sm font-bold">2</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Saving to Database</p>
                          <p className="text-sm text-gray-600">
                            {uploadProgress >= 95 
                              ? '✅ Car information saved successfully'
                              : uploadProgress >= 85 
                                ? '💾 Storing car details in catalog...'
                                : '⏳ Waiting for file upload...'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Publishing */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        uploadProgress >= 100 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          uploadProgress >= 100 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {uploadProgress >= 100 ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-bold">3</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Making Car Live</p>
                          <p className="text-sm text-gray-600">
                            {uploadProgress >= 100 
                              ? '🎉 Car is now live in the catalog!'
                              : '⏳ Preparing to publish...'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Fun Facts */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600">💡</span>
                          <span className="text-sm font-medium text-blue-800">Did you know?</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {uploadProgress < 30 && "Your files are being optimized for the best viewing experience..."}
                          {uploadProgress >= 30 && uploadProgress < 70 && "We're ensuring your 3D model loads smoothly in our viewer..."}
                          {uploadProgress >= 70 && uploadProgress < 100 && "Your car is being added to our search index for customers to discover..."}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/manufacturer/cars")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Car Model</h1>
            <p className="text-gray-600 mt-2">Create a new car model for your catalog</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className={`text-center ${currentStep === step.id ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Publish Car
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {showAddForm?.show && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add {getOptionTypeLabel(showAddForm.type)}</CardTitle>
              </CardHeader>
              <CardContent>
                <AddCustomizationForm
                  type={showAddForm.type}
                  onAdd={(option) => {
                    addCustomizationOption(showAddForm.type, option);
                  }}
                  onCancel={() => setShowAddForm(null)}
                />
              </CardContent>
            </Card>
          </div>
        )}
        {editingOption && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit {getOptionTypeLabel(editingOption.type)}</CardTitle>
              </CardHeader>
              <CardContent>
                <EditCustomizationForm
                  type={editingOption.type}
                  data={editingOption.data}
                  onUpdate={(option) => {
                    updateCustomizationOption(editingOption.type, editingOption.index, option);
                  }}
                  onCancel={() => setEditingOption(null)}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewCar;
