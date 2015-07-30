package data_importer.domain.datasets;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import data_importer.domain.servers.FileServer;

@MappedSuperclass
public abstract class FileDataset extends Dataset<FileServer>{	
	private String filename = null;

	public String getFilename() {
		return filename;
	}

	@Column(nullable=true)
	public void setFilename(String filename) {
		this.filename = filename;
	}
}
