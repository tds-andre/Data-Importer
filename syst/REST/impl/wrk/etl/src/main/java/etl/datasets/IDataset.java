package etl.datasets;

import java.sql.SQLException;

import etl.exceptions.NotImplementedMethodException;

public interface IDataset {
	public boolean exists() throws Exception;
	public void erase() throws Exception;
	public void create() throws Exception;
	public void create(Schema schema) throws Exception;	
	public Schema getSchema() throws Exception;
	public void clear() throws Exception;
	public boolean connect() throws Exception;
	public void disconnect() throws Exception;
	

}
