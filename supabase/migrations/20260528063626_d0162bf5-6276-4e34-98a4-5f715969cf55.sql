DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;
CREATE POLICY "Users list own avatars" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);