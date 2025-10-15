import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VagaRoteiros {
  principal: string;
  tecnico: string;
  comportamental: string;
  triagem: string;
}

interface ScriptDisplayProps {
  roteiros: VagaRoteiros;
  isLoading: boolean;
}

export const ScriptDisplay = ({ roteiros, isLoading }: ScriptDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-card border-border min-h-[400px] flex flex-col gap-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </Card>
    );
  }

  if (!roteiros.principal && !roteiros.tecnico && !roteiros.comportamental && !roteiros.triagem) {
    return (
      <Card className="p-6 bg-card border-border min-h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          O roteiro gerado aparecerá aqui
        </p>
      </Card>
    );
  }

  const hasMultipleScripts = [roteiros.tecnico, roteiros.comportamental, roteiros.triagem].filter(Boolean).length > 0;

  if (!hasMultipleScripts && roteiros.principal) {
    return (
      <Card className="p-6 bg-card border-border min-h-[400px]">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{roteiros.principal}</ReactMarkdown>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border min-h-[400px]">
      <Tabs defaultValue="principal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="principal" disabled={!roteiros.principal}>
            Principal
          </TabsTrigger>
          <TabsTrigger value="tecnico" disabled={!roteiros.tecnico}>
            Técnico
          </TabsTrigger>
          <TabsTrigger value="comportamental" disabled={!roteiros.comportamental}>
            Comportamental
          </TabsTrigger>
          <TabsTrigger value="triagem" disabled={!roteiros.triagem}>
            Triagem
          </TabsTrigger>
        </TabsList>
        
        {roteiros.principal && (
          <TabsContent value="principal" className="mt-4">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{roteiros.principal}</ReactMarkdown>
            </div>
          </TabsContent>
        )}
        
        {roteiros.tecnico && (
          <TabsContent value="tecnico" className="mt-4">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{roteiros.tecnico}</ReactMarkdown>
            </div>
          </TabsContent>
        )}
        
        {roteiros.comportamental && (
          <TabsContent value="comportamental" className="mt-4">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{roteiros.comportamental}</ReactMarkdown>
            </div>
          </TabsContent>
        )}
        
        {roteiros.triagem && (
          <TabsContent value="triagem" className="mt-4">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{roteiros.triagem}</ReactMarkdown>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};
