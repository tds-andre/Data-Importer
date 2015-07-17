package data_importer.services;

import org.springframework.stereotype.Service;

import data_importer.domain.SCD;
import data_importer.domain.transactions.Transaction;

@Service
public class DataService {
	public void executeTransaction(SCD<Transaction> scd){
		int x = 2;
		int y = 3;
		x = x + 3;
	}

}
