package data_importer.domain.datasets;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

import data_importer.domain.servers.Server;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name="dataset_type")
public abstract class Dataset<ServerClass extends Server> {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;	
	
	@ManyToOne(targetEntity=Server.class)
	private ServerClass server;	
}
