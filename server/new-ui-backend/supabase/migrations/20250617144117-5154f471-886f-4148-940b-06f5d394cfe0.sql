
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    handle_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sentiments table
CREATE TABLE IF NOT EXISTS public.sentiments (
    id SERIAL PRIMARY KEY,
    handle_id TEXT,
    sentiment TEXT CHECK(sentiment IN ('GREAT', 'MEH', 'UGH')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (handle_id) REFERENCES public.users(handle_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiments ENABLE ROW LEVEL SECURITY;

-- Create admin-only policies (for now, allow all access - you can restrict later)
CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all operations on sentiments" ON public.sentiments FOR ALL USING (true);

-- Insert mock data for demonstration
INSERT INTO public.users (handle_id, company_name, ip_address, registered_at) VALUES
('exec001', 'TechCorp Inc', '192.168.1.1', NOW() - INTERVAL '30 days'),
('dev002', 'TechCorp Inc', '192.168.1.2', NOW() - INTERVAL '25 days'),
('mgr003', 'TechCorp Inc', '192.168.1.3', NOW() - INTERVAL '20 days'),
('qa004', 'TechCorp Inc', '192.168.1.4', NOW() - INTERVAL '15 days'),
('hr005', 'TechCorp Inc', '192.168.1.5', NOW() - INTERVAL '10 days'),
('sales006', 'TechCorp Inc', '192.168.1.6', NOW() - INTERVAL '8 days'),
('support007', 'TechCorp Inc', '192.168.1.7', NOW() - INTERVAL '5 days'),
('marketing008', 'TechCorp Inc', '192.168.1.8', NOW() - INTERVAL '3 days'),
('finance009', 'TechCorp Inc', '192.168.1.9', NOW() - INTERVAL '2 days'),
('intern010', 'TechCorp Inc', '192.168.1.10', NOW() - INTERVAL '1 day');

-- Insert sentiment data with realistic patterns
INSERT INTO public.sentiments (handle_id, sentiment, timestamp) VALUES
-- Recent data (last 24 hours) - mixed sentiment
('exec001', 'GREAT', NOW() - INTERVAL '2 hours'),
('dev002', 'MEH', NOW() - INTERVAL '3 hours'),
('mgr003', 'UGH', NOW() - INTERVAL '4 hours'),
('qa004', 'GREAT', NOW() - INTERVAL '5 hours'),
('hr005', 'MEH', NOW() - INTERVAL '6 hours'),
('sales006', 'GREAT', NOW() - INTERVAL '8 hours'),
('support007', 'UGH', NOW() - INTERVAL '10 hours'),
('marketing008', 'MEH', NOW() - INTERVAL '12 hours'),
('finance009', 'GREAT', NOW() - INTERVAL '15 hours'),
('intern010', 'MEH', NOW() - INTERVAL '18 hours'),

-- Week data - showing Monday blues and Friday highs
('exec001', 'UGH', NOW() - INTERVAL '1 day' - INTERVAL '2 hours'),
('dev002', 'MEH', NOW() - INTERVAL '1 day' - INTERVAL '4 hours'),
('mgr003', 'UGH', NOW() - INTERVAL '2 days' - INTERVAL '3 hours'),
('qa004', 'MEH', NOW() - INTERVAL '2 days' - INTERVAL '5 hours'),
('hr005', 'GREAT', NOW() - INTERVAL '3 days' - INTERVAL '2 hours'),
('sales006', 'GREAT', NOW() - INTERVAL '3 days' - INTERVAL '4 hours'),
('support007', 'GREAT', NOW() - INTERVAL '4 days' - INTERVAL '3 hours'),
('marketing008', 'MEH', NOW() - INTERVAL '5 days' - INTERVAL '2 hours'),
('finance009', 'UGH', NOW() - INTERVAL '6 days' - INTERVAL '4 hours'),
('intern010', 'MEH', NOW() - INTERVAL '7 days' - INTERVAL '3 hours'),

-- Month data - various patterns
('exec001', 'GREAT', NOW() - INTERVAL '10 days'),
('dev002', 'MEH', NOW() - INTERVAL '12 days'),
('mgr003', 'UGH', NOW() - INTERVAL '14 days'),
('qa004', 'GREAT', NOW() - INTERVAL '16 days'),
('hr005', 'MEH', NOW() - INTERVAL '18 days'),
('sales006', 'GREAT', NOW() - INTERVAL '20 days'),
('support007', 'UGH', NOW() - INTERVAL '22 days'),
('marketing008', 'MEH', NOW() - INTERVAL '24 days'),
('finance009', 'GREAT', NOW() - INTERVAL '26 days'),
('intern010', 'MEH', NOW() - INTERVAL '28 days');
