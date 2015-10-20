package data_importer.domain.transactions;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import data_importer.domain.datasets.Dataset;

@Entity
public class Transaction {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	private Boolean isFavorite = false;
	
	private String name;

	@ManyToOne(cascade = CascadeType.DETACH)
	private Dataset targetDataset;

	@ManyToOne(cascade = CascadeType.DETACH)
	private Dataset sourceDataset;

	@OneToMany(targetEntity = TransactionLog.class, mappedBy = "transaction")
	private List<TransactionLog> logs;

	public Dataset getTargetDataset() {
		return targetDataset;
	}

	public void setTargetDataset(Dataset targetDataset) {
		this.targetDataset = targetDataset;
	}

	public Dataset getSourceDataset() {
		return sourceDataset;
	}

	public void setSourceDataset(Dataset sourceDataset) {
		this.sourceDataset = sourceDataset;
	}

	public List<TransactionLog> getLogs() {
		return logs;
	}

	public void setLogs(List<TransactionLog> logs) {
		this.logs = logs;
	}

	public long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getIsFavorite() {
		return isFavorite;
	}

	public void setIsFavorite(Boolean isFavorite) {
		this.isFavorite = isFavorite;
	}

	

}
