package data_importer.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import data_importer.domain.datasets.CsvFile;
import data_importer.domain.datasets.Dataset;
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
	
	public void indexSolr(String host, int port, String core, String filename){
		
	}

}
