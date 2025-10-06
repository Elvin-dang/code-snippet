import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ComplexityAnalysis } from "@/lib/complexity-analyzer";

interface ComplexityBadgeProps {
  analysis: ComplexityAnalysis;
  showDetails?: boolean;
  dict?: any;
}

export function ComplexityBadge({ analysis, showDetails = false, dict }: ComplexityBadgeProps) {
  const getComplexityColor = (complexity: string) => {
    if (complexity === "O(1)")
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    if (complexity === "O(log n)")
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    if (complexity === "O(n)" || complexity === "O(n log n)")
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
  };

  const getConfidenceText = (confidence: string) => {
    return dict.complexity.confidenceText + " " + dict.complexity.confidence[confidence];
  };

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={getComplexityColor(analysis.complexity)}>
              {analysis.complexity}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{analysis.explanation}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {getConfidenceText(analysis.confidence)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={getComplexityColor(analysis.complexity)}>
          {analysis.complexity}
        </Badge>
        <span className="text-sm text-muted-foreground">
          ({getConfidenceText(analysis.confidence)})
        </span>
      </div>
      <p className="text-sm">{analysis.explanation}</p>
      {analysis.patterns.length > 0 && (
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">{dict.complexity.detectedPatterns}:</p>
          <ul className="list-disc list-inside space-y-1">
            {analysis.patterns.map((pattern, i) => (
              <li key={i} className="text-muted-foreground">
                {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
