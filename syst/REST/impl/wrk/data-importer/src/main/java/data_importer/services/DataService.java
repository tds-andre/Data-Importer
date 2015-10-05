package data_importer.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data_importer.domain.datasets.CsvFile;
import data_importer.domain.datasets.SolrTable;
import data_importer.domain.servers.SolrServer;
import data_importer.domain.transactions.Transaction;
import data_importer.domain.transactions.TransactionLog;
import data_importer.repository.TransactionLogRepo;

@Service
public class DataService {
	@Autowired
	private TransactionLogRepo logs;
	
	public TransactionLog executeTransaction(long transactionLogId) throws IOException{
		TransactionLog 		log 	= logs.findOne(transactionLogId);
		Transaction 		trans	= log.getTransaction();
		SolrTable			target  = (SolrTable)trans.getTargetDataset();
		CsvFile 			source 	= (CsvFile)trans.getSourceDataset();
		SolrServer 			server 	= target.getServer();
		File 				file 	= new File(log.getUploadedFilename());		
		uploadToFTP(server.getHost(), server.getFtpPort(), server.getUsername(), server.getPassword(),log.getUploadedFilename(), file.getName());
		indexSolr(server.getHost(), server.getPort(), target.getLocation(), file.getName() );
		return log;
	}
	
	public void uploadToFTP(String host, int port, String user, String pass, String sourceFilename, String targetFilename) throws IOException{		
		FTPClient client = new FTPClient();		
		client.connect(host,port);		
		client.login(user, pass);
		client.setFileType(FTP.BINARY_FILE_TYPE);
		client.enterLocalPassiveMode();		
	    client.storeFile(targetFilename,  new FileInputStream(new File(sourceFilename)));
	    client.disconnect();		
	}
	
	public void indexSolr(String host, Integer port, String core, String filename) throws ClientProtocolException, IOException{
		String url = host+":"+port.toString()+"/biserver-web/"+core+"/update/?commit=true&separator=;&stream.file="+filename+"&stream.contentType=application/csv;charset=UTF-8";
		HttpClient client = HttpClientBuilder.create().build();
		HttpGet request = new HttpGet(url);

		// add request header
		//request.addHeader("User-Agent", USER_AGENT);
		HttpResponse response = client.execute(request);

		System.out.println("Response Code : " 
	                + response.getStatusLine().getStatusCode());

		BufferedReader rd = new BufferedReader(
			new InputStreamReader(response.getEntity().getContent()));

		StringBuffer result = new StringBuffer();
		String line = "";
		while ((line = rd.readLine()) != null) {
			result.append(line);
		}
	}

}
