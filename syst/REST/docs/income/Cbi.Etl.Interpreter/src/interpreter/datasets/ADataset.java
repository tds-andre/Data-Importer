package interpreter.datasets;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import interpreter.databases.IDatabase;
import interpreter.exceptions.NotImplementedMethodException;


/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public abstract class ADataset<T extends IDatabase> extends Object implements IDataset 
{
	private boolean IsConnected = false;
	public String Location = "";	
	public IDatabase Database = null;
	public Schema Schema = null;
	
		
	
	public ADataset(IDatabase database, String location) {
		super();
		Database = database;
		Location = location;
	}
	public ADataset(){
		super();
	}
	
	public String getLocation(){
		return Location;
	}
	
	public String getFullLocation(){
		return Database.getLocation() + Location;		
	}
	
	public T getDatabase(){
		return (T)Database;
	}
	
	public void create() throws Exception{
		create(getSchema());
	}	
	
	public void setSchema(Schema schema){
		Schema = schema;
	}
	
	//-----------------------------------------------------------------------------------//
	
	public Schema getSchema() throws Exception{
		if(Schema==null)
			throw new NotImplementedMethodException();
		return Schema;
	}	

	public void erase() throws Exception{
		throw new NotImplementedMethodException();
	}	
	
	public void create(Schema schema) throws Exception{
		throw new NotImplementedMethodException();
	}	
	
	public boolean exists() throws NotImplementedMethodException, SQLException{
		throw new NotImplementedMethodException();
	}	
	
	public void clear() throws NotImplementedMethodException, SQLException{
		throw new NotImplementedMethodException();
	}
	
	public boolean connect() throws Exception{
		throw new NotImplementedMethodException();
	}
	public void disconnect() throws SQLException, NotImplementedMethodException{
		throw new NotImplementedMethodException();		
	}
	
	
	public ArrayList<String[]> getList()throws Exception{
		throw new NotImplementedMethodException();
	}
}

