package data_importer.domain.datasets;

import javax.persistence.MappedSuperclass;

import data_importer.domain.servers.FileServer;

@MappedSuperclass
public abstract class FileDataset extends Dataset<FileServer>{
	public String fileName;

}
