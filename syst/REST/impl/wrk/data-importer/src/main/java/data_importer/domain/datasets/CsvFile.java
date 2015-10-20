package data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
public class CsvFile extends Upload {
	private String fieldDelimiter = ";";
	private String recordDelimiter = "\n";
	private String encoding = "UTF-8";
	public String getFieldDelimiter() {
		return fieldDelimiter;
	}
	public void setFieldDelimiter(String fieldDelimiter) {
		this.fieldDelimiter = fieldDelimiter;
	}
	public String getEncoding() {
		return encoding;
	}
	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}
	public String getRecordDelimiter() {
		return recordDelimiter;
	}
	public void setRecordDelimiter(String recordDelimiter) {
		this.recordDelimiter = recordDelimiter;
	}
	
	
}
