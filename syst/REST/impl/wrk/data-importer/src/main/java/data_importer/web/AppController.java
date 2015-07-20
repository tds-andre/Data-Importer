package data_importer.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import data_importer.domain.transactions.TransactionLog;
import data_importer.repository.TransactionRepo;
import data_importer.services.DataService;


@Controller
public class AppController  extends WebMvcConfigurerAdapter {	
	@Autowired
	private TransactionRepo transactions;
	
	
	@Autowired
	private DataService dataService;	
	
	@RequestMapping(value="service/transaction/{transactionId}/start", method=RequestMethod.GET)
    public TransactionLog startTransaction(@PathVariable long transactionId) {
		return dataService.startTransaction(transactions.findOne(transactionId));
 	}
	

}
