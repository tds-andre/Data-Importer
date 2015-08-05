package data_importer.domain.transactions;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import data_importer.domain.datasets.Dataset;
import data_importer.domain.fields.Mapping;
import data_importer.domain.servers.FileServer;

@Entity
public class Transaction{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	
	@Column(nullable=true)
	private String name = "Sem nome";
	
	@ManyToOne
	private Dataset targetDataset;
	
	@ManyToOne
	private Dataset sourceDataset;
	
	@ManyToOne(optional=true)	
	private Mapping mapping;
	

	@OneToMany(targetEntity=TransactionLog.class, mappedBy="transaction")
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

	public Mapping getMapping() {
		return mapping;
	}

	public void setMapping(Mapping mapping) {
		this.mapping = mapping;
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
	
	/*public Long getLatest(){
		if(logs.size()==0)
			return null;
		TransactionLog result = logs.get(0);
		for(TransactionLog log:logs){
			if(log.getCreatedAt().after(result.getCreatedAt()))
				result = log;
		}
		return result.getId();
		
	}*/
	
	
	
	
	
}
