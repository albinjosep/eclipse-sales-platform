# Eclipse Sales Platform - Frontend

A modern, AI-powered sales platform built with Next.js, React, and TypeScript.

## 🚀 Features

- **AI-Powered Sales Assistant**: Intelligent chat interface for sales insights
- **Interactive Dashboard**: Real-time sales metrics and pipeline visualization
- **Lead Management**: Comprehensive lead tracking and management
- **Pipeline Analytics**: Visual pipeline stages with drag-and-drop functionality
- **Account Insights**: Detailed account summaries with engagement tracking
- **Responsive Design**: Modern UI that works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT models
- **Charts**: Recharts for data visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eclise_sales/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and fill in your configuration:
   
   ```env
   # Required
   OPENAI_API_KEY=sk-your-openai-api-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Optional
   REDIS_URL=redis://localhost:6379
   SMTP_HOST=smtp.gmail.com
   ```

## 🚀 Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Start the backend server** (in a separate terminal)
   ```bash
   cd ../
   python run.py
   ```

## 🔑 API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file

### Supabase Configuration
1. Create a project at [Supabase](https://supabase.com/dashboard)
2. Go to Settings > API
3. Copy your Project URL and anon key
4. Add them to your `.env.local` file

## 📁 Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ChatConsole.tsx   # AI chat interface
│   ├── Pipeline.tsx      # Sales pipeline
│   └── Navigation.tsx    # Main navigation
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── auth.tsx          # Authentication
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── hooks/                 # Custom React hooks
└── public/               # Static assets
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

### Database Setup

The application uses Supabase for database management. Make sure to:

1. Set up your Supabase project
2. Run the database migrations (handled by the backend)
3. Configure Row Level Security (RLS) policies

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Deploy the `out` directory to your hosting platform
3. Ensure environment variables are configured

## 🐛 Troubleshooting

### Common Issues

1. **API endpoints returning 404**
   - Ensure the backend server is running
   - Check API route files in `app/api/`

2. **Environment variables not working**
   - Restart the development server
   - Check variable names (NEXT_PUBLIC_ prefix for client-side)

3. **Supabase connection issues**
   - Verify your Supabase URL and keys
   - Check network connectivity

4. **Build errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Check for missing dependencies

### Getting Help

- Check the console for error messages
- Review the Network tab in browser dev tools
- Ensure all required environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related

- [Backend API Documentation](../README.md)
- [Deployment Guide](./docs/deployment.md)
- [API Reference](./docs/api.md)