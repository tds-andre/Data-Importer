package interpreter.flow;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.Iterator;

import org.graphstream.graph.Edge;

public class NodeListener implements ActionListener {

	public ArrayList<Edge> Edges;
	public GraphHandler Graph;
	public String OwnerId;
	
	public NodeListener(GraphHandler owner, Iterator<Edge> edges, String selfId) {
		Graph = owner;
		OwnerId = selfId;
		Edges = new ArrayList<Edge>();
		while(edges.hasNext()){
			Edges.add(edges.next());
		}
	}

	@Override
	public void actionPerformed(ActionEvent e){
		
			for(int i = 0; i < Edges.size(); i++){				;
				Graph.signalNode(Edges.get(i).getTargetNode().getId(), OwnerId);
			}
	}
}
