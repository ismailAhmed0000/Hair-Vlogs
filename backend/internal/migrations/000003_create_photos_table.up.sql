CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    haircut_id UUID NOT NULL REFERENCES haircuts(id) ON DELETE CASCADE,
    image_url VARCHAR(2048) NOT NULL,
    angle VARCHAR(10) NOT NULL DEFAULT 'other' CHECK (angle IN ('front', 'side', 'back', 'other')),
    is_cover BOOLEAN NOT NULL DEFAULT false,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photos_haircut_id ON photos(haircut_id);
