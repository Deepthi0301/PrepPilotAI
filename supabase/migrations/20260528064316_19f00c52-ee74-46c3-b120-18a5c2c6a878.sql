UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/gif','image/webp'],
    file_size_limit = 4194304
WHERE id = 'avatars';