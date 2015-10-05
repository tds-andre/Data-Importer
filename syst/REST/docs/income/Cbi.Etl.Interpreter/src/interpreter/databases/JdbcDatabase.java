package interpreter.databases;
import interpreter.datasets.MySqlDataset;
import interpreter.datasets.Schema;

import java.sql.*;
import java.util.List;

/**
 * <!-- begin-user-doc -->
 * <!--  end-user-doc  -->
 * @generated
 */

public class JdbcDatabase extends ADatabase
{	
	private LocalFileSystem QueryServer ;
	public Connection Connection;
	
	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @generated
	 */
	public JdbcDatabase(JdbcConnectionToken tkn) throws ClassNotFoundException, SQLException{
		super(tkn);
		
	}
	
	public static AConnectionToken createToken(String driver, String host, String location, String user, String pass){
		JdbcConnectionToken tkn = new JdbcConnectionToken();
		tkn.Location = location;
		tkn.Host = host;
		tkn.User = user;
		tkn.Pass = pass;
		tkn.Driver = driver;
		return tkn;
	}
	
	public JdbcDatabase(String driver, String host, String location, String user, String pass){
		super(createToken(driver,host,location,user,pass));
		
	}
	
	public void setQueryServer(LocalFileSystem queryServer){
		QueryServer = queryServer;
	}
	
	
	
	
	
	
	public JdbcConnectionToken getToken(){
		return (JdbcConnectionToken)ConnectionToken;		
		
	}

	/**
	 * <!-- begin-user-doc -->
	 * <!--  end-user-doc  -->
	 * @generated
	 * @ordered
	 */
	public static String getDriverFor(String name){
		if(name.equals("mysql"))
			return "com.mysql.jdbc.Driver";
		else 
			return "";
	}
	
	public static String getDatabaseURL(JdbcConnectionToken token){
		return "jdbc:"+token.Driver+"://"+token.Host+"/"+token.Location;
	}
	
	public String getDatabaseURL(){
		return "jdbc:"+getToken().Driver+"://"+getToken().Host+"/"+getToken().Location;
	}	
	
	
	public void connect() throws ClassNotFoundException, SQLException {		
		if(Connection!=null)
			Connection.close();
		Connection = getNewConnection();
	}
	
	public static Connection getNewConnection(JdbcConnectionToken token) throws ClassNotFoundException, SQLException  {
		Connection result;		
		Class.forName(JdbcDatabase.getDriverFor(token.Driver));		
		result = DriverManager.getConnection(getDatabaseURL(token),token.User,token.Pass);
		query("use " + token.Location, result);
		return result;		
	}
	
	public Connection getNewConnection() throws ClassNotFoundException, SQLException  {
		return getNewConnection(getToken());
	}
	
	public static void query(String query, Connection con) throws SQLException{
		Statement stmt = con.createStatement();		
		stmt.execute(query);
	}
	
	
	
	public void diconnect() throws SQLException {
		Connection.close();
		Connection = null;
	}
	
	
	
	
	
	
	
	public ResultSet select(String query) throws SQLException{
		Statement stmt = Connection.createStatement();
		ResultSet rs = stmt.executeQuery(query);		
		return rs;
		
	}
	public void query(String query) throws SQLException{
		query(query, Connection);		
	}
	
	

	public MySqlDataset newDatasetInstance(String loc) {		
		return new MySqlDataset(this,loc);
	}
	
	public boolean datasetExists(String name) throws SQLException{
		ResultSet x = Connection.getMetaData().getTables(null, null, name, null);
		if(x.next())
			return true;
		else
			return false;
	}
	
	public Connection getConnection(){
		return Connection;
	}
	
	
	
	@Override
	public String getLocation(){
		return ConnectionToken.Location;
	}
	
	
	
	
}

