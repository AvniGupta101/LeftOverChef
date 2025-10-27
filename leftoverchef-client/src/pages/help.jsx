// import React, { useState } from "react";
// import { HelpCircle, MessageCircle, Mail, Phone, Book, Users, Heart, Gift, Shield, ChevronDown, Search } from "lucide-react";

// export default function HelpPage() {
//   const [openFaq, setOpenFaq] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const faqs = [
//     {
//       category: "Getting Started",
//       icon: Book,
//       questions: [
//         {
//           q: "How do I register as an NGO?",
//           a: "Click on 'Register' in the top navigation, select 'NGO' as your role, and fill in your organization details. Once registered, you can immediately start claiming donations."
//         },
//         {
//           q: "How do I become a donor?",
//           a: "Simply register with your details and select 'Donor' as your role. You can then start listing food donations for NGOs to claim."
//         },
//         {
//           q: "Is there any cost to use LeftoverChef?",
//           a: "No! LeftoverChef is completely free for both donors and NGOs. Our mission is to reduce food waste and help those in need."
//         }
//       ]
//     },
//     {
//       category: "For NGOs",
//       icon: Users,
//       questions: [
//         {
//           q: "How do I claim a donation?",
//           a: "Browse available donations on the home page, click 'Claim Now' on any listing, fill in your pickup details, and submit. The donor will be notified immediately."
//         },
//         {
//           q: "Can I track my claimed donations?",
//           a: "Yes! Visit the 'My Claims' page to see all your past and current claims, including their status (requested, confirmed, fulfilled)."
//         },
//         {
//           q: "What happens after I claim a donation?",
//           a: "The donor receives your claim request with your contact information. They'll confirm the pickup details, and you can coordinate the collection directly."
//         }
//       ]
//     },
//     {
//       category: "For Donors",
//       icon: Gift,
//       questions: [
//         {
//           q: "What types of food can I donate?",
//           a: "You can donate fresh cooked meals, packaged foods, baked goods, fruits, vegetables, and any other edible items that are safe for consumption."
//         },
//         {
//           q: "How do I list a donation?",
//           a: "After logging in, navigate to 'Create Listing', add photos, describe your donation, specify quantity and pickup location, then submit for approval."
//         },
//         {
//           q: "How quickly will my donation be claimed?",
//           a: "Most donations are claimed within a few hours! NGOs actively monitor new listings and respond quickly to help those in need."
//         }
//       ]
//     },
//     {
//       category: "Safety & Quality",
//       icon: Shield,
//       questions: [
//         {
//           q: "How do you ensure food safety?",
//           a: "We require all donations to be fresh, properly stored, and safe for consumption. NGOs verify food quality upon pickup. Report any concerns immediately."
//         },
//         {
//           q: "What if a donation doesn't meet standards?",
//           a: "NGOs can reject donations that don't meet safety standards. Contact us to report any issues, and we'll take appropriate action."
//         },
//         {
//           q: "Are NGOs verified?",
//           a: "Yes, all NGOs go through a verification process to ensure they're legitimate organizations committed to serving communities in need."
//         }
//       ]
//     }
//   ];

//   const contactOptions = [
//     {
//       icon: Mail,
//       title: "Email Support",
//       detail: "support@leftoverchef.com",
//       description: "We'll respond within 24 hours",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: Phone,
//       title: "Call Us",
//       detail: "+91 98765 43210",
//       description: "Mon-Sat, 9 AM - 6 PM",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: MessageCircle,
//       title: "Live Chat",
//       detail: "Chat with us",
//       description: "Available 24/7",
//       color: "from-purple-500 to-pink-500"
//     }
//   ];

//   const toggleFaq = (categoryIndex, questionIndex) => {
//     const key = `${categoryIndex}-${questionIndex}`;
//     setOpenFaq(openFaq === key ? null : key);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
//               <HelpCircle className="w-10 h-10" />
//             </div>
//             <h1 className="text-4xl lg:text-5xl font-bold mb-4">How Can We Help?</h1>
//             <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
//               Find answers to common questions or reach out to our support team
//             </p>
            
//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto">
//               <div className="bg-white rounded-2xl p-2 shadow-2xl">
//                 <div className="flex items-center gap-3 px-4 py-3">
//                   <Search className="w-5 h-5 text-gray-400" />
//                   <input 
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search for help..."
//                     className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         {/* Contact Options */}
//         <div className="mb-16">
//           <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
//             Get In Touch
//           </h2>
//           <p className="text-center text-gray-600 mb-8">Choose your preferred way to reach us</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {contactOptions.map((option, i) => (
//               <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-orange-100 hover:-translate-y-1 cursor-pointer">
//                 <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-4`}>
//                   <option.icon className="w-6 h-6 text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h3>
//                 <p className="text-orange-600 font-semibold mb-1">{option.detail}</p>
//                 <p className="text-sm text-gray-500">{option.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* FAQs */}
//         <div>
//           <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">
//             Frequently Asked Questions
//           </h2>
//           <p className="text-center text-gray-600 mb-12">Find quick answers to common questions</p>

//           <div className="space-y-8">
//             {faqs.map((category, categoryIndex) => (
//               <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
//                 <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-6 py-4 border-b border-orange-100">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
//                       <category.icon className="w-5 h-5 text-white" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
//                   </div>
//                 </div>
                
//                 <div className="divide-y divide-orange-100">
//                   {category.questions.map((faq, questionIndex) => {
//                     const isOpen = openFaq === `${categoryIndex}-${questionIndex}`;
//                     return (
//                       <div key={questionIndex}>
//                         <button
//                           onClick={() => toggleFaq(categoryIndex, questionIndex)}
//                           className="w-full px-6 py-4 flex items-center justify-between hover:bg-orange-50 transition-colors text-left"
//                         >
//                           <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
//                           <ChevronDown className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//                         </button>
//                         {isOpen && (
//                           <div className="px-6 pb-4 text-gray-600 animate-fadeIn">
//                             {faq.a}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Still Need Help */}
//         <div className="mt-16 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center">
//           <Heart className="w-12 h-12 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
//           <p className="text-white/90 mb-6 max-w-2xl mx-auto">
//             Our support team is always here to help. Reach out anytime and we'll get back to you as soon as possible.
//           </p>
//           <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg">
//             Contact Support
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }// src/pages/Help.jsx
import React, { useState } from "react";
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Send, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I claim a food donation?",
      answer: "To claim a donation, browse the available listings on the home page, click on 'Claim Now' button, fill in your NGO details and contact information, and submit. You'll receive a confirmation once your claim is processed."
    },
    {
      question: "What types of organizations can register?",
      answer: "We welcome all registered NGOs, charitable organizations, food banks, shelters, and community kitchens that work towards feeding those in need. You must be a verified non-profit organization to claim donations."
    },
    {
      question: "How quickly can I pick up claimed donations?",
      answer: "Most donations are available for immediate pickup. Once you claim a donation, check the pickup details and contact the donor directly to coordinate timing. We recommend pickup within 2-4 hours of claiming."
    },
    {
      question: "Is there a limit to how many donations I can claim?",
      answer: "There's no strict limit, but we encourage fair distribution. Claim what your organization can realistically collect and distribute to ensure food doesn't go to waste."
    },
    {
      question: "What if I need to cancel a claim?",
      answer: "You can cancel a claim from your 'My Claims' dashboard before it's confirmed. Click on the claim and select 'Cancel Claim'. Please do this promptly so other NGOs can claim the donation."
    },
    {
      question: "How do I become a donor?",
      answer: "Register as a donor on our platform, then you can post food donations by providing details about the food, quantity, pickup location, and timing. Our team will review and approve legitimate donations."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/20">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
              <HelpCircle className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Help & Support</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We're here to help! Find answers to common questions or get in touch with our team.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Get a response within 24 hours</p>
            <a href="mailto:support@leftoverchef.com" className="text-indigo-600 font-semibold hover:text-indigo-700">
              support@leftoverchef.com
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Mon-Fri, 9am-6pm</p>
            <a href="tel:1-800-FOOD-HELP" className="text-indigo-600 font-semibold hover:text-indigo-700">
              1-800-FOOD-HELP
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Available during business hours</p>
            <button className="text-indigo-600 font-semibold hover:text-indigo-700">
              Start Chat →
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Quick answers to common questions</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Still Need Help?</h2>
              <p className="text-gray-600">Send us a message and we'll get back to you soon</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your question or issue..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">
              Support Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}