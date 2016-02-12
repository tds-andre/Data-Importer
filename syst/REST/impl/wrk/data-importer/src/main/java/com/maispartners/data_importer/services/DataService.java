package com.maispartners.data_importer.services;

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
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.maispartners.data_importer.domain.datasets.CsvFile;
import com.maispartners.data_importer.domain.datasets.Dataset;
import com.maispartners.data_importer.domain.datasets.ExcelFile;
import com.maispartners.data_importer.domain.datasets.Field;
import com.maispartners.data_importer.domain.datasets.FieldType;
import com.maispartners.data_importer.domain.datasets.JdbcTable;
import com.maispartners.data_importer.domain.datasets.SolrTable;
import com.maispartners.data_importer.domain.datasets.Upload;
import com.maispartners.data_importer.domain.transactions.Transaction;
import com.maispartners.data_importer.domain.transactions.TransactionLog;
import com.maispartners.data_importer.domain.transactions.TransactionStatus;
import com.maispartners.data_importer.repository.DatasetRepo;
import com.maispartners.data_importer.repository.FieldRepo;
import com.maispartners.data_importer.repository.TransactionLogRepo;
import com.maispartners.data_importer.repository.UploadRepo;
import com.maispartners.data_importer.services.exceptions.SolrIndexingException;
import com.maispartners.data_importer.services.exceptions.TransactionNotReadyException;

import etl.databases.JdbcDatabase;
import etl.datasets.ADataset;
import etl.datasets.AField;
import etl.datasets.CsvDataset;
import etl.datasets.DatetimeField;
import etl.datasets.DecimalField;
import etl.datasets.EFieldType;
import etl.datasets.IntegerField;
import etl.datasets.JdbcDataset;
import etl.datasets.MySqlDataset;
import etl.datasets.Schema;
import etl.datasets.SolrCore;
import etl.datasets.Xlsx;
import etl.flow.DatasetCopier;
import etl.flow.EDatasetCopierMode;

@Service
public class DataService {
	private static final int FTP_TIMEOUT = 1000000;
	@Autowired
	private TransactionLogRepo logs;
	
	@Autowired
	private UploadRepo uploads;
	@Autowired
	private DatasetRepo datasets;
	@Autowired
	private FieldRepo fields;
	
	public void executeTransaction(long transactionLogId) throws Exception{		
		TransactionLog 		log 	= logs.findOne(transactionLogId);
		Transaction 		trans	= log.getTransaction();
		//if(!(log.getStatus() == TransactionStatus.READY))
		//	throw new TransactionNotReadyException("Transação indisponível");
		log.setStatus(TransactionStatus.EXECUTING);
		log.setSourceInfo(datasetToJson(trans.getSourceDataset()));
		log.setTargetInfo(datasetToJson(trans.getTargetDataset()));
		
		String duo  = "";
		if(trans.getSourceDataset() instanceof CsvFile){
			duo = "csv";
		}else if(trans.getSourceDataset() instanceof ExcelFile){
			duo = "csv";
		} 
		if(trans.getTargetDataset() instanceof SolrTable){
			duo += "-solr";
		}else if(trans.getTargetDataset() instanceof JdbcTable){
			duo += "-jdbc";
		}	
		try{
			switch(duo){
			case "csv-solr":
				csvToSolr(log);
				break;
			case "csv-jdbc":
				csvToJdbc(log);
				break;
			}			
		}catch(Exception e){
			log.setStatus(TransactionStatus.FAILED);
			logs.save(log);
			throw e;
		}
		log.setStatus(TransactionStatus.EXECUTED);
		log.setFinishedAt(new Timestamp(new java.util.Date().getTime()));
		logs.save(log);		
	}
	
	public void csvToSolr2(TransactionLog log) throws IOException, SolrIndexingException, URISyntaxException, UnrecoverableKeyException, KeyStoreException, NoSuchAlgorithmException, JSchException, SftpException{
		Transaction 		trans	= log.getTransaction();
		SolrTable			target  = (SolrTable)trans.getTargetDataset();
		CsvFile 			source 	= (CsvFile)trans.getSourceDataset();		
		File 				file 	= new File(source.getLocation());
		uploadToFTP(target.getHost(), target.getFtpPort(), target.getUsername(), target.getPassword(), source.getLocation(), file.getName());
		indexSolr(target.getHost(), target.getPort(), target.getLocation(), target.getFtpRoot() + file.getName() );
	}
	
	public void csvToSolr(TransactionLog log) throws Exception{
		Transaction 		trans	= log.getTransaction();
		SolrTable			target  = (SolrTable)trans.getTargetDataset();
		CsvFile 			source 	= (CsvFile)trans.getSourceDataset();		
		File 				file 	= new File(source.getLocation());
		CsvDataset src = new CsvDataset(source.getLocation());
		SolrCore tar = new SolrCore(target.getLocation(), target.getHost(), target.getFtpPort(), target.getPort(), target.getUsername(), target.getPassword(), target.getFtpRoot());
		DatasetCopier copier = new DatasetCopier(null, EDatasetCopierMode.CREATE, src, tar);
		copier.execute();
	}
	
	public void csvToJdbc(TransactionLog log) throws Exception{
		Transaction 		trans	= log.getTransaction();
		JdbcTable			target  = (JdbcTable)trans.getTargetDataset();
		CsvFile 			source 	= (CsvFile)trans.getSourceDataset();		
		File 				file 	= new File(source.getLocation());
		CsvDataset src = new CsvDataset(source.getLocation());
		src.setFieldDelimiter(source.getFieldDelimiter().charAt(0));
		src.setLineDelimiter(source.getRecordDelimiter());
		ADataset tar = null;
		if(target.getDriver().equals("mysql"))
			tar = new MySqlDataset(new JdbcDatabase(target.getDriver(), target.getHost(), target.getDb(),target.getUsername(),target.getPassword()), target.getLocation());
		else
			tar = new JdbcDataset(new JdbcDatabase(target.getDriver(), target.getHost(), target.getDb(),target.getUsername(),target.getPassword()), target.getLocation());		
		DatasetCopier copier = new DatasetCopier(null, EDatasetCopierMode.CREATE, src, tar);
		copier.execute();
	}
	
	
	
	public void receiveFile(Long uploadId, MultipartFile file) throws Exception{
		Upload local = (Upload)datasets.findOne(uploadId);
		
		BufferedOutputStream stream = null;
		try{			
			byte[] bytes = file.getBytes();
			File dir = new File("uploads/"+uploadId.toString());
			if(!dir.exists())
				dir.mkdir();
			String filename = dir.getAbsolutePath() + "\\" + file.getOriginalFilename(); 
			stream = new BufferedOutputStream(new FileOutputStream(new File(filename)));
			stream.write(bytes);
			stream.close();
			fields.delete(local.getFields());
			if(local instanceof ExcelFile){
				String sheet = ((ExcelFile)local).getSheet();
				if(sheet==null || sheet.equals(""))
					Xlsx.xlsToCsv(filename, filename + ".csv", 0);
				else
					Xlsx.xlsToCsv(filename, filename + ".csv", sheet);
				filename += ".csv";
			}
			List<Field> list;
			if(local instanceof CsvFile){
				CsvFile csv = ((CsvFile)local);
				list = extractCsvMetadata(filename, csv.getRecordDelimiter(), csv.getFieldDelimiter().charAt(0));
			}else					
				list =  extractCsvMetadata(filename);
			for(Field field:list) field.setDataset(local);			
			fields.save(list);			
			local.setFields(list);
			local.setLocation(filename);
			local.setUploaded(true);
			uploads.save(local);
		}
		finally{
		
		}
	}
	
	private List<Field> extractCsvMetadata(String filename, String lineDelimiter, char fieldDelimiter) throws Exception{
		CsvDataset csv  = new CsvDataset(filename);
		csv.setFieldDelimiter(fieldDelimiter);
		csv.setLineDelimiter(lineDelimiter);
		Schema schema = csv.getSchema();
		List<Field> fields = new ArrayList<Field>();
		for(AField field:schema.getFields()){
			Field f = new Field();
			f.setName(field.getName());
			if(field instanceof IntegerField){
				f.setType(FieldType.INTEGER);
			}else if(field instanceof DecimalField){
				f.setType(FieldType.DECIMAL);
			}else if(field instanceof DatetimeField){
				f.setType(FieldType.DATETIME);
			}else{
				f.setType(FieldType.STRING);
			}
			fields.add(f);
		}
		return fields;
	}
	
	private List<Field> extractCsvMetadata(String filename) throws Exception{
		return extractCsvMetadata(filename, "\r\n", ';');
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
	
	private String datasetToJson(Dataset dataset) throws JsonProcessingException{
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(dataset);
		
	}

}
