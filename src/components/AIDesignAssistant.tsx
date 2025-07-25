import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Palette, 
  Cog, 
  Paintbrush,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

interface AISuggestion {
  id: string;
  type: 'color' | 'wheel' | 'interior' | 'package';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  impact: 'performance' | 'aesthetics' | 'cost' | 'trending';
  price?: number;
  hex?: string;
}

interface AIDesignAssistantProps {
  currentSelections: {
    color?: { hex: string; name: string };
    customColor?: string; // Add custom color support
    wheel?: { id: string; name: string };
    interior?: { id: string; name: string };
    package?: { id: string; name: string };
  };
  onApplySuggestion: (suggestion: AISuggestion) => void;
  userPreferences?: string[];
}

// AI-powered design recommendation engine
class AIDesignEngine {
  private static instance: AIDesignEngine;
  private userHistory: Map<string, any[]> = new Map();
  private trendingData: Map<string, number> = new Map();

  static getInstance(): AIDesignEngine {
    if (!AIDesignEngine.instance) {
      AIDesignEngine.instance = new AIDesignEngine();
    }
    return AIDesignEngine.instance;
  }

  // Analyze current selections and generate recommendations
  generateRecommendations(currentSelections: any, userPreferences: string[] = []): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    // Color recommendations based on trends and user preferences
    const currentColorHex = currentSelections.customColor || (currentSelections.color ? currentSelections.color.hex : null);
    const colorSuggestions = this.generateColorSuggestions({ hex: currentColorHex }, userPreferences);
    suggestions.push(...colorSuggestions);
    
    // Wheel recommendations based on performance and aesthetics
    const wheelSuggestions = this.generateWheelSuggestions(currentSelections.wheel, currentSelections.color);
    suggestions.push(...wheelSuggestions);
    
    // Interior recommendations based on color harmony
    const interiorSuggestions = this.generateInteriorSuggestions(currentSelections.interior, currentSelections.color);
    suggestions.push(...interiorSuggestions);
    
    // Package recommendations based on user behavior patterns
    const packageSuggestions = this.generatePackageSuggestions(currentSelections.package, userPreferences);
    suggestions.push(...packageSuggestions);
    
    // Sort by confidence and return top recommendations
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
  }

  private generateColorSuggestions(currentColor: any, userPreferences: string[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    // Trending colors analysis with better descriptions
    const trendingColors = [
      { 
        hex: '#3b82f6', 
        name: 'Electric Blue', 
        trend: 0.95,
        description: 'Popular choice for modern EVs',
        reasoning: 'This vibrant blue is trending among electric vehicle buyers and represents innovation and sustainability.'
      },
      { 
        hex: '#ef4444', 
        name: 'Racing Red', 
        trend: 0.88,
        description: 'Classic performance color',
        reasoning: 'A timeless red that conveys speed and passion, perfect for performance-oriented vehicles.'
      },
      { 
        hex: '#22c55e', 
        name: 'Forest Green', 
        trend: 0.82,
        description: 'Eco-friendly and sophisticated',
        reasoning: 'This natural green reflects environmental consciousness and offers a sophisticated, premium look.'
      },
      { 
        hex: '#a855f7', 
        name: 'Royal Purple', 
        trend: 0.78,
        description: 'Luxury and exclusivity',
        reasoning: 'Purple represents luxury and exclusivity, making your vehicle stand out from the crowd.'
      },
      { 
        hex: '#f97316', 
        name: 'Sunset Orange', 
        trend: 0.75,
        description: 'Bold and energetic',
        reasoning: 'This vibrant orange is perfect for drivers who want to make a bold statement and show their energetic personality.'
      }
    ];
    
    trendingColors.forEach(color => {
      if (color.hex !== currentColor?.hex) {
        const confidence = this.calculateColorConfidence(color, currentColor, userPreferences);
        suggestions.push({
          id: `color-${color.hex}`,
          type: 'color',
          title: color.name,
          description: color.description,
          confidence,
          reasoning: color.reasoning,
          impact: 'trending',
          hex: color.hex
        });
      }
    });
    
    return suggestions;
  }

  private generateWheelSuggestions(currentWheel: any, currentColor: any): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    const wheelOptions = [
      { 
        id: 'wheel2', 
        name: 'Sport 19"', 
        performance: 0.85, 
        aesthetics: 0.9,
        description: 'Enhanced handling and style',
        reasoning: 'These larger wheels provide better road grip and a more aggressive, sporty appearance that complements your vehicle\'s design.'
      },
      { 
        id: 'wheel3', 
        name: 'Performance 20"', 
        performance: 0.95, 
        aesthetics: 0.95,
        description: 'Maximum performance and luxury',
        reasoning: 'Premium 20-inch wheels offer superior handling, braking performance, and a luxurious appearance that elevates your vehicle\'s premium feel.'
      }
    ];
    
    wheelOptions.forEach(wheel => {
      if (wheel.id !== currentWheel?.id) {
        const confidence = this.calculateWheelConfidence(wheel, currentColor);
        suggestions.push({
          id: `wheel-${wheel.id}`,
          type: 'wheel',
          title: wheel.name,
          description: wheel.description,
          confidence,
          reasoning: wheel.reasoning,
          impact: 'performance',
          price: wheel.id === 'wheel2' ? 1500 : 2500
        });
      }
    });
    
    return suggestions;
  }

  private generateInteriorSuggestions(currentInterior: any, currentColor: any): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    const interiorOptions = [
      { 
        id: 'interior2', 
        name: 'Premium White', 
        harmony: 0.9,
        description: 'Clean and modern interior',
        reasoning: 'White interior creates a clean, modern aesthetic that works well with most exterior colors and gives your vehicle a premium, spacious feel.'
      },
      { 
        id: 'interior3', 
        name: 'Luxury Wood Trim', 
        harmony: 0.85,
        description: 'Sophisticated and timeless',
        reasoning: 'Wood trim adds warmth and sophistication to your interior, creating a timeless luxury feel that complements any exterior color.'
      }
    ];
    
    interiorOptions.forEach(interior => {
      if (interior.id !== currentInterior?.id) {
        const confidence = this.calculateInteriorConfidence(interior, currentColor);
        suggestions.push({
          id: `interior-${interior.id}`,
          type: 'interior',
          title: interior.name,
          description: interior.description,
          confidence,
          reasoning: interior.reasoning,
          impact: 'aesthetics',
          price: interior.id === 'interior2' ? 1200 : 2000
        });
      }
    });
    
    return suggestions;
  }

  private generatePackageSuggestions(currentPackage: any, userPreferences: string[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    
    const packageOptions = [
      { 
        id: 'package2', 
        name: 'Premium Package', 
        value: 0.9, 
        features: ['Premium Audio', 'Heated Seats', 'Advanced Safety'],
        description: 'Enhanced comfort and safety',
        reasoning: 'This package adds premium comfort features and advanced safety systems, providing excellent value for daily driving and family use.'
      },
      { 
        id: 'package3', 
        name: 'Ultimate Package', 
        value: 0.95, 
        features: ['Premium Audio', 'Ventilated Seats', 'Full Self-Driving'],
        description: 'Maximum luxury and technology',
        reasoning: 'The ultimate package includes cutting-edge technology and luxury features, perfect for drivers who want the very best in comfort and innovation.'
      }
    ];
    
    packageOptions.forEach(pkg => {
      if (pkg.id !== currentPackage?.id) {
        const confidence = this.calculatePackageConfidence(pkg, userPreferences);
        suggestions.push({
          id: `package-${pkg.id}`,
          type: 'package',
          title: pkg.name,
          description: pkg.description,
          confidence,
          reasoning: pkg.reasoning,
          impact: 'cost',
          price: pkg.id === 'package2' ? 4500 : 8000
        });
      }
    });
    
    return suggestions;
  }

  private calculateColorConfidence(color: any, currentColor: any, userPreferences: string[]): number {
    let confidence = 0.5;
    
    // Trend factor
    confidence += color.trend * 0.3;
    
    // User preference factor
    if (userPreferences.includes(color.hex)) {
      confidence += 0.2;
    }
    
    // Complementary color factor
    if (currentColor && this.isComplementary(color.hex, currentColor.hex)) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private calculateWheelConfidence(wheel: any, currentColor: any): number {
    let confidence = 0.6;
    
    // Performance factor
    confidence += wheel.performance * 0.2;
    
    // Aesthetics factor
    confidence += wheel.aesthetics * 0.2;
    
    return Math.min(confidence, 1.0);
  }

  private calculateInteriorConfidence(interior: any, currentColor: any): number {
    let confidence = 0.7;
    
    // Color harmony factor
    confidence += interior.harmony * 0.3;
    
    return Math.min(confidence, 1.0);
  }

  private calculatePackageConfidence(pkg: any, userPreferences: string[]): number {
    let confidence = 0.5;
    
    // Value factor
    confidence += pkg.value * 0.4;
    
    // User preference factor
    if (userPreferences.some(pref => pkg.features.some((feature: string) => feature.toLowerCase().includes(pref.toLowerCase())))) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private isComplementary(color1: string, color2: string): boolean {
    // Simple complementary color detection
    const colors = [color1, color2].sort();
    const complementaryPairs = [
      ['#ff0000', '#00ffff'], // Red-Cyan
      ['#00ff00', '#ff00ff'], // Green-Magenta
      ['#0000ff', '#ffff00'], // Blue-Yellow
    ];
    
    return complementaryPairs.some(pair => 
      pair[0] === colors[0] && pair[1] === colors[1]
    );
  }
}

const AIDesignAssistant = ({ currentSelections, onApplySuggestion, userPreferences = [] }: AIDesignAssistantProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  const aiEngine = AIDesignEngine.getInstance();

  useEffect(() => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis time
    setTimeout(() => {
      const newSuggestions = aiEngine.generateRecommendations(currentSelections, userPreferences);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 1500);
  }, [currentSelections, userPreferences]);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'aesthetics': return <Palette className="h-4 w-4" />;
      case 'cost': return <CheckCircle className="h-4 w-4" />;
      case 'trending': return <Star className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'aesthetics': return 'bg-purple-100 text-purple-800';
      case 'cost': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 3);

  return (
    <Card className="backdrop-blur-sm border-primary-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary-500" />
          AI Design Assistant
        </CardTitle>
        <CardDescription>
          Get intelligent recommendations based on trends and your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Analyzing your design...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 border rounded-lg hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary-500" />
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge className={getImpactColor(suggestion.impact)}>
                        {getImpactIcon(suggestion.impact)}
                        <span className="ml-1 capitalize">{suggestion.impact}</span>
                      </Badge>
                    </div>
                    {suggestion.price && (
                      <span className="text-sm font-medium text-primary-600">
                        +${suggestion.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span>Confidence</span>
                      <span>{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                    <Progress value={suggestion.confidence * 100} className="h-2" />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    <strong>Why this works:</strong> {suggestion.reasoning}
                  </p>
                  
                  <Button
                    size="sm"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="w-full"
                  >
                    Apply Suggestion
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
            
            {suggestions.length > 3 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? 'Show Less' : `Show ${suggestions.length - 3} More Suggestions`}
              </Button>
            )}
            
            {suggestions.length === 0 && !isAnalyzing && (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recommendations available at the moment.</p>
                <p className="text-xs">Try changing your selections to get new suggestions.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDesignAssistant;