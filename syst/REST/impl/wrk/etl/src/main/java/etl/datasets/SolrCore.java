package etl.datasets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.sql.SQLException;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

import etl.databases.SolrConnectionToken;
import etl.databases.SolrServer;
import etl.exceptions.NotImplementedMethodException;

public class SolrCore extends ADataset<SolrServer> {
	public SolrCore(String core, String host, Integer ftpPort, Integer httpPort, String user, String pass, String ftpRoot) throws ClassNotFoundException, SQLException{
		SolrConnectionToken tkn = new SolrConnectionToken();
		tkn.FtpPort = ftpPort;
		tkn.Host = host;
		tkn.HttpPort = httpPort;
		tkn.User = user;
		tkn.Pass = pass;		
		tkn.FtpRoot  = ftpRoot;
		Location = core;
		Database = new SolrServer(tkn);
	}
	
	public void erase() throws Exception{
		
	}	
	
	public void create(Schema schema) throws Exception{
		Schema = SolrCore.transcodeSchema(schema);
		
	}
	
	public boolean connect(){
		return true;
	}
	
	public boolean exists() throws NotImplementedMethodException, SQLException{
		return false;
	}
	
	
	public void upload(String filename) throws Exception{
		File file = new File(filename);
		SolrConnectionToken token = (SolrConnectionToken)getDatabase().getToken();
		try{			
			uploadToFTP(token.Host, token.FtpPort, token.User, token.Pass, filename, file.getName());
		}
		catch(Exception e){
			uploadToSFTP(token.Host, token.FtpPort, token.User, token.Pass, filename, file.getName());
		}
		finally{
			indexSolr(token.Host, token.HttpPort, getLocation(),token.FtpRoot + file.getName()); 
		}
		
	}
	
	
	private void uploadToFTP(String host, int port, String user, String pass, String sourceFilename, String targetFilename) throws IOException, UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, JSchException, SftpException{
		
		FTPClient client = new FTPClient();		
		client.connect(host,port);		
		client.login(user, pass);
		client.setFileType(FTP.BINARY_FILE_TYPE);
		client.enterLocalPassiveMode();		
	    client.storeFile(targetFilename,  new FileInputStream(new File(sourceFilename)));
	    client.disconnect();	
		java.util.Properties config = new java.util.Properties(); 


	}
	
	private void uploadToSFTP(String host, int port, String user, String pass, String sourceFilename, String targetFilename) throws IOException, UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, JSchException, SftpException{
		java.util.Properties config = new java.util.Properties(); 
		config.put("StrictHostKeyChecking", "no");
		JSch jsch = new JSch();
	    Session session = jsch.getSession( user, host, port );
	    session.setConfig( "PreferredAuthentications", "password" );
	    session.setPassword( pass );
	    session.setConfig(config);
	    session.connect( 600000 );
	    Channel channel = session.openChannel( "sftp" );
	    ChannelSftp sftp = ( ChannelSftp ) channel;
	    sftp.connect( 600000 );
	    sftp.cd("/");
	    
        File f = new File(sourceFilename);
        sftp.put(new FileInputStream(f), f.getName());

	}
	
	
	
	public void indexSolr(String host, Integer port, String core, String filename) throws Exception{
		HttpClient client = HttpClientBuilder.create().build();
		
		URI address = new URI("http", null, host, port, "/biserver-web/"+core+"/update/", "commit=true&separator=;&stream.file="+filename+"&stream.contentType=application/csv;charset=UTF-8", "anchor"); 
		HttpGet request = new HttpGet(address);
		
		HttpResponse response = client.execute(request);		

		BufferedReader rd = new BufferedReader(
			new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
			result.append(line);
		}
		String res = result.toString();
		if(!res.contains("<int name=\"status\">0</int>"))
			throw new Exception(res);		
	}
	

	public static Schema transcodeSchema(Schema schema) throws CloneNotSupportedException {
		Schema result = new Schema(); 
		for(AField field:schema.getFields()){
			
			String suffix = SolrCoreFieldSuffix.suffixForType(field.getClass());
			String newname = field.getName().trim().replaceAll("[^a-z_A-Z0-9]+","_");
			newname = newname.toLowerCase();
			if(field.getName().trim().equals("id"))
				newname = "id";
			else if(!newname.endsWith("_" + suffix))
				newname+="_" + suffix;
			
			AField newfield = field.clone();
			newfield.setName(newname);
			result.addField(newfield);			
		}
		return result;		
	}

	
	
	
}
