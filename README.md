# 🍲 LeftoverChef - Food Donation Platform

**Share Food, Share Love** ❤️

LeftoverChef is a modern web application that connects food donors (restaurants, bakeries, event organizers) with NGOs and charitable organizations to reduce food waste and help feed those in need.



---

## 🌟 Features

### For NGOs
- 📋 **Browse Available Donations** - View real-time food listings with photos, quantities, and locations
- 🎯 **Claim Donations** - Easy one-click claiming with contact information
- 📊 **Track Claims** - Dashboard to manage all claimed donations with status tracking
- ❤️ **Favorite Listings** - Save interesting donations for later
- 🔔 **Real-time Updates** - Get instant notifications on claim status changes

### For Donors
- 📸 **Post Donations** - Upload food listings with images and details
- 🗺️ **Location Mapping** - Add pickup locations for easy coordination
- ✅ **Manage Listings** - Approve, reject, or mark donations as fulfilled
- 📈 **Impact Tracking** - See how many meals you've helped provide

### General Features
- 🎨 **Modern UI/UX** - Beautiful gradient designs with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **Secure Authentication** - JWT-based auth with role-based access control
- 🔍 **Advanced Search** - Filter and search donations by status, location, and more
- 💬 **Help & Support** - Comprehensive FAQ and contact system

---

## 🛠️ Tech Stack

### Frontend
- **React** 18 - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Toastify** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image hosting

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/leftoverchef.git
cd leftoverchef
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd leftoverchef-client
npm install
```

### 3. Environment Configuration

#### Backend (.env)
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leftoverchef
JWT_SECRET=your_super_secret_jwt_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

#### Frontend (.env)
Create `leftoverchef-client/.env`:
```env
VITE_API_BASE=http://localhost:5000/api
```

### 4. Seed Database (Optional)
```bash
cd server
node scripts/seed.js
```

### 5. Start Development Servers

#### Backend
```bash
cd server
npm start
# or for development with nodemon
npm run dev
```

#### Frontend
```bash
cd leftoverchef-client
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd leftoverchef-client
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables in your hosting platform
# Deploy using Git or CLI
```

---

## 📂 Project Structure

```
leftoverchef/
├── leftoverchef-client/          # React Frontend
│   ├── src/
│   │   ├── api/                  # API client configuration
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ClaimModal.jsx
│   │   ├── context/              # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useListings.js
│   │   │   └── useClaims.js
│   │   ├── pages/                # Page components
│   │   │   ├── ListingsPage.jsx
│   │   │   ├── MyClaims.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ListingDetails.jsx
│   │   │   └── Help.jsx
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── server/                        # Express Backend
    ├── config/                    # Configuration files
    │   └── cloudinary.js
    ├── controllers/               # Route controllers
    │   └── claimsController.js
    ├── middleware/                # Express middleware
    │   ├── auth.js
    │   └── requireAuth.js
    ├── models/                    # Mongoose models
    │   ├── User.js
    │   ├── Listing.js
    │   └── Claim.js
    ├── routes/                    # API routes
    │   ├── auth.js
    │   ├── listings.js
    │   └── claims.js
    ├── scripts/                   # Utility scripts
    │   ├── seed.js
    │   └── fixQuantities.js
    ├── index.js                   # Server entry point
    ├── package.json
    └── .env
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (donor only)
- `PATCH /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Claims
- `GET /api/claims` - Get user's claims (NGO only)
- `POST /api/claims` - Create new claim (NGO only)
- `POST /api/claims/fulfill` - Mark claim as fulfilled
- `PATCH /api/claims/:id` - Update claim status

---

## 👥 User Roles

### NGO (Non-Profit Organization)
- Can browse and claim available donations
- Can view and manage their claims
- Can mark claims as fulfilled
- Cannot post donations

### Donor (Restaurants, Bakeries, etc.)
- Can post food donations with images
- Can manage their listings
- Can approve/reject claims
- Cannot claim donations

### Admin (Platform Managers)
- Full access to all features
- Can moderate listings and users
- Can view analytics and reports

---

## 🎨 Design System

### Colors
- **Primary Gradient**: Indigo (600) → Purple (600) → Pink (500)
- **Success**: Green (500-600)
- **Warning**: Yellow (500-600)
- **Danger**: Red (500-600)
- **Neutral**: Gray (50-900)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 600-800 weight
- **Body**: 400-500 weight

### Components
- Rounded corners: 12-24px (rounded-xl to rounded-3xl)
- Shadows: Subtle to prominent elevation
- Animations: 200-500ms transitions
- Icons: Lucide React (24px standard)

---

## 🐛 Known Issues & Troubleshooting

### Issue: "Cast to Number failed for value" error
**Solution**: Run the quantity fix script:
```bash
cd server
node scripts/fixQuantities.js
```

### Issue: Images not uploading
**Solution**: Check Cloudinary credentials in `.env` and ensure the API limits aren't exceeded.

### Issue: CORS errors
**Solution**: Verify `VITE_API_BASE` in frontend `.env` matches your backend URL.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier for formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/)
- **Fonts**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **UI Inspiration**: Modern dashboard designs from Dribbble and Behance

---

## 📞 Contact & Support

- **Email**: support@leftoverchef.com
- **Phone**: 1-800-FOOD-HELP
- **Website**: [www.leftoverchef.com](https://leftoverchef.com)
- **GitHub**: [github.com/yourusername/leftoverchef](https://github.com/yourusername/leftoverchef)

---

## 🎯 Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] SMS alerts for claims
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-powered matching algorithm
- [ ] Integration with Google Maps for routing
- [ ] Volunteer management system
- [ ] Impact reports and statistics
- [ ] Social media sharing

---

## 💖 Made with Love

Built to make a difference, one meal at a time. 

**"No one should go hungry while perfectly good food goes to waste."**

---

### ⭐ Star this repo if you find it helpful!
