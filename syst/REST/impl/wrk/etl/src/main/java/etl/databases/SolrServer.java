package etl.databases;

import java.sql.SQLException;

public class SolrServer extends ADatabase {
	public SolrServer(String host, String user, String pass, Integer httpPort, Integer ftpPort, String ftpRoot){
		super(createToken(host, user, pass, httpPort, ftpPort, ftpRoot));
	}	
	
	public static AConnectionToken createToken(String host, String user, String pass, Integer httpPort, Integer ftpPort, String ftpRoot){
		SolrConnectionToken tkn = new SolrConnectionToken();		
		tkn.Host = host;
		tkn.User = user;
		tkn.Pass = pass;
		tkn.HttpPort = httpPort;
		tkn.FtpPort = ftpPort;
		tkn.FtpRoot = ftpRoot;
		return tkn;
	}
	
	public SolrServer(SolrConnectionToken tkn) throws ClassNotFoundException, SQLException{
		super(tkn);		
	}
}
