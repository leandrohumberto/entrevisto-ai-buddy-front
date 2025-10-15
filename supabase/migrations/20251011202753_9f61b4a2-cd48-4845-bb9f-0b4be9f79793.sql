-- Create vagas table
CREATE TABLE public.vagas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao_vaga_original TEXT NOT NULL,
  roteiro_principal TEXT NOT NULL,
  roteiro_tecnico TEXT,
  roteiro_comportamental TEXT,
  roteiro_triagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own vagas"
ON public.vagas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vagas"
ON public.vagas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vagas"
ON public.vagas
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vagas"
ON public.vagas
FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_vagas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vagas_updated_at
BEFORE UPDATE ON public.vagas
FOR EACH ROW
EXECUTE FUNCTION public.update_vagas_updated_at();