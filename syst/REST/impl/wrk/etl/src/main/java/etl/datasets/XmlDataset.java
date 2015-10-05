package etl.datasets;
import etl.databases.ADatabase;
import etl.databases.LocalFileSystem;
import etl.exceptions.NotImplementedMethodException;
import etl.utils.BreadcrumbItem;

import java.io.File;
import java.io.IOException;

import javax.xml.parsers.*;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import etl.exceptions.EtlException;



/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class XmlDataset extends ADataset<ADatabase>
{
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 */
	public Document Xml;
	public XPath Selector;
	public XmlDataset(LocalFileSystem dir, String location) throws ParserConfigurationException, SAXException, IOException{
		super(dir, location);
		Xml = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new File(BreadcrumbItem.preparePath(dir.getLocation())  + location));
		Selector = XPathFactory.newInstance().newXPath();
			
	}
	public NodeList select(String query) throws XPathExpressionException{
		XPathExpression expr = Selector.compile(query);		
		return (NodeList) expr.evaluate(Xml,XPathConstants.NODESET);
		
	}
	public static NodeList select(String query,Document document) throws XPathExpressionException{
		XPathExpression expr = XPathFactory.newInstance().newXPath().compile(query);
		return (NodeList) expr.evaluate(document,XPathConstants.NODESET);
	}
	public static Node searchChildren(Node node, String childName){		
		return searchList(node.getChildNodes(), childName);		
	}
	public static boolean searchChildren(Node node, String childName, Node outChild){		
		outChild = searchChildren(node, childName);
		if(outChild==null)
			return false;
		else
			return true;
	}	
	public static Node searchList(NodeList nodeList, String name){		
		for(int i = 0; i<nodeList.getLength(); i++)
			if(nodeList.item(i).getNodeName()==name)			
				return nodeList.item(i);
		return null;
			
	}
	public static String getAttribute(String attrName, Node node){
		return getAttribute(attrName, node, "");
	}
	public static String getAttribute(String attrName, Node node, String def){
		String result = def;
		Node attr = node.getAttributes().getNamedItem(attrName);
		if(attr!=null)
			result = attr.getNodeValue();
		return result;
	}
	
	
	

}

