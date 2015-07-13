package data_importer.domain.transactions;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import data_importer.domain.Version;

@Entity
public class Transaction extends Version {

	
	@OneToMany(targetEntity=TransactionLog.class, mappedBy="transaction")
	private List<TransactionLog> logs;
	

	
}
