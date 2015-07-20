package data_importer.domain.transactions;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class TransactionLog {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	
	@ManyToOne(optional=false, targetEntity=Transaction.class)
	private Transaction transaction;
	
	private String sourceInfo;
	private String targetInfo;
	public Transaction getTransaction() {
		return transaction;
	}
	public void setTransaction(Transaction transaction) {
		this.transaction = transaction;
	}
	public String getSourceInfo() {
		return sourceInfo;
	}
	public void setSourceInfo(String sourceInfo) {
		this.sourceInfo = sourceInfo;
	}
	public String getTargetInfo() {
		return targetInfo;
	}
	public void setTargetInfo(String targetInfo) {
		this.targetInfo = targetInfo;
	}
	public long getId() {
		return id;
	}
	
	
}
