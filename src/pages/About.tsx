import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold">Sobre o Entrevisto</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O Entrevisto ajuda recrutadores e gestores a conduzirem entrevistas mais
              inteligentes e consistentes, gerando roteiros completos em segundos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Estruturado</h3>
              <p className="text-muted-foreground">
                Roteiros organizados em seções claras: técnica, comportamental, cultural e
                motivacional.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
              <Zap className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rápido</h3>
              <p className="text-muted-foreground">
                Gere roteiros profissionais em segundos. Ajuste o foco entre técnico,
                comportamental ou triagem.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary transition-colors">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Profissional</h3>
              <p className="text-muted-foreground">
                Perguntas baseadas em metodologias consolidadas como STAR, com objetivos
                claros.
              </p>
            </Card>
          </div>

          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold mb-4">Como funciona?</h2>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <strong className="text-foreground">Cole a descrição da vaga</strong>
                  <p>Insira o texto completo da vaga que você está recrutando.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <strong className="text-foreground">Gere o roteiro</strong>
                  <p>
                    Nossa IA analisa as competências e cria um roteiro estruturado com
                    perguntas técnicas e comportamentais.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <strong className="text-foreground">Ajuste o foco</strong>
                  <p>
                    Refine o roteiro para aprofundar em aspectos técnicos, comportamentais
                    ou criar uma versão para triagem rápida.
                  </p>
                </div>
              </li>
            </ol>
          </Card>

          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold mb-4">Para quem é o Entrevisto?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <span>
                  <strong className="text-foreground">Recrutadores de PMEs</strong> que
                  precisam estruturar processos seletivos rapidamente
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <span>
                  <strong className="text-foreground">Times de RH de startups</strong> que
                  buscam consistência em suas entrevistas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">▸</span>
                <span>
                  <strong className="text-foreground">Fundadores e gestores</strong> que
                  conduzem entrevistas técnicas e precisam de orientação estruturada
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 bg-card border-border border-primary/30">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Novidade: Gerencie seus Roteiros
            </h2>
            <p className="text-muted-foreground mb-4">
              Agora você pode <strong className="text-foreground">salvar, editar e excluir</strong> seus roteiros 
              diretamente pelo app. Acesse <strong className="text-foreground">"📁 Minhas Vagas"</strong> no menu 
              superior para gerenciar todos os seus roteiros salvos.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Salve vagas com múltiplas versões de roteiros</li>
              <li>Edite títulos e descrições a qualquer momento</li>
              <li>Acesse rapidamente seus roteiros anteriores</li>
              <li>Exclua vagas quando não precisar mais delas</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
