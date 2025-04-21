console.log('Checking Firebase Environment Variables:');
console.log('API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('Auth Domain exists:', !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log('Project ID exists:', !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Storage Bucket exists:', !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log('Messaging Sender ID exists:', !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log('App ID exists:', !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
console.log('Measurement ID exists:', !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID); 