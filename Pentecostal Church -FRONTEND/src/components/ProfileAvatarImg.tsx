import React, { useMemo } from 'react';
import { getImageUrl } from '../config/environment';

interface ProfileAvatarImgProps {
  photoPath?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

// Resolves the photo URL once per actual `photoPath` change instead of on every
// re-render, so list views (user management, patron dashboard) don't re-fetch/flicker
// every visible avatar on unrelated state updates like search-box keystrokes.
const ProfileAvatarImg: React.FC<ProfileAvatarImgProps> = React.memo(({ photoPath, alt = '', className, style, onError }) => {
  const src = useMemo(() => (photoPath ? getImageUrl(photoPath) : ''), [photoPath]);

  if (!src) return null;

  return <img src={src} alt={alt} className={className} style={style} onError={onError} />;
});

export default ProfileAvatarImg;
