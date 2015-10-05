package data_importer.domain.transactions;

import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.print.attribute.standard.DateTimeAtCompleted;

import org.apache.commons.net.ntp.TimeStamp;

import data_importer.domain.transactions.TransactionStatus;

@Entity
public class TransactionLog {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	
	@ManyToOne(optional=false, targetEntity=Transaction.class)
	private Transaction transaction;
	
	@Column(nullable=true)
	private String uploadedFilename = null;
	
	@Enumerated(EnumType.STRING)
	private TransactionStatus status = TransactionStatus.CREATED;
	
	private Timestamp createdAt = new Timestamp(new java.util.Date().getTime());
	
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
	public String getUploadedFilename() {
		return uploadedFilename;
	}
	public void setUploadedFilename(String uploadedFilename) {
		this.uploadedFilename = uploadedFilename;
	}
	public Timestamp getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}
	public TransactionStatus getStatus() {
		return status;
	}
	public void setStatus(TransactionStatus status) {
		this.status = status;
	}

	
	

	
	
	
	
	
}
