package data_importer.services;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPSClient;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

import data_importer.domain.datasets.CsvFile;
import data_importer.domain.datasets.SolrTable;
import data_importer.domain.servers.SolrServer;
import data_importer.domain.transactions.Transaction;
import data_importer.domain.transactions.TransactionLog;
import data_importer.domain.transactions.TransactionStatus;
import data_importer.repository.TransactionLogRepo;
import data_importer.services.exceptions.SolrIndexingException;
import data_importer.services.exceptions.TransactionNotReadyException;

@Service
public class DataService {
	private static final int FTP_TIMEOUT = 1000000;
	@Autowired
	private TransactionLogRepo logs;
	
	public void executeTransaction(long transactionLogId) throws Exception{		
		TransactionLog 		log 	= logs.findOne(transactionLogId);
		Transaction 		trans	= log.getTransaction();
		if(!(log.getStatus() == TransactionStatus.READY))
			throw new TransactionNotReadyException("Transação indisponível");
		log.setStatus(TransactionStatus.EXECUTING);
		
		String duo  = "";
		if(trans.getSourceDataset() instanceof CsvFile){
			duo = "csv";
		}
		if(trans.getTargetDataset() instanceof SolrTable){
			duo += "-solr";
		}		
		try{
			switch(duo){
			case "csv-solr":
				csvToSolr(log);
				break;
			}			
		}catch(Exception e){
			log.setStatus(TransactionStatus.FAILED);
			logs.save(log);
			throw e;
		}
		log.setStatus(TransactionStatus.EXECUTED);
		logs.save(log);		
	}
	
	public void csvToSolr(TransactionLog log) throws IOException, SolrIndexingException, URISyntaxException, UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, JSchException, SftpException{
		Transaction 		trans	= log.getTransaction();
		SolrTable			target  = (SolrTable)trans.getTargetDataset();
		CsvFile 			source 	= (CsvFile)trans.getSourceDataset();
		SolrServer 			server 	= target.getServer();
		File 				file 	= new File(log.getUploadedFilename());
		uploadToFTP(server.getHost(), server.getFtpPort(), server.getUsername(), server.getPassword(), log.getUploadedFilename(), file.getName());
		indexSolr(server.getHost(), server.getPort(), target.getLocation(), server.getFtpRoot() + file.getName() );
	}
	
	public void receiveFile(long transactionLogId, MultipartFile file) throws IOException{
		TransactionLog log = logs.findOne(transactionLogId);
		log.setStatus(TransactionStatus.PREPARING);
		BufferedOutputStream stream = null;
		try{			
			byte[] bytes = file.getBytes();
			File dir = new File("uploads/"+((Long)transactionLogId).toString());
			if(!dir.exists())
				dir.mkdir();
			String filename = dir.getAbsolutePath() + "\\" + file.getOriginalFilename(); 
			stream = new BufferedOutputStream(new FileOutputStream(new File(filename)));
			stream.write(bytes);
			log.setUploadedFilename(filename);
			log.setStatus(TransactionStatus.READY);
			logs.save(log);
		}catch(Exception e){
			if(stream!=null)
				stream.close();
			log.setStatus(TransactionStatus.CREATED);
			log.setUploadedFilename(null);
			logs.save(log);
			throw e;
		}
		
		stream.close();
	}
	
	public void uploadToFTP(String host, int port, String user, String pass, String sourceFilename, String targetFilename) throws IOException, UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, JSchException, SftpException{
		
		FTPClient client = new FTPClient();		
		client.connect(host,port);		
		client.login(user, pass);
		client.setFileType(FTP.BINARY_FILE_TYPE);
		client.enterLocalPassiveMode();		
	    client.storeFile(targetFilename,  new FileInputStream(new File(sourceFilename)));
	    client.disconnect();	
		/*java.util.Properties config = new java.util.Properties(); 
	    config.put("StrictHostKeyChecking", "no");
		JSch jsch = new JSch();
	    Session session = jsch.getSession( user, host, port );
	    session.setConfig( "PreferredAuthentications", "password" );
	    session.setPassword( pass );
	    session.setConfig(config);
	    session.connect( FTP_TIMEOUT );
	    Channel channel = session.openChannel( "sftp" );
	    ChannelSftp sftp = ( ChannelSftp ) channel;
	    sftp.connect( FTP_TIMEOUT );
	    sftp.cd("/");
	    
        File f = new File(sourceFilename);
        sftp.put(new FileInputStream(f), f.getName());*/

	}
	
	public void indexSolr(String host, Integer port, String core, String filename) throws ClientProtocolException, IOException, URISyntaxException, SolrIndexingException{
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
			throw new SolrIndexingException(res);
		
		
	}

}
