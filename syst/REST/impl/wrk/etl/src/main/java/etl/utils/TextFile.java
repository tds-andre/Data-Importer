package etl.utils;

import java.io.IOException;
import java.io.ObjectInputStream.GetField;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TextFile extends BreadcrumbItem {

	public TextFile(BreadcrumbItem parent, String name) {
		super(parent, name);
		// TODO Auto-generated constructor stub
	}
	
	
	@Override
	public String toString()  
	{
		byte[] encoded;
		try {
			encoded = Files.readAllBytes(Paths.get(super.toString()));
			return new String(encoded, StandardCharsets.UTF_8);
		} catch (IOException e) {			
			return "";
		}		
	}
	
	
	
	public static String toString(String filename) throws IOException{
		byte[] encoded = Files.readAllBytes(Paths.get(filename));		
		return new String(encoded, StandardCharsets.UTF_8);		
	}
 
}
  