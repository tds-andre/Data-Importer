package interpreter.datasets;

import interpreter.databases.LocalFileSystem;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;

import org.w3c.dom.DOMException;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class InterpreterInput extends XmlDataset
{
	Map<String,Object> Definitions;	
	public InterpreterInput(LocalFileSystem dir, String location) throws Exception, ParserConfigurationException, SAXException, IOException, XPathExpressionException, InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, DOMException{
		super(dir, location);
		Definitions = InterpreterXmlMarshaller.process(this).Definitions;		
	}
	public HashMap<String,ADataset> getMapping() throws Exception{
		NodeList sl = select("//bus");
		HashMap<String,ADataset> result = new HashMap<String,ADataset>();
		for(int i=0; i<sl.getLength(); i++){
			Node ext = searchChildren(sl.item(i), "external");
			ADataset ds = (ADataset)InterpreterXmlMarshaller.resolve(ext, "dataset", Definitions);
			result.put(sl.item(i).getAttributes().getNamedItem("name").getNodeValue(), ds);			
		}
		return result;
	}	
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 */
}

