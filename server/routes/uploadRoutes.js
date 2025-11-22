// server/routes/uploadRoutes.js  (temporary debug version)
import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/image', upload.single('image'), (req, res) => {
  try {
    console.log('--- upload debug ---');
    console.log('req.is(multipart/form-data):', req.is('multipart/form-data'));
    console.log('req.headers[content-type]:', req.headers['content-type']);
    console.log('req.file =', JSON.stringify(req.file, null, 2));
    console.log('req.body =', JSON.stringify(req.body, null, 2));
    console.log('--------------------');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file received. Did you use Form multipart and set field name to "image"?',
      });
    }

    const imageUrl = req.file.path || req.file.secure_url || req.file.url || req.file.location || null;
    const public_id = req.file.filename || req.file.public_id || (req.file.raw && req.file.raw.public_id) || null;

    return res.json({
      success: true,
      imageUrl,
      public_id,
      raw: req.file
    });
  } catch (err) {
    console.error('upload route error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// add to server/routes/uploadRoutes.js (temporary test route)
router.get('/test', async (req, res) => {
  try {
    const cloudinary = (await import('../config/cloudinary.js')).default;

    // public image URL (you can replace with any https image)
    const publicImageUrl = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200';

    const result = await cloudinary.uploader.upload(publicImageUrl, {
      folder: 'leftoverchef/test',
    });

    return res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Cloudinary Error:', err);
    return res.status(500).json({ success: false, error: err.message, details: err });
  }
});



export default router;
