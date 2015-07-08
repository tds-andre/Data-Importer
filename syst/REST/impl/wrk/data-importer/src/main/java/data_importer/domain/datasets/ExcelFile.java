package data_importer.domain.datasets;

import javax.persistence.Entity;


@Entity
public class ExcelFile extends FileDataset{
	public String sheetName;

}
