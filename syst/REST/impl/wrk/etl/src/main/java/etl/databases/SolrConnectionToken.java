package etl.databases;

public class SolrConnectionToken extends AConnectionToken {

	public String User;
	public String Pass;	
	public String Driver;
	public Integer FtpPort;
	public Integer HttpPort;
	public String FtpRoot;

	public SolrConnectionToken(){
		super();
	}
	
}
