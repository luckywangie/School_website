import Hero from "../../components/Hero";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log("Message submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero
        title="Contact Us"
        subtitle="We’d love to hear from you! Reach out for inquiries, admissions, or support."
        background="/images/contact-hero.jpg"
      />

      <div className="px-6 md:px-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p className="text-gray-600">
            For any inquiries, please contact us using the details below or fill out the form. Our team will respond promptly.
          </p>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>📍 Address:</strong> 123 Learning Street, Nairobi, Kenya
            </p>
            <p>
              <strong>📞 Phone:</strong> +254 700 123 456
            </p>
            <p>
              <strong>✉️ Email:</strong> info@myschool.ac.ke
            </p>
          </div>

          <div className="mt-6">
            <iframe
              title="School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31910.49143503797!2d36.8219466!3d-1.2920659!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c7cfbcb0f%3A0x2d2d3121!2sNairobi!5e0!3m2!1sen!2ske!4v1672535200000!5m2!1sen!2ske"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg shadow"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              ✅ Thank you! Your message has been sent.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full focus:ring focus:ring-blue-300"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full focus:ring focus:ring-blue-300"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="border rounded px-4 py-2 w-full focus:ring focus:ring-blue-300"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
