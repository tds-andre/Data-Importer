package data_importer.web;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import javax.transaction.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
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
		return dataService.startTransaction(transactions.findOne(transactionId));
 	}
	
	@RequestMapping(value="/upload/{transactionLogId}", method=RequestMethod.POST)
    public @ResponseBody String handleFileUpload(@RequestParam("transactionLogId") long transactionLogId,
            @RequestParam("file") MultipartFile file){
        if (!file.isEmpty()) {
            try {
            	TransactionLog log = logs.findOne(transactionLogId);
            	String filename = ((Long)log.getTransaction().getId()).toString();
                byte[] bytes = file.getBytes();
                BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(filename)));
                stream.write(bytes);
                stream.close();
                log.setUploadedFilename(filename);
                logs.save(log);
                return "success";
            } catch (Exception e) {
                return "You failed to upload. "+ e.getMessage();
            }
        } else {
            return "You failed to upload because the file was empty.";
        }
    }
	

}
