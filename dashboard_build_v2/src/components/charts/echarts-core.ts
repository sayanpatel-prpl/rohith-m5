/**
 * Tree-shaken ECharts setup (Pitfall 3 mitigation)
 *
 * Imports only the chart types and components needed by the dashboard.
 * Without tree-shaking, ECharts adds ~1MB to the bundle.
 * With this setup, it should be ~300KB.
 */

import * as echarts from "echarts/core";

import {
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  TreemapChart,
  ScatterChart,
} from "echarts/charts";

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

import { LabelLayout, UniversalTransition } from "echarts/features";

echarts.use([
  // Charts
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  TreemapChart,
  ScatterChart,
  // Components
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  // Renderer
  CanvasRenderer,
  // Features
  LabelLayout,
  UniversalTransition,
]);

export default echarts;
