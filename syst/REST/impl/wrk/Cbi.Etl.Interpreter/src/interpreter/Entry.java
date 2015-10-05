package interpreter;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;

import org.graphstream.graph.implementations.SingleGraph;
import org.graphstream.stream.file.FileSinkGraphML;
import org.graphstream.stream.file.FileSourceGraphML;
import org.xml.sax.SAXException;


public class Entry {

	public static void main(String[] args) throws XPathExpressionException, ParserConfigurationException, SAXException, IOException, Exception {

	
		
		Interpreter inter = new Interpreter(args[0]);
		inter.Execute(args[1]);
		
		/*SingleGraph graph = new SingleGraph("Tutorial 1");
		graph.addNode("A" );
		graph.addNode("B" );
		graph.addNode("C" );
		graph.addEdge("AB", "A", "B");
		graph.addEdge("BC", "B", "C");
		graph.addEdge("CA", "C", "A");
		graph.display();
		FileSinkGraphML fs = new FileSinkGraphML();
		fs.writeAll(graph, "teast.graphml");*/
		
		/*SingleGraph graph = new SingleGraph("asdf");
		FileSourceGraphML fsrc = new FileSourceGraphML();
		fsrc.addSink(graph);
		fsrc.readAll("teast.graphml");
		graph.display();*/		
	}
}
