package interpreter.datasets;

import interpreter.databases.AConnectionToken;
import interpreter.databases.LocalFileSystem;
import interpreter.datasets.InterpreterXmlMarshaller.InterpreterXmlMarshallerResult;
import interpreter.flow.EDatasetCopierMode;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.DOMException;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import org.graphstream.graph.implementations.*;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class InterpreterConfiguration extends XmlDataset
{
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @throws IOException 
	 * @throws SAXException 
	 * @throws ParserConfigurationException 
	 * @generated
	 */
	
	Map<String,Object> Definitions;
	
	public InterpreterConfiguration(LocalFileSystem dir, String location) throws Exception, ParserConfigurationException, SAXException, IOException, XPathExpressionException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, DOMException{
		super(dir, location);
		Definitions = InterpreterXmlMarshaller.process(this).Definitions;		
	}

	private HashMap<String, String> getMapping(String xmlQuery) throws XPathExpressionException{
		NodeList list = select(xmlQuery);
		HashMap<String,String> result = new HashMap<String,String>();
		NamedNodeMap attrs;
		for(int i = 0; i< list.getLength(); i++){
			attrs = list.item(i).getAttributes();
			result.put(attrs.getNamedItem("name").getNodeValue(),attrs.getNamedItem("internal").getNodeValue());			
		}
		return result;
	}
	
	public ArrayList<String> getBusNameList() throws XPathExpressionException{
		NodeList list = select("//interface/bus[@direction='in']");
		ArrayList<String> result = new ArrayList<String>(); 
		for(int i = 0; i < list.getLength(); i++ )
			result.add(list.item(i).getAttributes().getNamedItem("name").getNodeValue());
		return result;
	}
	
	public ArrayList<EDatasetCopierMode> getBusModeList() throws Exception{
		ArrayList<EDatasetCopierMode>result = new ArrayList<EDatasetCopierMode>();
		NodeList list = select("//interface/bus[@direction='in']");
		for(int i =0; i < list.getLength(); i++){
			String mode = getAttribute("load-mode", list.item(i),"truncate");
			if(mode.equals("create"))
				result.add(EDatasetCopierMode.CREATE);
			else if(mode.equals("increment"))
				result.add(EDatasetCopierMode.INCREMENT);
			else 
				result.add(EDatasetCopierMode.CLEAR);
						
		}
			
		return result;		
	}
			
	public HashMap<String, String> getInputMapping() throws XPathExpressionException{
		return getMapping("//interface/bus[@direction='in']");
	}
	

	public Map<String, String> getOutputMapping() throws XPathExpressionException{
		return getMapping("//interface/bus[@direction='out']");
	}
	
	public AConnectionToken getWorkspaceToken() throws XPathExpressionException, Exception{
		return (AConnectionToken)InterpreterXmlMarshaller.resolve(select("//workspace").item(0), "token", Definitions);
		//return AConnectionToken.newInstance(select("//configuration.workspace").item(0));		
	}
	
	public SingleGraph getGraphml() throws Exception{
		return (SingleGraph)InterpreterXmlMarshaller.resolve(select("//actiongraph").item(0), "actiongraph", Definitions);
		
	}
	
	

}

