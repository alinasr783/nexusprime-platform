-- Fix payment type constraint
ALTER TABLE public.project_payments DROP CONSTRAINT IF EXISTS project_payments_payment_type_check;
ALTER TABLE public.project_payments ADD CONSTRAINT project_payments_payment_type_check 
CHECK (payment_type IN ('initial', 'progress', 'final', 'milestone', 'addon'));

-- Insert dummy payment data with correct payment types
INSERT INTO public.project_payments (project_id, amount, payment_type, status, due_date, description) VALUES 
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 5000, 'initial', 'paid', now() - interval '10 days', 'دفعة مقدمة - 50%'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 3000, 'progress', 'pending', now() + interval '5 days', 'دفعة التقدم - 30%'),
('1940182b-ed78-44fb-b99b-f7c9fc11b8e4', 2000, 'final', 'pending', now() + interval '15 days', 'الدفعة النهائية - 20%')
ON CONFLICT DO NOTHING;