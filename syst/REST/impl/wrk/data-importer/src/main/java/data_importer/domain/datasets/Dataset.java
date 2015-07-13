package data_importer.domain.datasets;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import data_importer.domain.Version;
import data_importer.domain.servers.Server;

@MappedSuperclass
public abstract class Dataset<ServerClass extends Server> extends Version{	
	@ManyToOne(targetEntity=Server.class)
	private ServerClass server;	
}
