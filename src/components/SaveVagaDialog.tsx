import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

interface SaveVagaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (titulo: string) => void;
  isLoading?: boolean;
  defaultTitulo?: string;
}

export const SaveVagaDialog = ({ open, onOpenChange, onSave, isLoading, defaultTitulo }: SaveVagaDialogProps) => {
  const [titulo, setTitulo] = useState(defaultTitulo || "");

  const handleSave = () => {
    if (titulo.trim()) {
      onSave(titulo.trim());
      setTitulo("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Salvar Roteiro da Vaga
          </DialogTitle>
          <DialogDescription>
            Digite um título para identificar esta vaga
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título da Vaga *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Desenvolvedor Full Stack Sênior"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="bg-input border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!titulo.trim() || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
