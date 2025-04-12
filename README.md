# Image Gallery Application

A responsive image gallery application built with Next.js and TailwindCSS that allows users to upload, view, search, and delete images. The application uses Cloudinary for image storage and management.

## Features

- Upload single or multiple images with title and tags
- Display images in a responsive grid layout
- Click on images to see larger previews in a modal
- Delete images with confirmation
- Search images by title or tags
- Pagination with "Load More" functionality
- Responsive design for all screen sizes

## Tech Stack

- Next.js (App Router)
- JavaScript
- TailwindCSS
- Cloudinary API
- React Icons
- React Toastify

## Getting Started

First, clone the repository:

```bash
git clone <repository-url>
cd image-gallery
```

Install the dependencies:

```bash
npm install
```

Set up the environment variables:

The `.env` file is already included with Cloudinary credentials:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dg5gwims9
CLOUDINARY_API_KEY=658996287986253
CLOUDINARY_API_SECRET=4ODUabJqsFk66WBs3fBhspswulQ
CLOUDINARY_URL=cloudinary://658996287986253:4ODUabJqsFk66WBs3fBhspswulQ@dg5gwims9
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Upload Images**: Click on the "Upload Images" button, enter a title (required), optional tags, and select one or more images to upload.

2. **View Gallery**: All uploaded images are displayed in a responsive grid layout. The most recent uploads appear at the top.

3. **Search Images**: Use the search bar in the header to search for images by title or tags.

4. **Image Preview**: Click on an image to open a modal with a larger preview.

5. **Delete Images**: When viewing an image in the modal, click the "Delete Image" button. You'll need to confirm the deletion.

6. **Pagination**: If there are more images than shown on the page, click the "Load More" button to load more images.

## Project Structure

- `app/page.js` - Main gallery page
- `app/components/` - React components (ImageUpload, ImageGrid, ImageModal, etc.)
- `app/api/` - API routes for image operations
- `app/lib/` - Utility functions
- `.env` - Environment variables for Cloudinary

## License

This project is open-source and available under the MIT License.
