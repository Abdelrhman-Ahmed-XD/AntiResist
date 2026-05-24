import { updateUserProfile } from '../firebase/firestore';

const CLOUD     = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyrf3eqtn';
const PUBLIC_ID = import.meta.env.VITE_CERTIFICATE_PUBLIC_ID; // add this to .env.local

// Text overlay parameters — match the original canvas positioning.
// If your certificate is a different height, adjust FONT_SIZE and NAME_Y:
//   FONT_SIZE = Math.round(imageHeight * 0.058)
//   NAME_Y    = Math.round(imageHeight * 0.405)
const FONT      = 'Georgia';
const FONT_SIZE = 78;       // for a ~1357 px tall certificate
const NAME_Y    = 550;      // px from top, for a ~1357 px tall certificate
const COLOR     = '1a3a5c';

function encodeText(text) {
  // Cloudinary text encoding: percent-encode everything, then also escape commas and slashes
  return encodeURIComponent(text)
    .replace(/'/g,  '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/,/g,  '%2C')
    .replace(/%2F/g, '%252F');
}

/**
 * Builds a Cloudinary transformation URL that overlays the name on the
 * certificate template and serves it as a forced download.
 *
 * @param {string} displayName  – user's name to print on the certificate
 * @param {string} filename     – download filename (without extension)
 */
export function buildCertificateUrl(displayName, filename = 'AntiResist-Certificate') {
  if (!PUBLIC_ID) return null;
  const encoded = encodeText(displayName);
  return (
    `https://res.cloudinary.com/${CLOUD}/image/upload/` +
    `l_text:${FONT}_${FONT_SIZE}_bold:${encoded},co_rgb:${COLOR},g_north,y_${NAME_Y},fl_layer_apply/` +
    `fl_attachment:${filename}/` +
    `${PUBLIC_ID}.jpg`
  );
}

/**
 * Triggers a download of the personalized certificate and saves the URL
 * to Firestore under the user's profile.
 *
 * Must be called synchronously inside a user-gesture handler (button click).
 *
 * @param {string}      name      – user's display name
 * @param {string|null} uid       – Firebase user uid (for saving to Firestore)
 * @param {string}      filename  – download filename (without extension)
 */
export function downloadCertificate(name, uid = null, filename = 'AntiResist-Certificate') {
  const displayName = name?.trim() || 'AMR Advocate';
  const url = buildCertificateUrl(displayName, filename);

  if (!url) {
    console.error('[cert] VITE_CERTIFICATE_PUBLIC_ID is not set — add it to .env.local');
    return;
  }

  // Synchronous anchor click — stays within the user-gesture so mobile allows it
  const a = document.createElement('a');
  a.href   = url;
  a.target = '_blank'; // opens download in new tab; fl_attachment forces save-as dialog
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Fire-and-forget Firebase save — does NOT block the download
  if (uid) {
    updateUserProfile(uid, {
      certificateUrl: url,
      certificateDownloadedAt: new Date().toISOString(),
    }).catch(e => console.warn('[cert] Firebase save failed:', e));
  }
}
