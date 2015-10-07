package etl.utils;

import java.io.IOException;

public class BreadcrumbItem extends Object {
	BreadcrumbItem Parent = null;
	String Location = "";
	Object Value = null;
	char Separator = '\\';
	public BreadcrumbItem(BreadcrumbItem parent,String location) {
		Parent = parent;
		if(location!=""){
			if(location.lastIndexOf(Separator)==location.length()-1)
				Location = location.substring(0, location.length()-1);
			else
				Location = location;
		}
	}
	public String toString(){
		if(Parent!=null)
			return Parent.toString() + Separator + Location;
		else			
			return Location;
	}
	public String getExtendedLocation(String extension){
		return toString() + Separator + extension;
	}
	public static String preparePath(String location, boolean isRoot) {
		if ((location==null)||(location.equals("")))
			return "";
		
		char sep = '/';
		int index = location.indexOf(sep);		
		if(index==-1){
			sep = '\\';
			index = location.indexOf(sep);
		}  
		if(!isRoot)
			while(location.charAt(0)==sep)
				location = location.substring(1);
		if(location.charAt(location.length()-1)!=sep)
			location+=sep;
		return location;			
	}
	
	
	public static String preparePath(String location) {
		if ((location==null)||(location.equals("")))
			return "";
		
		char sep = '/';
		int index = location.indexOf(sep);		
		if(index==-1){
			sep = '\\';
			index = location.indexOf(sep);
		}
		
		while(location.charAt(0)==sep)
			location = location.substring(1);
		if(location.charAt(location.length()-1)!=sep)
			location+=sep;
		return location;			
	}
}
