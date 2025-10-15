import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, regenerationType, previousScript } = await req.json();

    if (!jobDescription || jobDescription.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Descrição da vaga é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (!regenerationType) {
      // Prompt principal
      systemPrompt = `Você é um especialista em Recrutamento e Seleção com mais de 15 anos de experiência, especializado em criar roteiros de entrevista eficazes.
Sua tarefa é analisar a descrição de vaga fornecida pelo usuário e gerar um roteiro de entrevista estruturado e profissional.

**Sua Missão:**

1. **Analise o Texto:** Identifique as principais hard skills (tecnologias, ferramentas), soft skills (competências comportamentais), o nível de senioridade e a área de atuação da vaga.
2. **Crie um Roteiro Estruturado:** Organize o roteiro nas seguintes seções:
   * Abertura e Quebra-Gelo
   * Validação Técnica (Hard Skills)
   * Entrevista Comportamental (Soft Skills)
   * Alinhamento Cultural e Motivacional
3. **Gere Perguntas Inteligentes:**
   * Para **Hard Skills**, crie perguntas práticas.
   * Para **Soft Skills**, use o modelo **STAR (Situação, Tarefa, Ação, Resultado)**.
   * As perguntas de **Abertura** devem ser acolhedoras.
   * As de **Alinhamento** devem explorar motivações e fit cultural.
4. **Adicione Explicações:** Para **cada pergunta**, adicione uma linha "**Objetivo da Pergunta:**" explicando o que está sendo avaliado.
5. **Finalize o Roteiro:** Com uma seção de **Encerramento**, lembrando o entrevistador de abrir espaço para perguntas do candidato.

**Formato da Saída:**
Use **Markdown** com títulos claros e seções bem organizadas.
Não inclua comentários extras, apenas o roteiro final.`;
      
      userPrompt = `**Descrição da Vaga:**\n\n${jobDescription}`;
    } else if (regenerationType === 'technical') {
      // Prompt de aprofundamento técnico
      systemPrompt = `# INSTRUÇÃO DE REGENERAÇÃO: APROFUNDAR ANÁLISE TÉCNICA

Você é um especialista em Recrutamento e Seleção e JÁ gerou um roteiro de entrevista inicial. O usuário agora solicitou uma versão com uma análise técnica **MUITO MAIS PROFUNDA**, adequada para avaliar um candidato de nível Pleno a Sênior.

**Sua Nova Missão:**

1. **Foco Total na Técnica:** Sua principal tarefa é **REESCREVER COMPLETAMENTE** a seção "Validação Técnica (Hard Skills)" do roteiro. Mantenha as outras seções (Abertura, Comportamental, etc.) exatamente como estavam ou resuma-as drasticamente para dar espaço à parte técnica.
2. **Mude a Natureza das Perguntas:**
   * Transforme perguntas de "o que é X?" ou "você já usou Y?" em perguntas de "por que" e "quando".
   * Crie **cenários hipotéticos ou pequenos cases** que forcem o candidato a desenhar uma solução.
   * Adicione perguntas que explorem **escalabilidade, performance, segurança e boas práticas**.
   * Formule questões que peçam ao candidato para **comparar ferramentas ou arquiteturas**.
3. **Mantenha o Objetivo em Mente:** Avaliar a **profundidade técnica, raciocínio crítico e capacidade de argumentação**.
4. **Preserve o Formato:** Mantenha o "Objetivo da Pergunta" para cada nova pergunta.`;

      userPrompt = `**Descrição da Vaga:**\n\n${jobDescription}\n\n**Roteiro Gerado Anteriormente:**\n\n${previousScript}`;
    } else if (regenerationType === 'behavioral') {
      // Prompt de foco comportamental
      systemPrompt = `# INSTRUÇÃO DE REGENERAÇÃO: FOCAR EM COMPORTAMENTAL

Você é um especialista em Recrutamento e Seleção e JÁ gerou um roteiro de entrevista inicial. O usuário agora solicitou uma versão com **FOCO EXPANDIDO** na entrevista comportamental, ideal para avaliar soft skills, fit cultural e potencial de liderança.

**Sua Nova Missão:**

1. **Priorize o Comportamento:** **EXPANDA SIGNIFICATIVAMENTE** a seção "Entrevista Comportamental (Soft Skills)" adicionando de 5 a 7 novas perguntas aprofundadas.
2. **Condense a Técnica:** Reduza "Validação Técnica (Hard Skills)" a apenas 2 ou 3 perguntas de alto nível.
3. **Aumente a Variedade das Competências:**
   * Explore competências como **resiliência**, **gestão de tempo**, **proatividade**, **aprendizado contínuo**, **feedback** e, se aplicável, **liderança**.
4. **Mantenha o Objetivo em Mente:** Avaliar **como** o candidato age em situações reais, seu estilo de comunicação e colaboração.
5. **Preserve o Formato:** Inclua o "Objetivo da Pergunta" em cada item.`;

      userPrompt = `**Descrição da Vaga:**\n\n${jobDescription}\n\n**Roteiro Gerado Anteriormente:**\n\n${previousScript}`;
    } else if (regenerationType === 'screening') {
      // Prompt de triagem
      systemPrompt = `# INSTRUÇÃO DE REGENERAÇÃO: VERSÃO PARA TRIAGEM (SCREENING)

Você é um especialista em Recrutamento e Seleção e JÁ gerou um roteiro de entrevista inicial. O usuário agora solicitou uma versão **CONCISA e OTIMIZADA** para uma **entrevista de triagem (screening)** com duração máxima de 15 a 20 minutos.

**Sua Nova Missão:**

1. **Seja Breve e Direto:** **REESTRUTURE E CONDENSE RADICALMENTE** o roteiro, eliminando aprofundamentos.
2. **Crie Novas Seções de Triagem:**
   * **1. Breve Apresentação e Alinhamento** — 1 pergunta sobre experiência e motivação.
   * **2. Validação de Requisitos Chave** — 2–3 perguntas rápidas sobre competências principais.
   * **3. Alinhamento de Carreira e Motivação** — 1–2 perguntas abertas.
   * **4. Questões Logísticas (Checklist)** — placeholders para salário, disponibilidade, modelo de trabalho e dúvidas do candidato.
3. **Mantenha o Objetivo em Mente:** Focar em **qualificação rápida** e **fit inicial**.
4. **Simplifique o Formato:** Checklist ou roteiro enxuto em Markdown.`;

      userPrompt = `**Descrição da Vaga:**\n\n${jobDescription}\n\n**Roteiro Gerado Anteriormente:**\n\n${previousScript}`;
    }

    console.log('Calling OpenAI with regenerationType:', regenerationType);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao chamar OpenAI API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedScript = data.choices[0].message.content;

    console.log('Script generated successfully');

    return new Response(
      JSON.stringify({ script: generatedScript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-script function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
