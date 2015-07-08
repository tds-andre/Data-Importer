package data_importer.domain.servers;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ConnectionParameters {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)	
	private long id;
	private String host;
	private int port;
	private String username;
	private String password;

}
