package data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
public class CsvFile extends FileDataset {
	private String fieldDelimiter = ";";
	private String recordDelimiter = "\r\n";
	public String getFieldDelimiter() {
		return fieldDelimiter;
	}
	public void setFieldDelimiter(String fieldDelimiter) {
		this.fieldDelimiter = fieldDelimiter;
	}
	public String getRecordDelimiter() {
		return recordDelimiter;
	}
	public void setRecordDelimiter(String recordDelimiter) {
		this.recordDelimiter = recordDelimiter;
	}
	
	
}
