const { google } = require('googleapis');

// CORS headers for Flutter app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Semester folder IDs (same as in Flutter app)
const SEMESTER_FOLDERS = {
  'First Grade Communication Current Year Semester 1': '1F-aqh6UK5x8Cbva6Zr0UvnchyV8hDGp2',
  'First Grade Communication Current Year Semester 2': '1Xl2tlH1leBqoY10nwZvt_Hs4qsCMSNeL',
  'First Grade Communication Last Year Semester 1': '11YuvupTtPcZuTKAQOm9onpDrq6HwUTQS',
  'First Grade Communication Last Year Semester 2': '12g0GqJ__VAOwwr9Skqy7DHhfAAumstxl',
  'First Grade Electronics Current Year Semester 1': '1PR7sqZwA_4LgumJC0k3Af0aZ_ba2Zl30',
  'First Grade Electronics Current Year Semester 2': '1N7EiilaFCKUEE_O7Dy3P71FAcuREylXo',
  'First Grade Electronics Last Year Semester 1': '11YuvupTtPcZuTKAQOm9onpDrq6HwUTQS',
  'First Grade Electronics Last Year Semester 2': '1j65a7S832qfDMf1waGqW29zfjxofIXDs',
  'First Grade Mechatronics Current Year Semester 1': '1xthA_-KhZ5Edi3jloRkwRAIMM6ljpoIS',
  'First Grade Mechatronics Current Year Semester 2': '1rVnXee3-ELWNBJ8OSoOILw0DbmuKjGxo',
  'First Grade Mechatronics Last Year Semester 1': '11YuvupTtPcZuTKAQOm9onpDrq6HwUTQS',
  'First Grade Mechatronics Last Year Semester 2': '1--ivZFd-xXHTHuPrLsTVc7PelgptzvzA',
  'Second Grade Communication Current Year Semester 1': '1Ps1L5YOmU_LXfnb9sqwVtILVP5T3LjB9',
  'Second Grade Communication Current Year Semester 2': '1VUro5liVUNKtYG247Hwmq2fDQqkHqOhH',
  'Second Grade Communication Last Year Semester 1': '1bm4KMv65KpJqFPLNFcSMf4DItNq-H0WS',
  'Second Grade Communication Last Year Semester 2': '1rsfY18ebWzQPfYQIhhB_UAv0MIW_Q7Ot',
  'Second Grade Electronics Current Year Semester 1': '1q4FTG3ACwiu9z_n653kKkxx3DuZVJ2iV',
  'Second Grade Electronics Current Year Semester 2': '1XuYkkqZc1APLemfyKRuq_30Imzy_Hi4-',
  'Second Grade Electronics Last Year Semester 1': '1kSU6_cE4mpUmX2WykGAQG3rvEmp1p9Ez',
  'Second Grade Electronics Last Year Semester 2': '1LkNvv1ScdueAtl3FnjfcedrKc4rRMaJy',
  'Second Grade Mechatronics Current Year Semester 1': '1JKca-qZKuFN_S8wW0cNLYZqtJfuHyRJd',
  'Second Grade Mechatronics Current Year Semester 2': '1PL--naKlzPEehYLt4TbT9on4IG7szwmi',
  'Second Grade Mechatronics Last Year Semester 1': '1BZmiGjnz5Pwktv1kZW8Zed8V-gZb_Ctt',
  'Second Grade Mechatronics Last Year Semester 2': '1cjdOdSSji6Q2EdG9NdrkNOZzry5EXjvI',
  'Third Grade Communication Current Year Semester 1': '1LfORh3S9XzjmgeiPXpAHGs_78utNUznc',
  'Third Grade Communication Current Year Semester 2': '12edu3L3lWkiQTWqXkAWxzLaUo_4jXkXV',
  'Third Grade Communication Last Year Semester 1': '1dnZ-B3w0eho4DLQuaUjcu_gYRxQVUh27',
  'Third Grade Communication Last Year Semester 2': '1sHx6GHS5GGNfUWcAzJdDLXoxm5dJQUW5',
  'Third Grade Electronics Current Year Semester 1': '18s3_6cK3XaCGswmaaM3BqyqyWiE9adq0',
  'Third Grade Electronics Current Year Semester 2': '1g9QQto6aulAGb1s6jjBXStqnwyR3lWrI',
  'Third Grade Electronics Last Year Semester 1': '14tpmEzBxeK0a-2xKLJh27-zCyCRY8Sm7',
  'Third Grade Electronics Last Year Semester 2': '13RNcUE-TkB31oRZ_s8lGQ-7Y_UZDf_tM',
  'Third Grade Mechatronics Current Year Semester 1': '1pWHRg_DNnWHefQer6yfxf5SnNd4PFKVV',
  'Third Grade Mechatronics Current Year Semester 2': '16QAM_Dcbm9GPYOk5O5wi-Vo3WcS70Bus',
  'Third Grade Mechatronics Last Year Semester 1': '1W49F5CEKwOeyHKgW5IQOUGttYtaqJoHr',
  'Third Grade Mechatronics Last Year Semester 2': '1sNAFCyOQX31f04S80qFA5ZpZNQorPMSS',
  'Fourth Grade Communication Current Year Semester 1': '1I353V2Dd1END87jCYcZb33fOmhjjKnGJ',
  'Fourth Grade Communication Current Year Semester 2': '1oJaBS3_nLYjCXIYOgqM5enjYxymw5h59',
  'Fourth Grade Communication Last Year Semester 1': '1eTqTDJc6_u3EsgzJKjjYU6metlTP7kZu',
  'Fourth Grade Communication Last Year Semester 2': '',
  'Fourth Grade Electronics Current Year Semester 1': '1KOX51U4QKDJ3plORY7c__YVh7j4A26SH',
  'Fourth Grade Electronics Current Year Semester 2': '11I6Q4nEoiXC6lxpo3vTEsalbblIqRIqU',
  'Fourth Grade Electronics Last Year Semester 1': '1Zuijl69NbI7qlLGJxrTjjaYLi61yeztV',
  'Fourth Grade Electronics Last Year Semester 2': '1Auityu6tfsbBo_i3bAU8xFx7XQO5Tb-Z',
  'Fourth Grade Mechatronics Current Year Semester 1': '1x_uNebUvo3ZlqpciawuBnu0ooAg_pdfV',
  'Fourth Grade Mechatronics Current Year Semester 2': '1p5Y6tooBY9TVaz55mdYL7_xcJYzqY3nY',
  'Fourth Grade Mechatronics Last Year Semester 1': '14GIx1XWA4bBtGZlcXJukX4PaB7iiaMZh',
  'Fourth Grade Mechatronics Last Year Semester 2': '1oxDUpEZ7i9gYipvSeMWDx1E1pA6LFLaz',
};

// Initialize Google Drive API with service account
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

// Grant permission to a user for a specific folder
async function grantFolderPermission(drive, folderId, userEmail) {
  try {
    // Check if user already has permission
    const existingPermissions = await drive.permissions.list({
      fileId: folderId,
      fields: 'permissions(id,emailAddress,role)',
    });

    const hasPermission = existingPermissions.data.permissions?.some(
      p => p.emailAddress === userEmail
    );

    if (hasPermission) {
      return { success: true, alreadyGranted: true };
    }

    // Grant writer permission
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: userEmail,
      },
      sendNotificationEmail: false,
    });

    return { success: true, alreadyGranted: false };
  } catch (error) {
    console.error(`Error granting permission for folder ${folderId}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, apiKey } = req.body;

    // Validate API key
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Initialize Drive client
    const drive = getDriveClient();

    // Grant permissions to all semester folders
    const results = [];
    const folderIds = [...new Set(Object.values(SEMESTER_FOLDERS).filter(id => id))];

    for (const folderId of folderIds) {
      const result = await grantFolderPermission(drive, folderId, email);
      results.push({ folderId, ...result });
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return res.status(200).json({
      success: true,
      message: `Access granted to ${successCount} folders`,
      email,
      stats: {
        total: folderIds.length,
        granted: successCount,
        failed: failedCount,
        alreadyHadAccess: results.filter(r => r.alreadyGranted).length,
      },
      details: results,
    });

  } catch (error) {
    console.error('Error in grant-access:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
};
