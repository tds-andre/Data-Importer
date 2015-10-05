 package interpreter;

import interpreter.databases.JdbcConnectionToken;
import interpreter.databases.JdbcDatabase;
import interpreter.databases.LocalFileSystem;
import interpreter.datasets.ADataset;
import interpreter.datasets.IDataset;
import interpreter.datasets.InterpreterConfiguration;
import interpreter.datasets.InterpreterInput;
import interpreter.flow.DatasetCopier;
import interpreter.flow.EDatasetCopierMode;
import interpreter.flow.GraphHandler;
import interpreter.flow.NodeThread;
import interpreter.flow.ManagedThread;
import interpreter.flow.ThreadManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;

import org.graphstream.ui.swingViewer.Viewer;
import org.graphstream.ui.swingViewer.ViewerListener;
import org.graphstream.ui.swingViewer.ViewerPipe;
import org.xml.sax.SAXException;

public class Interpreter
{
	public GraphHandler Transformer;	
	public ThreadManager Extractor;
	public ThreadManager Loader;	
	public JdbcDatabase Workspace;
	public InterpreterConfiguration Configuration;
	public InterpreterInput Input;
	
	private ActionListener NodeEventLogger = new ActionListener() {			
		@Override
		public void actionPerformed(ActionEvent e) {						
			System.out.println("["+e.getID()+"]:"+e.getActionCommand());				
		}
	};
	
	public Interpreter(String configFile) throws XPathExpressionException, Exception {
		super();
		Configuration = new InterpreterConfiguration(new LocalFileSystem(""), configFile)	;
		Workspace = new JdbcDatabase((JdbcConnectionToken) Configuration.getWorkspaceToken());
	}	
	
	public void Execute(String inputFile) throws Exception, ParserConfigurationException, SAXException, IOException, XPathExpressionException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException, SQLException {
		Input = new InterpreterInput(new LocalFileSystem(""), inputFile);		
		Loader = new ThreadManager();		
		Transformer = new GraphHandler(Workspace);
		
		ArrayList<String> busNameList = Configuration.getBusNameList();
		HashMap<String,ADataset> sourceMap = Input.getMapping();
		HashMap<String,String> targetMap = Configuration.getInputMapping();
		ArrayList<EDatasetCopierMode> busModeList = Configuration.getBusModeList();
		Transformer.loadFromGraphml(Configuration.getGraphml());
		
		Workspace.connect();
		
		
		
		for(int i = 0; i< busNameList.size(); i++){
			if(sourceMap.containsKey(busNameList.get(i))){				
				ManagedThread t = Loader.addThread(new DatasetCopier(Loader, busModeList.get(i), (IDataset)sourceMap.get(busNameList.get(i)), Workspace.newDatasetInstance(targetMap.get(busNameList.get(i)))));
				t.addEventListener(NodeEventLogger);
			}
		}
		Loader.startAll();
		Loader.joinAll();
		
		//pause test
		//((NodeThread)(Transformer.Threads.get(3))).HasBreakpoint = true;
		//
		
		Transformer.addEventListener(new ActionListener() {
			
			@Override
			public void actionPerformed(ActionEvent e) {
				if(e.getSource() instanceof NodeThread)
					System.out.println("["+((NodeThread)e.getSource()).getNodeId()+"]'"+((NodeThread)e.getSource()).getMessage()+"':"+e.getActionCommand());
				else if(e.getSource() instanceof GraphHandler){
					System.out.println("FINISH HIM.");
				}
				
			}
		});
		
		Transformer.addErrorListener(new ActionListener() {			
			@Override
			public void actionPerformed(ActionEvent event) {
				NodeThread node = (NodeThread)event.getSource();
				node.getNodeml().getGraph().addAttribute("ui.stylesheet", "node#"+node.getNodeId()+" { fill-color: red; }");				
			}
		});
		
		Transformer.addResumeListener(new ActionListener() {			
			@Override
			public void actionPerformed(ActionEvent event) {
				NodeThread node = (NodeThread)event.getSource();
				node.getNodeml().getGraph().addAttribute("ui.stylesheet", "node#"+node.getNodeId()+" { fill-color: blue; }");				
			}
		});
		
		
		Transformer.addSuccessListener(new ActionListener() {			
			@Override
			public void actionPerformed(ActionEvent event) {
				NodeThread node = (NodeThread)event.getSource();
				node.getNodeml().getGraph().addAttribute("ui.stylesheet", "node#"+node.getNodeId()+" { fill-color: green; }");				
			}
		});
		
		
		Transformer.addPauseListener(new ActionListener() {			
			@Override
			public void actionPerformed(ActionEvent event) {
				NodeThread node = (NodeThread)event.getSource();
				node.getNodeml().getGraph().addAttribute("ui.stylesheet", "node#"+node.getNodeId()+" { fill-color: yellow; }");
				try {
					node.sleep(5000);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				node.play();
			}
		});
		
		
		
		Viewer viewer = Transformer.getGraphml().display();
	
		if(Configuration.getGraphml().getNodeCount() > 0)
			Transformer.start();
		
		
		
	}	
}

