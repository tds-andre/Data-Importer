package etl.datasets;

import java.sql.SQLException;

import etl.databases.SolrServer;
import etl.exceptions.NotImplementedMethodException;

public class SolrCore extends ADataset<SolrServer> {
	public void erase() throws Exception{
		
	}	
	
	public void create(Schema schema) throws Exception{
		Schema = schema;
	}	
	
	public boolean exists() throws NotImplementedMethodException, SQLException{
		return false;
	}
	
	
}
