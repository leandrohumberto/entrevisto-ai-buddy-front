import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ScriptDisplay } from "@/components/ScriptDisplay";
import { SaveVagaDialog } from "@/components/SaveVagaDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Copy, Focus, Users, Filter, Save, Plus, Trash2, Edit2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from "@supabase/supabase-js";

interface VagaRoteiros {
  principal: string;
  tecnico: string;
  comportamental: string;
  triagem: string;
}

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [vagaId, setVagaId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [isEditingTitulo, setIsEditingTitulo] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [originalJobDescription, setOriginalJobDescription] = useState("");
  const [roteiros, setRoteiros] = useState<VagaRoteiros>({
    principal: "",
    tecnico: "",
    comportamental: "",
    triagem: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.state?.vaga) {
      const vaga = location.state.vaga;
      setVagaId(vaga.id);
      setTitulo(vaga.titulo);
      setJobDescription(vaga.descricao_vaga_original);
      setOriginalJobDescription(vaga.descricao_vaga_original);
      setRoteiros({
        principal: vaga.roteiro_principal || "",
        tecnico: vaga.roteiro_tecnico || "",
        comportamental: vaga.roteiro_comportamental || "",
        triagem: vaga.roteiro_triagem || ""
      });
      setHasGenerated(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const generateScript = async (regenerationType?: string) => {
    if (!jobDescription.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, insira a descrição da vaga",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-script', {
        body: {
          jobDescription,
          regenerationType,
          previousScript: regenerationType ? roteiros.principal : undefined
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (regenerationType === "technical") {
        setRoteiros(prev => ({ ...prev, tecnico: data.script }));
      } else if (regenerationType === "behavioral") {
        setRoteiros(prev => ({ ...prev, comportamental: data.script }));
      } else if (regenerationType === "screening") {
        setRoteiros(prev => ({ ...prev, triagem: data.script }));
      } else {
        setRoteiros(prev => ({ ...prev, principal: data.script }));
        setOriginalJobDescription(jobDescription);
      }
      
      setHasGenerated(true);
      
      toast({
        title: "Sucesso!",
        description: regenerationType 
          ? "Roteiro regenerado com sucesso" 
          : "Roteiro gerado com sucesso",
      });
    } catch (error: any) {
      console.error('Error generating script:', error);
      toast({
        title: "Erro ao gerar roteiro",
        description: error.message || "Ocorreu um erro ao gerar o roteiro",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyScript = () => {
    const allScripts = [
      roteiros.principal && `# Roteiro Principal\n\n${roteiros.principal}`,
      roteiros.tecnico && `# Roteiro Técnico\n\n${roteiros.tecnico}`,
      roteiros.comportamental && `# Roteiro Comportamental\n\n${roteiros.comportamental}`,
      roteiros.triagem && `# Roteiro de Triagem\n\n${roteiros.triagem}`
    ].filter(Boolean).join("\n\n---\n\n");

    navigator.clipboard.writeText(allScripts);
    toast({
      title: "Copiado!",
      description: "Roteiros copiados para a área de transferência",
    });
  };

  const handleSaveVaga = async (novoTitulo: string) => {
    setIsSaving(true);
    try {
      if (vagaId) {
        const { error } = await supabase
          .from("vagas")
          .update({
            titulo: novoTitulo,
            descricao_vaga_original: jobDescription,
            roteiro_principal: roteiros.principal,
            roteiro_tecnico: roteiros.tecnico,
            roteiro_comportamental: roteiros.comportamental,
            roteiro_triagem: roteiros.triagem,
          })
          .eq("id", vagaId);

        if (error) throw error;

        setTitulo(novoTitulo);
        setOriginalJobDescription(jobDescription);
        toast({
          title: "Alterações salvas",
          description: "A vaga foi atualizada com sucesso",
        });
      } else {
        const { data, error } = await supabase
          .from("vagas")
          .insert({
            user_id: user?.id,
            titulo: novoTitulo,
            descricao_vaga_original: jobDescription,
            roteiro_principal: roteiros.principal,
            roteiro_tecnico: roteiros.tecnico,
            roteiro_comportamental: roteiros.comportamental,
            roteiro_triagem: roteiros.triagem,
          })
          .select()
          .single();

        if (error) throw error;

        setVagaId(data.id);
        setTitulo(novoTitulo);
        setOriginalJobDescription(jobDescription);
        toast({
          title: "Roteiro salvo!",
          description: "Você pode acessá-lo em 'Minhas Vagas'",
        });
      }

      setSaveDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving vaga:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVaga = async () => {
    if (!vagaId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("vagas")
        .delete()
        .eq("id", vagaId);

      if (error) throw error;

      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso",
      });

      handleNovaVaga();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Error deleting vaga:", error);
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNovaVaga = () => {
    setVagaId(null);
    setTitulo("");
    setJobDescription("");
    setOriginalJobDescription("");
    setRoteiros({
      principal: "",
      tecnico: "",
      comportamental: "",
      triagem: ""
    });
    setHasGenerated(false);
    setIsEditingTitulo(false);
  };

  const isDescriptionChanged = originalJobDescription && jobDescription !== originalJobDescription;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              {vagaId && titulo ? (
                <div className="flex items-center justify-center gap-2">
                  {isEditingTitulo ? (
                    <Input
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      onBlur={() => setIsEditingTitulo(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setIsEditingTitulo(false);
                          handleSaveVaga(titulo);
                        }
                      }}
                      className="max-w-md text-center text-2xl font-bold"
                      autoFocus
                    />
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gradient-primary">
                        {titulo}
                      </h1>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingTitulo(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gradient-primary">
                    Gerador de Roteiros de Entrevista
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Cole a descrição da vaga e gere um roteiro estruturado em segundos
                  </p>
                </>
              )}
            </div>
            <Button
              onClick={handleNovaVaga}
              variant="outline"
              className="border-border hover:border-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Vaga
            </Button>
          </div>

          {isDescriptionChanged && (
            <Alert className="border-accent bg-accent/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                O roteiro atual está desatualizado. Clique em "Gerar Roteiro" para atualizar.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6 min-h-[600px]">
            <Card className="p-6 bg-card border-border flex flex-col">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Descrição da Vaga
              </h2>
              <Textarea
                placeholder="Cole aqui a descrição completa da vaga..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="flex-1 resize-none bg-input border-border text-foreground min-h-[400px]"
              />
              <div className="mt-4">
                <Button
                  onClick={() => generateScript()}
                  disabled={isLoading || !jobDescription.trim()}
                  className="w-full bg-primary hover:bg-primary/90 glow-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Roteiro de Entrevista
                </Button>
              </div>
            </Card>

            <div className="flex flex-col gap-4">
              <ScriptDisplay 
                roteiros={roteiros}
                isLoading={isLoading} 
              />
              
              {hasGenerated && roteiros.principal && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={copyScript}
                      variant="outline"
                      className="border-border hover:border-primary"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Roteiro
                    </Button>
                    <Button
                      onClick={() => setSaveDialogOpen(true)}
                      className="bg-primary hover:bg-primary/90 glow-primary"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {vagaId ? "Salvar Alterações" : "Salvar Roteiro"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button
                      onClick={() => generateScript("technical")}
                      variant="outline"
                      size="sm"
                      className="border-border hover:border-primary"
                      disabled={isLoading}
                    >
                      <Focus className="mr-2 h-4 w-4" />
                      Aprofundar Técnica
                    </Button>
                    <Button
                      onClick={() => generateScript("behavioral")}
                      variant="outline"
                      size="sm"
                      className="border-border hover:border-accent"
                      disabled={isLoading}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Focar em Comportamental
                    </Button>
                    <Button
                      onClick={() => generateScript("screening")}
                      variant="outline"
                      size="sm"
                      className="border-border hover:border-accent"
                      disabled={isLoading}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Versão Triagem
                    </Button>
                  </div>

                  {vagaId && (
                    <Button
                      onClick={() => setDeleteDialogOpen(true)}
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Vaga
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SaveVagaDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveVaga}
        isLoading={isSaving}
        defaultTitulo={titulo}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteVaga}
        titulo={titulo}
        isLoading={isDeleting}
      />
    </div>
  );
}
