/// <reference types="vite/client" />

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "echarts-for-react/core" {
  import type { EChartsInstance } from "echarts-for-react";
  import type { ComponentType } from "react";

  interface EChartsReactCoreProps {
    echarts: unknown;
    option: Record<string, unknown>;
    style?: React.CSSProperties;
    className?: string;
    theme?: string | Record<string, unknown>;
    notMerge?: boolean;
    lazyUpdate?: boolean;
    showLoading?: boolean;
    loadingOption?: Record<string, unknown>;
    opts?: { renderer?: "canvas" | "svg"; width?: number; height?: number };
    onEvents?: Record<string, (params: unknown) => void>;
    onChartReady?: (instance: EChartsInstance) => void;
  }

  const EChartsReactCore: ComponentType<EChartsReactCoreProps>;
  export default EChartsReactCore;
}

declare module "echarts-for-react/lib/types" {
  export type EChartsOption = Record<string, unknown>;
}
