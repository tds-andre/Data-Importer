package com.maispartners.data_importer.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;





import com.maispartners.data_importer.domain.transactions.TransactionLog;
import com.maispartners.data_importer.repository.TransactionLogRepo;
import com.maispartners.data_importer.repository.TransactionRepo;
import com.maispartners.data_importer.services.DataService;


@Controller
public class AppController  extends WebMvcConfigurerAdapter {	
	@Autowired
	private TransactionRepo transactions;
	
	
	@Autowired
	private DataService dataService;	
	
	@Autowired
	private TransactionLogRepo logs;
	

	 
	
	@RequestMapping(value = "log/{transactionLogId}/do", method = RequestMethod.GET)
	public  @ResponseBody ResponseEntity<Message> executeTransaction(HttpServletResponse response,@PathVariable long transactionLogId){	  
		HttpStatus  		responseCode = HttpStatus.OK;
    	final HttpHeaders	headers 	 = new HttpHeaders();
    	Message 			msg			 = new Message();
    	headers.setContentType(MediaType.APPLICATION_JSON);    	
		
		try{
			dataService.executeTransaction(transactionLogId);			
		}
		catch(Exception e){
			e.printStackTrace();
			msg.message = "Falha na execução. "+ e.getMessage();
        	responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
		}		
		
		return new ResponseEntity<Message>(msg ,headers, responseCode);		
	}
	
	@RequestMapping(value = {"upload/{datasetId}/upload", "csv/{datasetId}/upload", "excel/{datasetId}/upload"}, method = RequestMethod.POST)
	 public  @ResponseBody ResponseEntity<Message> uploadFile(HttpServletResponse response, @RequestParam(value="file") MultipartFile file, @PathVariable long datasetId){	 
		HttpStatus  		responseCode = HttpStatus.OK;
    	final HttpHeaders	headers 	 = new HttpHeaders();
    	Message 			msg			 = new Message();
    	headers.setContentType(MediaType.APPLICATION_JSON); 
    	headers.setPragma("no-cache");
		headers.setCacheControl("no-cache");
		headers.setDate(0);
		
		try{
			dataService.receiveFile(datasetId, file);			
		}catch(Exception e){
			e.printStackTrace();
			msg.message = "You failed to upload. "+ e.getMessage();
        	responseCode = HttpStatus.INTERNAL_SERVER_ERROR;			
		}
		
		return new ResponseEntity<Message>(msg ,headers, responseCode);
	}
}
