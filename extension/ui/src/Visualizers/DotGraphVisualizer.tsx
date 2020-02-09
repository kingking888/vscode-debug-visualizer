import { observer } from "mobx-react";
import * as React from "react";
import { DotViewer } from "./DotVisualizer";
import {
	VisualizationProvider,
	VisualizationCollector,
	asVisualizationId,
} from "./Visualizer";
import {
	ExtractedData,
	isCommonDataType,
} from "@hediet/debug-visualizer-data-extraction";

export class DotGraphVisualizer extends VisualizationProvider {
	getVisualizations(
		data: ExtractedData,
		collector: VisualizationCollector
	): void {
		if (isCommonDataType(data, { graph: true })) {
			collector.addVisualization({
				id: asVisualizationId("dot-graph"),
				name: "Dot Graph",
				priority: 100,
				render() {
					return (
						<DotGraphViewer edges={data.edges} nodes={data.nodes} />
					);
				},
			});
		}
	}
}

@observer
export class DotGraphViewer extends React.Component<{
	nodes: { id: string; label: string }[];
	edges: { from: string; to: string; label: string }[];
}> {
	render() {
		const { nodes, edges } = this.props;
		const dotContent = `
            digraph MyGraph {
                ${nodes
					.map(n => `${n.id} [ label = ${JSON.stringify(n.label)} ];`)
					.join("\n ")}
                ${edges
					.map(
						e =>
							`${e.from} -> ${e.to} [ label = ${JSON.stringify(
								e.label
							)} ];`
					)
					.join("\n")}
            }
        `;
		return <DotViewer dotCode={dotContent} />;
	}
}
