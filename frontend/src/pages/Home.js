import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => (
  <div className="home">
    {/* Hero Section */}
    <div className="hero-section">
      <video className="background-video" autoPlay muted loop>
        <source src="/assets/video.mp4" type="video/mp4" />
      </video>
      <h1 className="heading">Ignite Your Imagination, Design Your Drive</h1>
      <div className="hero-content">
        <h1>Welcome to Carvix</h1>
        <p>Streamline your vehicle design with our AI-powered real-time customization.</p>
        <Link to="/customize" className="customize-button">
          Start Customizing
        </Link>
      </div>
    </div>
    {/* About Section */}
    <section className="about-section">
      <h1>About Carvix</h1>
      <p>Carvix is revolutionizing the vehicle design experience with cutting-edge, AI-powered customization tools tailored to meet the needs of both vehicle enthusiasts and OEMs. Our platform enables users to personalize every detail of their car—from exterior colors and materials to interior features and functional components—using real-time, interactive 3D visualization. With Carvix, design is no longer limited to standard templates; instead, it’s a fully immersive experience where creativity meets precision.</p>
      <h2>Our Vision</h2>
      <p>At Carvix, our vision is to transform the way vehicles are designed and experienced. We believe that each car should be as unique as the person driving it. By leveraging advanced AI algorithms and 3D rendering technology, we aim to make vehicle customization accessible, intuitive, and inspiring. Whether you’re seeking performance, sustainability, or aesthetics, Carvix empowers you to bring your ideal vehicle to life with precision and ease.</p>
      <h2>What Makes Us Different</h2>
      <ul>
        <li><strong>AI-Driven Optimization:</strong> Our AI tools not only help you personalize the look of your vehicle but also optimize it for performance, structural integrity, and aerodynamics, providing a perfect balance between design and engineering.</li>
        <li><strong>Augmented Reality Integration:</strong> With AR technology, you can preview your customized vehicle in your real-world environment, giving you a realistic view before making final decisions.</li>
        <li><strong>Sustainable Choices:</strong> We support eco-conscious design with options for sustainable materials and energy-efficient configurations, helping you create a vehicle that aligns with both your style and environmental values.</li>
      </ul>
      <h2>Why Choose Carvix?</h2>
      <p>Carvix is more than just a customization tool; it’s a comprehensive design experience that brings together the best in AI, AR, and 3D technology. With our platform, you gain access to an intuitive interface, real-time visual feedback, and dynamic cost adjustments that make the design process seamless and transparent. We aim to simplify customization and make premium, high-tech design capabilities available to everyone. Whether you’re an OEM looking for a streamlined design solution or an individual wanting a one-of-a-kind car, Carvix delivers on every front.</p>
      </section>

    {/* Features Section */}
    <h1 className="heading1">Features</h1>
    <div className="features">
      <div className="feature">
        <img src="/assets/optim.jpg" alt="AI optimization" />
        <h2>AI-Driven Optimization</h2>
        <p>Optimize vehicle performance and aesthetics with AI recommendations.</p>
      </div>
      <div className="feature">
        <img src="/assets/image.jpg" alt="Real-time 3D customization" />
        <h2>Real-Time 3D Visualization</h2>
        <p>See your customizations in real-time with advanced 3D rendering.</p>
      </div>
      <div className="feature">
        <img src="/assets/ar.jpg" alt="AR integration" />
        <h2>AR Integration</h2>
        <p>Experience your vehicle design in Augmented Reality for a real-world view.</p>
      </div>
    </div>

    {/* Contact Section */}
    <div className="contact-section">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? We’d love to hear from you. Fill out the form below, and our team will get back to you promptly.</p>
      <form className="contact-form">
        <label>
          Name:
          <input type="text" name="name" placeholder="Your Name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" placeholder="Your Email" required />
        </label>
        <label>
          Message:
          <textarea name="message" placeholder="Your Message" required />
        </label>
        <button type="submit" className="submit-button">Send Message</button>
      </form>
    </div>
  </div>
);

export default Home;
