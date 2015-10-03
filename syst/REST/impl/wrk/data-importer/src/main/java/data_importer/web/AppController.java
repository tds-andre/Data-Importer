package data_importer.web;

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


import data_importer.domain.transactions.TransactionLog;
import data_importer.repository.TransactionLogRepo;
import data_importer.repository.TransactionRepo;
import data_importer.services.DataService;


@Controller
public class AppController  extends WebMvcConfigurerAdapter {	
	@Autowired
	private TransactionRepo transactions;
	
	
	@Autowired
	private DataService dataService;	
	
	@Autowired
	private TransactionLogRepo logs;
	
	@RequestMapping(value="service/transaction/{transactionId}/start", method=RequestMethod.GET)
    public TransactionLog startTransaction(@PathVariable long transactionId) {
		return null;
		//return dataService.startTransaction(transactions.findOne(transactionId));
 	}
	
	@RequestMapping(value="/upload/{transactionLogId}", method=RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> handleFileUpload(HttpServletRequest request, @PathVariable long transactionLogId){        
		HttpStatus responseCode = HttpStatus.OK;
    	final HttpHeaders headers = new HttpHeaders();
    	headers.setContentType(MediaType.APPLICATION_JSON);    	
		String message = null;

            try {            	
            	TransactionLog log = logs.findOne(transactionLogId);
            	String filename = ((Long)log.getTransaction().getId()).toString();
                byte[] bytes = null;//file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filename)));
                stream.write(bytes);
                stream.close();
                log.setUploadedFilename(filename);
                logs.save(log);
                message = "success";
            } catch (Exception e) {
            	message = "You failed to upload. "+ e.getMessage();
            	responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
            }

            return new ResponseEntity<String>(message ,headers, responseCode);
    }
	 
	
	@RequestMapping(value = "log/{transactionLogId}/upload", method = RequestMethod.POST)
	 public  @ResponseBody ResponseEntity<String> uploadFile(HttpServletResponse response, @RequestParam(value="file") MultipartFile file, @PathVariable long transactionLogId){	 
		HttpStatus responseCode = HttpStatus.OK;
    	final HttpHeaders headers = new HttpHeaders();
    	headers.setContentType(MediaType.APPLICATION_JSON);    	
		String message = null;
		
		try{
			TransactionLog log = logs.findOne(transactionLogId);
			byte[] bytes = file.getBytes();
			File dir = new File("uploads/"+((Long)transactionLogId).toString());
			if(!dir.exists())
				dir.mkdir();
			String filename = dir.getAbsolutePath() + "\\" + file.getOriginalFilename(); 
			BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filename)));
			stream.write(bytes);
			log.setUploadedFilename(filename);
			logs.save(log);
			stream.close();	
		}catch(Exception e){
			e.printStackTrace();
			message = "You failed to upload. "+ e.getMessage();
        	responseCode = HttpStatus.INTERNAL_SERVER_ERROR;
			
		}
		
		//headers.setPragma("no-cache");
		//headers.setCacheControl("no-cache");
		///headers.setDate(0);
		
		return new ResponseEntity<String>(message ,headers, responseCode);

	}
}
