package interpreter.datasets;

import interpreter.databases.AConnectionToken;
import interpreter.databases.Directory;
import interpreter.databases.IDatabase;
import interpreter.databases.JdbcConnectionToken;
import interpreter.databases.JdbcDatabase;
import interpreter.databases.LocalFileSystem;
import interpreter.datasets.InterpreterXmlMarshaller.InterpreterXmlMarshallerResult;
import interpreter.utils.BreadcrumbItem;
import interpreter.utils.TextFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.DOMException;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.graphstream.graph.implementations.*;
import org.graphstream.stream.file.FileSource;
import org.graphstream.stream.file.FileSourceFactory;
import org.graphstream.stream.file.FileSourceGraphML;

public class InterpreterXmlMarshaller extends XmlDataset {

	public InterpreterXmlMarshaller(LocalFileSystem dir, String location)
			throws ParserConfigurationException, SAXException, IOException {
		super(dir, location);
		// TODO Auto-generated constructor stub
	}
	static class InterpreterXmlMarshallerResult{
		HashMap<String,Object> Definitions = new HashMap<String,Object>();		
	}
	
	
	public static Object resolve(Node node, String clss, Map<String,Object> defs) throws Exception{
		java.lang.Object result = null;
		if(clss.equals("path")){
			BreadcrumbItem parent = (BreadcrumbItem)getComplexClass(node,"base", "path", defs);			
			result = new BreadcrumbItem(parent, node.getAttributes().getNamedItem("location").getNodeValue());
		}else if(clss.equals("textfile")){
			BreadcrumbItem parent = (BreadcrumbItem)getComplexClass(node,"base","path", defs);
			result = new TextFile(parent, getAttribute("location", node));
			
		}else if(clss.equals("string")){
			result = node.getTextContent();
		}		
		else if(clss.equals("server")||clss.equals("token")){
			String specs = node.getAttributes().getNamedItem("specialization").getNodeValue();
			AConnectionToken casted = null;
			NamedNodeMap attrs = node.getAttributes();
			if(specs.equals("jdbc")){								
				casted = new JdbcConnectionToken();
				casted.Location = (String)getComplexClass(node, "location", "string", defs);
				((JdbcConnectionToken) casted).Driver = getAttribute("jdbc-driver",node,"mysql");
				((JdbcConnectionToken) casted).User = getAttribute("jdbc-user",node,"root");
				((JdbcConnectionToken) casted).Pass = getAttribute("jdbc-pass",node);
				
				if(clss.equals("server"))
					result = new JdbcDatabase((JdbcConnectionToken) casted);
				else
					result = casted;	
			}else if(specs.equals("local")){
				casted = new Directory((String)getComplexClass(node, "location","string",defs));
				if(clss.equals("server"))
					result = new LocalFileSystem((Directory) casted);
				else
					result = casted;
			}
			casted.Host = getAttribute("host", node, "127.0.0.1");
					
		}else if(clss.equals("dataset")){
			String specs = node.getAttributes().getNamedItem("specialization").getNodeValue();
			ADataset casted = null;
			IDatabase server = (IDatabase)getComplexClass(node,"server","server",defs);
			NamedNodeMap attrs = node.getAttributes();
			if(specs.equals("csv")){								
				casted = new CsvDataset(server, (String)getComplexClass(node, "location","string", defs));
				
				
			}
			result = casted;
		
		}else if(clss.equals("actiongraph")){
			BreadcrumbItem x = (BreadcrumbItem)getComplexClass(node, "graphml","path",defs);
			SingleGraph graphml = new SingleGraph("Action Graph");
			FileSourceGraphML fs = new FileSourceGraphML();
			fs.addSink(graphml);
			fs.readAll(x.toString());
			fs.removeSink(graphml);			
			graphml.addAttribute("default-resources-path", (String)getComplexClass(node,"default-resources-path", "string", defs));
			result = graphml;
		}
		return result;
	}
	
	public static Object getComplexClass(Node node, String name, String clss, Map<String, Object> defs) throws Exception{
		Object result = null;
		Node rec = null;
		String base = "";
		Node ni = node.getAttributes().getNamedItem(name);
		if(ni!=null){
			base = ni.getNodeValue();						
			if(base.startsWith("#")){
				result = defs.get(base.substring(1));
				if(clss.equals("string") && (!(result instanceof String)))
					result = result.toString();				
			}
			else{
				result = ni.getNodeValue();				
			}
		}else {
			rec = XmlDataset.searchChildren(node, name);
			if(rec!=null)
				result = resolve(rec, clss, defs);			
		}
		return result;		
	}
	
	public static InterpreterXmlMarshallerResult process(XmlDataset data) throws Exception{
		// TODO Auto-generated method stub
		InterpreterXmlMarshallerResult result = new InterpreterXmlMarshallerResult();
		
		//definitions
		NodeList defs = data.select("//definitions/resource");		
		for(int i = 0; i < defs.getLength(); i++){
			Node item = defs.item(i);
			NamedNodeMap attrs = item.getAttributes();
			if(item.getNodeName()=="resource"){
				Node clss = attrs.removeNamedItem("class");
				Object obj = resolve(item, clss.getNodeValue(), result.Definitions);
				result.Definitions.put(item.getAttributes().getNamedItem("id").getNodeValue(), obj);
			}			
		}		
		return result;
	}
	

}
