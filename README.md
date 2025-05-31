# Imprinta Purchase Order System

A modern, cloud-based purchase order management system built with Next.js, Firebase, and Google Cloud Platform.

## 🚀 Features

- **Authentication & Authorization**
  - Role-based access control (Admin/User)
  - Secure Firebase Authentication
  - Protected routes and API endpoints

- **Purchase Order Management**
  - Create, view, edit, and delete purchase orders
  - Real-time updates with Firebase
  - PDF generation and export

- **Supplier Management**
  - Supplier database
  - Contact information management
  - Supplier categorization

- **Analytics & Reporting**
  - Dashboard with key metrics
  - Custom report generation
  - Data visualization

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 15.3.1
  - React 18.2.0
  - Tailwind CSS
  - Radix UI Components
  - Chart.js for visualizations

- **Backend**
  - Firebase Authentication
  - Firestore Database
  - Firebase Admin SDK
  - Google Cloud Run

- **Development Tools**
  - TypeScript
  - pnpm Package Manager
  - ESLint
  - Prettier

## 📋 Prerequisites

- Node.js 18 or higher
- pnpm
- Docker
- Google Cloud SDK
- Firebase CLI

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/imprinta-po.git
   cd imprinta-po
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration values

4. **Run the development server**
   ```bash
   pnpm dev
   ```

## 🚀 Deployment

### Local Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm start
```

### Google Cloud Run Deployment
1. **Enable required APIs**
   ```bash
   gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
   ```

2. **Configure Docker**
   ```bash
   gcloud auth configure-docker
   ```

3. **Build and deploy**
   ```bash
   ./deploy.ps1
   ```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Config
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

## 📁 Project Structure

```
imprinta-po/
├── app/                 # Next.js app directory
├── components/          # React components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
│   ├── firebase/       # Firebase configurations
│   └── types/          # TypeScript type definitions
├── public/             # Static files
└── styles/             # Global styles
```

## 🔒 Security

- Environment variables are not committed to the repository
- Firebase security rules are implemented
- API routes are protected
- Role-based access control is enforced

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend services
- Google Cloud Platform for hosting 