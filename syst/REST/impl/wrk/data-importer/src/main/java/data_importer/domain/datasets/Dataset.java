package data_importer.domain.datasets;

import javax.persistence.Column;
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
@Inheritance(strategy=InheritanceType.JOINED)
@DiscriminatorColumn(name="specialization")
public abstract class Dataset<T extends Server>{
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long id;
	
	@ManyToOne(targetEntity=Server.class)
	private T server;

	@Column(nullable=true)
	private String location;
	
	@Column(nullable=true)
	private String name = "Sem nome";		
			
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public T getServer() {
		return server;
	}

	public void setServer(T server) {
		this.server = server;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public long getId() {
		return id;
	}
	
	
}
