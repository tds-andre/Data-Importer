package data_importer.web;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import data_importer.repository.SCDRepo;
import data_importer.repository.TransactionRepo;
import data_importer.services.DataService;


@Controller
public class AppController  extends WebMvcConfigurerAdapter {	
	@Autowired
	private TransactionRepo transactions;
	
	@Autowired
	private SCDRepo scds;
	
	@Autowired
	private DataService dataService;
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="transaction/{scdId}/execute", method=RequestMethod.GET)
    public void executeTransaction(@PathVariable long scdId) {
		dataService.executeTransaction(scds.findOne(scdId));
 	}
}
