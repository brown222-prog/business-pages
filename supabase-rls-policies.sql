-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_sections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view active businesses" ON businesses;
DROP POLICY IF EXISTS "Public can view photos" ON photos;
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public can view custom sections" ON custom_sections;
DROP POLICY IF EXISTS "Allow all operations for now" ON businesses;
DROP POLICY IF EXISTS "Allow all operations for now" ON photos;
DROP POLICY IF EXISTS "Allow all operations for now" ON testimonials;
DROP POLICY IF EXISTS "Allow all operations for now" ON custom_sections;

-- Allow public to READ active businesses and related data
CREATE POLICY "Public can view active businesses"
ON businesses FOR SELECT
USING (active = true);

CREATE POLICY "Public can view photos"
ON photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = photos.business_id
    AND businesses.active = true
  )
);

CREATE POLICY "Public can view testimonials"
ON testimonials FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = testimonials.business_id
    AND businesses.active = true
  )
);

CREATE POLICY "Public can view custom sections"
ON custom_sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = custom_sections.business_id
    AND businesses.active = true
  )
);

-- Allow all operations with anon key (for admin operations)
-- Note: This is permissive. In production, you should implement proper authentication
-- and restrict these policies to authenticated admin users only.
CREATE POLICY "Allow all operations for admin"
ON businesses FOR ALL
USING (true);

CREATE POLICY "Allow all operations for admin"
ON photos FOR ALL
USING (true);

CREATE POLICY "Allow all operations for admin"
ON testimonials FOR ALL
USING (true);

CREATE POLICY "Allow all operations for admin"
ON custom_sections FOR ALL
USING (true);
