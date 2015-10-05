package interpreter.flow;
import interpreter.exceptions.ActionFailureException;

import java.util.ArrayList;
import java.util.EventListener;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Random;

import org.graphstream.graph.Edge;
import org.graphstream.graph.implementations.*;

public class NodeThread extends ManagedThread
{		
	public AAction Action;
	public SingleNode Node;
	public HashMap<String, Boolean> Pipes;	
	public boolean HasBreakpoint;
	
	public NodeThread(GraphHandler owner, AAction action, SingleNode nodeml) {
		super(owner);
		Action = action;
		Node = nodeml;
		Pipes = new HashMap<String,Boolean>();
		setName(Node.getId());
		Iterator<Edge> i = nodeml.getEachEnteringEdge().iterator();
		while(i.hasNext())
			addSignalPipe(((Edge)i.next()).getSourceNode().getId());
	}
	
	public String getNodeId(){
		return Node.getId();
	}
	
	public void addSignalPipe(String pipeID){
		Pipes.put(pipeID, false);
	}	
	
	public SingleNode getNodeml(){
		return Node;
	}
	
	public synchronized void signal(String pipeID){
		Pipes.put(pipeID, true);
		Iterator<Boolean> ite = Pipes.values().iterator();
		boolean res = true;
		while(ite.hasNext())
			if(!(boolean)ite.next()){
				res = false;
				break;			
			}
		if(res&&(!isAlive()))
			start();		
	}
	
	
	
	public void execute() throws Exception{		
			if(HasBreakpoint)
				pause();
			sleep((new Random()).nextInt(1000) + 500);			
			Action.run();
			if(Action.hadException())
				throw Action.getException();
			if(!Action.getIsSuccessful())
				throw new ActionFailureException();			
	}
}

