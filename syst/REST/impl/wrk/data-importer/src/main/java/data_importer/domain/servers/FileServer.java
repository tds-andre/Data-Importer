package data_importer.domain.servers;

import javax.persistence.MappedSuperclass;


@MappedSuperclass
public abstract class FileServer extends Server {
	private String root;

}
