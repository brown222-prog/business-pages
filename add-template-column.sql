-- Add template column to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS template VARCHAR(20) DEFAULT 'classic';

-- Add a check constraint to ensure only valid template values
ALTER TABLE businesses
ADD CONSTRAINT valid_template CHECK (template IN ('classic', 'modern', 'minimal'));
