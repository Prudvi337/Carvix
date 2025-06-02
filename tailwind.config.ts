
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#0ea5e9', // Bright cyan blue
					foreground: '#ffffff',
					100: '#e0f7ff',
					200: '#bae8ff',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9', // Base
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				secondary: {
					DEFAULT: '#8b5cf6', // Purple
					foreground: '#ffffff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#8b5cf6', // Base
					600: '#7c3aed',
					700: '#6d28d9',
					800: '#5b21b6',
					900: '#4c1d95',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#f3f4f6',
					foreground: '#6b7280'
				},
				accent: {
					DEFAULT: '#e5e7eb', // Brighter accent
					foreground: '#1f2937'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'spin-slow': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(360deg)' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'zoom-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(14, 165, 233, 0.5), 0 0 25px rgba(14, 165, 233, 0.3)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(14, 165, 233, 0.8), 0 0 40px rgba(14, 165, 233, 0.5)' 
					}
				},
				'cyber-gradient': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'spin-slow': 'spin-slow 20s linear infinite',
				'pulse': 'pulse 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out',
				'zoom-in': 'zoom-in 0.5s ease-out',
				'glow': 'glow 3s ease-in-out infinite',
				'cyber-gradient': 'cyber-gradient 8s ease infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'hero-pattern': 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
				'feature-pattern': 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
				'cta-pattern': 'linear-gradient(to right, #0ea5e9 0%, #8b5cf6 100%)',
				'cyber-pattern': 'linear-gradient(45deg, #0ea5e9, #8b5cf6, #0ea5e9)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
