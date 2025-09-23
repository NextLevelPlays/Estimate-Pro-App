# EstimatePro - Construction Estimate Management System

A professional web application for construction contractors to create, manage, and send estimates to clients.

## Features

- **Dashboard** - Overview of jobs, revenue, and business metrics
- **Estimate Creation** - Professional estimate builder with AI assistance
- **Client Management** - Customer database and contact management
- **Job Tracking** - Project pipeline and status management
- **PDF Generation** - Automated PDF creation from custom templates
- **Email Integration** - Direct client communication
- **AI Learning** - Smart suggestions based on historical data

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or extract the project files**
2. **Navigate to the project directory**
   ```bash
   cd EstimateProApp
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser** to `http://localhost:3000`

## Deployment

### Deploy to Vercel (Recommended)

1. **Sign up at [vercel.com](https://vercel.com)**
2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```
3. **Build the project**
   ```bash
   npm run build
   ```
4. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```
2. **Drag the `build` folder to [netlify.com/drop](https://app.netlify.com/drop)**

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```
2. **Add to package.json**
   ```json
   "homepage": "https://yourusername.github.io/estimate-pro",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. **Deploy**
   ```bash
   npm run deploy
   ```

## Customization

### Company Branding
- Update company information in Settings page
- Upload your PDF template for automated filling
- Customize tax rates and markup percentages

### AI Learning
- System learns from your pricing patterns
- Customizable job types and categories
- Automatic scope generation based on project type

## Technical Details

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React icon library
- **State Management**: React useState for local state
- **Ready for Backend**: Structured for easy API integration

## Next Steps for Production

1. **Add Backend Database** (Firebase, Supabase, or custom API)
2. **Integrate PDF Library** (PDF-lib for template filling)
3. **Add Email Service** (SendGrid, Mailgun, or SMTP)
4. **Implement Authentication** (User accounts and security)
5. **Add File Upload** (Real PDF template upload)

## Support

For technical support or customization requests, contact your development team.

## License

Proprietary - Built for [Client Name]