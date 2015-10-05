package interpreter.flow;
import interpreter.databases.JdbcDatabase;
import interpreter.flow.SqlStatementsExecutor.ETransactionMode;
import interpreter.utils.BreadcrumbItem;
import interpreter.utils.TextFile;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.graphstream.graph.Edge;
import org.graphstream.graph.implementations.*;
import org.graphstream.ui.spriteManager.SpriteManager;

public class GraphHandler extends ThreadManager
{	
	ArrayList<NodeThread> Entries;
	ArrayList<NodeThread> Endies;
	EventNotifier Notifier = new EventNotifier();
	ActionListener Logger;
	public String DefaultResourcesPath = "";
	public JdbcDatabase Database;
	private SingleGraph Graph;
	private Integer ComebackCounter = 0;
	private boolean IsFinished = false;
	public boolean getIsFinished(){
		return IsFinished;
	}
	private ActionListener ComebackListener = new ActionListener() {
		
		@Override
		public void actionPerformed(ActionEvent event) {						
			registerComeback(((NodeThread)event.getSource()).getNodeId());
		}
	};
	
	public void addCompletionListener(ActionListener listener){
		Notifier.add("completion", listener);
	}
	
	public GraphHandler(JdbcDatabase db) throws SQLException{		
		super();
		Entries = new ArrayList<NodeThread>();
		Endies = new ArrayList<NodeThread>();
		Database = db;		
	}
	
	public SingleGraph getGraphml(){
		return Graph;
	}
	
	public void loadFromGraphml(SingleGraph graphml) throws Exception{
		
		Graph = graphml;
		//get graph level attributes
		DefaultResourcesPath = BreadcrumbItem.preparePath((String)graphml.getAttribute("default-resources-path"));
		if(DefaultResourcesPath==null)
			DefaultResourcesPath = "";
		
		//iterate nodes
		for(int i = 0; i < graphml.getNodeCount(); i++){
			
			//get node level attributes
			SingleNode nodeml = graphml.getNode(i);
			String actionType = (String)nodeml.getAttribute("action-type");
			AAction action = null;
			
			//get action-type specific attributes
			if((actionType==null)||(actionType.equals("")))
				actionType = "query";
			if(actionType.equals("query")){
				String query = (String)nodeml.getAttribute("query-statements");
				if(query==null||query.equals("")){
					String queryFile = (String)nodeml.getAttribute("query-statements-file");
					if(queryFile==null||queryFile.equals(""))
						queryFile = DefaultResourcesPath + nodeml.getId() + ".sql";
					else
						queryFile = DefaultResourcesPath + queryFile;
					query = TextFile.toString(queryFile);
				}
				String transactionMode = (String)nodeml.getAttribute("query-transaction-mode");
				action = new SqlStatementsExecutor(Database,query,ETransactionMode.valueOf(transactionMode.toUpperCase()));
			}
			
			//create stuff
			NodeThread node = new NodeThread(this,action,nodeml);
			nodeml.addAttribute("ui.label", nodeml.getId());
			addThread(node);
			Iterable<Edge> edges = nodeml.getEachLeavingEdge();
			if(edges.iterator().hasNext()){
				node.addSuccessListener(new NodeListener(this, edges.iterator(),nodeml.getId()));
				if(!nodeml.getEachEnteringEdge().iterator().hasNext())
					Entries.add(node);
			}
			else{
				Endies.add(node);				
				node.addSuccessListener(ComebackListener);
				
			}
		}
	}

	
	private synchronized void registerComeback(String nodeID){
		ComebackCounter++;
		if(ComebackCounter>=Endies.size()){
			checkout();			
		}
	}
	
	private void checkout(){
		Notifier.trigger("completion", new ActionEvent(this, this.hashCode(), "completion"));
		IsFinished = true;
		try {
			Database.getConnection().commit();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	@Override
	public void addEventListener(ActionListener listener){
		super.addEventListener(listener);
		addCompletionListener(listener);
	}
	

	public void signalNode(String nodeId, String callerId) {
		getNodeById(nodeId).signal(callerId);				
	}
	
	public NodeThread getNodeById(String nodeId){
		for(int i = 0; i < Threads.size(); i++){
			if(((NodeThread)(Threads.get(i))).getNodeId().equals(nodeId))
				return (NodeThread)(Threads.get(i));
		}
		return null;
	}

	public void start() throws SQLException {
		Database.getConnection().setAutoCommit(false);
		for(int i = 0; i<Entries.size(); i++)
			Entries.get(i).start();
		
	}

	
}

