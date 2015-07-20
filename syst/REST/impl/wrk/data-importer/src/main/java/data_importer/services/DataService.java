package data_importer.services;

import org.springframework.stereotype.Service;

import data_importer.domain.transactions.Transaction;
import data_importer.domain.transactions.TransactionLog;

@Service
public class DataService {
	public TransactionLog startTransaction(Transaction transaction){
		//Mapping mapping =  transaction.getMapping().getLatest();
		//Dataset<Server> sourceDataset = transaction.getSourceDataset().getLatest();
		//Server sourceServer = sourceDataset.getServer().getLatest();
		//Dataset<Server> targetDataset = transaction.getTargetDataset().getLatest();
		//Server targetServer = targetDataset.getServer().getLatest();
		
		
		return null;
	}

}
