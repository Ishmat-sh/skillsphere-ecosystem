const express = require('express');
const router = express.Router();
const cloudinaryService = require('../services/cloudinaryService');
const auth = require('../middleware/authMiddleware');

// Upload single file
router.post('/single', auth(), (req, res) => {
  try {
    const upload = cloudinaryService.getMulterUpload('skillsphere', [{ name: 'file', maxCount: 1 }]);
    
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const file = req.files.file[0];
      res.json({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload multiple files
router.post('/multiple', auth(), (req, res) => {
  try {
    const upload = cloudinaryService.getMulterUpload('skillsphere', [{ name: 'files', maxCount: 5 }]);
    
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.files || !req.files.files) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      const files = req.files.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      }));
      
      res.json({ files });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/file/:publicId', auth(), async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinaryService.deleteFile(publicId);
    
    res.json({ message: 'File deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete multiple files
router.post('/delete-multiple', auth(), async (req, res) => {
  try {
    const { publicIds } = req.body;
    
    if (!publicIds || !Array.isArray(publicIds)) {
      return res.status(400).json({ error: 'publicIds array is required' });
    }
    
    const result = await cloudinaryService.deleteMultipleFiles(publicIds);
    
    res.json({ message: 'Files deleted successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get file info
router.get('/file/:publicId/info', auth(), async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const info = await cloudinaryService.getFileInfo(publicId);
    
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
