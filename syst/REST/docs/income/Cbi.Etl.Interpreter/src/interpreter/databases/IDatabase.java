package interpreter.databases;

import java.sql.SQLException;

public  interface IDatabase 
{	
	public void connect() throws Exception;
	public void diconnect() throws Exception;
	public String getLocation();
	
}

