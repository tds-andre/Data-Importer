package data_importer.domain.transactions;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import data_importer.domain.Version;
import data_importer.domain.datasets.Dataset;
import data_importer.domain.servers.Server;

@Entity
public class TransactionLog {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	
	@ManyToOne(optional=false)
	private Transaction transaction;
	
	@ManyToOne(targetEntity=Version.class)
	private Dataset sourceDataset;
	@ManyToOne(targetEntity=Version.class)
	private Dataset targetDataset;
	@ManyToOne(targetEntity=Version.class)
	private Server originServer;
	@ManyToOne(targetEntity=Version.class)
	private Server targetServer;
}
