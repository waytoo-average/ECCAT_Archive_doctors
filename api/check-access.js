const { google } = require('googleapis');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function getDriveClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    throw new Error('Service account credentials not configured');
  }

  const auth = new google.auth.JWT(
    serviceAccountEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/drive']
  );

  return google.drive({ version: 'v3', auth });
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, folderId, apiKey } = req.body;

    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (!email || !folderId) {
      return res.status(400).json({ error: 'Email and folderId are required' });
    }

    const drive = getDriveClient();

    const permissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id,emailAddress,role)',
    });

    const userPermission = permissions.data.permissions?.find(
      p => p.emailAddress === email
    );

    return res.status(200).json({
      hasAccess: !!userPermission,
      role: userPermission?.role || null,
      email,
      folderId,
    });

  } catch (error) {
    console.error('Error in check-access:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
