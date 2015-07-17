package data_importer.domain.transactions;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import data_importer.domain.SCD;
import data_importer.domain.Version;
import data_importer.domain.datasets.Dataset;
import data_importer.domain.fields.Mapping;

@Entity
public class Transaction extends Version {
	
	@ManyToOne(optional=false)
	private SCD<Dataset> targetDataset;
	
	@ManyToOne(optional=false, targetEntity=SCD.class)	
	private SCD<Dataset> sourceDataset;
	
	@ManyToOne(optional=false)
	private SCD<Mapping> mapping;	
	
	
	@OneToMany(targetEntity=TransactionLog.class, mappedBy="transaction")
	private List<TransactionLog> logs;
	

	
}
