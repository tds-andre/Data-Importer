package etl.datasets;

import java.sql.SQLException;

import etl.databases.SolrServer;
import etl.exceptions.NotImplementedMethodException;

public class SolrCore extends ADataset<SolrServer> {
	public void erase() throws Exception{
		
	}	
	
	public void create(Schema schema) throws Exception{
		Schema = SolrCore.transcodeSchema(schema);
		
	}	
	
	public boolean exists() throws NotImplementedMethodException, SQLException{
		return false;
	}
	
	
	

	public static Schema transcodeSchema(Schema schema) throws CloneNotSupportedException {
		Schema result = new Schema(); 
		for(AField field:schema.getFields()){
			String suffix = SolrCoreFieldSuffix.suffixForType(field.getClass());
			String newname = field.getName().replaceAll("[^a-z_A-Z0-9]+","_");
			newname = newname.toLowerCase();
			if(!newname.endsWith("_" + suffix))
				newname+="_" + suffix;
			AField newfield = field.clone();
			newfield.setName(newname);
			result.addField(newfield);			
		}
		return result;		
	}
	
	
}
