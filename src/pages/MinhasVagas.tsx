import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import apiClient from "@/lib/api"; // Import the new API client
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Trash2, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import type { User } from "@supabase/supabase-js";

// Updated Vaga interface to match backend ViewModel
interface Vaga {
  id: string;
  titulo: string;
  descricaoVagaOriginal: string;
  roteiroPrincipal: string;
  roteiroTecnico: string | null;
  roteiroComportamental: string | null;
  roteiroTriagem: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MinhasVagas() {
  const [user, setUser] = useState<User | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    if (user) {
      loadVagas();
    }
  }, [user]);

  const loadVagas = async () => {
    try {
      const data = await apiClient('/api/Vagas');
      setVagas(data || []);
    } catch (error: any) {
      console.error("Error loading vagas:", error);
      toast({
        title: "Erro ao carregar vagas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (vaga: Vaga) => {
    navigate("/", { state: { vaga } });
  };

  const handleDeleteClick = (vaga: Vaga) => {
    setSelectedVaga(vaga);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVaga) return;

    setIsDeleting(true);
    try {
      await apiClient(`/api/Vagas/${selectedVaga.id}`, { method: 'DELETE' });

      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso",
      });

      setVagas(vagas.filter(v => v.id !== selectedVaga.id));
      setDeleteDialogOpen(false);
      setSelectedVaga(null);
    } catch (error: any) {
      console.error("Error deleting vaga:", error);
      toast({
        title: "Erro ao excluir vaga",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
                <FolderOpen className="h-8 w-8" />
                Minhas Vagas
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie seus roteiros de entrevista salvos
              </p>
            </div>
            <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
              Nova Vaga
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando vagas...</p>
            </div>
          ) : vagas.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Nenhuma vaga salva</h2>
              <p className="text-muted-foreground mb-6">
                Comece gerando um roteiro de entrevista e salve-o para acessá-lo depois
              </p>
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90">
                Criar Primeira Vaga
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {vagas.map((vaga) => (
                <Card key={vaga.id} className="p-6 bg-card border-border hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{vaga.titulo}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(vaga.createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {[
                            vaga.roteiroPrincipal && "Principal",
                            vaga.roteiroTecnico && "Técnico",
                            vaga.roteiroComportamental && "Comportamental",
                            vaga.roteiroTriagem && "Triagem"
                          ].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpen(vaga)}
                        variant="outline"
                        size="sm"
                        className="border-border hover:border-primary"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Abrir
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(vaga)}
                        variant="outline"
                        size="sm"
                        className="border-border hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        titulo={selectedVaga?.titulo || ""}
        isLoading={isDeleting}
      />
    </div>
  );
}