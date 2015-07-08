package data_importer.domain.datasets;

import javax.persistence.Entity;

@Entity
public class CsvFile extends FileDataset {
	private char fieldDelimiter;
	private String recordDelimiter;	
}
