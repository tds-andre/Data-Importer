package etl.datasets;

import java.sql.SQLException;

import etl.databases.JdbcDatabase;

public class MySqlDataset extends JdbcDataset {
	
	
	public MySqlDataset(JdbcDatabase jdbcDatabase, String name) {
		super(jdbcDatabase,name);
	}
	public void bulkLoadFromCsv(String filename) throws SQLException{
		getDatabase().query("load data local "+
			" infile '"+ filename.replace("\\", "/") +
			"' into table "+ Location +
			" fields" +
				" terminated by ';'"+
				" enclosed by '\"'"+
			" lines"+
				" terminated by '\\r\\n'"+
				" ignore 1 lines");
	}
	public void drop() throws SQLException{
		getDatabase().query("truncate " + Location);
	}	
}
