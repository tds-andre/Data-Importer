package com.maispartners.data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity

public class ExcelFile extends CsvFile {
	@Column(nullable = true)
	public String sheet;

	
	public String getSheet() {
		return sheet;
	}

	public void setSheet(String sheet) {
		this.sheet = sheet;
	}

}
