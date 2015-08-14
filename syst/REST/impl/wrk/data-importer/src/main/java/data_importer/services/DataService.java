package data_importer.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.springframework.stereotype.Service;

import data_importer.domain.datasets.CsvFile;
import data_importer.domain.datasets.Dataset;
import data_importer.domain.datasets.SolrTable;
import data_importer.domain.servers.SolrServer;
import data_importer.domain.transactions.Transaction;
import data_importer.domain.transactions.TransactionLog;

@Service
public class DataService {
	public TransactionLog startTransaction(TransactionLog log){
		//Mapping mapping =  transaction.getMapping().getLatest();
		//Dataset<Server> sourceDataset = transaction.getSourceDataset().getLatest();
		//Server sourceServer = sourceDataset.getServer().getLatest();
		//Dataset<Server> targetDataset = transaction.getTargetDataset().getLatest();
		//Server targetServer = targetDataset.getServer().getLatest();
		Transaction trans = log.getTransaction();
		SolrTable target = (SolrTable)trans.getTargetDataset();
		CsvFile source = (CsvFile)trans.getSourceDataset();
		SolrServer server = target.getServer();
		File file = new File(log.getUploadedFilename());		
		uploadToFTP(server.getHost(), server.getFtpPort(), server.getUsername(), server.getPassword(),log.getUploadedFilename(),"/" + file.getName());
		
		return null;
	}
	
	public void uploadToFTP(String host, int port, String user, String pass, String sourceFilename, String targetFilename){		
		FTPClient client = new FTPClient();
		try {
			client.connect(host,port);		
			client.login(user, pass);
			client.setFileType(FTP.BINARY_FILE_TYPE);
			client.enterLocalPassiveMode();
			InputStream input = new FileInputStream(new File(sourceFilename));
		    client.storeFile(targetFilename, input);
		    client.disconnect();	
		} catch (SocketException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
