const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

class CloudinaryService {
  constructor() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary configuration incomplete. File upload features will be disabled.');
      this.configured = false;
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.configured = true;
  }

  getStorage(folder = 'skillsphere') {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
        public_id: (req, file) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return file.fieldname + '-' + uniqueSuffix;
        },
      },
    });
  }

  getMulterUpload(folder = 'skillsphere', fields = [{ name: 'file', maxCount: 1 }]) {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    const storage = this.getStorage(folder);
    return multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
        }
      },
    }).fields(fields);
  }

  async uploadSingleFile(file, folder = 'skillsphere') {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
      });
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  async uploadMultipleFiles(files, folder = 'skillsphere') {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, { folder: folder })
      );
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload files');
    }
  }

  async deleteFile(publicId) {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete file');
    }
  }

  async deleteMultipleFiles(publicIds) {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.api.delete_resources(publicIds);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete files');
    }
  }

  async getFileInfo(publicId) {
    if (!this.configured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary info error:', error);
      throw new Error('Failed to get file info');
    }
  }
}

module.exports = new CloudinaryService();
